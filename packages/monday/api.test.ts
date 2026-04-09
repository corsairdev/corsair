import 'dotenv/config';
import { makeMondayRequest } from './client';
import type {
	BoardsCreateInput,
	BoardsGetInput,
	BoardsListInput,
	ColumnsListInput,
	GroupsListInput,
	ItemsCreateInput,
	ItemsGetInput,
	ItemsListInput,
	UpdatesCreateInput,
	UsersListInput,
	WorkspacesListInput,
} from './endpoints/types';
import {
	MondayEndpointInputSchemas,
	MondayEndpointOutputSchemas,
} from './endpoints/types';

const TEST_TOKEN = process.env.MONDAY_API_KEY!;

let testBoardId: string;
let testItemId: string;

beforeAll(async () => {
	const boardsResult = await makeMondayRequest<
		(typeof MondayEndpointOutputSchemas.boardsList)['_output']
	>(
		`query {
			boards(limit: 1, state: active) {
				id
			}
		}`,
		TEST_TOKEN,
	);

	const boardId = boardsResult.boards?.[0]?.id;
	if (!boardId) throw new Error('No active boards found — cannot run tests');
	testBoardId = boardId;

	const itemsResult = await makeMondayRequest<
		(typeof MondayEndpointOutputSchemas.itemsList)['_output']
	>(
		`query($boardId: ID!) {
			boards(ids: [$boardId]) {
				items_page(limit: 1) {
					items { id }
				}
			}
		}`,
		TEST_TOKEN,
		{ boardId: testBoardId },
	);

	const itemId = itemsResult.boards?.[0]?.items_page?.items?.[0]?.id;
	if (!itemId)
		throw new Error('No items found in the first board — cannot run tests');
	testItemId = itemId;
});

describe('Monday API Type Tests', () => {
	describe('boards', () => {
		it('boardsList returns correct type', async () => {
			const input: BoardsListInput = { limit: 10 };
			MondayEndpointInputSchemas.boardsList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.boardsList)['_output']
			>(
				`query($limit: Int) {
					boards(limit: $limit) {
						id
						name
						description
						board_kind
						state
						workspace_id
					}
				}`,
				TEST_TOKEN,
				{ limit: input.limit },
			);

			MondayEndpointOutputSchemas.boardsList.parse(result);
		});

		it('boardsGet returns correct type', async () => {
			const input: BoardsGetInput = { board_id: testBoardId };
			MondayEndpointInputSchemas.boardsGet.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.boardsGet)['_output']
			>(
				`query($boardId: ID!) {
					boards(ids: [$boardId]) {
						id
						name
						description
						board_kind
						state
						workspace_id
						groups {
							id
							title
							color
						}
						columns {
							id
							title
							type
						}
					}
				}`,
				TEST_TOKEN,
				{ boardId: testBoardId },
			);

			MondayEndpointOutputSchemas.boardsGet.parse(result);
		});

		it('boardsCreate returns correct type', async () => {
			const input: BoardsCreateInput = {
				board_name: `Test Board ${Date.now()}`,
				board_kind: 'public',
			};
			MondayEndpointInputSchemas.boardsCreate.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.boardsCreate)['_output']
			>(
				`mutation($name: String!, $boardKind: BoardKind!) {
					create_board(board_name: $name, board_kind: $boardKind) {
						id
						name
					}
				}`,
				TEST_TOKEN,
				{ name: input.board_name, boardKind: input.board_kind },
			);

			MondayEndpointOutputSchemas.boardsCreate.parse(result);
		});
	});

	describe('items', () => {
		it('itemsList returns correct type', async () => {
			const input: ItemsListInput = { board_id: testBoardId, limit: 10 };
			MondayEndpointInputSchemas.itemsList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.itemsList)['_output']
			>(
				`query($boardId: ID!, $limit: Int) {
					boards(ids: [$boardId]) {
						items_page(limit: $limit) {
							cursor
							items {
								id
								name
								state
							}
						}
					}
				}`,
				TEST_TOKEN,
				{ boardId: testBoardId, limit: 10 },
			);

			MondayEndpointOutputSchemas.itemsList.parse(result);
		});

		it('itemsGet returns correct type', async () => {
			const input: ItemsGetInput = { item_id: testItemId };
			MondayEndpointInputSchemas.itemsGet.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.itemsGet)['_output']
			>(
				`query($itemId: ID!) {
					items(ids: [$itemId]) {
						id
						name
						state
						column_values { id text value }
					}
				}`,
				TEST_TOKEN,
				{ itemId: testItemId },
			);

			MondayEndpointOutputSchemas.itemsGet.parse(result);
		});

		it('itemsCreate returns correct type', async () => {
			const input: ItemsCreateInput = {
				board_id: testBoardId,
				item_name: `Test Item ${Date.now()}`,
			};
			MondayEndpointInputSchemas.itemsCreate.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.itemsCreate)['_output']
			>(
				`mutation($boardId: ID!, $itemName: String!) {
					create_item(board_id: $boardId, item_name: $itemName) {
						id
						name
					}
				}`,
				TEST_TOKEN,
				{ boardId: testBoardId, itemName: input.item_name },
			);

			MondayEndpointOutputSchemas.itemsCreate.parse(result);
		});
	});

	describe('groups', () => {
		it('groupsList returns correct type', async () => {
			const input: GroupsListInput = { board_id: testBoardId };
			MondayEndpointInputSchemas.groupsList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.groupsList)['_output']
			>(
				`query($boardId: ID!) {
					boards(ids: [$boardId]) {
						groups {
							id
							title
							color
							position
						}
					}
				}`,
				TEST_TOKEN,
				{ boardId: testBoardId },
			);

			MondayEndpointOutputSchemas.groupsList.parse(result);
		});
	});

	describe('columns', () => {
		it('columnsList returns correct type', async () => {
			const input: ColumnsListInput = { board_id: testBoardId };
			MondayEndpointInputSchemas.columnsList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.columnsList)['_output']
			>(
				`query($boardId: ID!) {
					boards(ids: [$boardId]) {
						columns {
							id
							title
							type
							settings_str
						}
					}
				}`,
				TEST_TOKEN,
				{ boardId: testBoardId },
			);

			MondayEndpointOutputSchemas.columnsList.parse(result);
		});
	});

	describe('updates', () => {
		it('updatesCreate returns correct type', async () => {
			const input: UpdatesCreateInput = {
				item_id: testItemId,
				body: `Test update ${Date.now()}`,
			};
			MondayEndpointInputSchemas.updatesCreate.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.updatesCreate)['_output']
			>(
				`mutation($itemId: ID!, $body: String!) {
					create_update(item_id: $itemId, body: $body) {
						id
						body
					}
				}`,
				TEST_TOKEN,
				{ itemId: testItemId, body: input.body },
			);

			MondayEndpointOutputSchemas.updatesCreate.parse(result);
		});
	});

	describe('users', () => {
		it('usersList returns correct type', async () => {
			const input: UsersListInput = { limit: 10 };
			MondayEndpointInputSchemas.usersList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.usersList)['_output']
			>(
				`query($limit: Int) {
					users(limit: $limit) {
						id
						name
						email
						is_admin
						is_guest
					}
				}`,
				TEST_TOKEN,
				{ limit: input.limit },
			);

			MondayEndpointOutputSchemas.usersList.parse(result);
		});
	});

	describe('workspaces', () => {
		it('workspacesList returns correct type', async () => {
			const input: WorkspacesListInput = { limit: 10 };
			MondayEndpointInputSchemas.workspacesList.parse(input);

			const result = await makeMondayRequest<
				(typeof MondayEndpointOutputSchemas.workspacesList)['_output']
			>(
				`query($limit: Int) {
					workspaces(limit: $limit) {
						id
						name
						kind
						description
					}
				}`,
				TEST_TOKEN,
				{ limit: input.limit },
			);

			MondayEndpointOutputSchemas.workspacesList.parse(result);
		});
	});
});
