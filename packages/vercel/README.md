# @corsair-dev/vercel

Vercel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vercel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `aliases.assignAlias` | `vercel.api.aliases.assignAlias` | `write` | Assign an alias |
| `aliases.getAliases` | `vercel.api.aliases.getAliases` | `read` | Get all aliases |
| `deployments.createDeployment` | `vercel.api.deployments.createDeployment` | `write` | Create a deployment |
| `deployments.getDeployment` | `vercel.api.deployments.getDeployment` | `read` | Get deployment details |
| `deployments.getDeployments` | `vercel.api.deployments.getDeployments` | `read` | Get all deployments |
| `domains.getDomains` | `vercel.api.domains.getDomains` | `read` | Get all domains |
| `domains.getProjectDomains` | `vercel.api.domains.getProjectDomains` | `read` | Get project domains |
| `envs.createEnvVariable` | `vercel.api.envs.createEnvVariable` | `write` | Create an environment variable for a project (supports plain, secret, encrypted, and sensitive types) |
| `envs.getEnvVariables` | `vercel.api.envs.getEnvVariables` | `read` | Get environment variables for a project (may include secret/sensitive values) |
| `projects.getProject` | `vercel.api.projects.getProject` | `read` | Get project details |
| `projects.getProjects` | `vercel.api.projects.getProjects` | `read` | Get all projects |
| `teams.getTeams` | `vercel.api.teams.getTeams` | `read` | Get all teams |
| `webhooks.createWebhook` | `vercel.api.webhooks.createWebhook` | `write` | Create a webhook |
| `webhooks.getWebhooks` | `vercel.api.webhooks.getWebhooks` | `read` | Get all webhooks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vercel

## License

Apache-2.0
