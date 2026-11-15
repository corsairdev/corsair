import { firecrawl } from '../../firecrawl';
import { createCorsair } from '../core';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

describe('managed_pricing webhooks', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('does not bind plugin webhooks on the client', () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [firecrawl({ authType: 'managed_pricing' })],
			database: env.db,
			kek: KEK,
			hub: {
				projectApiKey: 'ck_dev_test',
				signingSecret: 'sec',
			},
		} as any);

		expect((corsair as any).firecrawl.webhooks).toBeUndefined();
		expect((corsair as any).firecrawl.pluginWebhookMatcher).toBeUndefined();
	});
});
