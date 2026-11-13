import type { MondayMcpContext } from '../index';
import {
	agentsCatalog,
	agentsManage,
	agentsManageKnowledge,
	agentsManageTriggers,
} from './agents';

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

describe('agents family (mocked MCP transport)', () => {
	it('agents.catalog runs the session handshake and calls agent_catalog', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '[{"id": "skill-1"}]' }],
		});

		const result = await agentsCatalog(mockCtx, { action: 'list_skills' });

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
		expect(callBody.params.name).toBe('agent_catalog');
		expect(callBody.params.arguments).toEqual({ action: 'list_skills' });

		expect(result).toEqual({
			content: [{ type: 'text', text: '[{"id": "skill-1"}]' }],
		});
	});

	it('agents.manage forwards snake_case arguments to the tool', async () => {
		stubSession();
		stubToolResult({
			content: [
				{ type: 'text', text: '{"id": "agent-1", "name": "Support Bot"}' },
			],
		});

		await agentsManage(mockCtx, {
			action: 'get',
			agent_id: 'agent-1',
		});

		expect(fetchMock).toHaveBeenCalledTimes(3);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('manage_agent');
		expect(callBody.params.arguments).toEqual({
			action: 'get',
			agent_id: 'agent-1',
		});
	});

	it('agents.manageTriggers forwards trigger arguments to the tool', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"node_id": "node-9"}' }],
		});

		await agentsManageTriggers(mockCtx, {
			action: 'add',
			agent_id: 'agent-1',
			block_reference_id: 'block-123',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('manage_agent_triggers');
		expect(callBody.params.arguments).toEqual({
			action: 'add',
			agent_id: 'agent-1',
			block_reference_id: 'block-123',
		});
	});

	it('agents.manageKnowledge forwards scope and permission arguments to the tool', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"status": "added"}' }],
		});

		await agentsManageKnowledge(mockCtx, {
			action: 'add',
			agent_id: 'agent-1',
			resource_id: 'board-9',
			scope_type: 'BOARD',
			permission_type: 'READ',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('manage_agent_knowledge');
		expect(callBody.params.arguments).toEqual({
			action: 'add',
			agent_id: 'agent-1',
			resource_id: 'board-9',
			scope_type: 'BOARD',
			permission_type: 'READ',
		});
	});

	it('rejects an invalid scope_type enum value before any fetch', async () => {
		await expect(
			agentsManageKnowledge(mockCtx, {
				action: 'add',
				agent_id: 'agent-1',
				resource_id: 'board-9',
				scope_type: 'ITEM' as never,
				permission_type: 'READ',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

import { agentsManageSkills } from './agents';

describe('agents family — per-endpoint coverage', () => {
	it('agentsManageSkills forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			action: 'create',
		} as const;
		const result = await agentsManageSkills(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('manage_agent_skills');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});
