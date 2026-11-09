# @corsair-dev/servicenow

Servicenow plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/servicenow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `records.create` | `servicenow.api.records.create` | `write` | Create a record in any table, which triggers its business rules and notifications |
| `records.delete` | `servicenow.api.records.delete` | `destructive` | Delete one record. ServiceNow keeps no undo, and a deleted record takes its references with it |
| `records.get` | `servicenow.api.records.get` | `read` | Read one record by its sys_id |
| `records.list` | `servicenow.api.records.list` | `read` | Query any table with an encoded query, field selection and offset paging |
| `records.update` | `servicenow.api.records.update` | `write` | Patch fields on one record, which triggers its business rules and notifications |
| `tables.list` | `servicenow.api.tables.list` | `read` | List the tables this account can read, to find a name to query |

## Auth

Auth: HTTP Basic, with a username and password for your own ServiceNow instance.

Every customer runs their own instance, so two values are needed:

```ts
import Database from 'better-sqlite3';
import { createCorsair } from 'corsair';
import { servicenow } from '@corsair-dev/servicenow';

const db = new Database('corsair.db');
const corsair = createCorsair({
	plugins: [
		servicenow({
			host: 'acme.service-now.com',
			// The pair travels JSON-encoded, because a key is one string.
			key: JSON.stringify({ username: 'admin', password: process.env.SN_PASSWORD }),
		}),
	],
	database: db,
	kek: process.env.CORSAIR_KEK!,
});
```

Or store both once with `keys.set_host(host)` and
`keys.set_api_key(JSON.stringify({ username, password }))`. The `keys` methods need a
database and a KEK, and Corsair does not prompt for credentials on its own without Hub: a
call with neither a stored pair nor an `key` option throws `AuthMissingError`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/servicenow

## License

Apache-2.0
