output "docdb_endpoint" {
  value     = aws_docdb_cluster.main.endpoint
  sensitive = true
}

output "docdb_reader_endpoint" {
  value     = aws_docdb_cluster.main.reader_endpoint
  sensitive = true
}

output "docdb_port" {
  value = aws_docdb_cluster.main.port
}

output "docdb_sg_id" {
  value = aws_security_group.docdb.id
}

output "docdb_secret_arn" {
  value     = aws_secretsmanager_secret.docdb.arn
  sensitive = true
}
