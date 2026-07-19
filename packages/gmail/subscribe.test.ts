import { gmailSubscribe } from './subscribe';

describe('gmailSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	const creds = {
		topic_id: 'projects/p/topics/gmail-push',
		pubsub_audience: 'push-sa@p.iam.gserviceaccount.com',
	};

	it('POSTs users.watch and returns the email routing link + pubsub audience', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return {
					ok: true,
					json: async () => ({ emailAddress: 'user@example.com' }),
				};
			}
			return {
				ok: true,
				json: async () => ({ historyId: '12345', expiration: '1700000000000' }),
			};
		}) as unknown as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok-abc',
				get_integration_credentials: async () => creds,
			},
		};
		const result = await gmailSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result).toEqual({
			webhookLink: {
				linkType: 'email_address',
				externalId: 'user@example.com',
			},
			webhookSecret: creds.pubsub_audience,
		});

		const post = calls.find((c) => c.init?.method === 'POST')!;
		expect(post.url).toBe(
			'https://gmail.googleapis.com/gmail/v1/users/me/watch',
		);
		expect(post.init.headers.authorization).toBe('Bearer tok-abc');
		const body = JSON.parse(post.init.body);
		expect(body.topicName).toBe(creds.topic_id);
		expect(body.labelIds).toEqual(['INBOX']);

		const profile = calls.find((c) => (c.init?.method ?? 'GET') === 'GET')!;
		expect(profile.url).toBe(
			'https://gmail.googleapis.com/gmail/v1/users/me/profile',
		);
	});

	it('returns null when there is no access token', async () => {
		const ctx = {
			keys: {
				get_access_token: async () => null,
				get_integration_credentials: async () => creds,
			},
		};
		expect(await gmailSubscribe(ctx, { webhookUrl: 'https://x/y' })).toBeNull();
	});

	it('returns null when topic_id is missing', async () => {
		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				get_integration_credentials: async () => ({}),
			},
		};
		expect(await gmailSubscribe(ctx, { webhookUrl: 'https://x/y' })).toBeNull();
	});

	it('throws on a non-ok watch response', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 403,
			text: async () => 'topic permission denied',
		})) as unknown as typeof fetch;
		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				get_integration_credentials: async () => creds,
			},
		};
		await expect(
			gmailSubscribe(ctx, { webhookUrl: 'https://x/y' }),
		).rejects.toThrow(/403/);
	});
});
