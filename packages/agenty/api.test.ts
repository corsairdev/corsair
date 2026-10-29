import { request } from 'corsair/http';
import { makeAgentyRequest } from './client';
import { resolvePath } from './endpoints/factory';
import { agentyRoutes } from './endpoints/routes';
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
			headers: { Authorization: 'Bearer spoofed', 'X-Custom': '1' },
		});

		const headers = mockRequest.mock.calls[0]?.[0].HEADERS;
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.agenty.com/v2',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
					'X-Custom': '1',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/agents',
			}),
		);
		expect(headers?.Authorization).toBe('Bearer test-api-key');
		expect(mockRequest.mock.calls[0]?.[1].query?.apikey).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1].query?.apiKey).toBeUndefined();
		expect(headers?.['X-Agenty-ApiKey']).toBeUndefined();
	});

	it('adds X-Agenty-ApiKey for browser host without query-param leakage', async () => {
		await makeAgentyRequest('/screenshot', 'test-api-key', {
			method: 'GET',
			baseUrl: 'https://browser.agenty.com/api',
			query: { url: 'https://example.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://browser.agenty.com/api',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'X-Agenty-ApiKey': 'test-api-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/screenshot',
				query: { url: 'https://example.com' },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1].query?.apikey).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1].query?.apiKey).toBeUndefined();
	});

	it('rejects non-allowlisted baseUrl before attaching credentials', async () => {
		await expect(
			makeAgentyRequest('/agents', 'test-api-key', {
				baseUrl: 'https://evil.example/browser.agenty.com',
			}),
		).rejects.toThrow(/baseUrl host not allowed/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Agenty endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			agents: {
				agentsGetAll: (
					ctx: AgentyContext,
					input: { limit?: number },
				) => Promise<unknown>;
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
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
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

		await endpoints.workflows.getWorkflowById(mockCtx, {
			workflow_id: 'wf-123',
		});
		await endpoints.workflows.deleteWorkflow(mockCtx, {
			workflow_id: 'wf-456',
		});

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

	it('resolves workflow_id for update and patch operations', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			workflows: {
				updateWorkflow: (
					ctx: AgentyContext,
					input: {
						workflow_id: string;
						name: string;
						agents: Record<string, unknown>;
						actions: unknown[];
						trigger: Record<string, unknown>;
					},
				) => Promise<unknown>;
				patchWorkflow: (
					ctx: AgentyContext,
					input: { workflow_id: string; name?: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.workflows.updateWorkflow(mockCtx, {
			workflow_id: 'wf-update',
			name: 'Updated workflow',
			agents: {},
			actions: [],
			trigger: {},
		});
		await endpoints.workflows.patchWorkflow(mockCtx, {
			workflow_id: 'wf-patch',
			name: 'Patched name',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'PUT',
					url: '/workflows/wf-update',
				}),
				expect.objectContaining({
					method: 'PATCH',
					url: '/workflows/wf-patch',
					body: { name: 'Patched name' },
				}),
			]),
		);
	});

	it('resolves list_id and key_id into path segments', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		// Test-only: narrow to list/apiKey endpoints for path-param resolution assertions.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			lists: {
				listsDeleteById: (
					ctx: AgentyContext,
					input: { list_id: number },
				) => Promise<unknown>;
			};
			apiKeys: {
				apiKeysDeleteById: (
					ctx: AgentyContext,
					input: { key_id: number },
				) => Promise<unknown>;
			};
		};

		await endpoints.lists.listsDeleteById(mockCtx, { list_id: 123 });
		await endpoints.apiKeys.apiKeysDeleteById(mockCtx, { key_id: 789 });

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'DELETE',
					url: '/lists/123',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/apikeys/789',
				}),
			]),
		);
	});

	it('matches live Agenty shapes for copy, delete project, scrape, and add agents', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			agents: {
				copyAgent: (
					ctx: AgentyContext,
					input: { agent_id: string; name: string },
				) => Promise<unknown>;
			};
			projects: {
				deleteProject: (
					ctx: AgentyContext,
					input: { project_id: number },
				) => Promise<unknown>;
				projectsAddAgents: (
					ctx: AgentyContext,
					input: { project_id: number; agent_ids: string[] },
				) => Promise<unknown>;
				removeAgentFromProject: (
					ctx: AgentyContext,
					input: { project_id: number; agent_id: string },
				) => Promise<unknown>;
			};
			browser: {
				scrapeWebpageData: (
					ctx: AgentyContext,
					input: {
						url: string;
						query: Record<string, string>;
					},
				) => Promise<unknown>;
			};
		};

		await endpoints.agents.copyAgent(mockCtx, {
			agent_id: 'oruylgx351',
			name: 'copy-dst',
		});
		await endpoints.projects.deleteProject(mockCtx, { project_id: 28 });
		await endpoints.projects.projectsAddAgents(mockCtx, {
			project_id: 29,
			agent_ids: ['oruylgx351'],
		});
		await endpoints.projects.removeAgentFromProject(mockCtx, {
			project_id: 29,
			agent_id: 'oruylgx351',
		});
		await endpoints.browser.scrapeWebpageData(mockCtx, {
			url: 'https://example.com',
			query: { title: "$('h1').text()" },
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'POST',
					url: '/agents/oruylgx351/copy',
					body: { name: 'copy-dst' },
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/projects',
					query: { project_id: 28 },
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/projects/29/add',
					body: ['oruylgx351'],
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/projects/29/delete',
					query: { agent_id: 'oruylgx351' },
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/scrape',
					body: {
						url: 'https://example.com',
						query: { title: "$('h1').text()" },
					},
				}),
			]),
		);
	});
});

describe('Agenty route wiring', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('routes every operation to its declared HTTP method, path, and host', async () => {
		const plugin = agenty({ key: 'test-api-key' });
		// Test-only: widen plugin.endpoints for dynamic group+name lookup across all 79 ops.
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(ctx: AgentyContext, input: Record<string, unknown>) => Promise<unknown>
			>
		>;

		const allRoutes = agentyRoutes as readonly {
			group: string;
			name: string;
			method: string;
			path: string;
			hostType: 'main' | 'browser';
			pathParams?: readonly string[];
		}[];

		for (const route of allRoutes) {
			const handler = endpoints[route.group]?.[route.name];
			if (!handler) {
				throw new Error(`[test] missing endpoint ${route.group}.${route.name}`);
			}

			const input: Record<string, unknown> = {};
			for (const param of route.pathParams ?? []) {
				input[param] = `test-${param.replace(/_/g, '-')}`;
			}

			mockRequest.mockClear();
			await handler(mockCtx, input);

			const config = mockRequest.mock.calls[0]?.[0];
			const call = mockRequest.mock.calls[0]?.[1];
			const expectedBase =
				route.hostType === 'browser'
					? 'https://browser.agenty.com/api'
					: 'https://api.agenty.com/v2';

			const expectedUrl = resolvePath(route.path, input, route);
			expect(config).toMatchObject({ BASE: expectedBase });
			expect(call).toMatchObject({ method: route.method });
			expect(call.url).toBe(expectedUrl);
			expect(call.url).not.toContain('{');
		}
	});
});
