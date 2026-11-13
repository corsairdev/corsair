import { logEventFromContext } from 'corsair/core';
import type { MondayMcpContext } from '../index';
import {
	assetsGetUploadUrl,
	meetingsGetNotetaker,
	searchQuery,
	updatesCreate,
	updatesList,
} from './updates';

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

describe('updates family (mocked MCP transport)', () => {
	it('forwards search text without logging customer content', async () => {
		stubSession();
		stubToolResult({ content: [] });
		const input = {
			searchType: 'BOARD',
			searchTerm: 'private customer',
			query: 'private query',
			term: 'private term',
			limit: 5,
		};
		await searchQuery(mockCtx, input);
		const call = JSON.parse(String(fetchMock.mock.calls[2]?.[1]?.body));
		expect(call.params.arguments).toEqual(input);
		const payload = jest.mocked(logEventFromContext).mock.calls.at(-1)?.[2];
		expect(payload).toEqual({ limit: 5 });
	});
	it('updates.create runs the session handshake and calls create_update', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"id": "9876543210"}' }],
		});

		const result = await updatesCreate(mockCtx, {
			itemId: 18412502536,
			body: '<p>Weekly status update</p>',
			mentionsList: '[{"id": "48202303", "type": "User"}]',
			parentId: 556677,
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
		expect(callBody.params.name).toBe('create_update');
		expect(callBody.params.arguments).toEqual({
			itemId: 18412502536,
			body: '<p>Weekly status update</p>',
			mentionsList: '[{"id": "48202303", "type": "User"}]',
			parentId: 556677,
		});

		expect(result).toEqual({
			content: [{ type: 'text', text: '{"id": "9876543210"}' }],
		});
	});

	it('updates.list forwards pagination arguments to the tool', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '[]' }] });

		await updatesList(mockCtx, {
			objectId: '18412502536',
			objectType: 'Item',
			limit: 50,
			includeReplies: true,
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_updates');
		expect(callBody.params.arguments).toEqual({
			objectId: '18412502536',
			objectType: 'Item',
			limit: 50,
			includeReplies: true,
		});
	});

	it('search.query forwards the search term to the search tool', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '[]' }] });

		await searchQuery(mockCtx, {
			searchType: 'BOARD',
			searchTerm: 'Q4 planning',
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('search');
		expect(callBody.params.arguments).toEqual({
			searchType: 'BOARD',
			searchTerm: 'Q4 planning',
		});
	});

	it('assets.getUploadUrl requests a presigned upload URL with minimal input', async () => {
		stubSession();
		stubToolResult({
			content: [{ type: 'text', text: '{"uploadId": "up-123"}' }],
		});

		await assetsGetUploadUrl(mockCtx, {
			fileName: 'report.pdf',
			contentType: 'application/pdf',
			fileSize: 204800,
		});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_asset_upload_url');
		expect(callBody.params.arguments).toEqual({
			fileName: 'report.pdf',
			contentType: 'application/pdf',
			fileSize: 204800,
		});
	});

	it('meetings.getNotetaker calls the tool with empty optional-only input', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '[]' }] });

		await meetingsGetNotetaker(mockCtx, {});

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_notetaker_meetings');
		expect(callBody.params.arguments).toEqual({});
	});

	it('rejects input missing a required tool parameter', async () => {
		await expect(
			updatesCreate(mockCtx, { body: '<p>Missing item id</p>' } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

import {
	assetsFinalizeUpload,
	assetsGet,
	notificationsCreate,
} from './updates';

describe('updates family — per-endpoint coverage', () => {
	it('notificationsCreate forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			user_id: 'test-user_id',
			target_id: 'test-target_id',
			text: 'test-text',
			target_type: 'test-target_type',
		};
		const result = await notificationsCreate(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('create_notification');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('assetsGet forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			ids: ['12345'],
		};
		const result = await assetsGet(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('get_assets');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});

	it('assetsFinalizeUpload forwards its documented tool call', async () => {
		stubSession();
		stubToolResult({ content: [{ type: 'text', text: '{}' }] });
		const input = {
			uploadId: 'test-uploadId',
			etag: 'test-etag',
			boardId: 'test-boardId',
			itemId: 'test-itemId',
			columnId: 'test-columnId',
		};
		const result = await assetsFinalizeUpload(mockCtx, input);

		const callBody = JSON.parse(
			String(fetchMock.mock.calls[2]?.[1]?.body) ?? '{}',
		) as {
			params: { name: string; arguments: Record<string, unknown> };
		};
		expect(callBody.params.name).toBe('finalize_asset_upload');
		expect(callBody.params.arguments).toEqual(input);
		expect(result).toEqual({ content: [{ type: 'text', text: '{}' }] });
	});
});
