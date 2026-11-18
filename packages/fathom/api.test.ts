// Live Fathom Analytics API smoke tests. Excluded from default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run explicitly with:
//
//   FATHOM_API_KEY=... pnpm test:live
//
import { makeFathomRequest } from './client';
import type { Account, SiteListResponse, Token } from './endpoints/types';
import {
	AccountSchema,
	SiteListResponseSchema,
	TokenSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.FATHOM_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Fathom live API tests: FATHOM_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Fathom live API smoke tests (env-gated)', () => {
	it('GET /account retrieves account information with valid live key', async () => {
		const res = await makeFathomRequest<Account>('/account', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = AccountSchema.parse(res);
		expect(parsed.object).toBe('account');
		expect(typeof parsed.name).toBe('string');
	});

	it('GET /token retrieves token metadata with valid live key', async () => {
		const res = await makeFathomRequest<Token>('/token', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = TokenSchema.parse(res);
		expect(typeof parsed.name).toBe('string');
		expect(Array.isArray(parsed.abilities)).toBe(true);
	});

	it('GET /sites lists sites owned by account with valid live key', async () => {
		const res = await makeFathomRequest<SiteListResponse>('/sites', LIVE_KEY, {
			method: 'GET',
			query: { limit: 1 },
		});

		const parsed = SiteListResponseSchema.parse(res);
		expect(parsed.object).toBe('list');
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
