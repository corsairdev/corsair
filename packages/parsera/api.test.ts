import type { InternalParseraPlugin } from './index';
import { parsera } from './index';

/**
 * Live smoke: read-only, few calls (extraction runs charge credits, so only
 * scraper reads run live). Every answer comes back through the endpoint's
 * output schema, so a field typed wrongly fails here and not for a caller.
 */
const apiKey = process.env.PARSERAAPI_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PARSERAAPI_KEY not set; skipping live smoke tests (create a key at https://parsera.org/app)',
	);
}

describeIfKey('parsera live smoke', () => {
	const plugin: InternalParseraPlugin = parsera({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('extracts a page title through the output schema', async () => {
		const result = await plugin.endpoints!.extractor.extract(ctx, {
			url: 'https://example.com',
			attributes: [{ name: 'title', description: 'The page title' }],
		});
		expect(result['title']).toBeDefined();
	});

	it('parses content through the output schema', async () => {
		const result = await plugin.endpoints!.extractor.parse(ctx, {
			content: '<h1>Parsera</h1>',
			attributes: [{ name: 'heading', description: 'The heading text' }],
		});
		expect(result['heading']).toBeDefined();
	});
});
