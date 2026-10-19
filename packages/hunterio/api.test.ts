import { makeHunterioRequest } from './client';
import {
	AccountGetOutputSchema,
	UsageGetOutputSchema,
	UsageHistoryGetOutputSchema,
} from './endpoints/types';

// Live smoke tests run against the real API only when a key is provided:
// HUNTERIO_API_KEY=<key> pnpm test:live
// Only the free account and usage endpoints are exercised so the suite never
// spends search or verification credits.
const LIVE_KEY = process.env.HUNTERIO_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Hunter.io live API', () => {
	it('fetches the account', async () => {
		const response = await makeHunterioRequest('/account', LIVE_KEY);
		const parsed = AccountGetOutputSchema.parse(response);

		expect(parsed.data).toBeDefined();
	});

	it('fetches the current usage bucket', async () => {
		const response = await makeHunterioRequest('/usage', LIVE_KEY);
		const parsed = UsageGetOutputSchema.parse(response);

		expect(parsed.data).toBeDefined();
	});

	it('fetches the usage history', async () => {
		const response = await makeHunterioRequest('/usage/history', LIVE_KEY);
		const parsed = UsageHistoryGetOutputSchema.parse(response);

		expect(parsed).toBeDefined();
	});
});
