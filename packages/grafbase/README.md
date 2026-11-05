# @corsair-dev/grafbase

Grafbase plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/grafbase
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessTokens.create` | `grafbase.api.accessTokens.create` | `write` | Create a USER or ACCOUNT access token; the jwt value is returned only in this response, so store it right away |
| `accessTokens.delete` | `grafbase.api.accessTokens.delete` | `destructive` | Revoke an access token by ID; requests using it stop working immediately |
| `accessTokens.list` | `grafbase.api.accessTokens.list` | `read` | List your access tokens with their expiry and graph scopes, paginated |
| `deployments.get` | `grafbase.api.deployments.get` | `read` | Get one deployment's status, timing, schema change counts and the subgraph that triggered it |
| `graphs.create` | `grafbase.api.graphs.create` | `write` | Create an empty graph in an organization; it gets a schema when a subgraph is published to it |
| `graphs.delete` | `grafbase.api.graphs.delete` | `destructive` | Permanently delete a graph by ID, removing every branch and its schema history |
| `graphs.get` | `grafbase.api.graphs.get` | `read` | Get one graph by organization and graph slug, including its production branch |
| `graphs.list` | `grafbase.api.graphs.list` | `read` | List the graphs in an organization with their production branch, paginated; the response also carries the account id that graphs.create needs |
| `schemaVersions.list` | `grafbase.api.schemaVersions.list` | `read` | List a graph's schema versions, the deploy history with change messages, paginated |
| `subgraphs.delete` | `grafbase.api.subgraphs.delete` | `destructive` | Remove a subgraph from a branch and redeploy; dry run first to preview the composition result |
| `subgraphs.get` | `grafbase.api.subgraphs.get` | `read` | Get one subgraph's routing URL and SDL from a graph branch |
| `subgraphs.publish` | `grafbase.api.subgraphs.publish` | `write` | Publish a subgraph SDL to a graph branch, which runs composition and can trigger a gateway deployment; the outcome names the result, and composition failures carry their messages |
| `viewer.get` | `grafbase.api.viewer.get` | `read` | Return the user the access token belongs to; useful to check that a token works |

## Auth

Auth: API key. Create a token in the Grafbase dashboard on the Access Tokens page (account settings for a personal token, organization settings for an organization token). The first call reads the key saved for the tenant, and with no key saved it throws `AuthMissingError`, which may carry a `connectUrl`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/grafbase

## License

Apache-2.0
