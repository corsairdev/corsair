# @corsair-dev/northflank

Corsair plugin for the [Northflank API](https://northflank.com/docs/v1/api/introduction), covering 21 operations: projects, services, secrets, pipelines, plans, regions, addon types, cloud providers, and account DNS.

## Authentication

All calls use a Northflank API token sent as a `Bearer` token. Generate one in Northflank team settings (an API role with the required permissions must exist) and provide it through Corsair credentials or explicitly:

```ts
import { northflank } from '@corsair-dev/northflank';

const plugin = northflank({ key: process.env.NORTHFLANK_API_TOKEN });
```

Missing credentials fail with `AuthMissingError`; the plugin never sends an empty key.

## Endpoint overview

| Domain | Operations |
| --- | --- |
| Projects | list, get, create, createOrUpdate, update, delete |
| Services | list |
| Secrets | list, get, create, createOrUpdate, patch, update, getDetails |
| Pipelines | list |
| Plans | list |
| Regions | list |
| Addon types | list |
| Cloud providers | listNodeTypes, listRegions |
| Misc | getDnsId |

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.list` | `northflank.api.projects.list` | `read` | List Northflank projects |
| `projects.get` | `northflank.api.projects.get` | `read` | Get details of a Northflank project |
| `projects.create` | `northflank.api.projects.create` | `write` | Create a new Northflank project |
| `projects.createOrUpdate` | `northflank.api.projects.createOrUpdate` | `write` | Create or update a Northflank project (upsert) |
| `projects.update` | `northflank.api.projects.update` | `write` | Update an existing Northflank project |
| `projects.delete` | `northflank.api.projects.delete` | `write` | Delete a Northflank project |
| `services.list` | `northflank.api.services.list` | `read` | List services in a Northflank project |
| `secrets.list` | `northflank.api.secrets.list` | `read` | List secret groups in a Northflank project |
| `secrets.get` | `northflank.api.secrets.get` | `read` | Get details of a Northflank secret group |
| `secrets.create` | `northflank.api.secrets.create` | `write` | Create a new secret group in a Northflank project |
| `secrets.createOrUpdate` | `northflank.api.secrets.createOrUpdate` | `write` | Create or update a secret group in a Northflank project |
| `secrets.patch` | `northflank.api.secrets.patch` | `write` | Partially update a secret group in a Northflank project |
| `secrets.update` | `northflank.api.secrets.update` | `write` | Update a secret group in a Northflank project |
| `secrets.getDetails` | `northflank.api.secrets.getDetails` | `read` | Get a secret group with linked addon details |
| `pipelines.list` | `northflank.api.pipelines.list` | `read` | List pipelines in a Northflank project |
| `plans.list` | `northflank.api.plans.list` | `read` | List available Northflank resource plans |
| `regions.list` | `northflank.api.regions.list` | `read` | List available Northflank regions |
| `addonTypes.list` | `northflank.api.addonTypes.list` | `read` | List available Northflank addon types |
| `cloudProviders.listNodeTypes` | `northflank.api.cloudProviders.listNodeTypes` | `read` | List supported cloud provider node types |
| `cloudProviders.listRegions` | `northflank.api.cloudProviders.listRegions` | `read` | List supported cloud provider regions |
| `misc.getDnsId` | `northflank.api.misc.getDnsId` | `read` | Get the DNS identifier for the authenticated account |

No webhooks are registered — Northflank exposes no webhook surface relevant to these operations.

## Important behavior

- Routes, methods, and payload shapes follow the Northflank v1 API reference exactly: `PUT /v1/projects` upserts projects by name (no path id), `PUT /v1/projects/{projectId}/secrets` upserts secret groups, `PATCH` does partial updates, and `POST /v1/projects/{projectId}/secrets/{secretId}` performs the secret update.
- `secretType` uses the documented enum (`environment-arguments`, `environment`, `arguments`); `type` is the hierarchy switch (`secret`, `config`).
- Project `create`/`createOrUpdate` accept either `region` or `clusterId` (BYOC) — one of them is required.
- List responses carry `pagination` (`hasNextPage`, `cursor`, `count`) as a top-level sibling of `data`, matching the API envelope.
- Path ids are URL-encoded before interpolation.
- Secret values and secret content payloads are never written to event logs — only ids and names are logged.
- `429` rate-limit and `5xx` responses use exponential backoff for reads; write operations are never retried, to prevent duplicate resources.
- Every operation has a Zod input/output contract and a mocked routing test asserting the exact path, method, and body.

## Tests

Five test files, no more:

| File | What it covers |
| --- | --- |
| `error-handler.test.ts` | Error routing (mocked) |
| `schema.test.ts` | Zod input/output validation (mocked) |
| `client.test.ts` | Request construction and error mapping (mocked) |
| `endpoints.test.ts` | Every endpoint's route, method, and body (mocked) |
| `api.test.ts` | Live read-only checks against the real API |

```bash
pnpm --filter @corsair-dev/northflank typecheck
pnpm --filter @corsair-dev/northflank test
pnpm --filter @corsair-dev/northflank build
```

Offline tests require no key. Live tests run only with `NORTHFLANK_API_KEY` set and perform read-only calls (no resource is created, updated, or deleted):

```bash
export NORTHFLANK_API_KEY
pnpm --filter @corsair-dev/northflank test
```

## Links

- [Northflank API introduction](https://northflank.com/docs/v1/api/introduction)
- [Use the API](https://northflank.com/docs/v1/api/use-the-api)
- [Northflank API skills reference](https://github.com/northflank/skills/blob/master/skills/northflank/references/api-overview.md)
