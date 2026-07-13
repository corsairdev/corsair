import { postHubConnectSession } from '../hub/connect';
import type { HubConfig } from '../hub/types';

const devHub: HubConfig = {
	apiUrl: 'https://hub.example',
	projectApiKey: 'ck_dev_test_key',
	signingSecret: 'signing-secret',
};

const prodHub: HubConfig = {
	apiUrl: 'https://hub.example',
	projectApiKey: 'ck_prod_test_key',
	signingSecret: 'signing-secret',
};

const plugins = [
	{
		plugin: 'slack',
		providerName: 'Slack',
		authKind: 'oauth' as const,
	},
];

function mockHubConnectFetch() {
	let requestBody: Record<string, unknown> | undefined;

	const fetchMock = jest.fn(
		async (_url: string | URL | Request, init?: RequestInit) => {
			requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
			return new Response(
				JSON.stringify({
					connectUrl: 'https://hub.example/connect/sess-1',
					token: 'hub-connect-token',
					projectId: 'proj-1',
					environmentId: 'env_dev_1',
				}),
				{
					status: 200,
					headers: { 'content-type': 'application/json' },
				},
			);
		},
	) as typeof fetch;

	return {
		fetchMock,
		getRequestBody: () => requestBody,
	};
}

describe('postHubConnectSession', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('includes auto-detected deliveryUrl for development keys', async () => {
		const previousEnv = {
			PORT: process.env.PORT,
			CORSAIR_DELIVERY_URL: process.env.CORSAIR_DELIVERY_URL,
			APP_URL: process.env.APP_URL,
			NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
			VERCEL_URL: process.env.VERCEL_URL,
		};
		process.env.PORT = '3001';
		// Assigning undefined to process.env stores the string "undefined";
		// Reflect.deleteProperty removes the vars (biome noDelete-compliant).
		Reflect.deleteProperty(process.env, 'CORSAIR_DELIVERY_URL');
		Reflect.deleteProperty(process.env, 'APP_URL');
		Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_APP_URL');
		Reflect.deleteProperty(process.env, 'VERCEL_URL');

		const { fetchMock, getRequestBody } = mockHubConnectFetch();
		global.fetch = fetchMock;

		try {
			await postHubConnectSession(devHub, {
				tenantId: 'default',
				plugins,
			});

			expect(getRequestBody()).toMatchObject({
				tenantId: 'default',
				plugins,
				deliveryUrl: 'http://localhost:3001/api/corsair',
			});
		} finally {
			for (const [key, value] of Object.entries(previousEnv)) {
				if (value === undefined) {
					Reflect.deleteProperty(process.env, key);
				} else {
					process.env[key] = value;
				}
			}
		}
	});

	it('omits deliveryUrl for production keys', async () => {
		const { fetchMock, getRequestBody } = mockHubConnectFetch();
		global.fetch = fetchMock;

		await postHubConnectSession(prodHub, {
			tenantId: 'default',
			plugins,
		});

		expect(getRequestBody()).toMatchObject({
			tenantId: 'default',
			plugins,
		});
		expect(getRequestBody()).not.toHaveProperty('deliveryUrl');
	});
});
