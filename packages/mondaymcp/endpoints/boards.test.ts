import { MondayMcpAPIError } from '../client';
import type { MondayMcpContext } from '../index';
import { boardsCreate, boardsGetInfo, boardsGetItemsPage } from './boards';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// The shared HTTP boundary of this plugin is the client's fetch transport: the
// three-request MCP session handshake (initialize, notifications/initialized,
// tools/call) runs against https://mcp.monday.com/mcp.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

function rpcResult(id: number, result: unknown): unknown {
	return { jsonrpc: '2.0', id, result };
}

// Queue the standard session handshake: initialize assigns a session, the
// initialized notification answers 202 with an empty body.
function stubSession(): void {
	fetchMock.mockImplementationOnce(() =>
		Promise.resolve(
			jsonResponse(rpcResult(1, { protocolVersion: '2025-06-18' }), {
				'mcp-session-id': 'sess-123',
			}),
		),
	);
	fetchMock.mockImplementationOnce(() =>
		Promise.resolve(new Response(null, { status: 202 })),
	);
}

function stubToolResult(result: unknown): void {
	fetchMock.mockImplementationOnce(() =>
		Promise.resolve(jsonResponse(rpcResult(2, result))),
	);
}

const mockCtx = { key: 'mcp-token-test' } as never as MondayMcpContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('boards family (mocked MCP transport)', () => {
	it('boards.create runs the session handshake and calls create_board', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"id": "18412502536"}' }],
		});

		const result = await boardsCreate(mockCtx, {
			boardName: 'MCP Docs Test Board',
			boardKind: 'public',
			workspaceId: '12406666',
		});

		expect(fetchMock).toHaveBeenCalledTimes(3);

		const [initCall, notifyCall, callCall] = fetchMock.mock.calls;
		expect(initCall?.[0]).toBe('https://mcp.monday.com/mcp');
		expect(initCall?.[1]).toMatchObject({ method: 'POST' });
		const initBody = JSON.parse(String(initCall?.[1]?.body) ?? '{}') as {
			method: string;
			params: Record<string, unknown>;
		};
		expect(initBody.method).toBe('initialize');
		expect(initBody.params.protocolVersion).toBe('2025-06-18');
		expect(initCall?.[1]?.headers).toMatchObject({
			Authorization: 'Bearer mcp-token-test',
		});

		const notifyHeaders = notifyCall?.[1]?.headers as Record<string, string>;
		expect(notifyHeaders?.['mcp-session-id']).toBe('sess-123');
		expect(notifyHeaders?.['mcp-protocol-version']).toBe('2025-06-18');

		const callBody = JSON.parse(String(callCall?.[1]?.body) ?? '{}') as {
			method: string;
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.method).toBe('tools/call');
		expect(callBody.params.name).toBe('create_board');
		expect(callBody.params.arguments).toEqual({
			boardName: 'MCP Docs Test Board',
			boardKind: 'public',
			workspaceId: '12406666',
		});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"id": "18412502536"}' }],
		});
	});

	it('boards.getItemsPage forwards pagination arguments to the tool', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '[]' }] });

		await boardsGetItemsPage(mockCtx, {
			boardId: 18412502536,
			limit: 25,
			cursor: 'page-two-cursor',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_board_items_page');
		expect(callBody.params.arguments).toEqual({
			boardId: 18412502536,
			limit: 25,
			cursor: 'page-two-cursor',
		});
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			boardsCreate(mockCtx, { boardKind: 'public' } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('maps HTTP 429 with Retry-After onto the error', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('rate limited', {
					status: 429,
					headers: { 'retry-after': '7' },
				}),
			),
		);

		let caught: unknown;
		try {
			await boardsGetInfo(mockCtx, { boardId: 18412502536 });
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(MondayMcpAPIError);
		const apiError = caught as MondayMcpAPIError;
		expect(apiError.status).toBe(429);
		expect(apiError.retryAfter).toBe(7000);
	});

	it('does not expose tool text when the result is an MCP tool error', async () => {
		stubSession();
		stubToolResult({
			isError: true,
			content: [{ type: 'text', text: 'Board not found' }],
		});

		await expect(
			boardsGetInfo(mockCtx, { boardId: 18412502536 }),
		).rejects.toThrow('monday MCP tool reported an error');
	});
});

import {
	boardsGetActivity,
	boardsInsights,
	columnsCreate,
	columnsGetTypeInfo,
	groupsCreate,
	itemsChangeColumnValues,
	itemsCreate,
} from './boards';

describe('boards family — per-endpoint coverage', () => {
	it('boardsGetActivity forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 12345,
		};
		const result = await boardsGetActivity(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_board_activity');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('boardsInsights forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 12345,
		};
		const result = await boardsInsights(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('board_insights');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('groupsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 'test-boardId',
			groupName: 'test-groupName',
		};
		const result = await groupsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_group');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('columnsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 12345,
			columnType: 'test-columnType',
			columnTitle: 'test-columnTitle',
		};
		const result = await columnsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_column');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('columnsGetTypeInfo forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			columnType: 'test-columnType',
		};
		const result = await columnsGetTypeInfo(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_column_type_info');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('itemsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 12345,
			name: 'test-name',
			columnValues: 'test-columnValues',
		};
		const result = await itemsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_item');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('itemsChangeColumnValues forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 12345,
			itemId: 12345,
			columnValues: 'test-columnValues',
		};
		const result = await itemsChangeColumnValues(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('change_item_column_values');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});
