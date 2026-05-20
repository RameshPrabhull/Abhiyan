output "frontend_cloudfront_url" {
  description = "CloudFront URL — point your domain here or use directly"
  value       = "https://${module.frontend.cloudfront_domain_name}"
}

output "frontend_s3_bucket" {
  description = "S3 bucket name — deploy your Vite build here: aws s3 sync dist/ s3://<bucket>"
  value       = module.frontend.s3_bucket_name
}

output "frontend_cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used to invalidate cache after deploys"
  value       = module.frontend.cloudfront_distribution_id
}

output "backend_alb_dns" {
  description = "ALB DNS name — set VITE_API_URL to this in your frontend"
  value       = module.backend.alb_dns_name
}

output "docdb_endpoint" {
  description = "DocumentDB writer endpoint"
  value       = module.database.docdb_endpoint
  sensitive   = true
}

output "docdb_reader_endpoint" {
  description = "DocumentDB reader endpoint (use for read-heavy queries)"
  value       = module.database.docdb_reader_endpoint
  sensitive   = true
}

output "docdb_secret_arn" {
  description = "Secrets Manager ARN containing DocumentDB credentials"
  value       = module.database.docdb_secret_arn
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "deploy_commands" {
  description = "Quick-start deploy commands"
  value       = <<-EOT
    # 1. Build and deploy frontend
    cd your-app && npm run build
    aws s3 sync dist/ s3://${module.frontend.s3_bucket_name} --delete
    aws cloudfront create-invalidation \
      --distribution-id ${module.frontend.cloudfront_distribution_id} \
      --paths "/*"

    # 2. Deploy backend (SSH or SSM into an EC2 instance)
    aws ssm start-session --target <instance-id>
  EOT
}
