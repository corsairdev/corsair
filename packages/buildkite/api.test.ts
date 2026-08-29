import { makeBuildkiteRequest } from './client';
import { BuildkiteEndpointOutputSchemas } from './endpoints/types';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeBuildkiteRequest: jest.fn(),
}));

describe('Buildkite API Type Tests', () => {
	it('getCurrentAccessToken returns correct type', async () => {
		const mockResponse = { uuid: '123', scopes: ['read'] };
		(makeBuildkiteRequest as jest.Mock).mockResolvedValue(mockResponse);

		const response = await makeBuildkiteRequest('access-token', 'token');
		BuildkiteEndpointOutputSchemas.getCurrentAccessToken.parse(response);
	});

	it('getMeta returns correct type', async () => {
		const mockResponse = { webhookIps: ['1.2.3.4'] };
		(makeBuildkiteRequest as jest.Mock).mockResolvedValue(mockResponse);

		const response = await makeBuildkiteRequest('meta', 'token');
		BuildkiteEndpointOutputSchemas.getMeta.parse(response);
	});

	it('getUser returns correct type', async () => {
		const mockResponse = {
			id: 'user1',
			name: 'Test User',
			email: 'test@example.com',
		};
		(makeBuildkiteRequest as jest.Mock).mockResolvedValue(mockResponse);

		const response = await makeBuildkiteRequest('user', 'token');
		BuildkiteEndpointOutputSchemas.getUser.parse(response);
	});

	it('listOrganizations returns correct type', async () => {
		const mockResponse = [{ id: 'org1', name: 'Test Org', slug: 'test-org' }];
		(makeBuildkiteRequest as jest.Mock).mockResolvedValue(mockResponse);

		const response = await makeBuildkiteRequest('organizations', 'token');
		BuildkiteEndpointOutputSchemas.listOrganizations.parse(response);
	});

	it('listPipelineAgents returns correct type', async () => {
		const mockResponse = [
			{ id: 'agent1', name: 'Test Agent', connectionState: 'connected' },
		];
		(makeBuildkiteRequest as jest.Mock).mockResolvedValue(mockResponse);

		const response = await makeBuildkiteRequest(
			'organizations/test-org/agents',
			'token',
		);
		BuildkiteEndpointOutputSchemas.listPipelineAgents.parse(response);
	});
});
