import { request } from 'corsair/http';
import { listWorkspaces } from './workspaces';
import { GongWorkspacesOutputSchemas } from './workspaces-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
};
describe('Gong Workspaces operation', () => {
	it('validates the documented response shape', () => {
		expect(
			GongWorkspacesOutputSchemas.listWorkspaces.safeParse({
				requestId: 'r',
				workspaces: [{ id: '123', name: 'Sales', description: 'Workspace' }],
			}).success,
		).toBe(true);
	});
	it('lists workspaces with GET /v2/workspaces', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', workspaces: [] });
		await listWorkspaces(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ USERNAME: 'key', PASSWORD: 'secret' }),
			expect.objectContaining({ method: 'GET', url: '/v2/workspaces' }),
		);
	});
});
