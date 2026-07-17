import { outlookSubscribe } from './subscribe';

describe('outlookSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('POSTs the Graph subscription and returns the routing link + clientState', async () => {
		const calls: Array<{ url: unknown; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url, init });
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
				set_subscription_id: async (v: string) => {
					stored.subscription_id = v;
				},
				set_client_state: async (v: string) => {
					stored.client_state = v;
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

		// persisted for inbound verification/matching
		expect(stored.webhook_signature).toBe(result!.webhookSecret);
		expect(stored.subscription_id).toBe('sub-123');
		expect(stored.client_state).toBe(result!.webhookSecret);

		expect(calls).toHaveLength(1);
		expect(calls[0]!.url).toBe(
			'https://graph.microsoft.com/v1.0/subscriptions',
		);
		expect(calls[0]!.init.method).toBe('POST');
		expect(calls[0]!.init.headers.authorization).toBe('Bearer tok-abc');
		const body = JSON.parse(calls[0]!.init.body);
		expect(body.changeType).toBe('created');
		expect(body.notificationUrl).toBe('https://hub.example/webhooks/uuid');
		expect(body.resource).toBe("me/mailFolders('Inbox')/messages");
		expect(body.clientState).toBe(result!.webhookSecret);
		expect(typeof body.expirationDateTime).toBe('string');
	});

	const noopSetters = {
		set_webhook_signature: async () => {},
		set_subscription_id: async () => {},
		set_client_state: async () => {},
	};

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
