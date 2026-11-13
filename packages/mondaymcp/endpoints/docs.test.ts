import type { MondayMcpContext } from '../index';
import {
	dashboardsAllWidgetsSchema,
	docsCreate,
	docsRead,
	viewsCreateTable,
} from './docs';

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

describe('docs family (mocked MCP transport)', () => {
	it('dashboards.allWidgetsSchema runs the session handshake and calls all_widgets_schema with empty arguments', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"widgets": []}' }],
		});

		const result = await dashboardsAllWidgetsSchema(mockCtx, {});

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
		expect(callBody.params.name).toBe('all_widgets_schema');
		expect(callBody.params.arguments).toEqual({});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"widgets": []}' }],
		});
	});

	it('docs.create forwards validated input to create_doc', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"id": "18412502542"}' }],
		});

		const input = {
			doc_name: 'MCP Docs Test Doc',
			markdown: '# MCP Docs Test Doc',
			location: 'workspace' as const,
			workspace_id: 12406666,
			item_id: 987654,
		};
		const result = await docsCreate(mockCtx, input);

		expect(fetchMock).toHaveBeenCalledTimes(3);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_doc');
		expect(callBody.params.arguments).toEqual(input);

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"id": "18412502542"}' }],
		});
	});

	it('views.createTable forwards minimal input to create_view_table', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"id": "18412502600"}' }],
		});

		await viewsCreateTable(mockCtx, { boardId: '18412502536' });

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_view_table');
		expect(callBody.params.arguments).toEqual({ boardId: '18412502536' });
	});

	it('docs.read forwards query parameters to read_docs', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '[{"id": "18412502542"}]' }],
		});

		const input = {
			mode: 'content',
			type: 'ids',
			ids: ['18412502542'],
		};
		const result = await docsRead(mockCtx, input);

		expect(fetchMock).toHaveBeenCalledTimes(3);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('read_docs');
		expect(callBody.params.arguments).toEqual(input);

		expect(result).toEqual({
			content: [{ type: 'text', text: '[{"id": "18412502542"}]' }],
		});
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			docsCreate(mockCtx, {
				doc_name: 'Incomplete Doc',
				location: 'workspace',
				workspace_id: 12406666,
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

import {
	dashboardsCreate,
	dashboardsCreateWidget,
	docsUpdate,
	viewsCreate,
	viewsUpdate,
	viewsUpdateTable,
} from './docs';

describe('docs family — per-endpoint coverage', () => {
	it('docsUpdate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			doc_id: 'test-doc_id',
			object_id: 'test-object_id',
			operations: ['12345'],
		};
		const result = await docsUpdate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_doc');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('dashboardsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			name: 'test-name',
			workspace_id: 'test-workspace_id',
			board_ids: ['12345'],
		};
		const result = await dashboardsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_dashboard');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('dashboardsCreateWidget forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			parent_container_id: 'test-parent_container_id',
			parent_container_type: 'test-parent_container_type',
			widget_kind: 'test-widget_kind',
			widget_name: 'test-widget_name',
		};
		const result = await dashboardsCreateWidget(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_widget');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('viewsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			boardId: 'test-boardId',
		};
		const result = await viewsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_view');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('viewsUpdate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			viewId: 'test-viewId',
			boardId: 'test-boardId',
		};
		const result = await viewsUpdate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_view');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('viewsUpdateTable forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			viewId: 'test-viewId',
			boardId: 'test-boardId',
		};
		const result = await viewsUpdateTable(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_view_table');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});

describe('docs family — conditional input requirements', () => {
	it.each([
		{ location: 'workspace' as const, workspace_id: 42 },
		{ location: 'item' as const, item_id: 43 },
	])(
		'docsCreate accepts the applicable target for $location',
		async (target) => {
			stubSession();
			stubToolResult({ content: [] });
			const input = { doc_name: 'doc', markdown: 'body', ...target };
			await docsCreate(mockCtx, input);
			const call = JSON.parse(String(fetchMock.mock.calls[2]?.[1]?.body));
			expect(call.params.arguments).toEqual(input);
		},
	);

	it.each(['workspace', 'item'] as const)(
		'docsCreate requires the %s target',
		async (location) => {
			await expect(
				docsCreate(mockCtx, { doc_name: 'doc', markdown: 'body', location }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('docsUpdate accepts a document targeted by doc_id alone', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });

		const result = await docsUpdate(mockCtx, {
			doc_id: '18412502542',
			operations: [{ operation_type: 'replace_content', content: '# hi' }],
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as { params: { name: string; arguments: Record<string, unknown> } };
		expect(callBody.params.name).toBe('update_doc');
		expect(callBody.params.arguments).toEqual({
			doc_id: '18412502542',
			operations: [{ operation_type: 'replace_content', content: '# hi' }],
		});
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('docsRead accepts version_history calls without type', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });

		await docsRead(mockCtx, {
			mode: 'version_history',
			ids: ['18412502542'],
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as { params: { name: string; arguments: Record<string, unknown> } };
		expect(callBody.params.name).toBe('read_docs');
		expect(callBody.params.arguments).toEqual({
			mode: 'version_history',
			ids: ['18412502542'],
		});
	});

	it('docsRead still requires type for content reads', async () => {
		await expect(docsRead(mockCtx, { ids: ['18412502542'] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
