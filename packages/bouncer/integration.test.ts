import 'dotenv/config';
import { BouncerEndpointOutputSchemas } from './endpoints/types';
import { bouncer } from './index';

const LIVE_KEY =
	process.env.BOUNCER_API_KEY ?? 'IPksOzbwmeBGBUPAIc7r6zHn0Nj0qZsVkTsQuXPb';

describe('Bouncer Integration Tests', () => {
	it('executes getCredits against Bouncer API and validates output schema', async () => {
		const plugin = bouncer({ key: LIVE_KEY });
		const ctx: any = {
			key: LIVE_KEY,
			authType: 'api_key',
		};

		const result = await plugin.endpoints!.account.getCredits(ctx, {});
		expect(result).toBeDefined();

		const parsed = BouncerEndpointOutputSchemas.getCredits.parse(result);
		expect(typeof parsed.credits).toBe('number');
		expect(parsed.credits).toBeGreaterThanOrEqual(0);
	});

	it('executes verifyEmail against Bouncer API and validates output schema', async () => {
		const plugin = bouncer({ key: LIVE_KEY });
		const ctx: any = {
			key: LIVE_KEY,
			authType: 'api_key',
		};

		const result = await plugin.endpoints!.email.verifyEmail(ctx, {
			email: 'nirjar.patil25@pccoepune.org',
		});
		expect(result).toBeDefined();

		const parsed = BouncerEndpointOutputSchemas.verifyEmail.parse(result);
		expect(parsed.email).toBe('nirjar.patil25@pccoepune.org');
		expect(typeof parsed.status).toBe('string');
		expect(parsed.domain).toBeDefined();
	});

	it('plugin keyBuilder correctly resolves key from options', async () => {
		const plugin = bouncer({ key: 'custom-secret-key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => 'stored-secret-key',
			},
		};

		const resolvedOptionKey = await (plugin.keyBuilder as any)(ctx, 'endpoint');
		expect(resolvedOptionKey).toBe('custom-secret-key');

		const pluginWithoutKey = bouncer({});
		const resolvedStoredKey = await (pluginWithoutKey.keyBuilder as any)(
			ctx,
			'endpoint',
		);
		expect(resolvedStoredKey).toBe('stored-secret-key');
	});
});
