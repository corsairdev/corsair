import { request } from 'corsair/http';
import { boxhero, boxheroEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);

describe('BoxHero API integration', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedRequest.mockResolvedValue({} as never);
	});

	it('uses bearer authentication for API requests', async () => {
		const { makeBoxheroRequest } = await import('./client');

		await makeBoxheroRequest('/v1/teams/linked', 'test-token');

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ TOKEN: 'test-token' }),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/teams/linked',
			}),
		);
	});

	it('exposes every requested endpoint with schemas and metadata', () => {
		const plugin = boxhero();
		const expectedEndpoints = [
			'locations.delete',
			'locations.list',
			'locations.get',
			'transactions.listBasic',
			'transactions.listLocation',
			'partners.list',
			'items.delete',
			'items.get',
			'items.list',
			'itemAttributes.list',
			'itemAttributes.get',
			'teams.getInfo',
			'members.list',
			'members.get',
		] as const;

		for (const endpoint of expectedEndpoints) {
			expect(boxheroEndpointSchemas[endpoint].input).toBeDefined();
			expect(boxheroEndpointSchemas[endpoint].output).toBeDefined();
			expect(plugin.endpointMeta?.[endpoint]).toBeDefined();
		}
	});
});
