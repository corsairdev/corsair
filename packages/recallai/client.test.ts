import { ApiError, request } from 'corsair/http';
import { makeRecallaiContextRequest, RecallaiAPIError } from './client';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

describe('Recall.ai regional request routing', () => {
	beforeEach(() => {
		jest.mocked(request).mockReset();
		jest.mocked(request).mockResolvedValue({ count: 0, results: [] });
	});

	it('routes the API key to its configured region host', async () => {
		await makeRecallaiContextRequest(
			{ key: 'recall-key', options: { region: 'eu-central-1' } },
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://eu-central-1.recall.ai' }),
			expect.objectContaining({ method: 'GET', url: '/api/v1/bot/' }),
			expect.any(Object),
		);
	});

	it('keeps the existing US West host as the default region', async () => {
		await makeRecallaiContextRequest(
			{ key: 'recall-key', options: {} },
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://us-west-2.recall.ai' }),
			expect.objectContaining({ method: 'GET', url: '/api/v1/bot/' }),
			expect.any(Object),
		);
	});

	it('sends Recall token auth without triggering the shared bearer-token path', async () => {
		await makeRecallaiContextRequest(
			{ key: 'recall-key', options: {} },
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
				HEADERS: expect.objectContaining({ Authorization: 'Token recall-key' }),
			}),
			expect.any(Object),
			expect.any(Object),
		);
	});

	it('rejects inherited property names instead of treating them as regions', async () => {
		await expect(
			makeRecallaiContextRequest(
				{ key: 'recall-key', options: { region: 'toString' } },
				'/api/v1/bot/',
			),
		).rejects.toThrow('Unsupported Recall.ai region: toString');
		expect(request).not.toHaveBeenCalled();
	});

	it('uses the region stored with the connected account', async () => {
		await makeRecallaiContextRequest(
			{
				key: 'recall-key',
				options: {},
				keys: { get_region: async () => 'ap-northeast-1' },
			},
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://ap-northeast-1.recall.ai' }),
			expect.any(Object),
			expect.any(Object),
		);
	});

	it('lets the plugin option override the stored region', async () => {
		await makeRecallaiContextRequest(
			{
				key: 'recall-key',
				options: { region: 'us-east-1' },
				keys: { get_region: async () => 'eu-central-1' },
			},
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://us-east-1.recall.ai' }),
			expect.any(Object),
			expect.any(Object),
		);
	});

	it('never builds a host from a stored region outside the four Recall regions', async () => {
		await expect(
			makeRecallaiContextRequest(
				{
					key: 'recall-key',
					options: {},
					keys: { get_region: async () => 'evil.example.com/x' },
				},
				'/api/v1/bot/',
			),
		).rejects.toThrow('Unsupported Recall.ai region');
		expect(request).not.toHaveBeenCalled();
	});

	it('falls back to US West when the tenant has no stored credentials yet', async () => {
		await makeRecallaiContextRequest(
			{
				key: 'recall-key',
				options: {},
				keys: {
					get_region: async () => {
						throw new Error('No DEK found for tenant');
					},
				},
			},
			'/api/v1/bot/',
		);

		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://us-west-2.recall.ai' }),
			expect.any(Object),
			expect.any(Object),
		);
	});

	it('points a rejected key at the region setting', async () => {
		// The mocked ApiError takes only a message; status is what the client reads.
		const MockApiError = ApiError as unknown as new (message: string) => Error;
		const unauthorized = Object.assign(new MockApiError('Unauthorized'), {
			status: 401,
		});
		jest.mocked(request).mockRejectedValueOnce(unauthorized);

		const failure = makeRecallaiContextRequest(
			{ key: 'recall-key', options: { region: 'eu-central-1' } },
			'/api/v1/bot/',
		);

		await expect(failure).rejects.toBeInstanceOf(RecallaiAPIError);
		await expect(failure).rejects.toMatchObject({
			status: 401,
			message: expect.stringContaining(
				'https://eu-central-1.recall.ai. Keys only work in the region they were created in',
			),
		});
	});

	it('reads a pasted region host as its region', async () => {
		for (const stored of [
			'eu-central-1.recall.ai',
			'https://eu-central-1.recall.ai/',
			' EU-CENTRAL-1 ',
		]) {
			jest.mocked(request).mockClear();
			await makeRecallaiContextRequest(
				{ key: 'recall-key', keys: { get_region: async () => stored } },
				'/api/v1/bot/',
			);
			expect(request).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://eu-central-1.recall.ai' }),
				expect.any(Object),
				expect.any(Object),
			);
		}
		await expect(
			makeRecallaiContextRequest(
				{
					key: 'recall-key',
					keys: { get_region: async () => 'eu-central-1.recall.ai.evil.com' },
				},
				'/api/v1/bot/',
			),
		).rejects.toThrow('Unsupported Recall.ai region');
	});
});
