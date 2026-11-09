/**
 * Live CraftMyPDF tests. These run only when `CRAFTMYPDF_API_KEY` is set;
 * otherwise they are skipped so CI stays green without credentials.
 *
 * Every call here is read-only and costs no credits: the account, template and
 * transaction reads. Generation is not exercised because it spends the
 * account's monthly PDF allowance.
 *
 * Run with: CRAFTMYPDF_API_KEY=... pnpm --filter @corsair-dev/craftmypdf test:live
 */

import { makeCraftmypdfRequest } from './client';
import { CraftmypdfEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.CRAFTMYPDF_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'CRAFTMYPDF_API_KEY is not set: the live CraftMyPDF suite is skipped.',
	);
}

describeLive('CraftMyPDF live API', () => {
	it('reads the account quota', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/get-account-info',
		});
		const out = CraftmypdfEndpointOutputSchemas.accountGetInfo.parse(raw);

		expect(out.status).toBe('success');
		expect(out.username).toBeTruthy();
	});

	it('lists templates and returns an array even when empty', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/list-templates',
			query: { limit: 5, offset: 0 },
		});
		// unknown: the live body is untyped; only the array check matters here.
		const record = raw as { templates?: unknown };
		expect(Array.isArray(record?.templates)).toBe(true);
	});

	it('lists transactions', async () => {
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/list-transactions',
			query: { limit: 5, offset: 0 },
		});
		const out = CraftmypdfEndpointOutputSchemas.transactionsList.parse({
			...(raw as object),
			next_offset: undefined,
		});

		expect(out.status).toBe('success');
		expect(Array.isArray(out.transactions)).toBe(true);
	});

	it('rejects a key that does not exist', async () => {
		await expect(
			makeCraftmypdfRequest('definitely-not-a-key', {
				method: 'GET',
				path: '/get-account-info',
			}),
		).rejects.toThrow(/api key/i);
	});
});
