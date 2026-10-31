import { makeTrelloRequest } from '../client';
import type { TrelloContext } from '../index';
import { del as deleteBoard } from './boards';
import { del as deleteCard } from './cards';

jest.mock('../client', () => ({
	makeTrelloRequest: jest.fn(),
}));

jest.mock(
	'corsair/core',
	() => ({
		logEventFromContext: async () => null,
	}),
	{ virtual: true },
);

const mockedRequest = makeTrelloRequest as jest.MockedFunction<
	typeof makeTrelloRequest
>;

type EntityStore = {
	deleteByEntityId: jest.Mock<Promise<boolean>, [string]>;
	findByEntityId: jest.Mock;
	upsertByEntityId: jest.Mock;
};

function entityStore(): EntityStore {
	return {
		deleteByEntityId: jest.fn().mockResolvedValue(true),
		findByEntityId: jest.fn(),
		upsertByEntityId: jest.fn(),
	};
}

function context(stores: {
	boards?: EntityStore;
	cards?: EntityStore;
}): TrelloContext {
	return {
		key: 'test-token',
		options: {},
		db: stores,
	} as unknown as TrelloContext;
}

beforeEach(() => {
	mockedRequest.mockReset();
});

type DeleteEndpoint = (
	ctx: TrelloContext,
	entityId: string,
) => Promise<unknown>;

const deleteCases: Array<{
	resource: string;
	entityId: string;
	path: string;
	storeKey: 'boards' | 'cards';
	invoke: DeleteEndpoint;
}> = [
	{
		resource: 'board',
		entityId: 'board-1',
		path: 'boards/board-1',
		storeKey: 'boards',
		invoke: (ctx, entityId) => deleteBoard(ctx, { boardId: entityId }),
	},
	{
		resource: 'card',
		entityId: 'card-1',
		path: 'cards/card-1',
		storeKey: 'cards',
		invoke: (ctx, entityId) => deleteCard(ctx, { cardId: entityId }),
	},
];

describe('Trello delete endpoints (issue #1869)', () => {
	it.each(deleteCases)(
		'deletes the cached $resource row instead of marking it closed',
		async ({ entityId, path, storeKey, invoke }) => {
			const store = entityStore();
			const response = { _value: null };
			mockedRequest.mockResolvedValue(response);

			const stores =
				storeKey === 'boards' ? { boards: store } : { cards: store };
			await expect(invoke(context(stores), entityId)).resolves.toBe(response);

			expect(mockedRequest).toHaveBeenCalledWith(
				path,
				'test-token',
				{ method: 'DELETE' },
				undefined,
			);
			expect(store.deleteByEntityId).toHaveBeenCalledWith(entityId);
			expect(store.findByEntityId).not.toHaveBeenCalled();
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		},
	);
});
