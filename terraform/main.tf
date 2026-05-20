# ─── VPC ──────────────────────────────────────────────────────────────────────

module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}

# ─── Frontend (S3 + CloudFront) ───────────────────────────────────────────────

module "frontend" {
  source = "./modules/frontend"

  project_name = var.project_name
  environment  = var.environment
}

# ─── Database (DocumentDB) ────────────────────────────────────────────────────

module "database" {
  source = "./modules/database"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  backend_sg_id         = module.backend.backend_sg_id
  docdb_instance_class  = var.docdb_instance_class
  docdb_instance_count  = var.docdb_instance_count
  master_username       = var.docdb_master_username
  master_password       = var.docdb_master_password
}

# ─── Backend (ALB + EC2 ASG) ──────────────────────────────────────────────────

module "backend" {
  source = "./modules/backend"

  project_name         = var.project_name
  environment          = var.environment
  vpc_id               = module.vpc.vpc_id
  public_subnet_ids    = module.vpc.public_subnet_ids
  private_subnet_ids   = module.vpc.private_subnet_ids
  instance_type        = var.ec2_instance_type
  key_name             = var.ec2_key_name
  ami_id               = var.ec2_ami_id
  asg_min_size         = var.asg_min_size
  asg_max_size         = var.asg_max_size
  asg_desired_capacity = var.asg_desired_capacity
  app_port             = var.app_port
  certificate_arn      = var.certificate_arn
  docdb_secret_arn     = module.database.docdb_secret_arn
}
