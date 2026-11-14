// Live Folk API smoke tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`; run with:
//
//   FOLK_API_KEY=... pnpm --dir packages/folk test:live
//
import { makeFolkRequest } from './client';
import {
	CreditsGetResponseSchema,
	PeopleListResponseSchema,
	UsersGetCurrentUserResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.FOLK_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Folk live API tests: FOLK_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('folk live API smoke tests (env-gated)', () => {
	it('GET /users/me returns the current workspace user', async () => {
		// `unknown` because response JSON is untrusted data until validated by Zod schema below.
		const res: unknown = await makeFolkRequest('/users/me', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = UsersGetCurrentUserResponseSchema.parse(res);
		expect(typeof parsed.data.id).toBe('string');
		expect(typeof parsed.data.email).toBe('string');
	});

	it('GET /credits returns workspace credit balances', async () => {
		// `unknown` because response JSON is untrusted data until validated by Zod schema below.
		const res: unknown = await makeFolkRequest('/credits', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = CreditsGetResponseSchema.parse(res);
		expect(Array.isArray(parsed.data.items)).toBe(true);
		for (const item of parsed.data.items) {
			expect(typeof item.feature).toBe('string');
			expect(typeof item.used).toBe('number');
		}
	});

	it('GET /people lists people in read-only mode', async () => {
		// `unknown` because response JSON is untrusted data until validated by Zod schema below.
		const res: unknown = await makeFolkRequest('/people', LIVE_KEY, {
			method: 'GET',
			query: { limit: 1 },
		});

		const parsed = PeopleListResponseSchema.parse(res);
		expect(Array.isArray(parsed.data.items)).toBe(true);
	});
});
