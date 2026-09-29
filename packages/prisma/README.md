# @corsair-dev/prisma

Prisma plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/prisma
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `backups.list` | `prisma.api.backups.list` | `read` | List backups for a database |
| `backups.restore` | `prisma.api.backups.restore` | `destructive` | Restore a backup onto the target database (async, overwrites current data) |
| `connections.create` | `prisma.api.connections.create` | `write` | Create a connection (returns a ready-to-use connection string) |
| `connections.delete` | `prisma.api.connections.delete` | `destructive` | Delete/revoke a connection and access for anything using it |
| `connections.list` | `prisma.api.connections.list` | `read` | List connections |
| `databases.create` | `prisma.api.databases.create` | `write` | Create a database in a project |
| `databases.delete` | `prisma.api.databases.delete` | `destructive` | Delete a database and all of its data |
| `databases.get` | `prisma.api.databases.get` | `read` | Retrieve database details |
| `databases.getUsage` | `prisma.api.databases.getUsage` | `read` | Retrieve database usage metrics for a time period |
| `databases.inspectSchema` | `prisma.api.databases.inspectSchema` | `read` | Inspect a database schema (tables, columns, types, constraints) |
| `databases.list` | `prisma.api.databases.list` | `read` | List databases for a project |
| `integrations.list` | `prisma.api.integrations.list` | `read` | List integrations (OAuth clients, granted scopes) for a workspace |
| `projects.create` | `prisma.api.projects.create` | `write` | Create a project and its default/database environment |
| `projects.delete` | `prisma.api.projects.delete` | `destructive` | Delete a project and all of its data |
| `projects.get` | `prisma.api.projects.get` | `read` | Retrieve project details |
| `projects.list` | `prisma.api.projects.list` | `read` | List projects the token has access to |
| `projects.transfer` | `prisma.api.projects.transfer` | `write` | Transfer a project to another workspace |
| `regions.list` | `prisma.api.regions.list` | `read` | List all available regions across products (optionally by product) |
| `regions.listAccelerate` | `prisma.api.regions.listAccelerate` | `read` | List all available Prisma Accelerate regions |
| `regions.listPostgres` | `prisma.api.regions.listPostgres` | `read` | List all available Prisma Postgres regions with availability |
| `sql.execute` | `prisma.api.sql.execute` | `destructive` | Execute a SQL command (INSERT/UPDATE/DELETE/DDL) over the Postgres connection |
| `sql.query` | `prisma.api.sql.query` | `read` | Execute a read-only SQL query (SELECT) over the Postgres connection |
| `workspaces.list` | `prisma.api.workspaces.list` | `read` | List workspaces the token can access |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/prisma

## License

Apache-2.0
