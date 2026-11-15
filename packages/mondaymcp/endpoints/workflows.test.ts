import type { MondayMcpContext } from '../index';
import {
	automationsCreate,
	automationsList,
	automationsManage,
	workflowsCreate,
	workflowsPlan,
	workflowsUpdate,
} from './workflows';

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

describe('automations & workflows families (mocked MCP transport)', () => {
	it('automations.list runs the session handshake and calls list_automations', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"automations": []}' }],
		});

		const result = await automationsList(mockCtx, {
			boardId: '18412502536',
			limit: 25,
			cursor: 'cursor-page-2',
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
		expect(callBody.params.name).toBe('list_automations');
		expect(callBody.params.arguments).toEqual({
			boardId: '18412502536',
			limit: 25,
			cursor: 'cursor-page-2',
		});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"automations": []}' }],
		});
	});

	it('automations.manage forwards the action and workflowId to manage_automations', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"status": "deactivated"}' }],
		});

		await automationsManage(mockCtx, {
			action: 'deactivate',
			workflowId: 'automation-456',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('manage_automations');
		expect(callBody.params.arguments).toEqual({
			action: 'deactivate',
			workflowId: 'automation-456',
		});
	});

	it('automations.create forwards the prompt and board to create_automation', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{"id": "87265"}' }] });

		await automationsCreate(mockCtx, {
			userPrompt: 'When a status changes to Done, notify the requester',
			boardId: '18412502536',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_automation');
		expect(callBody.params.arguments).toEqual({
			userPrompt: 'When a status changes to Done, notify the requester',
			boardId: '18412502536',
		});
	});

	it('workflows.plan forwards the natural-language prompt to invoke_process_planner', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{"steps": []}' }] });

		await workflowsPlan(mockCtx, {
			prompt:
				'When a deal is marked Won, create a task in the onboarding board and notify the account manager',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('invoke_process_planner');
		expect(callBody.params.arguments).toEqual({
			prompt:
				'When a deal is marked Won, create a task in the onboarding board and notify the account manager',
		});
	});

	it('workflows.create forwards the workspace and visibility to create_workflow', async () => {
		stubSession();
		stubToolResult({
			content: [
				{
					type: 'text',
					text: '{"workflowObjectId": "wf-object-1", "workflowDraftId": "wf-draft-1"}',
				},
			],
		});

		await workflowsCreate(mockCtx, {
			workspaceId: '12406666',
			title: 'Deal Win Onboarding',
			privacyKind: 'PRIVATE',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_workflow');
		expect(callBody.params.arguments).toEqual({
			workspaceId: '12406666',
			title: 'Deal Win Onboarding',
			privacyKind: 'PRIVATE',
		});
	});

	it('workflows.update forwards the object and draft IDs to invoke_workflow_expert', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"workflowDraftId": "wf-draft-2"}' }],
		});

		await workflowsUpdate(mockCtx, {
			workflowObjectId: 12345,
			workflowDraftId: 67890,
			prompt:
				'Add a trigger that fires when an item is created on the Marketing board',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('invoke_workflow_expert');
		expect(callBody.params.arguments).toEqual({
			workflowObjectId: 12345,
			workflowDraftId: 67890,
			prompt:
				'Add a trigger that fires when an item is created on the Marketing board',
		});
	});

	it('workflows.update works on the live version when no draft ID is given', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: 'The workflow has 2 steps.' }],
		});

		await workflowsUpdate(mockCtx, {
			workflowObjectId: 12345,
			prompt: 'What steps does this workflow have?',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.arguments).toEqual({
			workflowObjectId: 12345,
			prompt: 'What steps does this workflow have?',
		});
	});

	it('rejects an invalid automations.manage action before any request', async () => {
		await expect(
			automationsManage(mockCtx, {
				action: 'pause' as never,
				workflowId: 'automation-456',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
