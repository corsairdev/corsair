# @corsair-dev/convex

Convex plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/convex
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customDomains.delete` | `convex.api.customDomains.delete` | `destructive` | Remove a custom domain from a Convex deployment |
| `deployKeys.create` | `convex.api.deployKeys.create` | `write` | Create a deploy key for a Convex deployment |
| `deployKeys.list` | `convex.api.deployKeys.list` | `read` | List deploy keys for a Convex deployment |
| `deployment.executeQueryBatch` | `convex.api.deployment.executeQueryBatch` | `read` | Execute a batch of Convex queries against a deployment |
| `deployment.getQueryTimestamp` | `convex.api.deployment.getQueryTimestamp` | `read` | Get the current query timestamp for a Convex deployment |
| `deployment.listLogStreams` | `convex.api.deployment.listLogStreams` | `read` | List log streams configured for a Convex deployment |
| `deployments.create` | `convex.api.deployments.create` | `write` | Create a new deployment for a Convex project |
| `deployments.delete` | `convex.api.deployments.delete` | `destructive` | Delete a Convex deployment and all of its data and files |
| `deployments.get` | `convex.api.deployments.get` | `read` | Get details about a Convex cloud deployment |
| `deployments.list` | `convex.api.deployments.list` | `read` | List deployments for a Convex project |
| `deployments.update` | `convex.api.deployments.update` | `write` | Update properties of an existing Convex deployment |
| `platform.getTokenDetails` | `convex.api.platform.getTokenDetails` | `read` | Get details about the token used to authenticate |
| `platform.listDeploymentClasses` | `convex.api.platform.listDeploymentClasses` | `read` | List the deployment classes available to a Convex team |
| `platform.listDeploymentRegions` | `convex.api.platform.listDeploymentRegions` | `read` | List the deployment regions available to a Convex team |
| `projects.create` | `convex.api.projects.create` | `write` | Create a new Convex project, optionally provisioning a deployment |
| `projects.delete` | `convex.api.projects.delete` | `destructive` | Delete a Convex project and all of its deployments |
| `projects.getById` | `convex.api.projects.getById` | `read` | Get a Convex project by its ID |
| `projects.getBySlug` | `convex.api.projects.getBySlug` | `read` | Get a Convex project by team identifier and project slug |
| `projects.list` | `convex.api.projects.list` | `read` | List projects in a Convex team |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/convex

## License

Apache-2.0
