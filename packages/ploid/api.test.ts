import { makePloidRequest } from './client';
import {
	AccountCreditsResponseSchema,
	AccountUsageResponseSchema,
	ResolveInputSchema,
	ResolveResponseSchema,
} from './endpoints/types';

// Live smoke, gated on a real key. Endpoint cost at the time of writing:
// credits 0 ACU, usage 0 ACU, resolve free when no person is found. The
// resolve below is built to miss; if Ploid ever fuses a match it costs 2 ACU
// from the workspace's own balance (the signup trial grants 50).
const TEST_API_KEY = process.env.PLOID_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

jest.setTimeout(180_000);

describeIfApiKey('Ploid live API', () => {
	it('reads the ACU balance', async () => {
		const raw = await makePloidRequest<unknown>(
			'/v1/account/credits',
			TEST_API_KEY,
			{ method: 'GET' },
		);
		const parsed = AccountCreditsResponseSchema.parse(raw);
		expect(parsed.data.acu?.available).toBeGreaterThanOrEqual(0);
	});

	it('reads the account usage', async () => {
		const raw = await makePloidRequest<unknown>(
			'/v1/account/usage',
			TEST_API_KEY,
			{ method: 'GET' },
		);
		const parsed = AccountUsageResponseSchema.parse(raw);
		expect(parsed.data.api_key?.active_keys).toBeGreaterThanOrEqual(1);
	});

	it('resolves a nonsense identity to a no-match without charging', async () => {
		const input = ResolveInputSchema.parse({
			name: 'Zzyqh Vvorrland',
			company: 'NoSuchCompanyXYZQ',
		});
		const raw = await makePloidRequest<unknown>('/v1/resolve', TEST_API_KEY, {
			method: 'POST',
			body: input,
		});
		const parsed = ResolveResponseSchema.parse(raw);
		// A no-match is a 200 with found:false; an unexpected match is still a
		// valid response, only a billed one.
		expect(typeof parsed.data.found).toBe('boolean');
	});
});
