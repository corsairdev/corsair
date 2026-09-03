import type { CorsairDatabase } from '../../db/kysely/database';
import type { ConnectRequest } from '../management/types';

// A connect-request is the bridge between a server-side auth-missing failure and
// the browser dialog: when any tool call raises auth-missing, the binding
// records one here; the client reads it on-demand when a failure surfaces (a
// read boundary catching, or `call` catching a mutation) to show the dialog.
// One row per tenant — the latest failure wins.

/** How long a recorded request stays live before it's treated as stale. */
export const CONNECT_REQUEST_TTL_MS = 10 * 60 * 1000;

export type RecordConnectRequestInput = {
	tenantId: string;
	plugin: string;
	connectUrl: string;
};

export async function recordConnectRequest(
	database: CorsairDatabase,
	input: RecordConnectRequestInput,
	now: number = Date.now(),
): Promise<void> {
	await database.db
		.insertInto('corsair_connects')
		.values({
			tenant_id: input.tenantId,
			plugin: input.plugin,
			connect_url: input.connectUrl,
			requested_at: new Date(now).toISOString(),
		})
		.onConflict((oc) =>
			oc.column('tenant_id').doUpdateSet({
				plugin: input.plugin,
				connect_url: input.connectUrl,
				requested_at: new Date(now).toISOString(),
			}),
		)
		.execute();
}

/** The tenant's live connect-request, or null when there is none or it expired. */
export async function readConnectRequest(
	database: CorsairDatabase,
	tenantId: string,
	now: number = Date.now(),
	ttlMs: number = CONNECT_REQUEST_TTL_MS,
): Promise<ConnectRequest | null> {
	const row = await database.db
		.selectFrom('corsair_connects')
		.selectAll()
		.where('tenant_id', '=', tenantId)
		.executeTakeFirst();

	if (!row) return null;
	if (now - Date.parse(row.requested_at) > ttlMs) return null;
	return {
		plugin: row.plugin,
		connectUrl: row.connect_url,
		requestedAt: row.requested_at,
		tenantId: row.tenant_id,
	};
}

export async function clearConnectRequest(
	database: CorsairDatabase,
	tenantId: string,
): Promise<void> {
	await database.db
		.deleteFrom('corsair_connects')
		.where('tenant_id', '=', tenantId)
		.execute();
}

// Called from the failing tool-call path, so it must never throw or block: a
// missing db/plugin/url just means no dialog is pre-armed, and a write error is
// swallowed.
export async function recordConnectRequestBestEffort(
	database: CorsairDatabase | undefined,
	input: {
		tenantId: string | undefined;
		plugin: string | null | undefined;
		connectUrl: string | null | undefined;
	},
): Promise<void> {
	if (!database || !input.plugin || !input.connectUrl) return;
	try {
		await recordConnectRequest(database, {
			tenantId: input.tenantId ?? 'default',
			plugin: input.plugin,
			connectUrl: input.connectUrl,
		});
	} catch {}
}
