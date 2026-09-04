import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import * as Messages from './endpoints/messages';
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

describe('griptape messages', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const messageId = '550e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('get', () => {
		it('sends GET /messages/{message_id}', async () => {
			const mockResponse = {
				message_id: messageId,
				input: 'Hello',
				output: 'Hi there',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.get(ctx, { message_id: messageId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `messages/${messageId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('update', () => {
		it('sends PATCH /messages/{message_id} with the input body', async () => {
			const mockResponse = {
				message_id: messageId,
				input: 'Hello',
				output: 'Updated reply',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.update(ctx, {
				message_id: messageId,
				body: { output: 'Updated reply' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'PATCH',
					url: `messages/${messageId}`,
					body: { output: 'Updated reply' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('remove', () => {
		it('sends DELETE /messages/{message_id}', async () => {
			const mockResponse = undefined as unknown as Record<string, unknown>;

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.remove(ctx, { message_id: messageId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'DELETE',
					url: `messages/${messageId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed messageGet payload', () => {
			const parsed = GriptapeEndpointInputSchemas.messageGet.safeParse({
				message_id: messageId,
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects messageGet with an empty message id', () => {
			const parsed = GriptapeEndpointInputSchemas.messageGet.safeParse({
				message_id: '',
			});

			expect(parsed.success).toBe(false);
		});
	});
});
