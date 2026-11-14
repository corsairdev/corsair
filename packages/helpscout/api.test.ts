import type { HelpScoutContext } from './index';
import { helpscout } from './index';

const apiKey = process.env.HELPSCOUT_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.log(
		'HELPSCOUT_API_KEY environment variable not set. Skipping live Help Scout smoke tests.',
	);
}

function buildCtx(): HelpScoutContext {
	const ctx: HelpScoutContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: apiKey ?? 'test-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(apiKey ?? 'test-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

describeLive('Help Scout Live API smoke tests (read-only)', () => {
	const plugin = helpscout({ key: apiKey });

	it('lists mailboxes successfully', async () => {
		if (!plugin.endpoints) {
			throw new Error('plugin.endpoints is not defined');
		}
		const result = await plugin.endpoints.mailboxes.list(ctx, { page: 1 });
		expect(result).toBeDefined();
		expect(result._embedded).toBeDefined();
		expect(Array.isArray(result._embedded.mailboxes)).toBe(true);
	});

	it('lists tags successfully', async () => {
		if (!plugin.endpoints) {
			throw new Error('plugin.endpoints is not defined');
		}
		const result = await plugin.endpoints.tags.list(ctx, { page: 1 });
		expect(result).toBeDefined();
		expect(result._embedded).toBeDefined();
		expect(Array.isArray(result._embedded.tags)).toBe(true);
	});
});
