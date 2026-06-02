import 'dotenv/config';
import { makeTrelloRequest } from './client';
import type {
	BoardsCreateResponse,
	BoardsGetResponse,
	BoardsListResponse,
	BoardsUpdateResponse,
	CardsCreateResponse,
	CardsGetResponse,
	CardsListResponse,
	CardsUpdateResponse,
	ChecklistsCreateResponse,
	ChecklistsGetResponse,
	LabelsCreateResponse,
	LabelsListResponse,
	ListsArchiveResponse,
	ListsCreateResponse,
	ListsGetResponse,
	ListsListResponse,
	MembersGetResponse,
	MembersListResponse,
} from './endpoints/types';
import { TrelloEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.TRELLO_TOKEN!;
const TEST_API_KEY = process.env.TRELLO_API_KEY;

let boardId: string;
let listId: string;
let cardId: string;

// Track resources created by this test suite for teardown
let setupCreatedBoardId: string | undefined;
let setupCreatedListId: string | undefined;
let setupCreatedCardId: string | undefined;
let testCreatedBoardId: string | undefined;
let testCreatedListId: string | undefined;
let testCreatedCardId: string | undefined;
let testCreatedChecklistId: string | undefined;
let testCreatedLabelId: string | undefined;

beforeAll(async () => {
	// ── board ──────────────────────────────────────────────────────────────────
	const boards = await makeTrelloRequest<BoardsListResponse>(
		'members/me/boards',
		TEST_TOKEN,
		{ method: 'GET', query: { filter: 'all', fields: 'id,name,closed' } },
		TEST_API_KEY,
	);
	boardId = boards.find((b) => !b.closed)?.id ?? boards[0]?.id ?? '';

	if (!boardId) {
		const newBoard = await makeTrelloRequest<BoardsCreateResponse>(
			'boards',
			TEST_TOKEN,
			{
				method: 'POST',
				body: { name: 'Corsair Test Board', defaultLists: true },
			},
			TEST_API_KEY,
		);
		boardId = newBoard.id;
		setupCreatedBoardId = newBoard.id;
	}

	// ── list ───────────────────────────────────────────────────────────────────
	if (boardId) {
		const lists = await makeTrelloRequest<ListsListResponse>(
			`boards/${boardId}/lists`,
			TEST_TOKEN,
			{ method: 'GET', query: { filter: 'open' } },
			TEST_API_KEY,
		);
		listId = lists[0]?.id ?? '';

		if (!listId) {
			const newList = await makeTrelloRequest<ListsCreateResponse>(
				'lists',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: 'Corsair Test List', idBoard: boardId },
				},
				TEST_API_KEY,
			);
			listId = newList.id;
			setupCreatedListId = newList.id;
		}
	}

	// ── card ───────────────────────────────────────────────────────────────────
	if (listId) {
		const cards = await makeTrelloRequest<CardsListResponse>(
			`lists/${listId}/cards`,
			TEST_TOKEN,
			{ method: 'GET', query: { filter: 'open' } },
			TEST_API_KEY,
		);
		cardId = cards[0]?.id ?? '';

		if (!cardId) {
			const newCard = await makeTrelloRequest<CardsCreateResponse>(
				'cards',
				TEST_TOKEN,
				{ method: 'POST', body: { name: 'Corsair Test Card', idList: listId } },
				TEST_API_KEY,
			);
			cardId = newCard.id;
			setupCreatedCardId = newCard.id;
		}
	}
});

afterAll(async () => {
	const del = async (path: string) => {
		try {
			await makeTrelloRequest(
				`${path}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
				TEST_API_KEY,
			);
		} catch (e) {
			console.warn(`Teardown: failed to delete ${path}`, e);
		}
	};
	const archive = async (listId: string) => {
		try {
			await makeTrelloRequest(
				`lists/${listId}/closed`,
				TEST_TOKEN,
				{ method: 'PUT', body: { value: true } },
				TEST_API_KEY,
			);
		} catch (e) {
			console.warn(`Teardown: failed to archive list ${listId}`, e);
		}
	};

	if (testCreatedChecklistId) await del(`checklists/${testCreatedChecklistId}`);
	if (testCreatedLabelId) await del(`labels/${testCreatedLabelId}`);
	if (testCreatedCardId) await del(`cards/${testCreatedCardId}`);
	if (testCreatedListId) await archive(testCreatedListId);
	if (testCreatedBoardId) await del(`boards/${testCreatedBoardId}`);
	if (setupCreatedCardId) await del(`cards/${setupCreatedCardId}`);
	if (setupCreatedListId) await archive(setupCreatedListId);
	if (setupCreatedBoardId) await del(`boards/${setupCreatedBoardId}`);
});

describe('Trello API Type Tests', () => {
	describe('boards', () => {
		it('boardsList returns correct type', async () => {
			const response = await makeTrelloRequest<BoardsListResponse>(
				'members/me/boards',
				TEST_TOKEN,
				{
					method: 'GET',
					query: { filter: 'all', fields: 'id,name,closed,url' },
				},
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.boardsList.parse(response);
		});

		it('boardsGet returns correct type', async () => {
			const response = await makeTrelloRequest<BoardsGetResponse>(
				`boards/${boardId}`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.boardsGet.parse(response);
		});

		it('boardsCreate returns correct type', async () => {
			const response = await makeTrelloRequest<BoardsCreateResponse>(
				'boards',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Board ${Date.now()}`, defaultLists: false },
				},
				TEST_API_KEY,
			);
			testCreatedBoardId = response.id;

			TrelloEndpointOutputSchemas.boardsCreate.parse(response);
		});

		it('boardsUpdate returns correct type', async () => {
			const response = await makeTrelloRequest<BoardsUpdateResponse>(
				`boards/${boardId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { desc: `Updated at ${new Date().toISOString()}` },
				},
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.boardsUpdate.parse(response);
		});
	});

	describe('lists', () => {
		it('listsList returns correct type', async () => {
			const response = await makeTrelloRequest<ListsListResponse>(
				`boards/${boardId}/lists`,
				TEST_TOKEN,
				{ method: 'GET', query: { filter: 'open' } },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.listsList.parse(response);
		});

		it('listsGet returns correct type', async () => {
			const response = await makeTrelloRequest<ListsGetResponse>(
				`lists/${listId}`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.listsGet.parse(response);
		});

		it('listsCreate returns correct type', async () => {
			const response = await makeTrelloRequest<ListsCreateResponse>(
				'lists',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: `Test List ${Date.now()}`, idBoard: boardId },
				},
				TEST_API_KEY,
			);
			testCreatedListId = response.id;

			TrelloEndpointOutputSchemas.listsCreate.parse(response);
		});

		it('listsArchive returns correct type', async () => {
			// Create a throwaway list so the shared listId stays open for card tests
			const throwaway = await makeTrelloRequest<ListsCreateResponse>(
				'lists',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: `Throwaway List ${Date.now()}`, idBoard: boardId },
				},
				TEST_API_KEY,
			);

			const response = await makeTrelloRequest<ListsArchiveResponse>(
				`lists/${throwaway.id}/closed`,
				TEST_TOKEN,
				{ method: 'PUT', body: { value: true } },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.listsArchive.parse(response);
		});
	});

	describe('cards', () => {
		it('cardsList returns correct type', async () => {
			const response = await makeTrelloRequest<CardsListResponse>(
				`lists/${listId}/cards`,
				TEST_TOKEN,
				{ method: 'GET', query: { filter: 'open' } },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.cardsList.parse(response);
		});

		it('cardsGet returns correct type', async () => {
			const response = await makeTrelloRequest<CardsGetResponse>(
				`cards/${cardId}`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.cardsGet.parse(response);
		});

		it('cardsCreate returns correct type', async () => {
			const response = await makeTrelloRequest<CardsCreateResponse>(
				'cards',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `Test Card ${Date.now()}`,
						idList: listId,
						desc: 'Created by Corsair automated test',
					},
				},
				TEST_API_KEY,
			);
			testCreatedCardId = response.id;

			TrelloEndpointOutputSchemas.cardsCreate.parse(response);
		});

		it('cardsUpdate returns correct type', async () => {
			const response = await makeTrelloRequest<CardsUpdateResponse>(
				`cards/${cardId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { desc: `Updated at ${new Date().toISOString()}` },
				},
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.cardsUpdate.parse(response);
		});
	});

	describe('members', () => {
		it('membersGet returns correct type', async () => {
			const response = await makeTrelloRequest<MembersGetResponse>(
				'members/me',
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.membersGet.parse(response);
		});

		it('membersList returns correct type', async () => {
			const response = await makeTrelloRequest<MembersListResponse>(
				`boards/${boardId}/members`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.membersList.parse(response);
		});
	});

	describe('labels', () => {
		it('labelsList returns correct type', async () => {
			const response = await makeTrelloRequest<LabelsListResponse>(
				`boards/${boardId}/labels`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.labelsList.parse(response);
		});

		it('labelsCreate returns correct type', async () => {
			const response = await makeTrelloRequest<LabelsCreateResponse>(
				'labels',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `Test Label ${Date.now()}`,
						color: 'blue',
						idBoard: boardId,
					},
				},
				TEST_API_KEY,
			);
			testCreatedLabelId = response.id;

			TrelloEndpointOutputSchemas.labelsCreate.parse(response);
		});
	});

	describe('checklists', () => {
		it('checklistsCreate returns correct type', async () => {
			const response = await makeTrelloRequest<ChecklistsCreateResponse>(
				'checklists',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { idCard: cardId, name: `Test Checklist ${Date.now()}` },
				},
				TEST_API_KEY,
			);
			testCreatedChecklistId = response.id;

			TrelloEndpointOutputSchemas.checklistsCreate.parse(response);
		});

		it('checklistsGet returns correct type', async () => {
			const cardResponse = await makeTrelloRequest<CardsGetResponse>(
				`cards/${cardId}`,
				TEST_TOKEN,
				{ method: 'GET', query: { checklists: 'all' } },
				TEST_API_KEY,
			);

			const checklistId = cardResponse.idChecklists?.[0];
			if (!checklistId) {
				throw new Error('No checklist found for card');
			}

			const response = await makeTrelloRequest<ChecklistsGetResponse>(
				`checklists/${checklistId}`,
				TEST_TOKEN,
				{ method: 'GET' },
				TEST_API_KEY,
			);

			TrelloEndpointOutputSchemas.checklistsGet.parse(response);
		});
	});
});
