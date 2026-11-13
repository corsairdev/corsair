import type { MondayMcpContext } from '../index';
import {
	apiExecuteQuery,
	apiGetTypeDetails,
	sprintsGetBoards,
	sprintsGetMetadata,
	sprintsGetSummary,
} from './sprints';

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

describe('sprints & api families (mocked MCP transport)', () => {
	it('sprints.getBoards runs the session handshake and calls get_monday_dev_sprints_boards', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '[]' }],
		});

		const result = await sprintsGetBoards(mockCtx, {});

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
		expect(callBody.params.name).toBe('get_monday_dev_sprints_boards');
		expect(callBody.params.arguments).toEqual({});

		expect(result).toEqual({
			content: [{ type: 'text', text: '[]' }],
		});
	});

	it('sprints.getSummary calls get_sprint_summary with the sprint id', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: 'Sprint 24 shipped 42 items.' }],
		});

		await sprintsGetSummary(mockCtx, { sprintId: 18753271 });

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_sprint_summary');
		expect(callBody.params.arguments).toEqual({ sprintId: 18753271 });
	});

	it('api.executeQuery forwards the GraphQL query to all_monday_api', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"data": {"boards": []}}' }],
		});

		await apiExecuteQuery(mockCtx, {
			query: 'query { boards { id name } }',
			variables: '{}',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('all_monday_api');
		expect(callBody.params.arguments).toEqual({
			query: 'query { boards { id name } }',
			variables: '{}',
		});
	});

	it('api.getTypeDetails calls get_type_details with the type name', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"fields": []}' }],
		});

		await apiGetTypeDetails(mockCtx, { typeName: 'Board' });

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_type_details');
		expect(callBody.params.arguments).toEqual({ typeName: 'Board' });
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			sprintsGetMetadata(mockCtx, { limit: 5 } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

import { apiGetGraphqlSchema } from './sprints';

describe('sprints family — per-endpoint coverage', () => {
	it('apiGetGraphqlSchema forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {};
		const result = await apiGetGraphqlSchema(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_graphql_schema');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});
