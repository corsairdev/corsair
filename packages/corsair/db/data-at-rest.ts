import type { Kysely } from 'kysely';

import {
	decryptDEK,
	decryptWithDEK,
	encryptWithDEK,
} from '../core/auth/encryption';
import type { CorsairKyselyDatabase } from './kysely/database';

/** Marker key. A stored JSON value is sealed when this is its only field. */
export const SEAL_KEY = '_corsair_enc';

export function isSealed(value: unknown): value is { [SEAL_KEY]: string } {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const record = value as Record<string, unknown>;
	return (
		typeof record[SEAL_KEY] === 'string' && Object.keys(record).length === 1
	);
}

/** Encrypt a JSON value under an account DEK. The plaintext is not a field. */
export function sealJson(value: unknown, dek: string): { [SEAL_KEY]: string } {
	return { [SEAL_KEY]: encryptWithDEK(JSON.stringify(value), dek) };
}

/**
 * Decrypt a sealed value. An unsealed value is returned as-is so a reader can
 * still open rows written before encryption was turned on.
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

function parseJsonLike(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}
