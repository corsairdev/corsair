# @corsair-dev/contentfulgraphql

Contentful GraphQL plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/contentfulgraphql
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `getCmaToken` | `contentfulgraphql.api.getCmaToken` | `read` | Get the stored Contentful access token, space ID, and environment ID |
| `graphQlContentApiPersistedQuery` | `contentfulgraphql.api.graphQlContentApiPersistedQuery` | `read` | Run an automatic persisted query (APQ) against the Contentful GraphQL Content API using a SHA-256 hash |
| `graphQlContentApiQuery` | `contentfulgraphql.api.graphQlContentApiQuery` | `read` | Run a GraphQL query against the Contentful GraphQL Content API for the configured space and environment |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/contentfulgraphql

## License

Apache-2.0
