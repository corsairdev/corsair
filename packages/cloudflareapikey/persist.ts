import type { CloudflareApiKeyContext } from './index';

export type CloudflareApiKeyDb = CloudflareApiKeyContext['db'];

/**
 * Unwrapped Cloudflare objects before field mapping. Extra provider keys are
 * provider-defined and left unknown so persistence copies only modeled columns.
 */
type CloudflareApiObject = Record<string, unknown>;

function parseDate(value: string | undefined): Date | null {
	return value ? new Date(value) : null;
}

async function persist(
	label: string,
	fn: () => Promise<unknown>, // store write result is discarded; only rejection matters
): Promise<void> {
	try {
		await fn();
	} catch (error) {
		console.warn(`Failed to save ${label} to database:`, error);
	}
}

export async function persistZone(
	zone: CloudflareApiObject,
	db: CloudflareApiKeyDb,
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
			vanity_name_servers: zone.vanity_name_servers as string[] | undefined,
			created_on: parseDate(zone.created_on as string | undefined),
			modified_on: parseDate(zone.modified_on as string | undefined),
			activated_on: parseDate(zone.activated_on as string | undefined),
		}),
	);
}

export async function deleteZone(
	zoneId: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.zones?.deleteByEntityId) return;
	await persist('zone deletion', () => db.zones!.deleteByEntityId!(zoneId));
}

export async function persistDnsRecord(
	record: CloudflareApiObject,
	zoneId: string,
	db: CloudflareApiKeyDb,
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
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.dnsRecords?.deleteByEntityId) return;
	await persist('DNS record deletion', () =>
		db.dnsRecords!.deleteByEntityId!(dnsRecordId),
	);
}

export async function persistDnssec(
	dnssec: CloudflareApiObject,
	zoneId: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.dnssec) return;
	await persist('DNSSEC', () =>
		db.dnssec!.upsertByEntityId(zoneId, {
			id: zoneId,
			zone_id: zoneId,
			status: dnssec.status as string | undefined,
			algorithm: dnssec.algorithm as string | undefined,
			digest: dnssec.digest as string | undefined,
			digest_algorithm: dnssec.digest_algorithm as string | undefined,
			digest_type: dnssec.digest_type as string | undefined,
			ds: dnssec.ds as string | undefined,
			dnssec_multi_signer: dnssec.dnssec_multi_signer as boolean | undefined,
			dnssec_presigned: dnssec.dnssec_presigned as boolean | undefined,
			dnssec_use_nsec3: dnssec.dnssec_use_nsec3 as boolean | undefined,
			flags: dnssec.flags as number | undefined,
			key_tag: dnssec.key_tag as number | undefined,
			key_type: dnssec.key_type as string | undefined,
			public_key: dnssec.public_key as string | undefined,
			modified_on: parseDate(dnssec.modified_on as string | undefined),
		}),
	);
}

export async function deleteDnssec(
	zoneId: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.dnssec?.deleteByEntityId) return;
	await persist('DNSSEC deletion', () => db.dnssec!.deleteByEntityId!(zoneId));
}

export async function persistLockdown(
	rule: CloudflareApiObject,
	zoneId: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.lockdowns || rule.id == null) return;
	const id = String(rule.id);
	await persist('lockdown', () =>
		db.lockdowns!.upsertByEntityId(id, {
			id,
			zone_id: zoneId,
			urls: (rule.urls as string[]) ?? [],
			configurations: (rule.configurations as CloudflareApiObject[]) ?? [],
			description: rule.description as string | undefined,
			paused: rule.paused as boolean | undefined,
			priority: rule.priority as number | undefined,
			created_on: parseDate(rule.created_on as string | undefined),
			modified_on: parseDate(rule.modified_on as string | undefined),
		}),
	);
}

export async function persistRuleset(
	ruleset: CloudflareApiObject,
	scope: { zone_id?: string; account_id?: string },
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.rulesets || ruleset.id == null) return;
	const id = String(ruleset.id);
	await persist('ruleset', () =>
		db.rulesets!.upsertByEntityId(id, {
			id,
			zone_id: scope.zone_id,
			account_id: scope.account_id,
			name: String(ruleset.name ?? ''),
			description: ruleset.description as string | undefined,
			kind: String(ruleset.kind ?? ''),
			version: ruleset.version as string | undefined,
			last_updated: parseDate(ruleset.last_updated as string | undefined),
			phase: String(ruleset.phase ?? ''),
			rules: ruleset.rules as CloudflareApiObject[] | undefined,
		}),
	);
}

export async function deleteRuleset(
	rulesetId: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.rulesets?.deleteByEntityId) return;
	await persist('ruleset deletion', () =>
		db.rulesets!.deleteByEntityId!(rulesetId),
	);
}

export async function persistR2Object(
	object: CloudflareApiObject,
	accountId: string,
	bucketName: string,
	db: CloudflareApiKeyDb,
): Promise<void> {
	if (!db.r2Objects) return;
	const key = String(object.key ?? '');
	if (!key) return;
	const id = `${bucketName}:${key}`;
	await persist('R2 object', () =>
		db.r2Objects!.upsertByEntityId(id, {
			id,
			account_id: accountId,
			bucket_name: bucketName,
			key,
			etag: object.etag as string | undefined,
			size: object.size == null ? undefined : String(object.size),
			storage_class: object.storage_class as string | undefined,
			version: object.version as string | undefined,
			uploaded: parseDate(object.uploaded as string | undefined),
		}),
	);
}
