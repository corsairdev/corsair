import { msGraphSubscribe } from '../core/webhooks/ms-graph-subscribe';

const noopSetters = {
	set_webhook_signature: async () => {},
};

describe('msGraphSubscribe (shared BYO Graph subscribe)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('POSTs the Graph subscription for the given resource/changeType and returns link + clientState', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return { ok: true, json: async () => ({ value: [] }) };
			}
			return { ok: true, json: async () => ({ id: 'sub-123' }) };
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
		const result = await msGraphSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
			resource: 'me/drive/root',
			changeType: 'updated',
		});

		expect(result).toEqual({
			webhookLink: { linkType: 'subscription_id', externalId: 'sub-123' },
			webhookSecret: expect.any(String),
		});
		expect(stored.webhook_signature).toBe(result!.webhookSecret);

		const post = calls.find((c) => c.init?.method === 'POST')!;
		expect(post.url).toBe('https://graph.microsoft.com/v1.0/subscriptions');
		const body = JSON.parse(post.init.body);
		expect(body.resource).toBe('me/drive/root');
		expect(body.changeType).toBe('updated');
		expect(body.notificationUrl).toBe('https://hub.example/webhooks/uuid');
		expect(body.clientState).toBe(result!.webhookSecret);
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
							{ id: 'other', notificationUrl: 'https://different/zzz' },
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
		const result = await msGraphSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
			resource: "me/mailFolders('Inbox')/messages",
			changeType: 'created',
		});

		expect(result!.webhookLink.externalId).toBe('sub-new');
		expect(deleted).toEqual([
			'https://graph.microsoft.com/v1.0/subscriptions/old-1',
		]);
	});

	it('returns null when there is no access token', async () => {
		const ctx = {
			keys: { get_access_token: async () => null, ...noopSetters },
		};
		expect(
			await msGraphSubscribe(ctx, {
				webhookUrl: 'https://x/y',
				resource: 'me/drive/root',
				changeType: 'updated',
			}),
		).toBeNull();
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
			msGraphSubscribe(ctx, {
				webhookUrl: 'https://x/y',
				resource: 'me/drive/root',
				changeType: 'updated',
			}),
		).rejects.toThrow(/403/);
	});
});
