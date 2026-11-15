// Live Handwrytten API tests. Excluded from default jest runs by
// `testPathIgnorePatterns` in `jest.config.cjs` (--testPathIgnorePatterns="api\.test\.ts");
// run explicitly with:
//
//   HANDWRYTTEN_API_KEY=... pnpm test:live
//
// Only non-destructive, read-only operations are tested here so no real
// physical cards are printed, no shipments triggered, and no account credits spent.
import { makeHandwryttenRequest } from './client';
import type {
	CardsListResponse,
	FontsListResponse,
	ShippingStampOptionsResponse,
} from './endpoints/types';
import {
	CardsListResponseSchema,
	FontsListResponseSchema,
	ShippingStampOptionsResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.HANDWRYTTEN_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping Handwrytten live API tests: HANDWRYTTEN_API_KEY environment variable is not set.',
	);
}

describeLive('Handwrytten live API (env-gated, read-only)', () => {
	it('GET /cards/list returns available greeting card designs', async () => {
		const res = await makeHandwryttenRequest<CardsListResponse>(
			'/cards/list',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 0 },
			},
		);

		const parsed = CardsListResponseSchema.parse(res);
		expect(parsed.status).toBe('ok');
		expect(Array.isArray(parsed.cards)).toBe(true);
		expect(parsed.cards?.length).toBeGreaterThan(0);
	});

	it('GET /fonts/list returns handwriting font options', async () => {
		const res = await makeHandwryttenRequest<FontsListResponse>(
			'/fonts/list',
			LIVE_KEY,
			{
				method: 'GET',
			},
		);

		const parsed = FontsListResponseSchema.parse(res);
		expect(parsed.status).toBe('ok');
		expect(Array.isArray(parsed.fonts)).toBe(true);
		expect(parsed.fonts?.length).toBeGreaterThan(0);
	});

	it('GET /shipping/stampOptions returns valid postage stamp options', async () => {
		const res = await makeHandwryttenRequest<ShippingStampOptionsResponse>(
			'/shipping/stampOptions',
			LIVE_KEY,
			{
				method: 'GET',
			},
		);

		const parsed = ShippingStampOptionsResponseSchema.parse(res);
		expect(parsed.status).toBe('ok');
		expect(Array.isArray(parsed.stamp_options)).toBe(true);
	});
});
