import type { InternalPandadocPlugin } from './index';
import { pandadoc } from './index';

/**
 * Live smoke: read-only, few calls (PandaDoc rate limits per plan). Every
 * answer comes back through the endpoint's output schema, so a field typed
 * wrongly fails here and not for a caller.
 */
const apiKey = process.env.PANDADOC_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PANDADOC_API_KEY not set; skipping live smoke tests (generate a key at https://app.pandadoc.com/developers/)',
	);
}

describeIfKey('pandadoc live smoke', () => {
	const plugin: InternalPandadocPlugin = pandadoc({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists documents through the output schema', async () => {
		const page = await plugin.endpoints!.documents.list(ctx, { count: 5 });
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists templates through the output schema', async () => {
		const page = await plugin.endpoints!.templates.list(ctx, { count: 5 });
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists contacts through the output schema', async () => {
		const page = await plugin.endpoints!.contacts.list(ctx, {});
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists document folders through the output schema', async () => {
		const page = await plugin.endpoints!.folders.list(ctx, {});
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists webhook subscriptions through the output schema', async () => {
		const result = await plugin.endpoints!.webhooks.listSubscriptions(ctx, {});
		expect(Array.isArray(result.items)).toBe(true);
	});

	it('reads one document listed above', async () => {
		const page = await plugin.endpoints!.documents.list(ctx, { count: 1 });
		const first = page.results[0];
		if (!first) {
			console.warn('No documents in the workspace; skipping details read');
			return;
		}
		const doc = await plugin.endpoints!.documents.get(ctx, { id: first.id });
		expect(doc.id).toBe(first.id);
		expect(doc.status).toBeDefined();
	});
});
