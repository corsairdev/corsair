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

// Public sample file from the W3C test set, so no upload is needed.
const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

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

	it('reads the page count and properties of a public PDF', async () => {
		// Free: get-pdf-info spends no credits (verified against the quota).
		const raw = await makeCraftmypdfRequest(LIVE_KEY, {
			method: 'GET',
			path: '/get-pdf-info',
			query: { url: SAMPLE_PDF },
		});
		const out = CraftmypdfEndpointOutputSchemas.pdfGetInfo.parse(raw);

		expect(out.status).toBe('success');
		expect(out.totalPages).toBe(1);
		expect(out.producer).toBeTruthy();
	});

	it('accepts the generation body and reports an unknown template', async () => {
		// No template exists on a fresh account and the API cannot create one
		// from scratch, so this pins the request shape and the error contract
		// instead of a rendered PDF. It spends no credit.
		await expect(
			makeCraftmypdfRequest(LIVE_KEY, {
				method: 'POST',
				path: '/create',
				body: {
					template_id: '0000000000000000',
					data: { probe: true },
					export_type: 'json',
				},
			}),
		).rejects.toThrow(/Template ID not found/);
	});

	it('accepts the empty-data fallback used with a data URL', async () => {
		// The plugin sends data: {} when a caller passes only load_data_from,
		// because the API documents data as required. Reaching the URL fetch
		// rather than a validation error proves the fallback is accepted.
		await expect(
			makeCraftmypdfRequest(LIVE_KEY, {
				method: 'POST',
				path: '/create',
				body: {
					template_id: '0000000000000000',
					data: {},
					load_data_from: 'https://example.com/does-not-exist.json',
					export_type: 'json',
				},
			}),
		).rejects.toThrow(/Failed to load/);
	});
});
