import { request } from 'corsair/http';
import { makeCodyRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockHttpRequest = request as jest.MockedFunction<typeof request>;

describe('makeCodyRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ ok: true });
	});

	it('sends a POST to the Sourcegraph host with token auth', async () => {
		await makeCodyRequest('/.api/graphql', 'test-api-key', {
			method: 'POST',
			body: { query: 'query { currentUser { username } }' },
		});

		expect(mockHttpRequest).toHaveBeenCalledTimes(1);
		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://sourcegraph.com',
				HEADERS: expect.objectContaining({
					Authorization: 'token test-api-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/.api/graphql',
				body: { query: 'query { currentUser { username } }' },
			}),
		);
	});

	it('sends Bearer auth for OAuth tokens', async () => {
		await makeCodyRequest('/.api/graphql', 'test-oauth-token', {
			method: 'POST',
			authScheme: 'Bearer',
			body: { query: 'query { currentUser { username } }' },
		});

		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-oauth-token',
				}),
			}),
			expect.anything(),
		);
	});

	it('passes query params through on every method', async () => {
		await makeCodyRequest('/.api/graphql', 'test-api-key', {
			method: 'POST',
			body: { query: 'query { currentUser { username } }' },
			query: { display: 10, extra: undefined },
		});

		const options = mockHttpRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({ display: 10 });
		expect(options?.query).not.toHaveProperty('extra');
	});

	it('propagates ApiError without wrapping', async () => {
		const apiError = new Error('Unauthorized');
		mockHttpRequest.mockRejectedValue(apiError);

		await expect(
			makeCodyRequest('/.api/graphql', 'test-api-key', {
				method: 'POST',
				body: { query: 'query { currentUser { username } }' },
			}),
		).rejects.toBe(apiError);
	});
});
