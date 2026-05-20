# ─── Security Group ───────────────────────────────────────────────────────────

resource "aws_security_group" "docdb" {
  name        = "${var.project_name}-${var.environment}-docdb-sg"
  description = "Allow MongoDB traffic from Express backend EC2 instances only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "MongoDB from backend EC2"
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [var.backend_sg_id]
  }

  # No direct egress needed for DocumentDB
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-${var.environment}-docdb-sg" }
}

# ─── Subnet Group ─────────────────────────────────────────────────────────────

resource "aws_docdb_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-docdb-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = { Name = "${var.project_name}-${var.environment}-docdb-subnet-group" }
}

# ─── Cluster Parameter Group ──────────────────────────────────────────────────

resource "aws_docdb_cluster_parameter_group" "main" {
  family      = "docdb5.0"
  name        = "${var.project_name}-${var.environment}-docdb-params"
  description = "DocumentDB 5.0 parameter group"

  # TLS enforced — connections without TLS are rejected
  parameter {
    name  = "tls"
    value = "enabled"
  }

  tags = { Name = "${var.project_name}-${var.environment}-docdb-params" }
}

# ─── DocumentDB Cluster ───────────────────────────────────────────────────────

resource "aws_docdb_cluster" "main" {
  cluster_identifier              = "${var.project_name}-${var.environment}-docdb"
  engine                          = "docdb"
  engine_version                  = "5.0.0"
  master_username                 = var.master_username
  master_password                 = var.master_password
  db_subnet_group_name            = aws_docdb_subnet_group.main.name
  vpc_security_group_ids          = [aws_security_group.docdb.id]
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name

  # Security
  storage_encrypted   = true
  deletion_protection = true # Prevent accidental deletion in prod

  # Backups — 7-day retention window
  backup_retention_period      = 7
  preferred_backup_window      = "03:00-05:00"
  preferred_maintenance_window = "sun:05:00-sun:07:00"
  skip_final_snapshot          = false
  final_snapshot_identifier    = "${var.project_name}-${var.environment}-docdb-final"

  tags = { Name = "${var.project_name}-${var.environment}-docdb" }
}

# ─── Cluster Instances (Primary + Replica across AZs) ────────────────────────

resource "aws_docdb_cluster_instance" "main" {
  count              = var.docdb_instance_count
  identifier         = "${var.project_name}-${var.environment}-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.docdb_instance_class

  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.project_name}-${var.environment}-docdb-instance-${count.index}"
    Role = count.index == 0 ? "primary" : "replica"
  }
}

# ─── Secrets Manager — store connection details ───────────────────────────────

resource "aws_secretsmanager_secret" "docdb" {
  name        = "${var.project_name}/${var.environment}/docdb/credentials"
  description = "DocumentDB credentials and connection info for ${var.project_name} ${var.environment}"

  # Recover window before permanent deletion
  recovery_window_in_days = 7

  tags = { Name = "${var.project_name}-${var.environment}-docdb-secret" }
}

resource "aws_secretsmanager_secret_version" "docdb" {
  secret_id = aws_secretsmanager_secret.docdb.id

  secret_string = jsonencode({
    username         = var.master_username
    password         = var.master_password
    host             = aws_docdb_cluster.main.endpoint
    port             = aws_docdb_cluster.main.port
    reader_host      = aws_docdb_cluster.main.reader_endpoint
    # Full MongoDB URI — inject this as MONGODB_URI in your Express app
    connection_uri   = "mongodb://${var.master_username}:${var.master_password}@${aws_docdb_cluster.main.endpoint}:${aws_docdb_cluster.main.port}/?tls=true&tlsCAFile=/etc/ssl/certs/global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
  })
}
