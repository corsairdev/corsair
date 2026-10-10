const mockMakeTrelloRequest = jest.fn();
const mockLogEventFromContext = jest.fn();

jest.mock('../client', () => ({
	makeTrelloRequest: (...args: unknown[]) => mockMakeTrelloRequest(...args),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: (...args: unknown[]) => mockLogEventFromContext(...args),
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

		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { cards: { deleteByEntityId } },
		} as any;

		await deleteCard(ctx, { cardId: 'card-123' });

		expect(deleteByEntityId).toHaveBeenCalledWith('card-123');
	});

	it('deletes the local board after successful Trello deletion', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { boards: { deleteByEntityId } },
		} as any;

		await deleteBoard(ctx, { boardId: 'board-123' });

		expect(deleteByEntityId).toHaveBeenCalledWith('board-123');
	});

	it('does not delete the local card when Trello deletion fails', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		const ctx = {
			key: 'test-token',
			options: { trelloApiKey: 'test-api-key' },
			db: { cards: { deleteByEntityId } },
		} as any;

		mockMakeTrelloRequest.mockRejectedValueOnce(
			new Error('Trello deletion failed'),
		);

		await expect(deleteCard(ctx, { cardId: 'card-123' })).rejects.toThrow(
			'Trello deletion failed',
		);

		expect(deleteByEntityId).not.toHaveBeenCalled();
	});
});
