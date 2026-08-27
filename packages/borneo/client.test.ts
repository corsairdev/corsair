import { executeBorneoTool, normalizeComposioBaseUrl } from './client';

const fetchMock = jest.fn();

describe('Borneo Composio transport', () => {
	beforeAll(() => {
		Object.defineProperty(globalThis, 'fetch', {
			value: fetchMock,
			writable: true,
		});
	});

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					successful: true,
					data: {},
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
		);
	});

	it('normalizes the official Composio API base URL', () => {
		expect(normalizeComposioBaseUrl()).toBe(
			'https://backend.composio.dev/api/v3',
		);
	});

	it('executes a Borneo tool through a connected account', async () => {
		await executeBorneoTool(
			'BORNEO_CREATE_NEW_ASSET',
			{ name: 'CRM', type: 'application' },
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
			},
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);

		const [url, init] = fetchMock.mock.calls[0];

		expect(url).toBe(
			'https://backend.composio.dev/api/v3/tools/execute/BORNEO_CREATE_NEW_ASSET',
		);

		expect(init).toMatchObject({
			method: 'POST',
			redirect: 'error',
			headers: expect.objectContaining({
				'x-api-key': 'project-key',
			}),
		});

		expect(JSON.parse(init.body)).toMatchObject({
			connected_account_id: 'ca_123',
			version: '20260429_00',
			arguments: {
				name: 'CRM',
				type: 'application',
			},
		});
	});

	it('supports explicit custom-auth injection without guessing the API-key header', async () => {
		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				borneoCredential: 'provider-secret',
				credentialHeaderName: 'X-Provider-Key',
				credentialPrefix: '',
				borneoBaseUrl: 'https://tenant.example.test',
			},
		);

		const [, init] = fetchMock.mock.calls[0];
		const requestBody = JSON.parse(init.body);

		expect(requestBody.custom_auth_params).toEqual({
			parameters: [
				{
					in: 'header',
					name: 'X-Provider-Key',
					value: 'provider-secret',
				},
			],
			base_url: 'https://tenant.example.test',
		});
	});

	it('rejects redirects for credential-bearing requests', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			executeBorneoTool(
				'BORNEO_LIST_SCANS_WITH_FILTERS',
				{},
				{
					composioApiKey: 'project-key',
					connectedAccountId: 'ca_123',
				},
			),
		).rejects.toThrow();

		expect(fetchMock).toHaveBeenCalledTimes(1);

		const [, init] = fetchMock.mock.calls[0];

		expect(init.redirect).toBe('error');
	});

	it('retries HTTP 429 responses', async () => {
		fetchMock
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: 'rate limited' }), {
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '0',
					},
				}),
			)
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						successful: true,
						data: {},
					}),
					{
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			);

		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
			},
		);

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('requires a header name for direct custom auth', async () => {
		await expect(
			executeBorneoTool(
				'BORNEO_LIST_SCANS_WITH_FILTERS',
				{},
				{
					composioApiKey: 'project-key',
					borneoCredential: 'provider-secret',
				},
			),
		).rejects.toThrow('credentialHeaderName is required');
	});
});
