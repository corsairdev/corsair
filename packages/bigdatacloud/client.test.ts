import { BigDataCloudAPIError, makeBigDataCloudRequest } from './client';

describe('makeBigDataCloudRequest', () => {
	it('rejects a missing API key before calling the network', async () => {
		await expect(
			makeBigDataCloudRequest('country-info', '  ', {
				query: { code: 'US' },
			}),
		).rejects.toBeInstanceOf(BigDataCloudAPIError);
	});
});
