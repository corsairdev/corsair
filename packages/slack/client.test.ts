import { request } from 'corsair/http';
import { makeSlackRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Slack API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('forwards pagination query parameters on POST requests', async () => {
		await makeSlackRequest('conversations.list', 'test-token', {
			method: 'POST',
			body: { types: 'public_channel' },
			query: { cursor: 'next-page', limit: 100 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				query: { cursor: 'next-page', limit: 100 },
			}),
			expect.anything(),
		);
	});
});
