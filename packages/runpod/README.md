# @corsair-dev/runpod

Runpod plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/runpod
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.myself` | `runpod.api.account.myself` | `read` | Get the authenticated RunPod user id, email, MFA, and SSH public key |
| `account.updateSettings` | `runpod.api.account.updateSettings` | `write` | Update the account SSH public key used for Pod access |
| `catalog.cpuTypes` | `runpod.api.catalog.cpuTypes` | `read` | List CPU types with vCPU range, RAM, and pricing |
| `catalog.gpuTypes` | `runpod.api.catalog.gpuTypes` | `read` | List GPU types with memory, cloud availability, pricing, and stock |
| `clusters.create` | `runpod.api.clusters.create` | `write` | Create a multi-node GPU cluster for distributed workloads |
| `endpoints.save` | `runpod.api.endpoints.save` | `write` | Create or update a Serverless endpoint and scaling settings |
| `pods.get` | `runpod.api.pods.get` | `read` | Get a Pod by id including status, cost, GPU, and memory |
| `pods.list` | `runpod.api.pods.list` | `read` | List Pods with optional status, GPU, image, and location filters |
| `registries.delete` | `runpod.api.registries.delete` | `write` | Delete stored container registry credentials |
| `registries.save` | `runpod.api.registries.save` | `write` | Store credentials for a private container registry |
| `registries.update` | `runpod.api.registries.update` | `write` | Update username or password for a saved registry auth |
| `secrets.create` | `runpod.api.secrets.create` | `write` | Create an encrypted secret referenced as RUNPOD_SECRET_<name> |
| `templates.delete` | `runpod.api.templates.delete` | `write` | Delete a template that is not in use by pods or endpoints |
| `templates.save` | `runpod.api.templates.save` | `write` | Create or update a reusable Pod or Serverless template |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/runpod

## License

Apache-2.0
