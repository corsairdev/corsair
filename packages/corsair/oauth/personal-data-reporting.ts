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
