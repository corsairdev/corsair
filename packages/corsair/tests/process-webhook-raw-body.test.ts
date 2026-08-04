import { processWebhook } from '../webhooks/index';

describe('processWebhook raw body provenance', () => {
	it('returns an error response for malformed JSON without throwing', async () => {
		const result = await processWebhook({} as never, {}, '{not-json');
		expect(result.plugin).toBeNull();
		expect(result.action).toBeNull();
		expect(result.response).toEqual({
			success: false,
			error: 'Malformed JSON body',
		});
	});

	it('preserves original string body and sets rawBodyPreserved true', async () => {
		const seen: { rawBody?: string; rawBodyPreserved?: boolean } = {};
		const raw = '{"hello":"world"}';
		const corsair = {
			sharepoint: {
				webhooks: {
					lists: {
						listChanged: {
							match: () => true,
							handler: async (req: {
								rawBody?: string;
								rawBodyPreserved?: boolean;
							}) => {
								seen.rawBody = req.rawBody;
								seen.rawBodyPreserved = req.rawBodyPreserved;
								return {};
							},
						},
					},
				},
				pluginWebhookMatcher: () => true,
			},
		} as never;

		const result = await processWebhook(corsair, {}, raw, undefined, {
			plugin: 'sharepoint',
		});
		expect(result.plugin).toBe('sharepoint');
		expect(seen.rawBody).toBe(raw);
		expect(seen.rawBodyPreserved).toBe(true);
	});

	it('marks reconstructed object bodies as not preserved', async () => {
		const seen: { rawBody?: string; rawBodyPreserved?: boolean } = {};
		const body = { hello: 'world' };
		const corsair = {
			sharepoint: {
				webhooks: {
					lists: {
						listChanged: {
							match: () => true,
							handler: async (req: {
								rawBody?: string;
								rawBodyPreserved?: boolean;
							}) => {
								seen.rawBody = req.rawBody;
								seen.rawBodyPreserved = req.rawBodyPreserved;
								return {};
							},
						},
					},
				},
				pluginWebhookMatcher: () => true,
			},
		} as never;

		const result = await processWebhook(corsair, {}, body, undefined, {
			plugin: 'sharepoint',
		});
		expect(result.plugin).toBe('sharepoint');
		expect(seen.rawBody).toBe(JSON.stringify(body));
		expect(seen.rawBodyPreserved).toBe(false);
	});
});
