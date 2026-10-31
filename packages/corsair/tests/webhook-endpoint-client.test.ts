import { getWebhookEndpointUrl } from '../hub/webhook-endpoint-client';

const hub = { projectApiKey: 'ck_dev_test', apiUrl: 'https://hub.example' };

describe('getWebhookEndpointUrl', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	function mockHubResponse(body: unknown) {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			headers: { get: () => 'application/json' },
			text: async () => JSON.stringify(body),
		}) as unknown as typeof fetch;
	}

	it('returns url and string clientState from Hub', async () => {
		mockHubResponse({
			url: 'https://hub.example/webhooks/uuid',
			clientState: 'shared-secret',
		});

		await expect(getWebhookEndpointUrl(hub, 'teams')).resolves.toEqual({
			url: 'https://hub.example/webhooks/uuid',
			clientState: 'shared-secret',
		});
	});

	it('rejects malformed non-string clientState', async () => {
		mockHubResponse({
			url: 'https://hub.example/webhooks/uuid',
			clientState: 123,
		});

		await expect(getWebhookEndpointUrl(hub, 'teams')).resolves.toBeNull();
	});
});
