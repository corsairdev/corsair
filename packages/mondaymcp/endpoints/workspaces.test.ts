import type { MondayMcpContext } from '../index';
import {
	foldersMoveObject,
	workspacesCreate,
	workspacesList,
} from './workspaces';

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

describe('workspaces & folders family (mocked MCP transport)', () => {
	it('workspaces.create runs the session handshake and calls create_workspace', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"id": "98765432"}' }],
		});

		const result = await workspacesCreate(mockCtx, {
			name: 'MCP Docs Test Workspace',
			workspaceKind: 'open',
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

		const callHeaders = callCall?.[1]?.headers as Record<string, string>;
		expect(callHeaders?.['mcp-session-id']).toBe('sess-123');
		expect(callHeaders?.['mcp-protocol-version']).toBe('2025-06-18');

		const callBody = JSON.parse(String(callCall?.[1]?.body) ?? '{}') as {
			method: string;
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.method).toBe('tools/call');
		expect(callBody.params.name).toBe('create_workspace');
		expect(callBody.params.arguments).toEqual({
			name: 'MCP Docs Test Workspace',
			workspaceKind: 'open',
		});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"id": "98765432"}' }],
		});
	});

	it('workspaces.list forwards pagination arguments to the tool', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '[]' }] });

		await workspacesList(mockCtx, {
			limit: 25,
			page: 2,
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('list_workspaces');
		expect(callBody.params.arguments).toEqual({
			limit: 25,
			page: 2,
		});
	});

	it('folders.moveObject calls move_object with minimal valid input', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{"moved": true}' }] });

		await foldersMoveObject(mockCtx, {
			objectType: 'Board',
			id: '18412502536',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('move_object');
		expect(callBody.params.arguments).toEqual({
			objectType: 'Board',
			id: '18412502536',
		});
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			workspacesCreate(mockCtx, { workspaceKind: 'open' } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

import {
	foldersCreate,
	foldersUpdate,
	workspacesGetInfo,
	workspacesUpdate,
} from './workspaces';

describe('workspaces family — per-endpoint coverage', () => {
	it('workspacesUpdate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			id: 'test-id',
		};
		const result = await workspacesUpdate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_workspace');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('workspacesGetInfo forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			workspace_id: 12345,
		};
		const result = await workspacesGetInfo(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('workspace_info');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('foldersCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			workspaceId: 'test-workspaceId',
			name: 'test-name',
		};
		const result = await foldersCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_folder');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('foldersUpdate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			folderId: 'test-folderId',
		};
		const result = await foldersUpdate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_folder');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});
