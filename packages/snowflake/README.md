# @corsair-dev/snowflake

Run SQL on a Snowflake account through the SQL API. Submit a statement, fetch one result partition, or cancel execution.

## Install

```bash
pnpm add @corsair-dev/snowflake
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `statements.submit` | `snowflake.api.statements.submit` | `destructive` | Submit SQL for execution. Returns rows, a handle while the statement is still running, or DML stats. |
| `statements.get` | `snowflake.api.statements.get` | `read` | Fetch the status of a statement and one partition of its result. |
| `statements.cancel` | `snowflake.api.statements.cancel` | `write` | Cancel a running SQL statement. |

`PUT`, `GET`, `USE`, `ALTER SESSION`, `BEGIN`, `COMMIT`, `ROLLBACK`, session-variable statements, and statements that create temporary tables or stages are not supported by the SQL API.

Results that do not fit in one response are split into partitions. Pass `partition` (starting at 0) to `statements.get`. The `Link` response header is not returned by the client; `resultSetMetaData.partitionInfo` lists the partitions.

## Auth

Auth: API key, sent as `Authorization: Bearer <token>`. The token is a key-pair JWT, an OAuth token, a programmatic access token, or a workload-identity token (`WIF.{provider}.{token}`).

Every request also sends `Accept: application/json`, `Content-Type: application/json`, and `User-Agent: corsair-snowflake/0.1.0`.

The account host is a second credential, `account`: an identifier such as `myorg-myaccount`, or a full `https://<account>.snowflakecomputing.com` URL (private link and `snowflakecomputing.cn` included). Set optional `tokenType` to `KEYPAIR_JWT`, `OAUTH`, `PROGRAMMATIC_ACCESS_TOKEN`, or `WORKLOAD_IDENTITY_FEDERATION` when you want `X-Snowflake-Authorization-Token-Type` sent. Workload identity federation requires that header. The other token kinds can omit it; Snowflake inspects the token.

```ts
import { snowflake } from '@corsair-dev/snowflake';
import { createCorsair } from 'corsair';

const client = createCorsair({
  plugins: [
    snowflake({
      key: process.env.SNOWFLAKE_API_KEY,
      account: process.env.SNOWFLAKE_ACCOUNT,
      tokenType: 'PROGRAMMATIC_ACCESS_TOKEN',
    }),
  ],
});

await client.snowflake.api.statements.submit({
  statement: 'SELECT 1',
  warehouse: 'COMPUTE_WH',
  timeout: 30,
});
```

Warehouse compute is billed per second while the warehouse runs, with a 60-second minimum each time it resumes. The SQL API has no per-request price. To resubmit a statement without running it twice, pass the same `requestId` and `retry: true`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/snowflake

SQL API reference: https://docs.snowflake.com/en/developer-guide/sql-api/reference

## License

Apache-2.0
