import { gongRequest } from '../client';
import { getCrmObjects } from './crm';

jest.mock('../client', () => ({
	gongRequest: jest
		.fn()
		.mockResolvedValue({ requestId: 'r', crmObjectsMap: {} }),
}));

const mockedGongRequest = jest.mocked(gongRequest);
const ctx = {
	key: 'stored-key',
	options: {
		authType: 'api_key' as const,
		accessKeySecret: 'secret',
		baseUrl: 'https://us-123.api.gong.io',
	},
	$getAccountId: async () => 'account-id',
};

describe('Gong CRM GET body route', () => {
	it('passes the documented query, JSON body, and resolved key to the transport', async () => {
		await getCrmObjects(ctx, {
			integrationId: 12,
			objectType: 'DEAL',
			objectsCrmIds: ['crm-1'],
		});

		expect(mockedGongRequest).toHaveBeenCalledWith({
			baseUrl: 'https://us-123.api.gong.io',
			credentials: {
				type: 'basic',
				accessKey: 'stored-key',
				accessKeySecret: 'secret',
			},
			method: 'GET',
			path: '/v2/crm/entities',
			query: { integrationId: 12, objectType: 'DEAL' },
			body: ['crm-1'],
		});
	});
});
