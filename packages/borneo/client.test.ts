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

	it('configures fetch to reject redirects for credential-bearing requests', async () => {
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

	it('normalizes network failures into ApiError', async () => {
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
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 0,
			message: expect.stringContaining('fetch failed'),
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('extracts nested error messages from Composio request errors', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: {
						message: 'Invalid arguments supplied',
						code: 'INVALID_ARGUMENTS',
					},
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
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
			name: 'ApiError',
			status: 400,
			message: 'Invalid arguments supplied',
		});
	});

	it('throws when a read execution returns an unsuccessful envelope', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					successful: false,
					error: 'Scan service is unavailable',
					data: null,
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
		);

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
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 200,
			message: 'Borneo tool execution failed: Scan service is unavailable',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('throws when a write execution returns an unsuccessful envelope', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					successful: false,
					error: 'Asset name already exists',
					data: null,
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
		);

		await expect(
			executeBorneoTool(
				'BORNEO_CREATE_NEW_ASSET',
				{ name: 'CRM', type: 'application' },
				{
					composioApiKey: 'project-key',
					connectedAccountId: 'ca_123',
					riskLevel: 'write',
				},
			),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 200,
			message: 'Borneo tool execution failed: Asset name already exists',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('applies base_url overrides to connected-account executions', async () => {
		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
				borneoBaseUrl: 'https://tenant.example.test',
				riskLevel: 'read',
			},
		);

		const [, init] = fetchMock.mock.calls[0];
		const requestBody = JSON.parse(init.body);

		expect(requestBody.connected_account_id).toBe('ca_123');
		expect(requestBody.custom_auth_params).toEqual({
			base_url: 'https://tenant.example.test',
		});
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

	it('rejects promptly when the caller cancels during a 429 backoff delay', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '60',
				},
			}),
		);

		const controller = new AbortController();

		const pending = executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				connectedAccountId: 'ca_123',
				riskLevel: 'read',
				signal: controller.signal,
			},
		);

		setTimeout(() => controller.abort(), 50);

		const startedAt = Date.now();

		await expect(pending).rejects.toMatchObject({
			name: 'ApiError',
			status: 0,
			message: expect.stringContaining('This operation was aborted'),
		});

		expect(Date.now() - startedAt).toBeLessThan(1000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
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

	it('throws when a successful HTTP response omits the execution flag', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					data: {},
					log_id: 'log_123',
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
		);

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
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 200,
			message: 'Borneo tool execution failed',
		});
	});

	it('defaults direct custom auth to an Authorization Bearer header', async () => {
		await executeBorneoTool(
			'BORNEO_LIST_SCANS_WITH_FILTERS',
			{},
			{
				composioApiKey: 'project-key',
				borneoCredential: 'provider-secret',
				riskLevel: 'read',
			},
		);

		const [, init] = fetchMock.mock.calls[0];
		const requestBody = JSON.parse(init.body);

		expect(requestBody.custom_auth_params).toEqual({
			parameters: [
				{
					in: 'header',
					name: 'Authorization',
					value: 'Bearer provider-secret',
				},
			],
		});
	});

	it('rejects Composio base URLs outside composio.dev', () => {
		expect(() =>
			normalizeComposioBaseUrl('https://evil.example.test/api/v3'),
		).toThrow('composio.dev');
	});
});
