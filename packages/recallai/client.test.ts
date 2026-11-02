import { request } from 'corsair/http';
import { makeRecallaiContextRequest } from './client';

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

	it('rejects inherited property names instead of treating them as regions', () => {
		expect(() =>
			makeRecallaiContextRequest(
				{ key: 'recall-key', options: { region: 'toString' } },
				'/api/v1/bot/',
			),
		).toThrow('Unsupported Recall.ai region: toString');
		expect(request).not.toHaveBeenCalled();
	});
});
