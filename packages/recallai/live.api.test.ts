import { z } from 'zod';
import type { RecallaiContext } from './index';
import { recallai } from './index';

const regionSchema = z.enum([
	'us-east-1',
	'us-west-2',
	'eu-central-1',
	'ap-northeast-1',
]);
const apiKey = process.env.RECALLAI_API_KEY?.trim();
const liveTestEnabled = process.env.LIVE_TEST === '1';
const regionValue = process.env.RECALLAI_REGION;
const region = regionValue ? regionSchema.parse(regionValue) : undefined;

const liveSuite = apiKey && liveTestEnabled ? describe : describe.skip;

liveSuite('Recall.ai live API', () => {
	it('lists bots through the configured regional API host', async () => {
		if (!apiKey) throw new Error('RECALLAI_API_KEY is required');
		const plugin = recallai({
			key: apiKey,
			...(region ? { region } : {}),
		});
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		const context: RecallaiContext = {
			key: apiKey,
			options: region ? { region } : {},
			$getAccountId: async () => 'recallai-live-test',
			// The read-only API call does not access Corsair's entity client.
			db: {} as RecallaiContext['db'],
			endpoints: {} as RecallaiContext['endpoints'],
			// The explicit plugin key is used, so the key manager is not consulted.
			keys: {} as RecallaiContext['keys'],
		};
		const response = await plugin.endpoints.bots.list(context, { page: 1 });

		expect(response.count).toEqual(expect.any(Number));
		expect(response.results).toEqual(expect.any(Array));
	});
});
