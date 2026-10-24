import { logEventFromContext } from 'corsair/core';
import { makeTrelloRequest } from '../client';
import { del as deleteBoard } from './boards';
import { del as deleteCard } from './cards';

jest.mock('../client', () => ({ makeTrelloRequest: jest.fn() }));
jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

const mockMakeTrelloRequest = jest.mocked(makeTrelloRequest);
const mockLogEventFromContext = jest.mocked(logEventFromContext);

type DeleteContext = Parameters<typeof deleteCard>[0] &
	Parameters<typeof deleteBoard>[0];

function createContext(db: {
	cards?: { deleteByEntityId: jest.Mock };
	boards?: { deleteByEntityId: jest.Mock };
}) {
	// The full plugin context carries every entity client, key helper and hook.
	// These endpoints only read key, options.trelloApiKey and one entity client,
	// so the test builds just those and casts once here.
	return {
		key: 'test-token',
		options: { trelloApiKey: 'test-api-key' },
		db,
	} as unknown as DeleteContext;
}

describe('Trello delete endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockMakeTrelloRequest.mockResolvedValue({});
		mockLogEventFromContext.mockResolvedValue(null);
	});

	it('deletes the local card after successful Trello deletion', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);

		await deleteCard(createContext({ cards: { deleteByEntityId } }), {
			cardId: 'card-123',
		});

		expect(mockMakeTrelloRequest).toHaveBeenCalledWith(
			'cards/card-123',
			'test-token',
			{ method: 'DELETE' },
			'test-api-key',
		);
		expect(deleteByEntityId).toHaveBeenCalledWith('card-123');
	});

	it('deletes the local board after successful Trello deletion', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);

		await deleteBoard(createContext({ boards: { deleteByEntityId } }), {
			boardId: 'board-123',
		});

		expect(mockMakeTrelloRequest).toHaveBeenCalledWith(
			'boards/board-123',
			'test-token',
			{ method: 'DELETE' },
			'test-api-key',
		);
		expect(deleteByEntityId).toHaveBeenCalledWith('board-123');
	});

	it('does not delete the local card when Trello deletion fails', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		mockMakeTrelloRequest.mockRejectedValueOnce(
			new Error('Trello deletion failed'),
		);

		await expect(
			deleteCard(createContext({ cards: { deleteByEntityId } }), {
				cardId: 'card-123',
			}),
		).rejects.toThrow('Trello deletion failed');

		expect(deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does not delete the local board when Trello deletion fails', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		mockMakeTrelloRequest.mockRejectedValueOnce(
			new Error('Trello deletion failed'),
		);

		await expect(
			deleteBoard(createContext({ boards: { deleteByEntityId } }), {
				boardId: 'board-123',
			}),
		).rejects.toThrow('Trello deletion failed');

		expect(deleteByEntityId).not.toHaveBeenCalled();
	});
});
