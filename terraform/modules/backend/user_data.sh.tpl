#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "=== Starting bootstrap at $(date) ==="

# ─── System updates ───────────────────────────────────────────────────────────
dnf update -y
dnf install -y nodejs npm git jq amazon-cloudwatch-agent

# ─── Install PM2 (process manager) ───────────────────────────────────────────
npm install -g pm2

# ─── Download DocumentDB TLS certificate ─────────────────────────────────────
# Required for TLS connections to DocumentDB
curl -sS https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
  -o /etc/ssl/certs/global-bundle.pem

# ─── Fetch credentials from Secrets Manager ──────────────────────────────────
SECRET=$(aws secretsmanager get-secret-value \
  --secret-id "${docdb_secret_arn}" \
  --region "${aws_region}" \
  --query SecretString \
  --output text)

MONGODB_URI=$(echo "$SECRET" | jq -r '.connection_uri')

# ─── Write application environment variables ─────────────────────────────────
# PM2 ecosystem file reads these; your Express app reads process.env.*
mkdir -p /app
cat > /app/.env << ENVFILE
NODE_ENV=production
PORT=${app_port}
MONGODB_URI=$MONGODB_URI
ENVFILE

chmod 600 /app/.env
chown ec2-user:ec2-user /app/.env

# ─── PM2 startup configuration ───────────────────────────────────────────────
# This file is a template — your actual app goes in /app
# Update the script path after deploying your Express app
cat > /app/ecosystem.config.js << 'PM2CONFIG'
module.exports = {
  apps: [{
    name: 'express-backend',
    script: '/app/dist/index.js',   // update to match your build output
    instances: 'max',               // one process per vCPU
    exec_mode: 'cluster',
    env_file: '/app/.env',
    watch: false,
    max_memory_restart: '512M',
    error_file: '/var/log/pm2/err.log',
    out_file: '/var/log/pm2/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
PM2CONFIG

mkdir -p /var/log/pm2
chown -R ec2-user:ec2-user /var/log/pm2

# ─── CloudWatch Agent config ──────────────────────────────────────────────────
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'CWA'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/pm2/out.log",
            "log_group_name": "/app/express/stdout",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/pm2/err.log",
            "log_group_name": "/app/express/stderr",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/user-data.log",
            "log_group_name": "/app/ec2/user-data",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
  "metrics": {
    "metrics_collected": {
      "mem": { "measurement": ["mem_used_percent"] },
      "disk": { "measurement": ["used_percent"], "resources": ["/"] }
    }
  }
}
CWA

systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent

echo "=== Bootstrap complete at $(date) ==="
