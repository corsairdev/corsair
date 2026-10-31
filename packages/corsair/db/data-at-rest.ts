import type { Kysely } from 'kysely';

import {
	decryptDEK,
	decryptWithDEK,
	encryptWithDEK,
} from '../core/auth/encryption';
import type { CorsairKyselyDatabase } from './kysely/database';

/** Marker key. A stored JSON value is sealed when this is its only field. */
export const SEAL_KEY = '_corsair_enc';

// unknown: a JSONB cell is either a plugin document or the seal envelope.
// The document shape is chosen by the caller's schema, so this boundary cannot name it.
export function isSealed(value: unknown): value is { [SEAL_KEY]: string } {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	// unknown: same boundary. The object's fields are not known until a plugin schema parses them.
	const record = value as Record<string, unknown>;
	return (
		typeof record[SEAL_KEY] === 'string' && Object.keys(record).length === 1
	);
}

// unknown: the plaintext is a caller-defined plugin document or event payload.
export function sealJson(value: unknown, dek: string): { [SEAL_KEY]: string } {
	return { [SEAL_KEY]: encryptWithDEK(JSON.stringify(value), dek) };
}

/**
 * Decrypt a sealed value. An unsealed value is returned as-is so a reader can
 * still open rows written before encryption was turned on.
 *
 * unknown: input and output are the JSONB cell and the caller-defined document.
 * Neither has a schema until the entity client parses the opened value.
 */
export function openJson(value: unknown, dek: string): unknown {
	const parsed = parseJsonLike(value);
	if (!isSealed(parsed)) return parsed;
	return JSON.parse(decryptWithDEK(parsed[SEAL_KEY], dek));
}

export async function loadAccountDek(
	db: Kysely<CorsairKyselyDatabase>,
	accountId: string,
	kek: string,
): Promise<string> {
	const row = await db
		.selectFrom('corsair_accounts')
		.select('dek')
		.where('id', '=', accountId)
		.executeTakeFirst();
	if (!row?.dek) {
		throw new Error(
			`No DEK found for account "${accountId}". Initialize the account first.`,
		);
	}
	return decryptDEK(row.dek, kek);
}

/**
 * Re-seal entity documents and event payloads for one account.
 * Unsealed rows are left as they are. Runs on the caller's transaction so the
 * new DEK and the rewritten rows commit together.
 *
 * unknown: `data` and `payload` are JSONB. A sealed cell is an envelope; anything
 * else is a plugin document this function does not interpret.
 */
export async function reencryptSealedAccountData(
	db: Kysely<CorsairKyselyDatabase>,
	accountId: string,
	oldDek: string,
	newDek: string,
): Promise<void> {
	const entities = await db
		.selectFrom('corsair_entities')
		.select(['id', 'data'])
		.where('account_id', '=', accountId)
		.execute();
	for (const row of entities) {
		const next = reseal(row.data, oldDek, newDek);
		if (!next) continue;
		await db
			.updateTable('corsair_entities')
			.set({ data: next, updated_at: new Date() })
			.where('id', '=', row.id)
			.execute();
	}

	const events = await db
		.selectFrom('corsair_events')
		.select(['id', 'payload'])
		.where('account_id', '=', accountId)
		.execute();
	for (const row of events) {
		const next = reseal(row.payload, oldDek, newDek);
		if (!next) continue;
		await db
			.updateTable('corsair_events')
			.set({ payload: next, updated_at: new Date() })
			.where('id', '=', row.id)
			.execute();
	}
}

/**
 * Delete one account's sealed entity documents and event payloads. Used when
 * the account's DEK can't be opened, so nothing can read those rows again.
 * Unsealed rows are left as they are. Runs on the caller's transaction so the
 * replacement DEK and the deletes commit together.
 */
export async function dropSealedAccountData(
	db: Kysely<CorsairKyselyDatabase>,
	accountId: string,
): Promise<void> {
	const entities = await db
		.selectFrom('corsair_entities')
		.select(['id', 'data'])
		.where('account_id', '=', accountId)
		.execute();
	const sealedEntities = entities
		.filter((row) => isSealed(parseJsonLike(row.data)))
		.map((row) => row.id);
	if (sealedEntities.length > 0) {
		await db
			.deleteFrom('corsair_entities')
			.where('id', 'in', sealedEntities)
			.execute();
	}

	const events = await db
		.selectFrom('corsair_events')
		.select(['id', 'payload'])
		.where('account_id', '=', accountId)
		.execute();
	const sealedEvents = events
		.filter((row) => isSealed(parseJsonLike(row.payload)))
		.map((row) => row.id);
	if (sealedEvents.length > 0) {
		await db
			.deleteFrom('corsair_events')
			.where('id', 'in', sealedEvents)
			.execute();
	}
}

function reseal(
	// unknown: JSONB cell. A sealed cell is an envelope; anything else stays plaintext.
	value: unknown,
	oldDek: string,
	newDek: string,
): { [SEAL_KEY]: string } | undefined {
	const parsed = parseJsonLike(value);
	if (!isSealed(parsed)) return undefined;
	return sealJson(openJson(parsed, oldDek), newDek);
}

// unknown: sqlite stores JSON as text; postgres returns an object. Both arrive here.
function parseJsonLike(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}
