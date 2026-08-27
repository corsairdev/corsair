import { executeBorneoTool, normalizeComposioBaseUrl } from './client';

const requestMock = jest.fn();

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return {
		...actual,
		request: (...args: unknown[]) => requestMock(...args),
	};
});

describe('Borneo Composio transport', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ successful: true, data: {} });
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

		expect(requestMock).toHaveBeenCalledTimes(1);
		const [, requestOptions] = requestMock.mock.calls[0];
		expect(requestOptions).toMatchObject({
			method: 'POST',
			url: '/tools/execute/BORNEO_CREATE_NEW_ASSET',
			body: expect.objectContaining({
				connected_account_id: 'ca_123',
				version: '20260429_00',
				arguments: { name: 'CRM', type: 'application' },
			}),
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

		const [, requestOptions] = requestMock.mock.calls[0];
		expect(requestOptions.body.custom_auth_params).toEqual({
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
