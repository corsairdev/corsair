import { ApiError, request } from 'corsair/http';
import { ReplyioAPIError, makeReplyioRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

describe('Replyio API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('targets the Reply.io v3 base URL with a Bearer token', async () => {
		mockRequest.mockResolvedValue({ items: [], hasMore: false });
		await makeReplyioRequest('sequences', 'test-api-key', {
			method: 'GET',
			query: { top: 10 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.reply.io/v3',
				TOKEN: 'test-api-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'sequences',
				query: { top: 10 },
			}),
			expect.anything(),
		);
	});

	it('never points at placeholder infrastructure', async () => {
		mockRequest.mockResolvedValue({ items: [], hasMore: false });
		await makeReplyioRequest('contacts', 'test-api-key', { method: 'GET' });

		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).not.toContain('example.com');
		expect(config?.BASE).toBe('https://api.reply.io/v3');
	});

	it('sends JSON bodies on POST requests', async () => {
		mockRequest.mockResolvedValue({ id: 1 });
		await makeReplyioRequest('contacts', 'test-api-key', {
			method: 'POST',
			body: { email: 'prospect@example.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: { email: 'prospect@example.com' },
				mediaType: 'application/json; charset=utf-8',
			}),
			expect.anything(),
		);
	});

	it('forwards pagination query parameters on POST filter requests', async () => {
		mockRequest.mockResolvedValue({ items: [], hasMore: false });
		await makeReplyioRequest('email-accounts/filter', 'test-api-key', {
			method: 'POST',
			body: { status: 'disconnected' },
			query: { top: 25, skip: 50 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				query: { top: 25, skip: 50 },
			}),
			expect.anything(),
		);
	});

	it('maps Reply problem+json failures to ReplyioAPIError with code and status', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'sequences/999' },
			{
				url: 'https://api.reply.io/v3/sequences/999',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { code: 'sequence.notFound', title: 'Bad Request' },
			},
			'Bad Request',
		);
		mockRequest.mockRejectedValue(apiError);

		const failure = await makeReplyioRequest('sequences/999', 'test-api-key', {
			method: 'GET',
		}).then(
			() => null,
			(error: unknown) => error,
		);
		expect(failure).toBeInstanceOf(ReplyioAPIError);
		if (failure instanceof ReplyioAPIError) {
			expect(failure.code).toBe('sequence.notFound');
			expect(failure.status).toBe(400);
		}
	});

	it('wraps generic errors without losing the message', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		const failure = await makeReplyioRequest('contacts', 'test-api-key', {
			method: 'GET',
		}).then(
			() => null,
			(error: unknown) => error,
		);
		expect(failure).toBeInstanceOf(ReplyioAPIError);
		if (failure instanceof ReplyioAPIError) {
			expect(failure.message).toBe('socket hang up');
		}
	});

	it('wraps non-error rejections as unknown errors', async () => {
		mockRequest.mockRejectedValue('boom');

		const failure = await makeReplyioRequest('contacts', 'test-api-key', {
			method: 'GET',
		}).then(
			() => null,
			(error: unknown) => error,
		);
		expect(failure).toBeInstanceOf(ReplyioAPIError);
		if (failure instanceof ReplyioAPIError) {
			expect(failure.message).toBe('Unknown error');
		}
	});
});
