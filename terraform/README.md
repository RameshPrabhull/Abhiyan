# AWS Infrastructure — React Vite + Express + DocumentDB

Terraform project for a production-ready, highly available AWS setup.

## Architecture

```
Internet
   │
   ├─── CloudFront ──► S3 (React Vite SPA)
   │
   └─── ALB (public subnets, 2 AZs)
           │
           ▼
        EC2 ASG (private subnets, 2 AZs)
        Express backend
           │
           ▼
        DocumentDB Cluster (private subnets)
        Primary (AZ-1) + Replica (AZ-2)
```

### What's included

| Resource | Purpose |
|---|---|
| VPC | Isolated network with public + private subnets across 2 AZs |
| NAT Gateway × 2 | Outbound internet for private EC2 instances (one per AZ) |
| S3 + CloudFront | Static hosting for the React Vite app with SPA routing |
| ALB | HTTPS load balancer, routes to EC2 Auto Scaling Group |
| EC2 ASG | Express backend, auto-scales on CPU, rolling deploys |
| DocumentDB | MongoDB-compatible, 1 primary + 1 replica, encrypted + TLS |
| Secrets Manager | Stores DocumentDB credentials — fetched by EC2 at boot |
| IAM Role | EC2 gets SSM, CloudWatch, and Secrets Manager access |
| CloudWatch | ALB 5xx and latency alarms; EC2 logs and memory/disk metrics |
| VPC Flow Logs | Network traffic logging for security auditing |

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5
- [AWS CLI](https://aws.amazon.com/cli/) configured with sufficient permissions
- An existing EC2 Key Pair in your target region
- (Optional) An ACM certificate ARN for HTTPS

---

## Quick Start

### 1. Configure variables

```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

Add `terraform.tfvars` to your `.gitignore` — it contains secrets.

### 2. Initialize and deploy

```bash
terraform init
terraform plan    # Review what will be created
terraform apply
```

First apply takes ~15–20 minutes (DocumentDB cluster is slow to provision).

### 3. Note the outputs

```bash
terraform output
# frontend_cloudfront_url      = "https://d1234abcd.cloudfront.net"
# frontend_s3_bucket           = "myapp-prod-frontend-ab12cd34"
# backend_alb_dns              = "myapp-prod-alb-123456789.us-east-1.elb.amazonaws.com"
```

---

## Deploying Your Apps

### Frontend (React Vite)

```bash
# In your Vite project — set the API URL to your ALB
echo "VITE_API_URL=http://$(terraform output -raw backend_alb_dns)" > .env.production

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://$(terraform output -raw frontend_s3_bucket) --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw frontend_cloudfront_distribution_id) \
  --paths "/*"
```

### Backend (Express)

**Option A — Deploy via SSM Session Manager (no bastion needed)**

```bash
# Get an instance ID from the ASG
INSTANCE_ID=$(aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names $(terraform output -raw backend_asg_name) \
  --query 'AutoScalingGroups[0].Instances[0].InstanceId' \
  --output text)

# Start a session
aws ssm start-session --target $INSTANCE_ID

# On the instance:
cd /app
git clone https://github.com/your-org/your-backend.git .
npm ci && npm run build
pm2 start ecosystem.config.js
pm2 save
```

**Option B — CI/CD (recommended for production)**  
Use GitHub Actions or CodeDeploy. The ASG instance refresh (triggered on launch template update) handles rolling deploys.

### Express app — required setup

Your Express app must:
1. Expose a `GET /health` route returning HTTP 200 (used by ALB health checks)
2. Read `process.env.MONGODB_URI` for the database connection
3. Read `process.env.PORT` for the listen port (default: 3000)

```js
// health check
app.get('/health', (req, res) => res.sendStatus(200));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Listen
app.listen(process.env.PORT ?? 3000);
```

---

## HTTPS Setup

1. Request an ACM certificate in the same region as your ALB via the AWS Console
2. Add to `terraform.tfvars`:
   ```
   certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abc-123"
   ```
3. Run `terraform apply`
4. Point your domain's CNAME to the ALB DNS name

---

## Remote State (Recommended)

Uncomment the `backend "s3"` block in `provider.tf` and create the resources first:

```bash
# Create state bucket and DynamoDB lock table (one-time)
aws s3api create-bucket --bucket your-terraform-state-bucket --region us-east-1
aws dynamodb create-table \
  --table-name terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

---

## Tear Down

```bash
# DocumentDB has deletion_protection=true — disable it first
terraform apply -var="docdb_deletion_protection=false"

terraform destroy
```

---

## Module Structure

```
terraform/
├── main.tf                      # Wires modules together
├── variables.tf                 # All input variables
├── outputs.tf                   # Key outputs + deploy commands
├── provider.tf                  # AWS provider + Terraform version
├── terraform.tfvars.example     # Template — copy to terraform.tfvars
└── modules/
    ├── vpc/                     # VPC, subnets, NAT GWs, flow logs
    ├── frontend/                # S3 + CloudFront
    ├── database/                # DocumentDB cluster + Secrets Manager
    └── backend/                 # ALB, EC2 ASG, IAM, CloudWatch alarms
```
