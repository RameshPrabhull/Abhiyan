# ─── General ──────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name — used as a prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (prod, staging, dev)"
  type        = string
  default     = "prod"
}

# ─── Networking ───────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of AZs to deploy into (minimum 2 for HA)"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ─── EC2 / Backend ────────────────────────────────────────────────────────────

variable "ec2_instance_type" {
  description = "EC2 instance type for the Express backend"
  type        = string
  default     = "t3.small"
}

variable "ec2_key_name" {
  description = "EC2 Key Pair name for emergency SSH access"
  type        = string
}

variable "ec2_ami_id" {
  description = "AMI ID for EC2 instances — defaults to Amazon Linux 2023 in us-east-1"
  type        = string
  default     = "ami-0c02fb55956c7d316"
}

variable "asg_min_size" {
  description = "Minimum EC2 instances in the Auto Scaling Group"
  type        = number
  default     = 2
}

variable "asg_max_size" {
  description = "Maximum EC2 instances in the Auto Scaling Group"
  type        = number
  default     = 6
}

variable "asg_desired_capacity" {
  description = "Desired EC2 instance count"
  type        = number
  default     = 2
}

variable "app_port" {
  description = "Port the Express app listens on"
  type        = number
  default     = 3000
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS on the ALB. Leave empty to use HTTP only."
  type        = string
  default     = ""
}

# ─── DocumentDB ───────────────────────────────────────────────────────────────

variable "docdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.r6g.large"
}

variable "docdb_instance_count" {
  description = "Number of DocumentDB instances (1 primary + N-1 replicas)"
  type        = number
  default     = 2
}

variable "docdb_master_username" {
  description = "DocumentDB master username"
  type        = string
  sensitive   = true
}

variable "docdb_master_password" {
  description = "DocumentDB master password (min 8 chars, avoid / \" @)"
  type        = string
  sensitive   = true
}
