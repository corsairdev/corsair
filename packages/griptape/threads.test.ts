import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as Threads from './endpoints/threads';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = jest.mocked(logEventFromContext);

describe('griptape threads', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const threadId = '550e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('list', () => {
		it('sends GET /threads with pagination and filter parameters', async () => {
			const mockResponse = {
				threads: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.list(ctx, {
				page: 1,
				page_size: 10,
				alias: 'support',
				starts_with: 'sup',
				created_by: 'user@example.com',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: 'threads',
					query: {
						page: 1,
						page_size: 10,
						alias: 'support',
						starts_with: 'sup',
						created_by: 'user@example.com',
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('create', () => {
		it('sends POST /threads with the input body', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'support',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.create(ctx, {
				body: { alias: 'support' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: 'threads',
					body: { alias: 'support' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('get', () => {
		it('sends GET /threads/{thread_id}', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'support',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.get(ctx, { thread_id: threadId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `threads/${threadId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('update', () => {
		it('sends PATCH /threads/{thread_id} with the input body', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'renamed',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.update(ctx, {
				thread_id: threadId,
				body: { alias: 'renamed' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'PATCH',
					url: `threads/${threadId}`,
					body: { alias: 'renamed' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('remove', () => {
		it('sends DELETE /threads/{thread_id}', async () => {
			const mockResponse = undefined as unknown as Record<string, unknown>;

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.remove(ctx, { thread_id: threadId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'DELETE',
					url: `threads/${threadId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listMessages', () => {
		it('sends GET /threads/{thread_id}/messages with pagination', async () => {
			const mockResponse = {
				messages: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.listMessages(ctx, {
				thread_id: threadId,
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `threads/${threadId}/messages`,
					query: { page: 1, page_size: 10 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('createMessage', () => {
		it('sends POST /threads/{thread_id}/messages with input/output/metadata', async () => {
			const mockResponse = {
				message_id: '660e8400-e29b-41d4-a716-446655440000',
				input: 'Hello',
				output: 'Hi there',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.createMessage(ctx, {
				thread_id: threadId,
				input: 'Hello',
				output: 'Hi there',
				metadata: { source: 'test' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `threads/${threadId}/messages`,
					body: {
						input: 'Hello',
						output: 'Hi there',
						metadata: { source: 'test' },
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed threadMessageCreate payload', () => {
			const parsed = GriptapeEndpointInputSchemas.threadMessageCreate.safeParse(
				{
					thread_id: threadId,
					input: 'Hello',
					output: 'Hi there',
				},
			);

			expect(parsed.success).toBe(true);
		});

		it('rejects threadMessageCreate with an empty thread id', () => {
			const parsed = GriptapeEndpointInputSchemas.threadMessageCreate.safeParse(
				{
					thread_id: '',
					input: 'Hello',
					output: 'Hi there',
				},
			);

			expect(parsed.success).toBe(false);
		});
	});
});
