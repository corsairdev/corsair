import { sql } from 'kysely';
import { generateUUID } from '../../core/utils';
import type { CorsairDatabase } from '../../db/kysely/database';
import type { ConnectRequest } from '../management/types';

// A connect-request is the bridge between a server-side auth-missing failure and
// the browser dialog: when any tool call raises auth-missing, the binding
// appends one to the immutable corsair_events log; the client reads the tenant's
// latest live request on-demand when a failure surfaces (a read boundary
// catching, or `call` catching a mutation) to show the dialog.

export const CONNECT_REQUEST_EVENT = 'connect.request';
export const CONNECT_CLEARED_EVENT = 'connect.cleared';

/** How long a recorded request stays live before it's treated as stale. */
export const CONNECT_REQUEST_TTL_MS = 10 * 60 * 1000;

export type RecordConnectRequestInput = {
	tenantId: string;
	plugin: string;
	connectUrl: string;
};

// Resolves the account row that owns a connect event. corsair_events.account_id
// is a foreign key into corsair_accounts, and setup/ensurePluginRows provisions
// one (tenant, integration) account before any connect link is minted — so the
// target exists by the time a request is recorded.
async function resolveAccountId(
	database: CorsairDatabase,
	tenantId: string,
	plugin: string,
): Promise<string | null> {
	const integration = await database.db
		.selectFrom('corsair_integrations')
		.select('id')
		.where('name', '=', plugin)
		.executeTakeFirst();
	if (!integration) return null;

	const account = await database.db
		.selectFrom('corsair_accounts')
		.select('id')
		.where('tenant_id', '=', tenantId)
		.where('integration_id', '=', integration.id)
		.executeTakeFirst();
	return account?.id ?? null;
}

async function tenantAccountIds(
	database: CorsairDatabase,
	tenantId: string,
): Promise<string[]> {
	const rows = await database.db
		.selectFrom('corsair_accounts')
		.select('id')
		.where('tenant_id', '=', tenantId)
		.execute();
	return rows.map((r) => r.id);
}

async function appendConnectEvent(
	database: CorsairDatabase,
	accountId: string,
	eventType: string,
	payload: Record<string, unknown>,
	now: number,
): Promise<void> {
	const at = new Date(now);
	await database.db
		.insertInto('corsair_events')
		.values({
			id: generateUUID(),
			created_at: at,
			updated_at: at,
			account_id: accountId,
			event_type: eventType,
			payload,
		})
		.execute();
}

export async function recordConnectRequest(
	database: CorsairDatabase,
	input: RecordConnectRequestInput,
	now: number = Date.now(),
): Promise<void> {
	const accountId = await resolveAccountId(
		database,
		input.tenantId,
		input.plugin,
	);
	if (!accountId) return;
	await appendConnectEvent(
		database,
		accountId,
		CONNECT_REQUEST_EVENT,
		{ plugin: input.plugin, connectUrl: input.connectUrl },
		now,
	);
}

type LiveRequest = ConnectRequest & {
	requestedAtMs: number;
	accountId: string;
};

// The most recent connect event for one account. The CASE tiebreak makes a
// `connect.cleared` win a same-timestamp tie against a `connect.request` (the
// safe default: prompt stays suppressed). Bounded to `limit 1` on
// (account_id, event_type, created_at) — an index seek per plugin, so it never
// scans the growing event log.
async function latestConnectEventForAccount(
	database: CorsairDatabase,
	accountId: string,
	tenantId: string,
	now: number,
	ttlMs: number,
): Promise<LiveRequest | null> {
	const latest = await database.db
		.selectFrom('corsair_events')
		.select(['event_type', 'payload', 'created_at'])
		.where('account_id', '=', accountId)
		.where('event_type', 'in', [CONNECT_REQUEST_EVENT, CONNECT_CLEARED_EVENT])
		.orderBy('created_at', 'desc')
		.orderBy(
			sql`case when event_type = ${CONNECT_CLEARED_EVENT} then 0 else 1 end`,
			'asc',
		)
		.limit(1)
		.executeTakeFirst();

	if (!latest || latest.event_type !== CONNECT_REQUEST_EVENT) return null;

	const requestedAtMs =
		latest.created_at instanceof Date
			? latest.created_at.getTime()
			: Date.parse(String(latest.created_at));
	if (now - requestedAtMs > ttlMs) return null;

	const payload =
		typeof latest.payload === 'string'
			? (JSON.parse(latest.payload) as Record<string, unknown>)
			: ((latest.payload ?? {}) as Record<string, unknown>);
	const plugin = payload.plugin;
	const connectUrl = payload.connectUrl;
	if (typeof plugin !== 'string' || typeof connectUrl !== 'string') return null;

	return {
		plugin,
		connectUrl,
		requestedAt: new Date(requestedAtMs).toISOString(),
		tenantId,
		requestedAtMs,
		accountId,
	};
}

/**
 * The tenant's live connect-request, or null when there is none. Per-plugin and
 * one-at-a-time: among all plugins whose latest event is a live request, the one
 * with the oldest created_at wins (FIFO — the first modal doesn't drift to a
 * later failure), tiebroken by account_id so it never flaps. N = plugins the
 * tenant uses (small), one index seek each.
 */
export async function readConnectRequest(
	database: CorsairDatabase,
	tenantId: string,
	now: number = Date.now(),
	ttlMs: number = CONNECT_REQUEST_TTL_MS,
): Promise<ConnectRequest | null> {
	const accountIds = await tenantAccountIds(database, tenantId);
	if (accountIds.length === 0) return null;

	const live = (
		await Promise.all(
			accountIds.map((id) =>
				latestConnectEventForAccount(database, id, tenantId, now, ttlMs),
			),
		)
	).filter((r): r is LiveRequest => r !== null);
	if (live.length === 0) return null;

	live.sort(
		(a, b) =>
			a.requestedAtMs - b.requestedAtMs ||
			a.accountId.localeCompare(b.accountId),
	);
	const { requestedAtMs: _ms, accountId: _acct, ...request } = live[0]!;
	return request;
}

/**
 * Suppress a live request by appending a tombstone to the plugin's account.
 * With `plugin`, clears only that plugin. Without it (back-compat), resolves the
 * current live request and clears that plugin; no-op when nothing is live.
 * Append-only: a tombstone supersedes the request, rows are never deleted.
 */
export async function clearConnectRequest(
	database: CorsairDatabase,
	tenantId: string,
	now: number = Date.now(),
	plugin?: string,
): Promise<void> {
	let accountId: string | null;
	if (plugin) {
		accountId = await resolveAccountId(database, tenantId, plugin);
	} else {
		const live = await readConnectRequest(database, tenantId, now);
		accountId = live
			? await resolveAccountId(database, tenantId, live.plugin)
			: null;
	}
	if (!accountId) return;
	await appendConnectEvent(database, accountId, CONNECT_CLEARED_EVENT, {}, now);
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
