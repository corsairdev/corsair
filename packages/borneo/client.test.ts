import type { ApiRequestOptions } from 'corsair/http';
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

	it('rejects non-HTTPS Composio base URLs', () => {
		expect(() =>
			normalizeComposioBaseUrl('http://backend.composio.dev/api/v3'),
		).toThrow('must use https');
	});

	it('executes a Borneo tool through a connected account', async () => {
		await executeBorneoTool(
			'BORNEO_CREATE_NEW_ASSET',
			{ name: 'CRM', type: 'application' },
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
				riskLevel: 'write',
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

		expect(init.signal).toBeInstanceOf(AbortSignal);

		expect(JSON.parse(init.body)).toMatchObject({
			connected_account_id: 'ca_123',
			version: '20260429_00',
			arguments: {
				name: 'CRM',
				type: 'application',
			},
		});
	});

	it('supports explicit custom-auth injection', async () => {
		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				borneoCredential: 'provider-secret',
				credentialHeaderName: 'X-Provider-Key',
				borneoBaseUrl: 'https://tenant.example.test',
				riskLevel: 'read',
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

	it('rejects non-HTTPS custom-auth provider URLs', async () => {
		await expect(
			executeBorneoTool(
				'BORNEO_LIST_SCANS_WITH_FILTERS',
				{},
				{
					composioApiKey: 'project-key',
					borneoCredential: 'provider-secret',
					credentialHeaderName: 'X-Provider-Key',
					borneoBaseUrl: 'http://tenant.example.test',
				},
			),
		).rejects.toThrow('borneoBaseUrl must use https');

		expect(fetchMock).not.toHaveBeenCalled();
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
					riskLevel: 'read',
				},
			),
		).rejects.toThrow();

		const [, init] = fetchMock.mock.calls[0];

		expect(init.redirect).toBe('error');
	});

	it('retries HTTP 429 only for read operations', async () => {
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
				riskLevel: 'read',
			},
		);

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('does not retry write operations after HTTP 429', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '0',
				},
			}),
		);

		await expect(
			executeBorneoTool(
				'BORNEO_CREATE_NEW_ASSET',
				{},
				{
					composioApiKey: 'project-key',
					connectedAccountId: 'ca_123',
					riskLevel: 'write',
				},
			),
		).rejects.toMatchObject({
			status: 429,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('does not retry destructive operations after HTTP 429', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '0',
				},
			}),
		);

		await expect(
			executeBorneoTool(
				'BORNEO_DELETE_ASSET_BY_ID',
				{},
				{
					composioApiKey: 'project-key',
					connectedAccountId: 'ca_123',
					riskLevel: 'destructive',
				},
			),
		).rejects.toMatchObject({
			status: 429,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('attaches a finite request deadline', async () => {
		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
				riskLevel: 'read',
				timeoutMs: 5000,
			},
		);

		const [, init] = fetchMock.mock.calls[0];

		expect(init.signal).toBeInstanceOf(AbortSignal);
		expect(init.signal.aborted).toBe(false);
	});

	it('propagates caller cancellation', async () => {
		const controller = new AbortController();

		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
				riskLevel: 'read',
				signal: controller.signal,
			},
		);

		const [, init] = fetchMock.mock.calls[0];

		controller.abort();

		expect(init.signal.aborted).toBe(true);
	});

	it('redacts provider custom-auth data from ApiError request metadata', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'bad request' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			}),
		);

		try {
			await executeBorneoTool(
				'BORNEO_CREATE_NEW_ASSET',
				{},
				{
					composioApiKey: 'project-key',
					borneoCredential: 'provider-secret',
					credentialHeaderName: 'X-Provider-Key',
					riskLevel: 'write',
				},
			);

			throw new Error('expected request to fail');
		} catch (error) {
			expect(error).toMatchObject({
				status: 400,
			});

			const request = (error as { request: ApiRequestOptions }).request;

			expect(request.body).toMatchObject({
				custom_auth_params: '[REDACTED]',
			});

			expect(JSON.stringify(request)).not.toContain('provider-secret');
		}
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
