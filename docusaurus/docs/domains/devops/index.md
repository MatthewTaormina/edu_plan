# 🚢 DevOps Domain Index

> Shipping, operating, and scaling software in production.

---

## Units in This Domain

| Unit | Topic | Estimated Time | Status |
|------|-------|---------------|--------|
| [`linux_cli.md`](linux_cli.md) | Shell, filesystem, scripting, SSH | 3 weeks | 📋 Planned |
| [`git_workflow.md`](git_workflow.md) | Branching, PRs, GitFlow, hooks | 1 week | 📋 Planned |
| [`docker.mdx`](docker.mdx) | Images, containers, Compose, networking | 3 weeks | 📋 Planned |
| [`kubernetes.md`](kubernetes.md) | Pods, deployments, services, Helm | 5 weeks | 📋 Planned |
| [`ci_cd.md`](ci_cd.md) | GitHub Actions, pipelines, deployment | 3 weeks | 📋 Planned |
| [`iac.md`](iac.md) | Terraform, Ansible, IaC principles | 3 weeks | 📋 Planned |
| [`monitoring.md`](monitoring.md) | Prometheus, Grafana, OpenTelemetry | 2 weeks | 📋 Planned |
| [`testing.md`](testing.md) | Unit, integration, E2E, TDD | 2 weeks | 📋 Planned |

---

## Dependency Order

```
git_workflow ←── linux_cli
      ↓
   docker
      ↓
kubernetes ←── (cloud/fundamentals)
      ↓
ci_cd ←── kubernetes
      ↓
iac ←── (cloud/fundamentals)
      ↓
  monitoring
```
