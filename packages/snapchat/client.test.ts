import { request } from 'corsair/http';
import { executeSnapchatTool } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const requestMock = request as jest.MockedFunction<typeof request>;

describe('executeSnapchatTool', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		requestMock.mockResolvedValue({ successful: true, data: { ok: true } });
	});

	it('calls composio execute endpoint with auth headers and body', async () => {
		await executeSnapchatTool(
			'SNAPCHAT_GET_AUTHENTICATED_USER',
			{},
			{
				composioApiKey: 'ck_test',
				snapchatAccessToken: 'token_123',
				connectedAccountId: 'ca_1',
				userId: 'user_1',
			},
		);

		expect(requestMock).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = requestMock.mock.calls[0]!;
		expect(config.BASE).toBe('https://backend.composio.dev/api/v3');
		expect(config.HEADERS).toMatchObject({ 'x-api-key': 'ck_test' });
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.url).toBe(
			'/tools/execute/SNAPCHAT_GET_AUTHENTICATED_USER',
		);
		const body = requestOptions.body as Record<string, unknown>;
		expect(body.connected_account_id).toBe('ca_1');
		expect(body.user_id).toBe('user_1');
		expect(
			(body.custom_auth_params as Record<string, string>).access_token,
		).toBe('token_123');
	});

	it('requires composio api key', async () => {
		await expect(
			executeSnapchatTool(
				'SNAPCHAT_GET_AUTHENTICATED_USER',
				{},
				{
					composioApiKey: '   ',
				},
			),
		).rejects.toThrow('[snapchat] composioApiKey is required');
	});
});
