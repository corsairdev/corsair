import type { Kysely } from 'kysely';
import { CORSAIR_INTERNAL, createCorsair } from '../core';
import { encryptDEK, generateDEK } from '../core/auth/encryption';
import { loadAccountDek, openJson, sealJson } from '../db/data-at-rest';
import type { CorsairKyselyDatabase } from '../db/kysely/database';

const KEK = 'kek-for-tests';

describe('encryptDataAtRest', () => {
	it('defaults to off', () => {
		const corsair = createCorsair({ plugins: [] });
		expect(
			(corsair as unknown as Record<symbol, { encryptDataAtRest?: boolean }>)[
				CORSAIR_INTERNAL
			].encryptDataAtRest,
		).toBe(false);
	});

	it('stores the flag when set', () => {
		const corsair = createCorsair({
			plugins: [],
			encryptDataAtRest: true,
			kek: KEK,
		});
		expect(
			(corsair as unknown as Record<symbol, { encryptDataAtRest?: boolean }>)[
				CORSAIR_INTERNAL
			].encryptDataAtRest,
		).toBe(true);
	});
});

describe('sealJson', () => {
	it('round-trips and does not leave the plaintext in the stored value', () => {
		const dek = generateDEK();
		const stored = sealJson({ subject: 'hello from sarah' }, dek);
		expect(JSON.stringify(stored)).not.toContain('hello from sarah');
		expect(openJson(stored, dek)).toEqual({ subject: 'hello from sarah' });
	});

	it('returns an unsealed value unchanged', () => {
		const dek = generateDEK();
		expect(openJson({ subject: 'already plain' }, dek)).toEqual({
			subject: 'already plain',
		});
	});
});

describe('loadAccountDek', () => {
	it('unwraps the account DEK with the KEK', async () => {
		const dek = generateDEK();
		const wrapped = await encryptDEK(dek, KEK);
		const db = {
			selectFrom: () => ({
				select: () => ({
					where: () => ({
						executeTakeFirst: async () => ({ dek: wrapped }),
					}),
				}),
			}),
		};
		await expect(
			loadAccountDek(
				db as unknown as Kysely<CorsairKyselyDatabase>,
				'acct_1',
				KEK,
			),
		).resolves.toBe(dek);
	});
});
