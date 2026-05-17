import type { CloudflareContext } from './index';

/** Typed `ctx.db` when a Corsair database is configured. */
export type CloudflareDb = CloudflareContext['db'];

function parseDate(value: string | undefined): Date | null {
	return value ? new Date(value) : null;
}

async function persist(
	label: string,
	fn: () => Promise<unknown>,
): Promise<void> {
	try {
		await fn();
	} catch (error) {
		console.warn(`Failed to save ${label} to database:`, error);
	}
}

export async function persistZone(
	zone: Record<string, unknown>,
	db: CloudflareDb,
): Promise<void> {
	if (!db.zones || zone.id == null) return;
	const id = String(zone.id);
	await persist('zone', () =>
		db.zones!.upsertByEntityId(id, {
			id,
			name: String(zone.name ?? ''),
			status: zone.status as string | undefined,
			paused: zone.paused as boolean | undefined,
			type: zone.type as string | undefined,
			account: zone.account as { id: string } | undefined,
			name_servers: zone.name_servers as string[] | undefined,
			created_on: parseDate(zone.created_on as string | undefined),
			modified_on: parseDate(zone.modified_on as string | undefined),
			activated_on: parseDate(zone.activated_on as string | undefined),
		}),
	);
}

export async function deleteZone(zoneId: string, db: CloudflareDb): Promise<void> {
	if (!db.zones?.deleteByEntityId) return;
	await persist('zone deletion', () => db.zones!.deleteByEntityId!(zoneId));
}

export async function persistDnsRecord(
	record: Record<string, unknown>,
	zoneId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.dnsRecords || record.id == null) return;
	const id = String(record.id);
	await persist('DNS record', () =>
		db.dnsRecords!.upsertByEntityId(id, {
			id,
			zone_id: String(record.zone_id ?? zoneId),
			zone_name: record.zone_name as string | undefined,
			type: String(record.type ?? ''),
			name: String(record.name ?? ''),
			content: String(record.content ?? ''),
			proxiable: record.proxiable as boolean | undefined,
			proxied: record.proxied as boolean | undefined,
			ttl: record.ttl as number | undefined,
			priority: record.priority as number | undefined,
			locked: record.locked as boolean | undefined,
			created_on: parseDate(record.created_on as string | undefined),
			modified_on: parseDate(record.modified_on as string | undefined),
		}),
	);
}

export async function deleteDnsRecord(
	dnsRecordId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.dnsRecords?.deleteByEntityId) return;
	await persist('DNS record deletion', () =>
		db.dnsRecords!.deleteByEntityId!(dnsRecordId),
	);
}

export async function persistWorkerScript(
	script: Record<string, unknown>,
	accountId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.workerScripts) return;
	const id = String(script.id ?? '');
	if (!id) return;
	await persist('Worker script', () =>
		db.workerScripts!.upsertByEntityId(id, {
			id,
			account_id: accountId,
			created_on: parseDate(script.created_on as string | undefined),
			modified_on: parseDate(script.modified_on as string | undefined),
		}),
	);
}

export async function deleteWorkerScript(
	scriptName: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.workerScripts?.deleteByEntityId) return;
	await persist('Worker script deletion', () =>
		db.workerScripts!.deleteByEntityId!(scriptName),
	);
}

export async function persistWorkerRoute(
	route: Record<string, unknown>,
	zoneId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.workerRoutes || route.id == null) return;
	const id = String(route.id);
	await persist('Worker route', () =>
		db.workerRoutes!.upsertByEntityId(id, {
			id,
			zone_id: zoneId,
			pattern: String(route.pattern ?? ''),
			script: route.script as string | undefined,
		}),
	);
}

export async function deleteWorkerRoute(
	routeId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.workerRoutes?.deleteByEntityId) return;
	await persist('Worker route deletion', () =>
		db.workerRoutes!.deleteByEntityId!(routeId),
	);
}

export async function persistRuleset(
	ruleset: Record<string, unknown>,
	zoneId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.rulesets || ruleset.id == null) return;
	const id = String(ruleset.id);
	await persist('ruleset', () =>
		db.rulesets!.upsertByEntityId(id, {
			id,
			zone_id: zoneId,
			name: String(ruleset.name ?? ''),
			description: ruleset.description as string | undefined,
			kind: String(ruleset.kind ?? ''),
			version: ruleset.version as string | undefined,
			last_updated: parseDate(ruleset.last_updated as string | undefined),
			phase: String(ruleset.phase ?? ''),
			rules: ruleset.rules as Record<string, unknown>[] | undefined,
		}),
	);
}

export async function deleteRuleset(
	rulesetId: string,
	db: CloudflareDb,
): Promise<void> {
	if (!db.rulesets?.deleteByEntityId) return;
	await persist('ruleset deletion', () =>
		db.rulesets!.deleteByEntityId!(rulesetId),
	);
}
