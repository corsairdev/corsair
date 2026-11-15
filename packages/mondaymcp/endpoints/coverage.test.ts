import type { MondayMcpContext } from '../index';
import { agentsManageSkills } from './agents';
import { apiExecuteQuery, apiGetGraphqlSchema } from './sprints';
import {
	assetsFinalizeUpload,
	assetsGet,
	assetsGetUploadUrl,
	notificationsCreate,
} from './updates';
import { workflowsCreate } from './workflows';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// Same transport boundary as the other endpoint tests: fetch against
// https://mcp.monday.com/mcp (initialize, notifications/initialized, tools/call).
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// JSON-RPC bodies are arbitrary fixtures here, so the helper takes any value.
function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
}

// Queues the handshake plus one tools/call reply whose result is a fixture.
function stubCall(result: unknown): void {
	fetchMock
		.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ jsonrpc: '2.0', id: 1, result: {} })),
		)
		.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 202 })),
		)
		.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ jsonrpc: '2.0', id: 2, result })),
		);
}

// Tool arguments are an open object per the MCP protocol.
function lastCall(): { name: string; arguments: Record<string, unknown> } {
	const body = JSON.parse(String(fetchMock.mock.calls[2]?.[1]?.body)) as {
		params: { name: string; arguments: Record<string, unknown> };
	};
	return body.params;
}

const mockCtx = { key: 'mcp-token-test' } as never as MondayMcpContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('endpoints without other coverage', () => {
	it('notifications.create calls create_notification', async () => {
		stubCall({
			content: [{ type: 'text', text: '{"notification_id":"-1"}' }],
		});
		await notificationsCreate(mockCtx, {
			user_id: '121943394',
			target_id: '2907784466',
			text: 'Build finished',
			target_type: 'Project',
		});
		expect(lastCall()).toEqual({
			name: 'create_notification',
			arguments: {
				user_id: '121943394',
				target_id: '2907784466',
				text: 'Build finished',
				target_type: 'Project',
			},
		});
	});

	it('assets.get calls get_assets with the asset IDs', async () => {
		stubCall({
			content: [{ type: 'text', text: 'Found 1 asset(s): 100659598' }],
		});
		await assetsGet(mockCtx, { ids: ['100659598'] });
		expect(lastCall()).toEqual({
			name: 'get_assets',
			arguments: { ids: ['100659598'] },
		});
	});

	it('assets.finalizeUpload works without boardId (resolved from the item)', async () => {
		stubCall({
			content: [{ type: 'text', text: 'Uploaded report.txt as asset 1' }],
		});
		await assetsFinalizeUpload(mockCtx, {
			uploadId: 'b09e903a-97b0-47e1-950f-06f8475692fa',
			etag: '"abc"',
			itemId: '2907784466',
			columnId: 'file_mm93rn96',
		});
		expect(lastCall()).toEqual({
			name: 'finalize_asset_upload',
			arguments: {
				uploadId: 'b09e903a-97b0-47e1-950f-06f8475692fa',
				etag: '"abc"',
				itemId: '2907784466',
				columnId: 'file_mm93rn96',
			},
		});
	});

	it('assets.getUploadUrl works without contentType (derived from the extension)', async () => {
		stubCall({ content: [{ type: 'text', text: 'Upload ready' }] });
		await assetsGetUploadUrl(mockCtx, { fileName: 'report.pdf', fileSize: 22 });
		expect(lastCall().arguments).toEqual({
			fileName: 'report.pdf',
			fileSize: 22,
		});
	});

	it('agents.manageSkills calls manage_agent_skills', async () => {
		stubCall({
			content: [{ type: 'text', text: '{"message":"Skill added"}' }],
		});
		await agentsManageSkills(mockCtx, {
			action: 'add',
			agent_id: '89688',
			skill_id: '42',
		});
		expect(lastCall()).toEqual({
			name: 'manage_agent_skills',
			arguments: { action: 'add', agent_id: '89688', skill_id: '42' },
		});
	});

	it('schema.getGraphqlSchema calls get_graphql_schema', async () => {
		stubCall({
			content: [
				{ type: 'text', text: '{"message":"GraphQL schema retrieved"}' },
			],
		});
		await apiGetGraphqlSchema(mockCtx, { operationType: 'read' });
		expect(lastCall()).toEqual({
			name: 'get_graphql_schema',
			arguments: { operationType: 'read' },
		});
	});

	it('schema.executeQuery works without variables (the server defaults them)', async () => {
		stubCall({ content: [{ type: 'text', text: '{"me":{"id":"1"}}' }] });
		await apiExecuteQuery(mockCtx, { query: 'query { me { id } }' });
		expect(lastCall()).toEqual({
			name: 'all_monday_api',
			arguments: { query: 'query { me { id } }' },
		});
	});

	it('workflows.create rejects SHAREABLE, which the server does not accept', async () => {
		await expect(
			workflowsCreate(mockCtx, {
				workspaceId: '3594060',
				privacyKind: 'SHAREABLE' as never,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
