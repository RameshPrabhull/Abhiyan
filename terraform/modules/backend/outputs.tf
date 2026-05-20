output "alb_dns_name"   { value = aws_lb.backend.dns_name }
output "alb_arn"        { value = aws_lb.backend.arn }
output "backend_sg_id"  { value = aws_security_group.backend.id }
output "asg_name"       { value = aws_autoscaling_group.backend.name }
