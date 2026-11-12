import { request } from 'corsair/http';
import { updateIntegrationSettings } from './integration-settings';
import {
	GongIntegrationSettingsInputSchemas,
	GongIntegrationSettingsOutputSchemas,
} from './integration-settings-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'token',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://us-123.api.gong.io',
	},
	$getAccountId: async () => 'account-id',
};

describe('Gong Integration Settings operation', () => {
	it('validates input and documented response shape', () => {
		expect(
			GongIntegrationSettingsInputSchemas.update.safeParse({}).success,
		).toBe(false);
		expect(
			GongIntegrationSettingsInputSchemas.update.safeParse({
				integrationTypeSettings: [],
			}).success,
		).toBe(true);
		expect(
			GongIntegrationSettingsOutputSchemas.update.safeParse({
				requestId: 'r',
				integrationId: 12,
			}).success,
		).toBe(true);
	});
	it('posts the integration settings payload', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', integrationId: 12 });
		const input = { integrationTypeSettings: [] };
		await updateIntegrationSettings(ctx, input);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/integration-settings',
				body: input,
			}),
		);
	});
});
