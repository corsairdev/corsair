import { request } from 'corsair/http';
import { makeAgentyRequest } from './client';
import type { AgentyContext } from './index';
import { agenty, agentyEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as AgentyContext;

describe('Agenty plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = agenty();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(79);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(79);
		expect(Object.keys(agentyEndpointSchemas)).toHaveLength(79);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(agentyEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = agenty();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('Agenty request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Bearer Authorization header and JSON bodies', async () => {
		await makeAgentyRequest('/agents', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.agenty.com/v2',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/agents',
			}),
		);
	});
});

describe('Agenty endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
			agents: {
				agentsGetAll: (ctx: AgentyContext, input: { limit?: number }) => Promise<unknown>;
			};
			jobs: {
				jobsStart: (
					ctx: AgentyContext,
					input: { agent_id?: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.agents.agentsGetAll(mockCtx, { limit: 10 });
		await endpoints.jobs.jobsStart(mockCtx, {
			agent_id: 'agent-123',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/agents',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/jobs/start',
					body: {
						agent_id: 'agent-123',
					},
				}),
			]),
		);
	});

	it('resolves workflow_id into workflow path segments', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		// Test-only: narrow to workflow endpoints for path-param resolution assertions.
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
			workflows: {
				getWorkflowById: (
					ctx: AgentyContext,
					input: { workflow_id: string },
				) => Promise<unknown>;
				deleteWorkflow: (
					ctx: AgentyContext,
					input: { workflow_id: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.workflows.getWorkflowById(mockCtx, { workflow_id: 'wf-123' });
		await endpoints.workflows.deleteWorkflow(mockCtx, { workflow_id: 'wf-456' });

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/workflows/wf-123',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/workflows/wf-456',
				}),
			]),
		);
	});

	it('resolves list_id and key_id into path segments', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		// Test-only: narrow to list/apiKey endpoints for path-param resolution assertions.
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
			lists: {
				listsDeleteById: (
					ctx: AgentyContext,
					input: { list_id: number },
				) => Promise<unknown>;
			};
			apiKeys: {
				apiKeysDeleteById: (
					ctx: AgentyContext,
					input: { key_id: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.lists.listsDeleteById(mockCtx, { list_id: 123 });
		await endpoints.apiKeys.apiKeysDeleteById(mockCtx, { key_id: 'key-789' });

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'DELETE',
					url: '/lists/123',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/apikeys/key-789',
				}),
			]),
		);
	});
});
