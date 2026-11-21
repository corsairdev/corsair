// Live Lodgify API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\\.test\\.ts"); run it with:
//
//   LODGIFY_API_KEY=... pnpm test:live
//
import { makeLodgifyRequest } from './client';
import {
	LodgifyAvailabilityGetOutputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyReservationsListOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.LODGIFY_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping live Lodgify API tests because LODGIFY_API_KEY is not set. Set LODGIFY_API_KEY to run live tests.',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Lodgify live API (env-gated)', () => {
	it('GET /v2/properties retrieves properties list with live key', async () => {
		// `unknown` because response is validated at runtime by schema
		const res: unknown = await makeLodgifyRequest('/v2/properties', LIVE_KEY, {
			method: 'GET',
			query: { page: 1, size: 5, includeCount: true },
		});

		const parsed = LodgifyPropertiesListOutputSchema.parse(res);
		expect(
			parsed.items === undefined ||
				parsed.items === null ||
				Array.isArray(parsed.items),
		).toBe(true);
	});

	it('GET /v2/reservations/bookings retrieves bookings list with live key', async () => {
		// `unknown` because response is validated at runtime by schema
		const res: unknown = await makeLodgifyRequest(
			'/v2/reservations/bookings',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 1, size: 5, includeCount: true },
			},
		);

		const parsed = LodgifyReservationsListOutputSchema.parse(res);
		expect(
			parsed.items === undefined ||
				parsed.items === null ||
				Array.isArray(parsed.items),
		).toBe(true);
	});

	it('GET /v2/availability/{propertyId} retrieves calendar periods if a property exists', async () => {
		// `unknown` because response is validated at runtime by schema
		const propsRes: unknown = await makeLodgifyRequest(
			'/v2/properties',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 1, size: 1 },
			},
		);

		const props = LodgifyPropertiesListOutputSchema.parse(propsRes);
		const items = props.items ?? [];
		if (items.length === 0) return;

		const propertyId = items[0]?.id;
		if (!propertyId) return;

		// `unknown` because response is validated at runtime by schema
		const start = new Date().toISOString();
		const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
		const availRes: unknown = await makeLodgifyRequest(
			`/v2/availability/${propertyId}`,
			LIVE_KEY,
			{
				method: 'GET',
				query: { start, end },
			},
		);

		const parsed = LodgifyAvailabilityGetOutputSchema.parse(availRes);
		expect(Array.isArray(parsed)).toBe(true);
	});
});
