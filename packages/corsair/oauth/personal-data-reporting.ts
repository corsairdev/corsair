/**
 * Atlassian Personal Data Reporting for managed OAuth.
 *
 * Providers such as Atlassian require an app that stores user personal data to
 * report the stored account IDs so users can see (and force erasure of) their
 * data. This module enumerates the account IDs Corsair keeps in its entity
 * mirror, reports them to the provider, and erases the mirror rows the provider
 * says are closed. It mirrors `renewal.ts` in shape: pure helpers here, a
 * per-account pass, and a start-at-boot interval scheduler.
 *
 * Contract (Atlassian 3LO): POST https://api.atlassian.com/app/report-accounts/
 * body `{ accounts: [{ accountId, updatedAt(RFC3339) }] }`, max 90 per request;
 * response 204 (nothing to do) or 200 `{ accounts: [{ accountId, status }] }`
 * where status `closed` means erase. Default cycle is 7 days.
 */

import type { CorsairInternalConfig, CorsairPlugin } from '../core';
import { createAccountKeyManager } from '../core';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getHubConfig } from '../hub/config';
import { getManagedAccessToken } from '../hub/managed-auth';

/** Which stored entity fields hold a provider account id, keyed by entity_type. */
export type PersonalDataConfig = {
	entityAccountIdFields: Record<string, string[]>;
};

export type ReportableAccount = { accountId: string; updatedAt: string };

type EntityRow = {
	entity_type: string;
	data: Record<string, unknown>;
	updated_at: Date;
};

/**
 * Distinct provider account IDs across the given mirror rows, each tagged with
 * the latest `updated_at` (RFC 3339) of any row that referenced it — that is
 * the "when personal data was last retrieved" value the report API expects.
 */
export function collectReportableAccounts(
	rows: EntityRow[],
	config: PersonalDataConfig,
): ReportableAccount[] {
	const latest = new Map<string, number>();
	for (const row of rows) {
		const fields = config.entityAccountIdFields[row.entity_type];
		if (!fields) continue;
		const ts = row.updated_at.getTime();
		for (const field of fields) {
			const id = row.data[field];
			if (typeof id !== 'string' || !id) continue;
			const prev = latest.get(id);
			if (prev === undefined || ts > prev) latest.set(id, ts);
		}
	}
	return [...latest].map(([accountId, ms]) => ({
		accountId,
		updatedAt: new Date(ms).toISOString(),
	}));
}

export function chunk<T>(items: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		out.push(items.slice(i, i + size));
	}
	return out;
}

/** Account IDs the provider marked `closed` (must be erased). */
export function parseReportResponse(status: number, body: unknown): string[] {
	if (status === 204 || !body || typeof body !== 'object') return [];
	const accounts = (body as { accounts?: unknown }).accounts;
	if (!Array.isArray(accounts)) return [];
	const closed: string[] = [];
	for (const account of accounts) {
		if (
			account &&
			typeof account === 'object' &&
			typeof (account as { accountId?: unknown }).accountId === 'string' &&
			(account as { status?: unknown }).status === 'closed'
		) {
			closed.push((account as { accountId: string }).accountId);
		}
	}
	return closed;
}

/** Max account IDs Atlassian accepts per report-accounts request. */
const REPORT_BATCH_SIZE = 90;

/** One connected account, with its already-loaded entity rows. */
export type AccountEntities = {
	/** corsair_accounts.id — the entity mirror's account_id scope. */
	accountId: string;
	tenantId: string;
	entities: EntityRow[];
};

export type ReportFn = (
	token: string,
	accounts: ReportableAccount[],
) => Promise<{ status: number; body: unknown }>;

export type ReportAccountsDeps = {
	config: PersonalDataConfig;
	rows: AccountEntities[];
	/** Managed access token for the row's tenant, or null to skip. */
	getToken: (row: AccountEntities) => Promise<string | null | undefined>;
	report: ReportFn;
	/** Erase the mirror rows for the given closed provider account IDs. */
	eraseAccount: (row: AccountEntities, closedIds: string[]) => Promise<void>;
};

export type ReportAccountsResult = {
	/**
	 * Provider account IDs submitted across all accounts (the report call
	 * returned without throwing). Not an acknowledgement count — a 2xx with an
	 * unparseable body still counts as submitted.
	 */
	reported: number;
	/** Provider account IDs erased because the provider marked them closed. */
	erased: string[];
	/** corsair account IDs whose pass threw (isolated, not rethrown). */
	failed: string[];
};

/**
 * Pure orchestration over already-loaded accounts. For each account: collect
 * the stored provider account IDs, report them (batched, with the tenant's
 * token), and erase whatever the provider says is closed. Per-account failures
 * are isolated and tallied, never thrown — mirrors `renewAccounts`.
 */
export async function reportAccounts(
	deps: ReportAccountsDeps,
): Promise<ReportAccountsResult> {
	const { config, rows, getToken, report, eraseAccount } = deps;
	let reported = 0;
	const erased: string[] = [];
	const failed: string[] = [];

	for (const row of rows) {
		try {
			const accounts = collectReportableAccounts(row.entities, config);
			if (accounts.length === 0) continue;
			const token = await getToken(row);
			if (!token) continue;

			const closedIds: string[] = [];
			for (const batch of chunk(accounts, REPORT_BATCH_SIZE)) {
				const { status, body } = await report(token, batch);
				closedIds.push(...parseReportResponse(status, body));
			}
			reported += accounts.length;

			if (closedIds.length > 0) {
				await eraseAccount(row, closedIds);
				erased.push(...closedIds);
			}
		} catch (error) {
			console.warn(
				`[corsair:personal-data] report failed for account '${row.accountId}':`,
				error,
			);
			failed.push(row.accountId);
		}
	}

	return { reported, erased, failed };
}

// ─────────────────────────────────────────────────────────────────────────────
// DB-backed pass
// ─────────────────────────────────────────────────────────────────────────────

/** Atlassian OAuth 2.0 (3LO) personal-data report endpoint. */
const ATLASSIAN_REPORT_URL = 'https://api.atlassian.com/app/report-accounts/';
const REPORT_TIMEOUT_MS = 15_000;

/** SQLite stores JSON as TEXT; Postgres as JSONB. Decode either into an object. */
function decodeData(value: unknown): Record<string, unknown> {
	if (value && typeof value === 'object') {
		return value as Record<string, unknown>;
	}
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return parsed && typeof parsed === 'object' ? parsed : {};
		} catch {
			return {};
		}
	}
	return {};
}

/** Default reporter: POST the batch to Atlassian with the tenant's bearer token. */
async function reportToAtlassian(
	token: string,
	accounts: ReportableAccount[],
): Promise<{ status: number; body: unknown }> {
	const response = await fetch(ATLASSIAN_REPORT_URL, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${token}`,
			'content-type': 'application/json',
			accept: 'application/json',
		},
		body: JSON.stringify({ accounts }),
		signal: AbortSignal.timeout(REPORT_TIMEOUT_MS),
	});
	// ponytail: honour the `Cycle-Period` response header for next-run cadence
	// once per-accountId cycle bookkeeping exists; the daily blanket pass is
	// well inside Atlassian's 7-day default, so reading it now buys nothing.
	if (response.status === 204) return { status: 204, body: null };
	const body = await response.json().catch(() => null);
	return { status: response.status, body };
}

/**
 * Erase every mirror row for `accountId` whose data references any of the
 * closed provider account IDs. `closed` means the Atlassian account is gone, so
 * the attribution rows (users, and issues/comments/projects that name the user)
 * are purged wholesale.
 *
 * ponytail: full-row delete of any entity referencing a closed account. If a
 * future requirement is to keep the issue but scrub only the person, switch to
 * a field-level update here — the reporting/erase-list plumbing is unchanged.
 */
async function eraseAccountRows(
	internal: CorsairInternalConfig,
	config: PersonalDataConfig,
	accountId: string,
	closedIds: string[],
): Promise<void> {
	if (!internal.database) return;
	const closed = new Set(closedIds);
	const entityTypes = Object.keys(config.entityAccountIdFields);

	const rows = await internal.database.db
		.selectFrom('corsair_entities')
		.select(['id', 'entity_type', 'data'])
		.where('account_id', '=', accountId)
		.where('entity_type', 'in', entityTypes)
		.execute();

	const doomed: string[] = [];
	for (const row of rows) {
		const fields = config.entityAccountIdFields[row.entity_type] ?? [];
		const data = decodeData(row.data);
		if (fields.some((f) => closed.has(data[f] as string))) {
			doomed.push(row.id);
		}
	}
	if (doomed.length === 0) return;

	// Chunk the delete: a widely-referenced closed account can produce thousands
	// of ids, and SQLite caps bound variables per statement (`id in (…)`).
	for (const ids of chunk(doomed, 500)) {
		await internal.database.db
			.deleteFrom('corsair_entities')
			.where('account_id', '=', accountId)
			.where('id', 'in', ids)
			.execute();
	}
}

/** Load every connected account of a plugin plus its entity rows. */
async function loadAccountEntities(
	internal: CorsairInternalConfig,
	pluginId: string,
): Promise<AccountEntities[]> {
	if (!internal.database) return [];
	const accounts = await internal.database.db
		.selectFrom('corsair_accounts as a')
		.innerJoin('corsair_integrations as i', 'i.id', 'a.integration_id')
		.select(['a.id as accountId', 'a.tenant_id as tenantId'])
		.where('i.name', '=', pluginId)
		.where('a.dek', 'is not', null)
		.execute();

	const out: AccountEntities[] = [];
	for (const account of accounts) {
		if (!account.tenantId) continue;
		const entities = await internal.database.db
			.selectFrom('corsair_entities')
			.select(['entity_type', 'data', 'updated_at'])
			.where('account_id', '=', account.accountId)
			.execute();
		out.push({
			accountId: account.accountId,
			tenantId: account.tenantId,
			entities: entities.map((e) => ({
				entity_type: e.entity_type,
				data: decodeData(e.data),
				updated_at:
					e.updated_at instanceof Date
						? e.updated_at
						: new Date(e.updated_at as string | number),
			})),
		});
	}
	return out;
}

/** One personal-data reporting pass over every connected account of a plugin. */
export async function reportPersonalDataForPlugin(
	corsair: unknown,
	plugin: CorsairPlugin,
	overrides: Partial<Pick<ReportAccountsDeps, 'report' | 'getToken'>> = {},
): Promise<ReportAccountsResult> {
	const empty: ReportAccountsResult = { reported: 0, erased: [], failed: [] };
	const internal = getCorsairInternal(corsair);
	if (!internal.database || !plugin.personalData) return empty;
	const config = plugin.personalData;

	const rows = await loadAccountEntities(internal, plugin.id);

	// Managed access tokens expire (~1h); a daily pass will usually find the
	// stored token stale. getManagedAccessToken checks expiry and refreshes via
	// the Hub, exactly as the endpoint keyBuilder does. Resolve the Hub lazily so
	// injected getToken overrides (tests) never require a configured Hub.
	const getToken =
		overrides.getToken ??
		(async (row: AccountEntities) => {
			const keys = createAccountKeyManager({
				authType: 'managed',
				integrationName: plugin.id,
				tenantId: row.tenantId,
				kek: internal.kek,
				database: internal.database!,
				extraAccountFields: [...(plugin.authConfig?.managed?.account ?? [])],
			});
			const { accessToken } = await getManagedAccessToken({
				keys,
				hub: getHubConfig(corsair),
				plugin: plugin.id,
				tenantId: row.tenantId,
			});
			return accessToken;
		});

	return reportAccounts({
		config,
		rows,
		getToken,
		report: overrides.report ?? reportToAtlassian,
		eraseAccount: (row, closedIds) =>
			eraseAccountRows(internal, config, row.accountId, closedIds),
	});
}

/** Report personal data for every plugin that declares it. */
export async function reportPersonalData(corsair: unknown): Promise<void> {
	const internal = getCorsairInternal(corsair);
	if (!internal.database) return;
	for (const plugin of internal.plugins) {
		if (!plugin.personalData) continue;
		try {
			await reportPersonalDataForPlugin(corsair, plugin);
		} catch (error) {
			console.warn(
				`[corsair:personal-data] pass failed for '${plugin.id}':`,
				error,
			);
		}
	}
}

/**
 * Start periodic personal-data reporting. Call once at app startup (a
 * long-running server; serverless apps should invoke `reportPersonalData` from
 * their own scheduler instead). Runs immediately, then on the interval.
 * Default 24h sits well inside Atlassian's 7-day cycle. Returns a stop function.
 *
 * ponytail: in-process interval like `startSubscriptionRenewal`; move to a
 * shared db-backed job when running many app instances (reports are idempotent,
 * so overlap only adds provider API chatter).
 */
export function startPersonalDataReporting(
	corsair: unknown,
	options: { intervalHours?: number } = {},
): () => void {
	let inFlight = false;
	const run = () => {
		if (inFlight) return;
		inFlight = true;
		reportPersonalData(corsair)
			.catch((error) =>
				console.warn('[corsair:personal-data] pass failed:', error),
			)
			.finally(() => {
				inFlight = false;
			});
	};
	run();
	const timer = setInterval(run, (options.intervalHours ?? 24) * 60 * 60_000);
	timer.unref?.();
	return () => clearInterval(timer);
}
