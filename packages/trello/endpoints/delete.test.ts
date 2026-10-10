const mockMakeTrelloRequest = jest.fn<
	Promise<unknown>,
	[
		string,
		string,
		{
			method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
			body?: Record<string, unknown>;
			query?: Record<string, string | number | boolean | undefined>;
		}?,
		string?,
	]
>();

// The request helper is generic, so its response type can vary by endpoint.
// `unknown` keeps the mock from assuming a specific response shape.
const mockLogEventFromContext = jest.fn<
	Promise<void>,
	[unknown, ...unknown[]]
>();

jest.mock('../client', () => ({
	makeTrelloRequest: mockMakeTrelloRequest,
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: mockLogEventFromContext,
}));

import { del as deleteBoard } from './boards';
import { del as deleteCard } from './cards';

describe('Trello delete endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockMakeTrelloRequest.mockResolvedValue({});
		mockLogEventFromContext.mockResolvedValue(undefined);
	});

	it('deletes the local card after successful Trello deletion', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		// Only the dependencies exercised by this endpoint are needed here;
		// the complete runtime context includes unrelated services.
		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { cards: { deleteByEntityId } },
		} as unknown as Parameters<typeof deleteCard>[0];

		await deleteCard(ctx, { cardId: 'card-123' });

		expect(deleteByEntityId).toHaveBeenCalledWith('card-123');
	});

	it('deletes the local board after successful Trello deletion', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		// The board endpoint test intentionally mocks only the dependencies
		// relevant to deletion rather than building the full runtime context.
		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { boards: { deleteByEntityId } },
		} as unknown as Parameters<typeof deleteBoard>[0];

		await deleteBoard(ctx, { boardId: 'board-123' });

		expect(deleteByEntityId).toHaveBeenCalledWith('board-123');
	});

	it('does not delete the local card when Trello deletion fails', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		// This focused test supplies only the card deletion dependencies.
		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { cards: { deleteByEntityId } },
		} as unknown as Parameters<typeof deleteCard>[0];

		mockMakeTrelloRequest.mockRejectedValueOnce(
			new Error('Trello deletion failed'),
		);

		await expect(deleteCard(ctx, { cardId: 'card-123' })).rejects.toThrow(
			'Trello deletion failed',
		);

		expect(deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does not delete the local board when Trello deletion fails', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		// This focused test supplies only the board deletion dependencies.
		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { boards: { deleteByEntityId } },
		} as unknown as Parameters<typeof deleteBoard>[0];

		mockMakeTrelloRequest.mockRejectedValueOnce(
			new Error('Trello deletion failed'),
		);

		await expect(deleteBoard(ctx, { boardId: 'board-123' })).rejects.toThrow(
			'Trello deletion failed',
		);

		expect(deleteByEntityId).not.toHaveBeenCalled();
	});
});
