import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Infrastructure as Code (IaC)

**Domain:** DevOps · **Time Estimate:** 2–3 weeks

> **Tool:** Terraform · **Introduced:** 2014 · **Latest:** 1.8 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — industry standard for multi-cloud IaC  
> **Tool:** OpenTofu · **Introduced:** 2023 · **Latest:** 1.7 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — open-source Terraform fork after HashiCorp licence change (Aug 2023)  
> **Tool:** Ansible · **Introduced:** 2012 · **Latest:** 9.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — still the dominant agentless configuration management tool  
> **Tool:** Pulumi · **Introduced:** 2018 · **Latest:** 3.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — IaC in real programming languages (Python, TypeScript, Go, Rust)

!!! warning "🟡 Legacy Tools — acknowledged, not taught here"
    **Chef** · Introduced 2009 · Still maintained · Status: 🟡 Legacy — replaced by Ansible in most new projects  
    **Puppet** · Introduced 2005 · Still maintained · Status: 🟡 Legacy — agent-based model was dominant pre-2015; Ansible's agentless approach won

> **Prerequisites:** [Linux CLI](linux_cli.md), [Git Workflow](git_workflow.md), [Docker](docker.md)  
> **Who needs this:** Anyone who manages cloud infrastructure. IaC applies the same principles to infrastructure that version control applies to code — every change is tracked, reviewable, repeatable, and automated.

!!! note "🔵 Foundation Concept"
    Before IaC, infrastructure was configured manually by clicking through cloud consoles or running ad-hoc commands — **ClickOps**. This creates "snowflake servers": unique, undocumented, impossible to reproduce. IaC replaces this with declarative files you commit to Git.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the difference between declarative IaC (Terraform) and procedural IaC (Ansible)
- [ ] Write a Terraform configuration that provisions real cloud resources
- [ ] Use `terraform plan` and `terraform apply` safely
- [ ] Manage Terraform state and understand why it matters
- [ ] Organise Terraform code with modules and variables
- [ ] Write an Ansible playbook that configures a Linux server
- [ ] Explain the GitOps pattern and how it differs from traditional CI/CD
- [ ] Understand when to use Terraform vs Ansible vs both

---

## 📖 Concepts

### 1. What IaC Solves

```
Without IaC:
  Engineer A clicks through AWS console to create a server
  → Server works. No record of what was configured.
  
  Three months later, Engineer B creates a "similar" server
  → Slightly different AMI, different security group rules, wrong IAM role
  → Production incident. Root cause: "it worked on my server"

With IaC:
  Infrastructure defined in files committed to Git
  → Every change has an author, timestamp, diff, and code review
  → Any environment can be created from scratch identically
  → Destroyed and recreated at will (dev environments, testing)
  → Security and compliance auditable from the Git history
```

**Two approaches:**

| Approach | Style | Tools | Use for |
|----------|-------|-------|---------|
| **Declarative** | Define *what* you want; tool figures out *how* | Terraform, CloudFormation, Pulumi | Cloud resources (VMs, networks, databases, DNS) |
| **Procedural** | Define *step-by-step* instructions | Ansible, shell scripts | Server configuration, software installation, app deployment |

In practice: **Terraform provisions infrastructure; Ansible configures what runs on it.**

---

### 2. Terraform — Core Concepts

> **Tool:** Terraform · **Introduced:** 2014 · **Latest:** 1.8 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern  
> **Tool:** OpenTofu · **Introduced:** 2023 (CNCF fork after HashiCorp BSL licence, Aug 2023) · **Latest:** 1.7 (2024) · **Status:** 🟢 Modern — drop-in Terraform replacement; syntax identical

!!! tip "Terraform vs OpenTofu"
    HashiCorp changed Terraform's licence from MPL (open source) to BSL (not open source) in August 2023. **OpenTofu** is the Linux Foundation fork that kept the MPL licence. For new projects with a preference for genuine open source, OpenTofu is a good choice. Syntax is identical.

**How Terraform works:**

```
1. Write configuration (.tf files)
   → Declare resources you want (VMs, networks, DNS records, etc.)

2. terraform init
   → Downloads provider plugins (AWS, Azure, GCP, etc.)

3. terraform plan
   → Compares desired state (your .tf files) with current state (state file)
   → Shows exactly what will be created, modified, or destroyed
   → ALWAYS read this before applying

4. terraform apply
   → Executes the plan; updates the state file

5. terraform destroy
   → Destroys everything managed by this configuration ⚠️
```

**State file:** Terraform tracks what it has created in `terraform.tfstate`. This file is the source of truth — never edit it manually. In teams, store it remotely (S3, Terraform Cloud, Azure Storage).

---

### 3. Writing Terraform

<Tabs>
<TabItem value="aws-most-common" label="AWS (most common)">

```hcl
# main.tf

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"    # 5.x — released 2023
    }
  }

  # Remote state storage — REQUIRED for team use
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"   # Prevents concurrent applies
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ── Variables ─────────────────────────────────────────────
variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy into"
}

variable "environment" {
  type        = string
  description = "Deployment environment: dev, staging, prod"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

# ── VPC and Networking ────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-${count.index}"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# ── EC2 Instance ──────────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]   # Canonical (Ubuntu)
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "app" {
  ami             = data.aws_ami.ubuntu.id
  instance_type   = "t3.micro"
  subnet_id       = aws_subnet.public[0].id
  key_name        = aws_key_pair.deployer.key_name

  tags = {
    Name = "${var.environment}-app"
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.environment}-deployer"
  public_key = file("~/.ssh/id_ed25519.pub")
}

# ── Outputs ───────────────────────────────────────────────
output "instance_public_ip" {
  value       = aws_instance.app.public_ip
  description = "Public IP of the app server"
}

output "vpc_id" {
  value = aws_vpc.main.id
}
```


</TabItem>
<TabItem value="variables-and-tfvars" label="Variables and tfvars">

```hcl
# variables.tf — declare all variables here
variable "db_password" {
  type      = string
  sensitive = true    # Redacted from plan output and logs
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

# terraform.tfvars — values for non-sensitive vars (commit this)
# instance_type = "t3.small"
# environment   = "prod"

# terraform.tfvars.json is also valid
# Never commit secrets — pass via env var or secret manager:
# TF_VAR_db_password=mysecret terraform apply
```


</TabItem>
<TabItem value="modules-reusable-components" label="Modules — reusable components">

```hcl
# ── Call a module ─────────────────────────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.environment}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}

# ── Write a module ────────────────────────────────────────
# modules/web_server/main.tf
variable "instance_type" { type = string }
variable "subnet_id"     { type = string }

resource "aws_instance" "this" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
}

output "public_ip" { value = aws_instance.this.public_ip }
```


</TabItem>
</Tabs>

---

### 4. Essential Terraform Commands

```bash
terraform init              # Download providers, initialise backend
terraform init -upgrade     # Upgrade provider versions

terraform fmt               # Auto-format all .tf files (run before committing)
terraform validate          # Check syntax without hitting the API

terraform plan              # Show what would change — always read this first
terraform plan -out=tfplan  # Save plan to file (for automated apply)
terraform apply             # Apply (interactive prompt: type "yes")
terraform apply tfplan      # Apply a saved plan (no prompt — safe for CI)
terraform apply -auto-approve  # Skip prompt ⚠️ use only in CI with care

terraform show              # Show current state in human-readable form
terraform output            # Show output values
terraform state list        # List all resources in state
terraform state show aws_instance.app  # Details of one resource

terraform destroy           # Destroy all resources ⚠️
terraform destroy -target aws_instance.app  # Destroy specific resource only

# Moving / refactoring
terraform state mv old_name new_name  # Rename resource in state without destroying
terraform import aws_instance.app i-1234567890abcdef0  # Import existing resource
```

---

### 5. Ansible — Agentless Configuration Management

> **Tool:** Ansible · **Introduced:** 2012 · **Latest:** 9.x (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern  
> **Introduced by:** Michael DeHaan; acquired by Red Hat in 2015

Ansible connects to servers over SSH and runs tasks — no agent required on the target.

```
Ansible Architecture:
  Control node (your machine or CI runner)
      │ SSH
      ├── target server 1
      ├── target server 2
      └── target server 3

  Inventory: list of servers to manage
  Playbook:  list of tasks to run on those servers
  Role:      reusable bundle of tasks (like a Terraform module)
```

```yaml
# inventory.ini — or use dynamic inventory from AWS/GCP/etc.
[webservers]
192.168.1.10  ansible_user=ubuntu  ansible_ssh_private_key_file=~/.ssh/id_ed25519
192.168.1.11  ansible_user=ubuntu

[databases]
192.168.1.20

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

```yaml
# playbook.yml — configure web servers
---
- name: Configure web servers
  hosts: webservers
  become: true              # sudo
  vars:
    app_user: deploy
    app_dir: /opt/myapp
    node_version: "20"

  tasks:
    - name: Update apt cache
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

    - name: Install required packages
      ansible.builtin.apt:
        name:
          - git
          - curl
          - nginx
        state: present

    - name: Install Node.js via NodeSource
      ansible.builtin.shell: |
        curl -fsSL https://deb.nodesource.com/setup_{{ node_version }}.x | bash -
        apt-get install -y nodejs
      args:
        creates: /usr/bin/node    # Skip if node is already installed (idempotency)

    - name: Create app user
      ansible.builtin.user:
        name: "{{ app_user }}"
        system: true
        create_home: false

    - name: Create app directory
      ansible.builtin.file:
        path: "{{ app_dir }}"
        state: directory
        owner: "{{ app_user }}"
        mode: "0755"

    - name: Deploy application
      ansible.builtin.copy:
        src: ./dist/
        dest: "{{ app_dir }}/"
        owner: "{{ app_user }}"

    - name: Template nginx config
      ansible.builtin.template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/myapp
      notify: Reload nginx              # Trigger handler

    - name: Enable nginx site
      ansible.builtin.file:
        src: /etc/nginx/sites-available/myapp
        dest: /etc/nginx/sites-enabled/myapp
        state: link

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded
```

```bash
# Run a playbook
ansible-playbook -i inventory.ini playbook.yml
ansible-playbook -i inventory.ini playbook.yml --check      # Dry run
ansible-playbook -i inventory.ini playbook.yml --diff       # Show file diffs
ansible-playbook -i inventory.ini playbook.yml --tags install  # Run only tagged tasks
ansible-playbook ... --limit webservers                      # Limit to host group

# Ad-hoc commands (no playbook)
ansible webservers -i inventory.ini -m ping
ansible all -i inventory.ini -m shell -a "df -h"
ansible webservers -i inventory.ini -m apt -a "name=nginx state=present" --become
```

---

### 6. Terraform + Ansible Together

```
Typical workflow:

Terraform:
  ① Provision VPC, subnets, security groups
  ② Create EC2 instances (get their IPs)
  ③ Create RDS database, ElastiCache
  ④ Set up load balancer, target groups, listeners

Ansible (runs after Terraform):
  ⑤ Install runtime (Node, Python, Java)
  ⑥ Deploy application code
  ⑦ Configure nginx, systemd services
  ⑧ Run database migrations

CI/CD pipeline stitches them together:
  terraform apply → capture output IPs → ansible-playbook -i <dynamic inventory>
```

---

### 7. GitOps

**GitOps** (introduced ~2017 by Weaveworks) extends IaC: Git is not just where the code lives — it is the **single source of truth** for all infrastructure state. Changes happen by merging a pull request, never by running commands manually.

```
Developer pushes PR → Review → Merge to main
                                    │
                                    ▼
                         GitOps operator (ArgoCD, Flux)
                         detects change in Git
                                    │
                                    ▼
                         Applies change to cluster/infra
                         Reports back success/failure
                         Drifts are auto-corrected
```

> **Tool:** ArgoCD · **Introduced:** 2018 · **Latest:** 2.11 (2024) · **Deprecated:** N/A · **Status:** 🟢 Modern — dominant GitOps tool for Kubernetes  
> **Tool:** Flux · **Introduced:** 2019 (v2) · **Latest:** 2.x (2024) · **Deprecated:** Flux v1 (deprecated 2022) · **Status:** 🟢 Modern

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- 📖 **[Terraform Docs (FREE)](https://developer.hashicorp.com/terraform/docs)** — Start with "Get Started — AWS/Azure/GCP" tutorials; they are excellent
- 📖 **[Ansible Docs (FREE)](https://docs.ansible.com/)** — Official reference; structured well for learning


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 📺 **[TechWorld with Nana — Terraform Course (YouTube, FREE)](https://www.youtube.com/watch?v=7xngnjfIlK4)** — Best full walkthrough with AWS, 4 hours
- 📺 **[Jeff Geerling — Ansible 101 (YouTube, FREE)](https://www.youtube.com/playlist?list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN)** — Most thorough intro to Ansible; very practical


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[Terraform AWS Getting Started (FREE tier)](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)** — Official interactive tutorials, free with AWS free tier


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Terraform a Cloud Environment
Using AWS free tier, Azure free account, or GCP free tier:

- [ ] Write Terraform to provision: VPC, public subnet, security group, EC2/VM instance
- [ ] Use variables for region, environment name, and instance type
- [ ] Store state in a remote backend (S3 for AWS, Azure Storage, or Terraform Cloud free tier)
- [ ] Add outputs: instance IP, VPC ID
- [ ] Run `terraform fmt`, `terraform validate`, `terraform plan` — review the plan
- [ ] Apply — verify the instance is accessible via SSH
- [ ] Modify the security group — run `terraform plan` again and read the diff carefully
- [ ] Destroy everything cleanly with `terraform destroy`

### Assignment 2 — Ansible Server Configuration
Using the instance from Assignment 1 (or a local VM via Vagrant/VirtualBox):

- [ ] Write an inventory file pointing to your server
- [ ] Write a playbook that: updates packages, installs nginx, deploys a static HTML file
- [ ] Template the nginx config with at least one variable
- [ ] Run with `--check` first; then for real
- [ ] Break something (delete the nginx config manually) — rerun playbook to prove idempotency restores it
- [ ] Add a second play that creates an app user with a specific UID

### Assignment 3 — Full IaC Pipeline
Combine Terraform + Ansible in a CI/CD workflow:

- [ ] GitHub Actions workflow with two jobs: `provision` (Terraform) then `configure` (Ansible)
- [ ] Terraform state stored remotely
- [ ] Ansible inventory dynamically generated from Terraform output
- [ ] Pipeline triggered on push to `main`
- [ ] Add `terraform plan` as a PR check (no apply on PRs — only on merge)
- [ ] Document: how would you roll back if the Ansible step fails?

---

## ✅ Milestone Checklist

- [ ] Can explain what IaC solves vs manual ClickOps
- [ ] Can write a Terraform config with variables, resources, and outputs
- [ ] Can read `terraform plan` output and predict what will be created/changed/destroyed
- [ ] Can write an Ansible playbook that is idempotent
- [ ] Know when to use Terraform vs Ansible vs both
- [ ] Have provisioned real cloud infrastructure and destroyed it cleanly
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Your infrastructure is now code.**
>
> Everything is in Git, reviewable, reproducible, and automated.
> You've crossed the line from "DevOps engineer" to "platform engineer."

**Log this in your kanban:** Move `devops/iac` to ✅ Done.

## ➡️ Next Unit

→ [Monitoring & Observability](monitoring.md)
