import 'dotenv/config';
import { Credits } from './endpoints';

describe('BetterContact Live API Integration', () => {
	it('fetches real credit balance when BETTERCONTACT_API_KEY is configured', async () => {
		const apiKey = process.env.BETTERCONTACT_API_KEY;
		if (!apiKey) {
			console.log(
				'Skipping live test: BETTERCONTACT_API_KEY not configured in .env',
			);
			return;
		}

		const ctx = { key: apiKey } as never;
		const response = await Credits.get(ctx, {});

		expect(response).toBeDefined();
		expect(
			typeof response.credits_left === 'number' || response.success === true,
		).toBe(true);
	});
});
