// Live Fundable API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   FUNDABLE_API_KEY=... pnpm test:live
//
// Credit costs (docs §4): /location/search and /industry/search are free,
// /company/search costs 0.1 credit per call. Paid discovery endpoints are
// deliberately not exercised here.
import { makeFundableRequest } from './client';
import type { FundableEndpointOutputs } from './endpoints/types';
import {
	CompanySearchResponseSchema,
	IndustrySearchResponseSchema,
	LocationSearchResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.FUNDABLE_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('fundable live API (env-gated)', () => {
	it('GET /location/search resolves a location label for the live key', async () => {
		const res = await makeFundableRequest<
			FundableEndpointOutputs['filters.locations']
		>('/location/search', LIVE_KEY, {
			method: 'GET',
			query: { name: 'san francisco' },
		});

		const parsed = LocationSearchResponseSchema.parse(res);
		expect(Array.isArray(parsed.data.locations)).toBe(true);
		expect(parsed.data.locations.length).toBeGreaterThan(0);
		for (const location of parsed.data.locations) {
			expect(typeof location.permalink).toBe('string');
			expect(typeof location.name).toBe('string');
		}
	});

	it('GET /industry/search resolves an industry label for the live key', async () => {
		const res = await makeFundableRequest<
			FundableEndpointOutputs['filters.industries']
		>('/industry/search', LIVE_KEY, {
			method: 'GET',
			query: { name: 'fintech' },
		});

		const parsed = IndustrySearchResponseSchema.parse(res);
		expect(Array.isArray(parsed.data.industries)).toBe(true);
		expect(parsed.data.industries.length).toBeGreaterThan(0);
	});

	it('GET /company/search fuzzy-searches companies', async () => {
		const res = await makeFundableRequest<
			FundableEndpointOutputs['companies.search']
		>('/company/search', LIVE_KEY, {
			method: 'GET',
			query: { name: 'openai' },
		});

		const parsed = CompanySearchResponseSchema.parse(res);
		expect(Array.isArray(parsed.data.companies)).toBe(true);
		for (const company of parsed.data.companies) {
			expect(typeof company.id).toBe('string');
			expect(typeof company.name).toBe('string');
		}
	});
});
