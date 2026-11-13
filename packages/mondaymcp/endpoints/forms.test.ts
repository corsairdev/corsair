import { logEventFromContext } from 'corsair/core';
import type { MondayMcpContext } from '../index';
import {
	formsCreate,
	formsCreateSubmission,
	formsEditQuestions,
	formsGet,
	formsUpdate,
	usersGetContext,
	usersListAndTeams,
} from './forms';

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

describe('forms and users families (mocked MCP transport)', () => {
	it('forms.create runs the session handshake and calls create_form', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"form_token": "abc123def456"}' }],
		});

		const input = {
			destination_workspace_id: '12406666',
			destination_name: 'MCP Forms Test Board',
			board_kind: 'private',
		};
		const result = await formsCreate(mockCtx, input);

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
		expect(callBody.params.name).toBe('create_form');
		expect(callBody.params.arguments).toEqual({
			destination_workspace_id: '12406666',
			destination_name: 'MCP Forms Test Board',
			board_kind: 'private',
		});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"form_token": "abc123def456"}' }],
		});
	});

	it('forms.get forwards the form token to get_form', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"title": "Feedback Form"}' }],
		});

		await formsGet(mockCtx, { formToken: 'abc123def456' });

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_form');
		expect(callBody.params.arguments).toEqual({ formToken: 'abc123def456' });
	});

	it('forms.update forwards the action and form patch to update_form', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{"success": true}' }] });

		const input = {
			formToken: 'abc123def456',
			action: 'updateFormHeader',
			form: { title: 'Weekly Status Intake' },
		};
		await formsUpdate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('update_form');
		expect(callBody.params.arguments).toEqual(input);
	});

	it('forms.editQuestions forwards minimal input to form_questions_editor', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{"id": "q-1"}' }] });

		await formsEditQuestions(mockCtx, {
			action: 'create',
			formToken: 'abc123def456',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('form_questions_editor');
		expect(callBody.params.arguments).toEqual({
			action: 'create',
			formToken: 'abc123def456',
		});
	});

	it('forms.createSubmission forwards answers to create_form_submission', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"submission_id": "s-1"}' }],
		});

		const input = {
			form_token: 'https://forms.monday.com/forms/abc123def456',
			answers: [{ question_id: 'q-1', text: 'Shreyash' }],
			form_timezone_offset: -120,
		};
		await formsCreateSubmission(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_form_submission');
		expect(callBody.params.arguments).toEqual(input);
	});

	it('users.getContext runs the session handshake and calls get_user_context with empty arguments', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"user": {"id": "9837235"}}' }],
		});

		const result = await usersGetContext(mockCtx, {});

		expect(fetchMock).toHaveBeenCalledTimes(3);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			method: string;
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.method).toBe('tools/call');
		expect(callBody.params.name).toBe('get_user_context');
		expect(callBody.params.arguments).toEqual({});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"user": {"id": "9837235"}}' }],
		});
	});

	it('users.listAndTeams forwards optional userIds and getMe to list_users_and_teams', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"users": [{"id": "9837235"}]}' }],
		});

		await usersListAndTeams(mockCtx, {
			userIds: ['9837235'],
			getMe: false,
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('list_users_and_teams');
		expect(callBody.params.arguments).toEqual({
			userIds: ['9837235'],
			getMe: false,
		});
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			formsCreate(mockCtx, { destination_name: 'Incomplete Form' } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('forms family — event payload safety', () => {
	it('keeps formPassword out of the logged event payload', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });

		await formsUpdate(mockCtx, {
			formToken: 'test-formToken',
			action: 'test-action',
			formPassword: 'hunter2',
		});

		const logged = jest.mocked(logEventFromContext).mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(logged).toBeDefined();
		expect(logged).not.toHaveProperty('formPassword');
		expect(logged).not.toHaveProperty('action');
	});
});
