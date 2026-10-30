import { outlookSubscribe } from './subscribe';

const noopSetters = {
	set_webhook_signature: async () => {},
};

describe('outlookSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('POSTs the Graph subscription and returns the routing link + clientState', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return { ok: true, json: async () => ({ value: [] }) };
			}
			return {
				ok: true,
				json: async () => ({
					id: 'sub-123',
					expirationDateTime: '2026-01-01T00:00:00Z',
				}),
			};
		}) as unknown as typeof fetch;

		const stored: Record<string, string> = {};
		const ctx = {
			keys: {
				get_access_token: async () => 'tok-abc',
				set_webhook_signature: async (v: string) => {
					stored.webhook_signature = v;
				},
			},
		};
		const result = await outlookSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result).toEqual({
			webhookLink: { linkType: 'subscription_id', externalId: 'sub-123' },
			webhookSecret: expect.any(String),
		});
		// persisted for inbound verification (clientState == webhook_signature)
		expect(stored.webhook_signature).toBe(result!.webhookSecret);

		const post = calls.find((c) => c.init?.method === 'POST')!;
		expect(post.url).toBe('https://graph.microsoft.com/v1.0/subscriptions');
		expect(post.init.headers.authorization).toBe('Bearer tok-abc');
		const body = JSON.parse(post.init.body);
		expect(body.changeType).toBe('created');
		expect(body.notificationUrl).toBe('https://hub.example/webhooks/uuid');
		expect(body.resource).toBe("me/mailFolders('Inbox')/messages");
		expect(body.clientState).toBe(result!.webhookSecret);
		expect(typeof body.expirationDateTime).toBe('string');
	});

	it('deletes prior subscriptions pointing at the same Hub URL before creating', async () => {
		const deleted: string[] = [];
		global.fetch = (async (url: unknown, init: any) => {
			const method = init?.method ?? 'GET';
			if (method === 'GET') {
				return {
					ok: true,
					json: async () => ({
						value: [
							{
								id: 'old-1',
								notificationUrl: 'https://hub.example/webhooks/uuid',
							},
							{
								id: 'other',
								notificationUrl: 'https://different/webhooks/zzz',
							},
						],
					}),
				};
			}
			if (method === 'DELETE') {
				deleted.push(String(url));
				return { ok: true, json: async () => ({}) };
			}
			return { ok: true, json: async () => ({ id: 'sub-new' }) };
		}) as unknown as typeof fetch;

		const ctx = {
			keys: { get_access_token: async () => 'tok', ...noopSetters },
		};
		const result = await outlookSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink.externalId).toBe('sub-new');
		// only the subscription pointing at OUR Hub URL is deleted
		expect(deleted).toEqual([
			'https://graph.microsoft.com/v1.0/subscriptions/old-1',
		]);
	});

	it('returns null when there is no access token', async () => {
		const ctx = {
			keys: { get_access_token: async () => null, ...noopSetters },
		};
		const result = await outlookSubscribe(ctx, { webhookUrl: 'https://x/y' });
		expect(result).toBeNull();
	});

	it('throws on a non-ok Graph response', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 403,
			text: async () => 'Forbidden',
		})) as unknown as typeof fetch;
		const ctx = {
			keys: { get_access_token: async () => 'tok', ...noopSetters },
		};
		await expect(
			outlookSubscribe(ctx, { webhookUrl: 'https://x/y' }),
		).rejects.toThrow(/403/);
	});
});
