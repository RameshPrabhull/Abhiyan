resource "random_id" "suffix" {
  byte_length = 4
}

# ─── Security Groups ──────────────────────────────────────────────────────────

resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Public-facing ALB — allow HTTP and HTTPS from internet"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-${var.environment}-alb-sg" }
}

resource "aws_security_group" "backend" {
  name        = "${var.project_name}-${var.environment}-backend-sg"
  description = "Express backend EC2 — accepts traffic from ALB only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "App traffic from ALB"
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-${var.environment}-backend-sg" }
}

# ─── IAM Role for EC2 ─────────────────────────────────────────────────────────

resource "aws_iam_role" "ec2" {
  name = "${var.project_name}-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# SSM Session Manager — access EC2 without a bastion or open SSH port
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# CloudWatch agent — ship logs and metrics to CloudWatch
resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Allow EC2 to read the DocumentDB secret from Secrets Manager
resource "aws_iam_role_policy" "secrets" {
  name = "${var.project_name}-${var.environment}-ec2-secrets-policy"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = [var.docdb_secret_arn]
    }]
  })
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2.name
}

# ─── ALB Access Logs Bucket ───────────────────────────────────────────────────

resource "aws_s3_bucket" "alb_logs" {
  bucket        = "${var.project_name}-${var.environment}-alb-logs-${random_id.suffix.hex}"
  force_destroy = false

  tags = { Name = "${var.project_name}-${var.environment}-alb-logs" }
}

resource "aws_s3_bucket_public_access_block" "alb_logs" {
  bucket                  = aws_s3_bucket.alb_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = data.aws_elb_service_account.main.arn }
      Action    = "s3:PutObject"
      Resource  = "${aws_s3_bucket.alb_logs.arn}/alb/AWSLogs/*"
    }]
  })
}

# ─── Application Load Balancer ────────────────────────────────────────────────

resource "aws_lb" "backend" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = true
  enable_http2               = true
  drop_invalid_header_fields = true

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb"
    enabled = true
  }

  tags = { Name = "${var.project_name}-${var.environment}-alb" }
}

# Target Group — health checks against /health endpoint
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-${var.environment}-tg"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  deregistration_delay = 30 # Drain connections before removing instance

  tags = { Name = "${var.project_name}-${var.environment}-tg" }
}

# HTTP listener — redirect to HTTPS if cert provided, else forward directly
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.backend.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = var.certificate_arn != "" ? "redirect" : "forward"

    dynamic "redirect" {
      for_each = var.certificate_arn != "" ? [1] : []
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }

    dynamic "forward" {
      for_each = var.certificate_arn == "" ? [1] : []
      content {
        target_group {
          arn = aws_lb_target_group.backend.arn
        }
      }
    }
  }
}

# HTTPS listener (only created when a certificate ARN is provided)
resource "aws_lb_listener" "https" {
  count             = var.certificate_arn != "" ? 1 : 0
  load_balancer_arn = aws_lb.backend.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

# ─── Launch Template ──────────────────────────────────────────────────────────

resource "aws_launch_template" "backend" {
  name_prefix   = "${var.project_name}-${var.environment}-backend-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile { name = aws_iam_instance_profile.ec2.name }

  network_interfaces {
    associate_public_ip_address = false # Private subnet — no public IP
    security_groups             = [aws_security_group.backend.id]
    delete_on_termination       = true
  }

  # IMDSv2 enforced — prevents SSRF-based metadata attacks
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  monitoring { enabled = true }

  # Encrypted root volume
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 20
      volume_type           = "gp3"
      encrypted             = true
      delete_on_termination = true
    }
  }

  # User data — runs once on first boot
  # Fetches DocumentDB credentials from Secrets Manager, installs Node.js + PM2
  user_data = base64encode(templatefile("${path.module}/user_data.sh.tpl", {
    app_port         = var.app_port
    docdb_secret_arn = var.docdb_secret_arn
    aws_region       = data.aws_region.current.name
  }))

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-${var.environment}-backend"
    }
  }
}

data "aws_region" "current" {}

# ─── Auto Scaling Group ───────────────────────────────────────────────────────

resource "aws_autoscaling_group" "backend" {
  name                      = "${var.project_name}-${var.environment}-asg"
  min_size                  = var.asg_min_size
  max_size                  = var.asg_max_size
  desired_capacity          = var.asg_desired_capacity
  vpc_zone_identifier       = var.private_subnet_ids
  target_group_arns         = [aws_lb_target_group.backend.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 120

  launch_template {
    id      = aws_launch_template.backend.id
    version = "$Latest"
  }

  # Zero-downtime rolling deploys — replaces instances when launch template changes
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 120
    }
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}-backend"
    propagate_at_launch = true
  }
}

# ─── Auto Scaling Policy (CPU target tracking) ────────────────────────────────

resource "aws_autoscaling_policy" "cpu" {
  name                   = "${var.project_name}-${var.environment}-cpu-policy"
  autoscaling_group_name = aws_autoscaling_group.backend.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 60.0 # Scale out when average CPU > 60%
  }
}

# ─── CloudWatch Alarms ────────────────────────────────────────────────────────

resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "ALB returning too many 5xx errors"
  treat_missing_data  = "notBreaching"

  dimensions = {
    LoadBalancer = aws_lb.backend.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "alb_latency" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "p99"
  threshold           = 2 # seconds
  alarm_description   = "p99 response time exceeds 2 seconds"
  treat_missing_data  = "notBreaching"

  dimensions = {
    LoadBalancer = aws_lb.backend.arn_suffix
  }
}
