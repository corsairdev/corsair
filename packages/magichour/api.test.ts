// Live Magic Hour API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs` (`api\.test\.ts`); run them with:
//
//   MAGIC_HOUR_API_KEY=... pnpm test:live
//
// Magic Hour bills credits for every create operation, so this file only hits
// the two free read endpoints (`GET /v1/account` and `GET /v1/saved-items`)
// and is skipped cleanly when no key is exported.
import { makeMagicHourRequest } from './client';
import type {
	AccountGetResponse,
	FilesSavedItemsListResponse,
} from './endpoints/types';
import {
	AccountGetResponseSchema,
	FilesSavedItemsListResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.MAGIC_HOUR_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('magichour live API (env-gated)', () => {
	it('GET /v1/account returns the credit balance and subscription', async () => {
		const res = await makeMagicHourRequest<AccountGetResponse>(
			'/v1/account',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = AccountGetResponseSchema.parse(res);
		expect(typeof parsed.id).toBe('string');
		expect(typeof parsed.credits).toBe('number');
	});

	it('GET /v1/saved-items returns a paginated list', async () => {
		const res = await makeMagicHourRequest<FilesSavedItemsListResponse>(
			'/v1/saved-items',
			LIVE_KEY,
			{ method: 'GET', query: { limit: 1 } },
		);

		const parsed = FilesSavedItemsListResponseSchema.parse(res);
		expect(Array.isArray(parsed.items)).toBe(true);
	});
});
