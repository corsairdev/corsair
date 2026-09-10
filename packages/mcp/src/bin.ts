#!/usr/bin/env node
/**
 * Turnkey stdio MCP server for Corsair, configured entirely from the
 * environment so MCP registries (mcp.so, Glama, Smithery, the official
 * registry, …) can list it as `npx @corsair-dev/mcp`.
 *
 * Env contract:
 *   CORSAIR_KEK           (required) key-encryption key for stored credentials
 *   CORSAIR_API_KEY       (required) Corsair Hub project API key
 *   CORSAIR_PLUGINS       (required) comma list of plugins, e.g.
 *                         "slack,github" or "@corsair-dev/slack,@corsair-dev/github"
 *   CORSAIR_SIGNING_SECRET (required) Hub signing secret; Hub needs both keys
 *   CORSAIR_DB_PATH       (optional) sqlite file, default ./corsair.db
 *   CORSAIR_MULTITENANCY  (optional) "true" to enable multi-tenant storage
 *   CORSAIR_READONLY      (optional) "true" to expose only read operations
 *
 * sqlite is the only bundled store (matches demo/mcp/db.ts). Outgrow it by
 * importing this package's pieces directly against a hosted database.
 */
import { createCorsair } from 'corsair';
import { runStdioMcpServer } from './index.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS corsair_integrations (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS corsair_accounts (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS corsair_entities (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
  version TEXT NOT NULL, data TEXT NOT NULL,
  UNIQUE (account_id, entity_type, entity_id)
);
CREATE TABLE IF NOT EXISTS corsair_events (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  account_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT NOT NULL, status TEXT
);
CREATE INDEX IF NOT EXISTS corsair_events_account_type_created_idx
  ON corsair_events (account_id, event_type, created_at);
CREATE TABLE IF NOT EXISTS corsair_permissions (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  token TEXT NOT NULL, plugin TEXT NOT NULL, endpoint TEXT NOT NULL,
  args TEXT NOT NULL, tenant_id TEXT NOT NULL DEFAULT 'default',
  status TEXT NOT NULL DEFAULT 'pending', expires_at TEXT NOT NULL, error TEXT NULL
);
`;

/** Package name for a plugin spec, and the named export it exposes. */
export function resolvePlugin(spec: string): {
	pkg: string;
	exportName: string;
} {
	const trimmed = spec.trim();
	const pkg = trimmed.includes('/') ? trimmed : `@corsair-dev/${trimmed}`;
	const exportName = pkg.replace(/^@corsair-dev\//, '');
	return { pkg, exportName };
}

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		console.error(`[corsair-mcp] missing required env ${name}`);
		process.exit(1);
	}
	return value;
}

async function main() {
	const kek = required('CORSAIR_KEK');
	const projectApiKey = required('CORSAIR_API_KEY');
	// Hub requires both credentials together (normalizeHubConfig throws if either
	// is empty), so the signing secret is required, not optional.
	const signingSecret = required('CORSAIR_SIGNING_SECRET');
	const specs = required('CORSAIR_PLUGINS')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	if (specs.length === 0) {
		console.error('[corsair-mcp] CORSAIR_PLUGINS lists no plugins');
		process.exit(1);
	}

	// sqlite is an optional dependency; only the bin needs it. The `as string`
	// keeps the specifier dynamic so it is not required to typecheck the package.
	const sqliteModule = await import('better-sqlite3' as string).catch(() => {
		console.error(
			'[corsair-mcp] needs "better-sqlite3" installed: npm i better-sqlite3',
		);
		process.exit(1);
	});
	const Database = (sqliteModule as { default: new (path: string) => unknown })
		.default;
	const database = new Database(process.env.CORSAIR_DB_PATH ?? './corsair.db');
	(database as { exec: (sql: string) => void }).exec(SCHEMA);

	// CREATE TABLE IF NOT EXISTS is a no-op against a database created by an
	// older schema, so a reused CORSAIR_DB_PATH can lack columns the permission
	// runtime needs. Reject an incompatible database with a clear message rather
	// than hitting missing-column errors mid-operation.
	const permissionCols = new Set(
		(database as { pragma: (s: string) => Array<{ name: string }> })
			.pragma('table_info(corsair_permissions)')
			.map((c) => c.name),
	);
	for (const col of ['token', 'plugin', 'args', 'tenant_id', 'expires_at']) {
		if (!permissionCols.has(col)) {
			console.error(
				`[corsair-mcp] corsair_permissions in this database is missing the "${col}" column — it was created by an older schema. Delete the database file or migrate it, then restart.`,
			);
			process.exit(1);
		}
	}

	const plugins = [];
	for (const spec of specs) {
		const { pkg, exportName } = resolvePlugin(spec);
		const mod = (await import(pkg).catch(() => {
			console.error(
				`[corsair-mcp] plugin "${pkg}" is not installed: npm i ${pkg}`,
			);
			process.exit(1);
		})) as Record<string, unknown>;
		const factory = mod[exportName] ?? mod.default;
		if (typeof factory !== 'function') {
			console.error(
				`[corsair-mcp] "${pkg}" has no "${exportName}" plugin export`,
			);
			process.exit(1);
		}
		// Plugin defaults only. Per-plugin options (e.g. authType) would need a
		// JSON config in env; add that when a listing actually needs it.
		plugins.push((factory as () => unknown)());
	}

	const corsair = (createCorsair as (config: unknown) => unknown)({
		database,
		kek,
		multiTenancy: process.env.CORSAIR_MULTITENANCY === 'true',
		hub: {
			projectApiKey,
			signingSecret,
			// stdout is the JSON-RPC channel for a stdio MCP server; the dev tunnel
			// logs its URL to stdout on a ck_dev_ key and would corrupt the stream.
			tunnel: false,
		},
		plugins,
	});

	await runStdioMcpServer({
		corsair: corsair as { [key: string]: unknown },
		runOptions: { readonly: process.env.CORSAIR_READONLY === 'true' },
	});
	console.error(`[corsair-mcp] serving ${plugins.length} plugin(s) over stdio`);
}

main().catch((err) => {
	console.error('[corsair-mcp]', err);
	process.exit(1);
});
