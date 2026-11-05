import type { EnginemailerContext } from './index';
import { enginemailer } from './index';

// Read-only checks against a real account. CI skips *api.test.ts; run with
// ENGINEMAILER_API_KEY set. A free account cannot use the campaign API, so
// campaigns are not read here.
const apiKey =
	process.env.ENGINEMAILER_N8N_API_KEY ?? process.env.ENGINEMAILER_API_KEY;
const describeIfApiKey = apiKey ? describe : describe.skip;

describeIfApiKey('Enginemailer live API', () => {
	const endpoints = enginemailer({ key: apiKey }).endpoints;
	if (!endpoints) throw new Error('enginemailer() returned no endpoints');
	// Why safe: the handlers read only `ctx.key`; a full CorsairPluginContext
	// needs a database and key manager these read-only checks never use.
	const ctx = { key: apiKey } as EnginemailerContext;

	it('reads subcategories and custom fields through the REST API', async () => {
		// Both arrive labelled application/octet-stream; the client parses them.
		const subcategories = await endpoints.subscribers.getSubcategories(ctx, {});
		expect(subcategories.Result).toMatchObject({ StatusCode: '200' });
		const fields = await endpoints.subscribers.getCustomFields(ctx, {});
		expect(fields.Result).toMatchObject({ StatusCode: '200' });
	});

	it('raises a REST error for an unknown subscriber', async () => {
		await expect(
			endpoints.subscribers.get(ctx, {
				email: 'corsair-plugin-test+nobody@corsair.dev',
			}),
		).rejects.toMatchObject({ message: 'Subscriber not found!' });
	});

	it('reads the N8N connection, lists and subscriber feeds as arrays', async () => {
		expect(await endpoints.n8n.connect(ctx, {})).toBeDefined();
		for (const list of [
			await endpoints.n8n.listForms(ctx, {}),
			await endpoints.n8n.listPages(ctx, {}),
			await endpoints.n8n.listPopups(ctx, {}),
			await endpoints.n8n.newSubscribers(ctx, { limit: 5 }),
			await endpoints.n8n.unsubscribedSubscribers(ctx, { limit: 5 }),
			await endpoints.n8n.deletedSubscribers(ctx, { limit: 5 }),
			await endpoints.n8n.modifiedSubscribers(ctx, { limit: 5 }),
		]) {
			expect(Array.isArray(list)).toBe(true);
		}
	});
});
