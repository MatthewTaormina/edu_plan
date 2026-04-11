# ☁️ Cloud Domain

> Design and operate cloud-native systems at scale.

!!! warning "Coming in a future sprint"
    This domain is planned and will be expanded significantly. See the structure below.

---

## Planned Structure

The Cloud domain will be split into two tracks to avoid mixing generic concepts with vendor specifics:

### Track 1 — Cloud Fundamentals (Provider-Agnostic)

Concepts that apply to any cloud provider:

| Unit | Topic | Status |
|------|-------|--------|
| `fundamentals.md` | Cloud models (IaaS/PaaS/SaaS), pricing, shared responsibility | 📋 Planned |
| `networking.md` | VPCs, subnets, routing, load balancers, CDN, DNS | 📋 Planned |
| `storage.md` | Object storage, block storage, file storage, lifecycle policies | 📋 Planned |
| `databases.md` | Managed databases, read replicas, connection pooling, backups | 📋 Planned |
| `compute.md` | VMs, containers, serverless, auto-scaling | 📋 Planned |
| `iam.md` | Identity, roles, policies, least-privilege | 📋 Planned |
| `serverless.md` | Functions-as-a-Service, event-driven, FaaS patterns | 📋 Planned |
| `architecture_patterns.md` | Microservices, event-driven, CQRS, saga pattern | 📋 Planned |

### Track 2 — Platform-Specific (AWS / Azure / GCP)

Concrete implementation with each provider's services and CLI:

**AWS**

| Unit | Topic | Status |
|------|-------|--------|
| `aws/ec2.md` | EC2 instances, AMIs, security groups, key pairs | 📋 Planned |
| `aws/s3.md` | Buckets, policies, presigned URLs, versioning, lifecycle | 📋 Planned |
| `aws/rds.md` | RDS, Aurora, parameter groups, Multi-AZ, snapshots | 📋 Planned |
| `aws/lambda.md` | Lambda functions, event sources, layers, cold starts | 📋 Planned |
| `aws/iam.md` | IAM users, roles, policies, STS, instance profiles | 📋 Planned |
| `aws/vpc.md` | VPCs, subnets, route tables, internet gateways, NAT | 📋 Planned |
| `aws/eks.md` | Managed Kubernetes on AWS | 📋 Planned |

**Azure**

| Unit | Topic | Status |
|------|-------|--------|
| `azure/compute.md` | VMs, VMSS, Azure Container Apps | 📋 Planned |
| `azure/storage.md` | Blob, Queue, Table, File storage | 📋 Planned |
| `azure/sql.md` | Azure SQL, Cosmos DB, PostgreSQL Flexible | 📋 Planned |
| `azure/functions.md` | Azure Functions, Durable Functions | 📋 Planned |
| `azure/aks.md` | Managed Kubernetes on Azure | 📋 Planned |

**GCP**

| Unit | Topic | Status |
|------|-------|--------|
| `gcp/compute.md` | Compute Engine, GKE, Cloud Run | 📋 Planned |
| `gcp/storage.md` | Cloud Storage, Cloud SQL, Firestore | 📋 Planned |
| `gcp/functions.md` | Cloud Functions, Cloud Run | 📋 Planned |

---

## Teaching Approach

1. **Teach concepts in Track 1 first** — a VPC is a VPC regardless of provider
2. **Track 2 shows how to apply it** with each provider's actual CLI/console/SDK
3. **Cross-link liberally** — the S3 unit links back to the generic storage unit for concepts

---

## Quick Links (while units are being built)

- 📖 **[AWS Docs (FREE)](https://docs.aws.amazon.com/)** — Authoritative AWS reference
- 📖 **[Azure Docs (FREE)](https://learn.microsoft.com/en-us/azure/)** — Authoritative Azure reference
- 📖 **[GCP Docs (FREE)](https://cloud.google.com/docs)** — Authoritative GCP reference
- 📺 **[AWS Cloud Practitioner Essentials (FREE)](https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/)** — Good conceptual foundation
