// Live test is read-only and runs only with a deliberately supplied API key:
// MAILERLITE_API_KEY=... pnpm --dir packages/mailerlite test:live
import { makeMailerLiteRequest } from './client';
import { MailerLiteListResponseSchema } from './endpoints/types';

const LIVE_KEY = process.env.MAILERLITE_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping MailerLite live test: MAILERLITE_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('MailerLite live API (read-only, env-gated)', () => {
	it('lists one group with a valid paginated response', async () => {
		// `unknown` because the provider response remains untrusted until parsed by Zod.
		const response = await makeMailerLiteRequest<unknown>(
			{ method: 'GET', url: '/groups', query: { limit: 1 } },
			LIVE_KEY,
		);
		const parsed = MailerLiteListResponseSchema.parse(response);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
		for (const group of parsed.data) expect(group.id).toBeDefined();
	});
});
