import { InstagramAPIError, makeInstagramRequest } from './client';

describe('graphPath sanitizer', () => {
	it('rejects braces that would hit the OpenAPI ReDoS regex', async () => {
		await expect(
			makeInstagramRequest('/{aaaaaaaaaaaaaaaa}/media', 'token'),
		).rejects.toBeInstanceOf(InstagramAPIError);
	});
});
