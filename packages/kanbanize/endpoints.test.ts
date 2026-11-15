import { logEventFromContext } from 'corsair/core';
import {
	isKanbanizeAuthError,
	isKanbanizeRateLimit,
	KanbanizeAPIError,
	kanbanizeErrorCode,
} from './client';
import {
	Account,
	Boards,
	Cards,
	Columns,
	Comments,
	Lanes,
	Subtasks,
	Tags,
	Webhooks,
	Workflows,
} from './endpoints';
import {
	board,
	boardNotFound,
	boards,
	card,
	cards,
	column,
	columns,
	comment,
	comments,
	invalidField,
	invalidKey,
	lane,
	lanes,
	limitExceeded,
	limits,
	me,
	minutelyLimit,
	notLoggedIn,
	subtask,
	subtasks,
	tags,
	users,
	webhook,
	webhooks,
	workflow,
	workflows,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'bm-test-key';
const SUBDOMAIN = 'acme';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: ctx.key, the subdomain
	// option, and the account key manager.
	const ctx = {
		key: API_KEY,
		options: { subdomain: SUBDOMAIN },
		keys: { get_subdomain: jest.fn().mockResolvedValue(SUBDOMAIN) },
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		host: parsed.host,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allBoardIds: parsed.searchParams.getAll('board_ids'),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.host).toBe('acme.kanbanize.com');
	expect(sent.path.startsWith('/api/v2/')).toBe(true);
	expect(sent.headers.get('apikey')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('boards.list', () => {
	it('GETs the boards with the key in the apikey header', async () => {
		respond(boards);

		const result = (await invoke(Boards.list, {})) as {
			data: typeof boards.data;
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/boards',
			body: undefined,
		});
		expect(result.data).toHaveLength(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kanbanize.boards.list',
			{ count: 2 },
			'completed',
		);
	});

	it('sends the ID lists comma-joined and the flags as 0 or 1', async () => {
		respond(boards);

		await invoke(Boards.list, {
			board_ids: [1075, 1076],
			workspace_ids: [3],
			is_archived: 0,
			if_assigned: 1,
			fields: ['board_id', 'name'],
			expand: ['workflows'],
		});

		const sent = lastRequest();
		expect(sent.allBoardIds).toEqual(['1075,1076']);
		expect(sent.query).toEqual({
			board_ids: '1075,1076',
			workspace_ids: '3',
			is_archived: '0',
			if_assigned: '1',
			fields: 'board_id,name',
			expand: 'workflows',
		});
	});

	it('keeps fields it does not know', async () => {
		respond({ data: [{ board_id: 1, brandNew: 'kept' }] });

		await expect(invoke(Boards.list, {})).resolves.toMatchObject({
			data: [{ board_id: 1, brandNew: 'kept' }],
		});
	});

	it.each([
		[{ board_ids: [] }],
		[{ is_archived: true }],
		[{ if_assigned: 2 }],
		[{ expand: ['everything'] }],
		[{ fields: [] }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Boards.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a body that is not a board list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Boards.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('boards.get', () => {
	it('GETs one board', async () => {
		respond({ data: board });

		await expect(invoke(Boards.get, { board_id: 1075 })).resolves.toMatchObject(
			{
				data: { board_id: 1075, name: 'Product delivery' },
			},
		);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/boards/1075',
		});
	});

	it('surfaces a board that is not there, with its code', async () => {
		respond(boardNotFound, 404);

		await expect(
			invoke(Boards.get, { board_id: 12049702 }),
		).rejects.toMatchObject({
			status: 404,
			body: { error: { code: 'B001', reference: 'GE-B001' } },
			message:
				"Businessmap 404 B001: A board with id 1'204'9702 does not exist. (reference GE-B001)",
		});
	});

	it.each([
		[{}],
		[{ board_id: 0 }],
		[{ board_id: '1075' }],
		[{ board_id: 1.5 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Boards.get, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('boards.create', () => {
	it('POSTs the workspace, name and type', async () => {
		respond({ data: board });

		await expect(
			invoke(Boards.create, {
				workspace_id: 3,
				name: 'Product delivery',
				description: 'Everything the team ships',
				type: 1,
			}),
		).resolves.toMatchObject({ data: { board_id: 1075 } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/boards',
			body: {
				workspace_id: 3,
				name: 'Product delivery',
				description: 'Everything the team ships',
				type: 1,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	it('sends only the required fields when that is all it is given', async () => {
		respond({ data: board });

		await invoke(Boards.create, { workspace_id: 3, name: 'Ops' });

		expect(lastRequest().body).toEqual({ workspace_id: 3, name: 'Ops' });
	});

	it.each([
		[{ name: 'No workspace' }],
		[{ workspace_id: 3 }],
		[{ workspace_id: 3, name: '' }],
		[{ workspace_id: 3, name: 'x'.repeat(101) }],
		[{ workspace_id: 3, name: 'Ok', type: 3 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Boards.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('boards.update', () => {
	it('PATCHes only the fields the caller changed', async () => {
		respond({ data: { ...board, name: 'Delivery' } });

		await invoke(Boards.update, { board_id: 1075, name: 'Delivery' });

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/boards/1075',
			body: { name: 'Delivery' },
		});
	});

	it('archives a board with the flag as 1', async () => {
		respond({ data: { ...board, is_archived: 1 } });

		await invoke(Boards.update, { board_id: 1075, is_archived: 1 });

		expect(lastRequest().body).toEqual({ is_archived: 1 });
	});

	it.each([
		[{ board_id: 1075 }],
		[{ board_id: 1075, name: '' }],
		[{ board_id: 1075, is_archived: true }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Boards.update, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('boards.delete', () => {
	it('DELETEs the board and reports it is gone', async () => {
		respondEmpty(204);

		await expect(invoke(Boards.remove, { board_id: 1075 })).resolves.toEqual({
			success: true,
		});
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/boards/1075',
			body: undefined,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kanbanize.boards.delete',
			{ boardId: 1075 },
			'completed',
		);
	});

	it('throws on a delete that failed rather than reporting success', async () => {
		respond(boardNotFound, 404);

		await expect(invoke(Boards.remove, { board_id: 1 })).rejects.toMatchObject({
			status: 404,
			body: { error: { code: 'B001' } },
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('workflows', () => {
	it('lists the workflows on a board', async () => {
		respond(workflows);

		await expect(
			invoke(Workflows.list, { board_id: 1075 }),
		).resolves.toMatchObject({
			data: [{ workflow_id: 1695 }],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/boards/1075/workflows',
		});
	});

	it('gets one workflow', async () => {
		respond({ data: workflow });

		await expect(
			invoke(Workflows.get, { board_id: 1075, workflow_id: 1695 }),
		).resolves.toMatchObject({ data: { workflow_id: 1695 } });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/boards/1075/workflows/1695',
		});
	});

	it('creates a workflow of a given type', async () => {
		respond({ data: workflow });

		await invoke(Workflows.create, {
			board_id: 1075,
			type: 0,
			name: 'Software development',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/boards/1075/workflows',
			body: { type: 0, name: 'Software development' },
		});
	});

	it('updates a workflow', async () => {
		respond({ data: { ...workflow, name: 'Delivery' } });

		await invoke(Workflows.update, {
			board_id: 1075,
			workflow_id: 1695,
			name: 'Delivery',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/boards/1075/workflows/1695',
			body: { name: 'Delivery' },
		});
	});

	it('deletes a workflow and reports it is gone', async () => {
		respondEmpty(204);

		await expect(
			invoke(Workflows.remove, { board_id: 1075, workflow_id: 1695 }),
		).resolves.toEqual({ success: true });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/boards/1075/workflows/1695',
		});
	});

	it.each([
		[{ board_id: 1075 }],
		[{ board_id: 1075, type: 3 }],
		[{ board_id: 1075, workflow_id: 1695 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Workflows.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('columns', () => {
	it('lists the columns on a board', async () => {
		respond(columns);

		await expect(
			invoke(Columns.list, { board_id: 1075 }),
		).resolves.toMatchObject({
			data: [{ column_id: 15876, section: 3 }],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/boards/1075/columns',
		});
	});

	it('sends the fields as one comma-joined value with the column ID', async () => {
		respond({ data: [{ column_id: 15876, name: 'In progress' }] });

		await invoke(Columns.list, { board_id: 1075, fields: ['name', 'limit'] });

		const url = new URL(
			(fetchMock.mock.calls.at(-1) as [string, RequestInit])[0],
		);
		expect(url.searchParams.getAll('fields')).toEqual(['column_id,name,limit']);
	});

	it('gets one column', async () => {
		respond({ data: column });

		await expect(
			invoke(Columns.get, { board_id: 1075, column_id: 15876 }),
		).resolves.toMatchObject({ data: { column_id: 15876 } });
	});

	it('creates a main column with its workflow and section', async () => {
		respond({ data: column });

		await invoke(Columns.create, {
			board_id: 1075,
			name: 'In progress',
			position: 1,
			workflow_id: 1695,
			section: 3,
		});

		expect(lastRequest().body).toEqual({
			name: 'In progress',
			position: 1,
			workflow_id: 1695,
			section: 3,
		});
	});

	it('creates a subcolumn under a parent, with no section', async () => {
		respond({ data: column });

		await invoke(Columns.create, {
			board_id: 1075,
			name: 'Review',
			position: 0,
			parent_column_id: 15876,
		});

		expect(lastRequest().body).toEqual({
			name: 'Review',
			position: 0,
			parent_column_id: 15876,
		});
	});

	it('updates a column', async () => {
		respond({ data: { ...column, limit: 8 } });

		await invoke(Columns.update, {
			board_id: 1075,
			column_id: 15876,
			limit: 8,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/boards/1075/columns/15876',
			body: { limit: 8 },
		});
	});

	it('deletes a column', async () => {
		respondEmpty(204);

		await expect(
			invoke(Columns.remove, { board_id: 1075, column_id: 15876 }),
		).resolves.toEqual({ success: true });
	});

	it.each([
		[{ board_id: 1075, name: 'x', position: 0 }],
		[
			{
				board_id: 1075,
				name: 'x',
				position: 0,
				workflow_id: 1695,
				section: 3,
				parent_column_id: 15876,
			},
		],
		[{ board_id: 1075, name: 'x', position: 0, workflow_id: 1695 }],
		[
			{
				board_id: 1075,
				name: 'x',
				position: 0,
				parent_column_id: 15876,
				section: 3,
			},
		],
		[{ board_id: 1075, name: 'x', position: 0, workflow_id: 1695, section: 5 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Columns.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('lanes', () => {
	it('lists the lanes on a board', async () => {
		respond(lanes);

		await expect(invoke(Lanes.list, { board_id: 1075 })).resolves.toMatchObject(
			{
				data: [{ lane_id: 9838 }],
			},
		);
	});

	it('gets one lane', async () => {
		respond({ data: lane });

		await expect(
			invoke(Lanes.get, { board_id: 1075, lane_id: 9838 }),
		).resolves.toMatchObject({ data: { lane_id: 9838 } });
	});

	it('creates a lane on a workflow', async () => {
		respond({ data: lane });

		await invoke(Lanes.create, {
			board_id: 1075,
			name: 'Expedite',
			position: 0,
			workflow_id: 1695,
		});

		expect(lastRequest().body).toEqual({
			name: 'Expedite',
			position: 0,
			workflow_id: 1695,
		});
	});

	it('creates a nested lane under a parent', async () => {
		respond({ data: lane });

		await invoke(Lanes.create, {
			board_id: 1075,
			name: 'Emergency',
			position: 0,
			parent_lane_id: 9838,
		});

		expect(lastRequest().body).toEqual({
			name: 'Emergency',
			position: 0,
			parent_lane_id: 9838,
		});
	});

	it('updates a lane', async () => {
		respond({ data: { ...lane, name: 'Urgent' } });

		await invoke(Lanes.update, {
			board_id: 1075,
			lane_id: 9838,
			name: 'Urgent',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/boards/1075/lanes/9838',
			body: { name: 'Urgent' },
		});
	});

	it('deletes a lane', async () => {
		respondEmpty(204);

		await expect(
			invoke(Lanes.remove, { board_id: 1075, lane_id: 9838 }),
		).resolves.toEqual({ success: true });
	});

	it.each([
		[{ board_id: 1075, name: 'x', position: 0 }],
		[
			{
				board_id: 1075,
				name: 'x',
				position: 0,
				workflow_id: 1695,
				parent_lane_id: 9838,
			},
		],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Lanes.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cards.list', () => {
	it('GETs the first page and offers the next one', async () => {
		respond({
			data: {
				pagination: { all_pages: 3, current_page: 1, results_per_page: 200 },
				data: [card],
			},
		});

		const result = (await invoke(Cards.list, {})) as {
			data: { data: typeof cards.data.data };
			next_page: number | null;
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/cards',
		});
		expect(result.data.data).toHaveLength(1);
		expect(result.next_page).toBe(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kanbanize.cards.list',
			{ count: 1, totalPages: 3 },
			'completed',
		);
	});

	it('reports no next page on the last one', async () => {
		respond(cards);

		await expect(invoke(Cards.list, {})).resolves.toMatchObject({
			next_page: null,
		});
	});

	it('sends every filter the caller asked for', async () => {
		respond(cards);

		await invoke(Cards.list, {
			card_ids: [539522, 539523],
			board_ids: [1075],
			workflow_ids: [1695],
			state: 'archived',
			column_ids: [15876],
			lane_ids: [9838],
			owner_user_ids: [12],
			type_ids: [4],
			custom_ids: ['ACME-42'],
			is_blocked: 0,
			priorities: [2],
			sizes: [3],
			colors: ['34a97b'],
			created_from_date: '2026-11-01',
			created_to_date: '2026-11-12',
			page: 2,
			per_page: 50,
			fields: ['card_id', 'title'],
			expand: ['custom_fields', 'subtasks'],
		});

		expect(lastRequest().query).toEqual({
			card_ids: '539522,539523',
			board_ids: '1075',
			workflow_ids: '1695',
			state: 'archived',
			column_ids: '15876',
			lane_ids: '9838',
			owner_user_ids: '12',
			type_ids: '4',
			custom_ids: 'ACME-42',
			is_blocked: '0',
			priorities: '2',
			sizes: '3',
			colors: '34a97b',
			created_from_date: '2026-11-01',
			created_to_date: '2026-11-12',
			page: '2',
			per_page: '50',
			fields: 'card_id,title',
			expand: 'custom_fields,subtasks',
		});
	});

	it('offers the next page from a full page when the API omits pagination', async () => {
		respond({
			data: {
				data: Array.from({ length: 2 }, (_, index) => ({
					...card,
					card_id: index,
				})),
			},
		});

		await expect(
			invoke(Cards.list, { page: 4, per_page: 2 }),
		).resolves.toMatchObject({ next_page: 5 });
	});

	it('uses the documented 200 card page to judge a full page', async () => {
		respond({
			data: {
				data: Array.from({ length: 200 }, (_, index) => ({
					...card,
					card_id: index,
				})),
			},
		});

		await expect(invoke(Cards.list, {})).resolves.toMatchObject({
			next_page: 2,
		});
	});

	it('keeps the expanded objects it does not type', async () => {
		respond({
			data: {
				pagination: { all_pages: 1, current_page: 1, results_per_page: 200 },
				data: [
					{
						...card,
						custom_fields: [{ field_id: 638, value: 50 }],
						somethingNew: 'kept',
					},
				],
			},
		});

		await expect(
			invoke(Cards.list, { expand: ['custom_fields'] }),
		).resolves.toMatchObject({
			data: {
				data: [
					{
						custom_fields: [{ field_id: 638, value: 50 }],
						somethingNew: 'kept',
					},
				],
			},
		});
	});

	it.each([
		[{ card_ids: [] }],
		[{ state: 'done' }],
		[{ is_blocked: true }],
		[{ per_page: 0 }],
		[{ per_page: 1001 }],
		[{ page: 0 }],
		[{ expand: ['everything'] }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Cards.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cards.get', () => {
	it('GETs one card', async () => {
		respond({ data: card });

		await expect(invoke(Cards.get, { card_id: 539522 })).resolves.toMatchObject(
			{
				data: { card_id: 539522, custom_id: 'ACME-42' },
			},
		);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/cards/539522',
		});
	});
});

describe('cards.create', () => {
	it('POSTs the card fields Businessmap accepts', async () => {
		respond({ data: card });

		await expect(
			invoke(Cards.create, {
				title: 'Ship the pricing page',
				description: 'Needs the new plan table.',
				column_id: 15876,
				lane_id: 9838,
				owner_user_id: 12,
				priority: 2,
				size: 3,
				deadline: '2026-12-01T17:00:00+00:00',
				tag_ids_to_add: [31, 32],
				custom_fields_to_add_or_update: [{ field_id: 638, value: 50 }],
				subtasks_to_add: [{ description: 'Get the plan table' }],
			}),
		).resolves.toMatchObject({ data: { card_id: 539522 } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/cards',
			body: {
				title: 'Ship the pricing page',
				description: 'Needs the new plan table.',
				column_id: 15876,
				lane_id: 9838,
				owner_user_id: 12,
				priority: 2,
				size: 3,
				deadline: '2026-12-01T17:00:00+00:00',
				tag_ids_to_add: [31, 32],
				custom_fields_to_add_or_update: [{ field_id: 638, value: 50 }],
				subtasks_to_add: [{ description: 'Get the plan table' }],
			},
		});
	});

	it('sends only the title and location when that is all it is given', async () => {
		respond({ data: [card] });

		await invoke(Cards.create, {
			title: 'Fix the invoice PDF',
			column_id: 15876,
			lane_id: 9838,
		});

		expect(lastRequest().body).toEqual({
			title: 'Fix the invoice PDF',
			column_id: 15876,
			lane_id: 9838,
		});
	});

	it.each([
		[{ title: 'No place', lane_id: 9838 }],
		[{ title: 'No place', column_id: 15876 }],
		[{ title: 'No place' }],
	])(
		'rejects a card with no column or lane before calling Businessmap: %j',
		async (input) => {
			await expect(invoke(Cards.create, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('creates a card from a template', async () => {
		respond({ data: card });

		await invoke(Cards.create, {
			title: 'Weekly release',
			template_id: 91,
			column_id: 15876,
			lane_id: 9838,
		});

		expect(lastRequest().body).toEqual({
			title: 'Weekly release',
			template_id: 91,
			column_id: 15876,
			lane_id: 9838,
		});
	});

	it.each([
		[{}],
		[{ title: '' }],
		[{ title: 'x', priority: 5 }],
		[{ title: 'x', column_id: 0 }],
		[{ title: 'x', custom_fields_to_add_or_update: [] }],
		[{ title: 'x', subtasks_to_add: [{ description: '' }] }],
		[{ title: 'x', watch: true }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Cards.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cards.update', () => {
	it('PATCHes the changed fields', async () => {
		respond({ data: { ...card, column_id: 15877 } });

		await invoke(Cards.update, {
			card_id: 539522,
			column_id: 15877,
			priority: 1,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/cards/539522',
			body: { column_id: 15877, priority: 1 },
		});
	});

	it('clears the owner and deadline with null', async () => {
		respond({ data: card });

		await invoke(Cards.update, {
			card_id: 539522,
			owner_user_id: null,
			deadline: null,
			size: null,
			type_id: null,
			custom_id: null,
		});

		expect(lastRequest().body).toEqual({
			owner_user_id: null,
			deadline: null,
			size: null,
			type_id: null,
			custom_id: null,
		});
	});

	it('selects a dropdown option without a scalar value', async () => {
		respond({ data: card });

		await invoke(Cards.update, {
			card_id: 539522,
			custom_fields_to_add_or_update: [
				{ field_id: 8, selected_values_to_add_or_update: [{ value_id: 2 }] },
			],
		});

		expect(lastRequest().body).toEqual({
			custom_fields_to_add_or_update: [
				{ field_id: 8, selected_values_to_add_or_update: [{ value_id: 2 }] },
			],
		});
	});

	it('refuses a custom field entry that changes nothing', async () => {
		await expect(
			invoke(Cards.update, {
				card_id: 539522,
				custom_fields_to_add_or_update: [{ field_id: 8 }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('archives a card with the flag as 1', async () => {
		respond({ data: { ...card, section: 5 } });

		await invoke(Cards.update, { card_id: 539522, is_archived: 1 });

		expect(lastRequest().body).toEqual({ is_archived: 1 });
	});

	it('adds and removes tags in one body', async () => {
		respond({ data: card });

		await invoke(Cards.update, {
			card_id: 539522,
			tag_ids_to_add: [33],
			tag_ids_to_remove: [31],
		});

		expect(lastRequest().body).toEqual({
			tag_ids_to_add: [33],
			tag_ids_to_remove: [31],
		});
	});

	it('surfaces a column whose WIP limit refuses the move', async () => {
		respond(limitExceeded, 409);

		await expect(
			invoke(Cards.update, { card_id: 539522, column_id: 15877 }),
		).rejects.toMatchObject({
			status: 409,
			body: { error: { code: 'L001' } },
		});
	});

	it.each([
		[{ card_id: 539522 }],
		[{ card_id: 539522, priority: 0 }],
		[{ card_id: 539522, is_archived: 2 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Cards.update, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cards.delete', () => {
	it('DELETEs the card', async () => {
		respondEmpty(204);

		await expect(invoke(Cards.remove, { card_id: 539522 })).resolves.toEqual({
			success: true,
		});
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/cards/539522',
		});
	});

	it('sends the exceeding reason when the board is at its limit', async () => {
		respondEmpty(204);

		await invoke(Cards.remove, {
			card_id: 539522,
			exceeding_reason: 'Cleaning out the archive column',
		});

		expect(lastRequest().query).toEqual({
			exceeding_reason: 'Cleaning out the archive column',
		});
	});
});

describe('comments', () => {
	it('lists the comments on a card', async () => {
		respond(comments);

		await expect(
			invoke(Comments.list, { card_id: 539522 }),
		).resolves.toMatchObject({ data: [{ comment_id: 91001 }] });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/cards/539522/comments',
		});
	});

	it('adds a comment and never logs its text', async () => {
		respond({ data: comment });

		await invoke(Comments.create, {
			card_id: 539522,
			text: 'Blocked on the plan table copy.',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/cards/539522/comments',
			body: { text: 'Blocked on the plan table copy.' },
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('Blocked');
	});

	it('rejects an empty comment before calling Businessmap', async () => {
		await expect(
			invoke(Comments.create, { card_id: 539522, text: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('subtasks', () => {
	it('lists the subtasks of a card', async () => {
		respond(subtasks);

		await expect(
			invoke(Subtasks.list, { card_id: 539522 }),
		).resolves.toMatchObject({ data: [{ subtask_id: 4401 }] });
	});

	it('adds a subtask with an owner and a deadline', async () => {
		respond({ data: subtask });

		await invoke(Subtasks.create, {
			card_id: 539522,
			description: 'Get the plan table from finance',
			owner_user_id: 12,
			deadline: '2026-11-20T17:00:00+00:00',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/cards/539522/subtasks',
			body: {
				description: 'Get the plan table from finance',
				owner_user_id: 12,
				deadline: '2026-11-20T17:00:00+00:00',
			},
		});
	});

	it('marks a subtask finished', async () => {
		respond({ data: { ...subtask, finished_at: '2026-11-12T10:00:00+00:00' } });

		await invoke(Subtasks.update, {
			card_id: 539522,
			subtask_id: 4401,
			is_finished: 1,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/cards/539522/subtasks/4401',
			body: { is_finished: 1 },
		});
	});

	it('deletes a subtask', async () => {
		respondEmpty(204);

		await expect(
			invoke(Subtasks.remove, { card_id: 539522, subtask_id: 4401 }),
		).resolves.toEqual({ success: true });
	});

	it.each([[{ card_id: 539522 }], [{ card_id: 539522, subtask_id: 4401 }]])(
		'rejects %j before calling Businessmap',
		async (input) => {
			await expect(invoke(Subtasks.create, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('tags.list', () => {
	it('GETs every tag on the account', async () => {
		respond(tags);

		const result = (await invoke(Tags.list, {})) as { data: typeof tags.data };
		expect(result.data[0]?.label).toBe('pricing');
		expect(result.data.map(({ tag_id }) => tag_id)).toEqual([31, 32]);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/tags',
		});
	});
});

describe('users.list', () => {
	it('GETs the users, optionally with only some fields', async () => {
		respond(users);

		await invoke(Account.users, { fields: ['user_id', 'email'] });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/users',
			query: { fields: 'user_id,email' },
		});
	});
});

describe('me.get', () => {
	it('GETs the key’s own user', async () => {
		respond(me);

		await expect(invoke(Account.me, {})).resolves.toMatchObject({
			data: { user_id: 12, username: 'praman' },
		});
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/api/v2/me' });
	});
});

describe('limits.get', () => {
	it('GETs the hourly and minutely ceilings', async () => {
		respond(limits);

		await expect(invoke(Account.limits, {})).resolves.toEqual(limits);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/apiLimits',
		});
	});
});

describe('webhooks', () => {
	it('lists the registered webhooks', async () => {
		respond(webhooks);

		await expect(invoke(Webhooks.list, {})).resolves.toMatchObject({
			data: [{ webhook_id: 77, board_id: 1075 }],
		});
	});

	it('registers a URL for a board', async () => {
		respond({ data: webhook });

		await invoke(Webhooks.create, {
			url: 'https://corsair.example/hooks/kanbanize',
			board_id: 1075,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/webhooks',
			body: { url: 'https://corsair.example/hooks/kanbanize', board_id: 1075 },
		});
	});

	it('disables a webhook', async () => {
		respond({ data: { ...webhook, is_enabled: 0 } });

		await invoke(Webhooks.update, { webhook_id: 77, is_enabled: 0 });

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/webhooks/77',
			body: { is_enabled: 0 },
		});
	});

	it('deletes a webhook', async () => {
		respondEmpty(204);

		await expect(invoke(Webhooks.remove, { webhook_id: 77 })).resolves.toEqual({
			success: true,
		});
	});

	it.each([
		[{ board_id: 1075 }],
		[{ url: 'not a url', board_id: 1075 }],
		[{ url: 'https://example.test/h', board_id: 0 }],
	])('rejects %j before calling Businessmap', async (input) => {
		await expect(invoke(Webhooks.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('the account subdomain', () => {
	it('falls back to the stored credential when no option is set', async () => {
		respond(boards);

		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_subdomain: jest.fn().mockResolvedValue('stored-co') },
		};
		await (Boards.list as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().host).toBe('stored-co.kanbanize.com');
	});

	it('fails before a request when no subdomain is known', async () => {
		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_subdomain: jest.fn().mockResolvedValue(null) },
		};

		const error = await caught(
			(Boards.list as never as AnyEndpoint)(ctx as never, {} as never),
		);

		expect(error).toBeInstanceOf(KanbanizeAPIError);
		expect(String(error)).toContain('subdomain');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		'attacker.example/',
		'evil.com#',
		'user@evil.com',
		'a.b',
		'acme:8080',
		'-acme',
	])(
		'refuses %s as a subdomain, so the key never leaves for another host',
		async (bad) => {
			const ctx = {
				key: API_KEY,
				options: {},
				keys: { get_subdomain: jest.fn().mockResolvedValue(bad) },
			};

			const error = await caught(
				(Boards.list as never as AnyEndpoint)(ctx as never, {} as never),
			);

			expect(error).toBeInstanceOf(KanbanizeAPIError);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('error envelopes', () => {
	it('reads the message and code from an invalid key', async () => {
		respond(invalidKey, 401);

		await expect(invoke(Boards.list, {})).rejects.toMatchObject({
			status: 401,
			body: { error: { code: 'A001' } },
			message: 'Businessmap 401 A001: Invalid API Key.',
			request: { method: 'GET' },
		});
	});

	it('reads the key as an auth error when it names A001', async () => {
		respond(notLoggedIn, 401);

		const error = await caught(invoke(Boards.list, {}));

		expect(kanbanizeErrorCode(error)).toBe('A002');
		expect(isKanbanizeAuthError(error)).toBe(true);
	});

	it('keeps the reference when the body carries one', async () => {
		respond(notLoggedIn, 401);

		await expect(invoke(Boards.list, {})).rejects.toMatchObject({
			body: { error: { reference: 'GE-A002' } },
		});
	});

	it('turns the body’s retry_after seconds into milliseconds', async () => {
		respond(minutelyLimit, 429);

		const error = await caught(invoke(Boards.list, {}));

		expect(error).toMatchObject({ status: 429, retryAfter: 58_000 });
		expect(kanbanizeErrorCode(error)).toBe('RL02');
		expect(isKanbanizeRateLimit(error)).toBe(true);
	});

	it('treats a 429 with no body code as a rate limit', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));

		const error = await caught(invoke(Boards.list, {}));

		expect(error).toMatchObject({ status: 429 });
		expect(isKanbanizeRateLimit(error)).toBe(true);
	});

	it('surfaces an invalid field with the value it rejected', async () => {
		respond(invalidField, 400);

		await expect(
			invoke(Cards.create, {
				title: 'x',
				column_id: 15876,
				lane_id: 9838,
				priority: 1,
			}),
		).rejects.toMatchObject({
			status: 400,
			body: { error: { code: 'V001' } },
		});
	});

	it('keeps the key out of the error', async () => {
		respond(notLoggedIn, 401);

		const error = await caught(invoke(Boards.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps neither the card body it sent nor the echoed reply anywhere on the error', async () => {
		respond(
			{
				error: {
					code: 'V001',
					message: 'Invalid field.',
					details: { description: 'secret plan table' },
				},
			},
			400,
		);

		const error = await caught(
			invoke(Cards.create, {
				title: 'x',
				column_id: 1,
				lane_id: 2,
				description: 'secret plan table',
			}),
		);

		expect(error).toMatchObject({
			status: 400,
			body: { error: { code: 'V001' } },
			request: { method: 'POST' },
		});
		expect((error as Error).cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('secret plan table');
		expect(String(error)).not.toContain('secret plan table');
	});

	// cards.delete sends the caller's exceeding_reason as a query value, so the
	// error drops the query and the URL's query string.
	it('keeps the exceeding_reason query text off a failed card delete', async () => {
		respond({ error: { code: 'V001', message: 'Invalid field.' } }, 400);

		const error = await caught(
			invoke(Cards.remove, {
				card_id: 7,
				exceeding_reason: 'acme renewal for jane doe',
			}),
		);

		expect(error).toMatchObject({ status: 400, request: { method: 'DELETE' } });
		const { url, request } = error as { url: string; request: object };
		expect(url).not.toContain('?');
		expect(JSON.stringify(request)).not.toContain('acme renewal');
		expect(JSON.stringify(error)).not.toContain('acme renewal');
		expect(String(error)).not.toContain('acme renewal');
	});
});

// The single-resource reads and updates leave the record's own ID out, and the
// card writes answer with an array: the shapes below are copied from the
// OpenAPI document's 200 responses.
describe('responses shaped as the OpenAPI document gives them', () => {
	const { board_id: _b, ...boardBody } = board;
	const { workflow_id: _w, ...workflowBody } = workflow;
	const { column_id: _c, ...columnBody } = column;
	const { lane_id: _l, ...laneBody } = lane;
	const { webhook_id: _h, ...webhookBody } = webhook;

	it.each([
		['boards.get', Boards.get, { board_id: 1075 }, boardBody, 'board_id', 1075],
		[
			'boards.update',
			Boards.update,
			{ board_id: 1075, name: 'Delivery' },
			boardBody,
			'board_id',
			1075,
		],
		[
			'workflows.get',
			Workflows.get,
			{ board_id: 1075, workflow_id: 1695 },
			workflowBody,
			'workflow_id',
			1695,
		],
		[
			'workflows.update',
			Workflows.update,
			{ board_id: 1075, workflow_id: 1695, name: 'Dev' },
			workflowBody,
			'workflow_id',
			1695,
		],
		[
			'columns.get',
			Columns.get,
			{ board_id: 1075, column_id: 15876 },
			columnBody,
			'column_id',
			15876,
		],
		[
			'columns.update',
			Columns.update,
			{ board_id: 1075, column_id: 15876, limit: 3 },
			columnBody,
			'column_id',
			15876,
		],
		[
			'lanes.get',
			Lanes.get,
			{ board_id: 1075, lane_id: 9838 },
			laneBody,
			'lane_id',
			9838,
		],
		[
			'lanes.update',
			Lanes.update,
			{ board_id: 1075, lane_id: 9838, name: 'Fast' },
			laneBody,
			'lane_id',
			9838,
		],
		[
			'webhooks.update',
			Webhooks.update,
			{ webhook_id: 77, is_enabled: 0 },
			webhookBody,
			'webhook_id',
			77,
		],
	] as const)(
		'%s accepts a record without its ID and returns the ID asked about',
		async (_name, endpoint, input, body, key, id) => {
			respond({ data: body });

			await expect(invoke(endpoint, input)).resolves.toMatchObject({
				data: { [key]: id },
			});
		},
	);

	it('cards.create returns the one card from the array Businessmap sends', async () => {
		respond({ data: [card] });

		await expect(
			invoke(Cards.create, { title: 'x', column_id: 15876, lane_id: 9838 }),
		).resolves.toMatchObject({ data: { card_id: 539522 } });
	});

	it('cards.update returns the one card from the array Businessmap sends', async () => {
		respond({ data: [{ ...card, title: 'Renamed' }] });

		await expect(
			invoke(Cards.update, { card_id: 539522, title: 'Renamed' }),
		).resolves.toMatchObject({ data: { card_id: 539522, title: 'Renamed' } });
	});

	it('cards.get reads the reporter and the block reason as objects', async () => {
		respond({
			data: {
				...card,
				is_blocked: 1,
				reporter: { type: 'external', value: 'client@acme.example' },
				block_reason: {
					block_type: 1,
					reason_id: 3,
					comment: 'Waiting on legal',
				},
			},
		});

		await expect(invoke(Cards.get, { card_id: 539522 })).resolves.toMatchObject(
			{
				data: {
					reporter: { type: 'external' },
					block_reason: { reason_id: 3 },
				},
			},
		);
	});

	it('subtasks.update accepts the 204 Businessmap sends when the result is not readable', async () => {
		respondEmpty(204);

		await expect(
			invoke(Subtasks.update, {
				card_id: 539522,
				subtask_id: 4401,
				is_finished: 1,
			}),
		).resolves.toEqual({ data: { subtask_id: 4401 } });
	});
});

describe('fields projections keep the record IDs', () => {
	it.each([
		['boards.list', Boards.list, { fields: ['name'] }, 'board_id,name'],
		['users.list', Account.users, { fields: ['email'] }, 'user_id,email'],
		[
			'cards.list',
			Cards.list,
			{ fields: ['title', 'card_id'] },
			'title,card_id',
		],
	] as const)(
		'%s asks for the ID with the named fields',
		async (_name, endpoint, input, sent) => {
			respond(
				endpoint === Cards.list
					? cards
					: endpoint === Boards.list
						? boards
						: users,
			);

			await invoke(endpoint, input);

			expect(lastRequest().query.fields).toBe(sent);
		},
	);
});

describe('cards.list with no body', () => {
	it('throws rather than reporting an empty last page', async () => {
		respondEmpty(200);

		await expect(invoke(Cards.list, {})).rejects.toThrow();
	});
});

describe('webhooks.create', () => {
	it('returns the signing secret as a string and keeps it out of the event log', async () => {
		respond({ data: { ...webhook, secret: 'whsec-test-value' } });

		const result = await invoke(Webhooks.create, {
			url: 'https://corsair.example/hooks/kanbanize',
			board_id: 1075,
		});

		const typed: string | null | undefined = (
			result as Awaited<ReturnType<typeof Webhooks.create>>
		).data.secret;
		expect(typed).toBe('whsec-test-value');
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'whsec-test-value',
		);
	});
});
