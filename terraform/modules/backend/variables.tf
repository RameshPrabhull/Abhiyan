variable "project_name"         { type = string }
variable "environment"           { type = string }
variable "vpc_id"                { type = string }
variable "public_subnet_ids"     { type = list(string) }
variable "private_subnet_ids"    { type = list(string) }
variable "instance_type"         { type = string }
variable "key_name"              { type = string }
variable "ami_id"                { type = string }
variable "asg_min_size"          { type = number }
variable "asg_max_size"          { type = number }
variable "asg_desired_capacity"  { type = number }
variable "app_port"              { type = number }
variable "certificate_arn"       { type = string }
variable "docdb_secret_arn"      {
    type = string
 sensitive = true 
 }
