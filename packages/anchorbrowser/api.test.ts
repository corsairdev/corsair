import { request } from 'corsair/http';
import { makeAnchorBrowserRequest } from './client';
import { anchorBrowserRoutes } from './endpoints/routes';
import type { AnchorBrowserContext } from './index';
import { anchorBrowserEndpointSchemas, anchorbrowser } from './index';

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
			// Test-only: recurse into nested endpoint groups without a typed tree shape.
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
			// Test-only: recurse into nested endpoint groups without a typed tree shape.
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
	// Test-only partial mock; AnchorBrowserContext requires full plugin/db surface not needed here.
} as unknown as AnchorBrowserContext;

describe('AnchorBrowser plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = anchorbrowser();
		// Test-only: treat nested endpoints as a tree for leaf-count traversal.
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(64);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(64);
		expect(Object.keys(anchorBrowserEndpointSchemas)).toHaveLength(64);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(anchorBrowserEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = anchorbrowser();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('AnchorBrowser request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends anchor-api-key header and JSON bodies', async () => {
		await makeAnchorBrowserRequest('/sessions', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.anchorbrowser.io/v1',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					'anchor-api-key': 'test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/sessions',
			}),
		);
	});
});

describe('AnchorBrowser endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = anchorbrowser({ key: 'test-api-key' });
		// Test-only: narrow to one representative endpoint per group for route-mapping assertions.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			agent: {
				listAgentResources: (
					ctx: AnchorBrowserContext,
					input: { session_id: string },
				) => Promise<unknown>;
			};
			batchSessions: {
				getBatchSessionStatus: (
					ctx: AnchorBrowserContext,
					input: { batch_id: string },
				) => Promise<unknown>;
			};
			downloads: {
				listSessionDownloads: (
					ctx: AnchorBrowserContext,
					input: { session_id: string },
				) => Promise<unknown>;
			};
			events: {
				signalEvent: (
					ctx: AnchorBrowserContext,
					input: { event_name: string; data: Record<string, unknown> },
				) => Promise<unknown>;
			};
			extensions: {
				listExtensions: (
					ctx: AnchorBrowserContext,
					input: Record<string, never>,
				) => Promise<unknown>;
			};
			integrations: {
				listIntegrations: (
					ctx: AnchorBrowserContext,
					input: Record<string, never>,
				) => Promise<unknown>;
			};
			osLevel: {
				clickMouse: (
					ctx: AnchorBrowserContext,
					input: { session_id: string; x: number; y: number },
				) => Promise<unknown>;
			};
			pages: {
				getSessionPages: (
					ctx: AnchorBrowserContext,
					input: { session_id: string },
				) => Promise<unknown>;
			};
			profiles: {
				listProfiles: (
					ctx: AnchorBrowserContext,
					input: Record<string, never>,
				) => Promise<unknown>;
			};
			recordings: {
				listSessionRecordings: (
					ctx: AnchorBrowserContext,
					input: { session_id: string },
				) => Promise<unknown>;
			};
			screenshots: {
				takeScreenshot: (
					ctx: AnchorBrowserContext,
					input: { session_id: string },
				) => Promise<unknown>;
			};
			sessions: {
				listSessions: (
					ctx: AnchorBrowserContext,
					input: Record<string, never>,
				) => Promise<unknown>;
				startBrowserSession: (
					ctx: AnchorBrowserContext,
					input: { browser?: Record<string, unknown> },
				) => Promise<unknown>;
			};
			tasks: {
				listTasks: (
					ctx: AnchorBrowserContext,
					input: Record<string, never>,
				) => Promise<unknown>;
			};
			tools: {
				getWebpageContent: (
					ctx: AnchorBrowserContext,
					input: { url: string },
				) => Promise<unknown>;
			};
			uploads: {
				uploadFilesToSession: (
					ctx: AnchorBrowserContext,
					input: { session_id: string; file: Record<string, unknown> },
				) => Promise<unknown>;
			};
		};

		const sessionId = 'sess-demo-123';

		await endpoints.agent.listAgentResources(mockCtx, {
			session_id: sessionId,
		});
		await endpoints.batchSessions.getBatchSessionStatus(mockCtx, {
			batch_id: 'batch-demo-456',
		});
		await endpoints.downloads.listSessionDownloads(mockCtx, {
			session_id: sessionId,
		});
		await endpoints.events.signalEvent(mockCtx, {
			event_name: 'page-loaded',
			data: { ready: true },
		});
		await endpoints.extensions.listExtensions(mockCtx, {});
		await endpoints.integrations.listIntegrations(mockCtx, {});
		await endpoints.osLevel.clickMouse(mockCtx, {
			session_id: sessionId,
			x: 120,
			y: 80,
		});
		await endpoints.pages.getSessionPages(mockCtx, { session_id: sessionId });
		await endpoints.profiles.listProfiles(mockCtx, {});
		await endpoints.recordings.listSessionRecordings(mockCtx, {
			session_id: sessionId,
		});
		await endpoints.screenshots.takeScreenshot(mockCtx, {
			session_id: sessionId,
		});
		await endpoints.sessions.listSessions(mockCtx, {});
		await endpoints.sessions.startBrowserSession(mockCtx, {
			browser: { profile: { name: 'demo-profile' } },
		});
		await endpoints.tasks.listTasks(mockCtx, {});
		await endpoints.tools.getWebpageContent(mockCtx, {
			url: 'https://example.com',
		});
		await endpoints.uploads.uploadFilesToSession(mockCtx, {
			session_id: sessionId,
			file: { name: 'upload.txt' },
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: `/sessions/${sessionId}/agent/files`,
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/batch-sessions/batch-demo-456',
				}),
				expect.objectContaining({
					method: 'GET',
					url: `/sessions/${sessionId}/downloads`,
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/events/page-loaded',
					body: { data: { ready: true } },
				}),
				expect.objectContaining({ method: 'GET', url: '/extensions' }),
				expect.objectContaining({ method: 'GET', url: '/integrations' }),
				expect.objectContaining({
					method: 'POST',
					url: `/sessions/${sessionId}/mouse/click`,
					body: { x: 120, y: 80 },
				}),
				expect.objectContaining({
					method: 'GET',
					url: `/sessions/${sessionId}/pages`,
				}),
				expect.objectContaining({ method: 'GET', url: '/profiles' }),
				expect.objectContaining({
					method: 'GET',
					url: `/sessions/${sessionId}/recordings`,
				}),
				expect.objectContaining({
					method: 'GET',
					url: `/sessions/${sessionId}/screenshot`,
				}),
				expect.objectContaining({ method: 'GET', url: '/sessions' }),
				expect.objectContaining({
					method: 'POST',
					url: '/sessions',
					body: {
						browser: { profile: { name: 'demo-profile' } },
					},
				}),
				expect.objectContaining({ method: 'GET', url: '/task' }),
				expect.objectContaining({
					method: 'POST',
					url: '/tools/fetch/webpage',
					body: { url: 'https://example.com' },
				}),
				expect.objectContaining({
					method: 'POST',
					url: `/sessions/${sessionId}/uploads`,
					body: { file: { name: 'upload.txt' } },
				}),
			]),
		);
	});
});

describe('AnchorBrowser route wiring', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('routes every operation to its declared HTTP method and path', async () => {
		const plugin = anchorbrowser({ key: 'test-api-key' });
		// Test-only: widen plugin.endpoints for dynamic group+name lookup across all 64 ops.
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(
					ctx: AnchorBrowserContext,
					input: Record<string, unknown>,
				) => Promise<unknown>
			>
		>;

		// Widen routes array so the loop can read optional fields uniformly.
		const allRoutes = anchorBrowserRoutes as readonly {
			group: string;
			name: string;
			method: string;
			path: string;
			pathParams?: readonly string[];
		}[];

		for (const route of allRoutes) {
			const handler = endpoints[route.group]?.[route.name];
			if (!handler) {
				throw new Error(`[test] missing endpoint ${route.group}.${route.name}`);
			}

			// Synthesise one value per declared path param so the factory can resolve them all.
			const input: Record<string, unknown> = {};
			let expectedUrl = route.path;
			for (const param of route.pathParams ?? []) {
				const value = `test-${param.replace(/_/g, '-')}`;
				input[param] = value;
				// routes.ts uses camelCase placeholders; alias system maps snake_case input to them
				expectedUrl = expectedUrl.replace(/\{[^}]+\}/, value);
			}

			mockRequest.mockClear();
			await handler(mockCtx, input);

			const call = mockRequest.mock.calls[0]?.[1];
			expect(call).toMatchObject({ method: route.method });
			// No unresolved {placeholder} means path params and route template agree.
			expect(call.url).not.toContain('{');
		}
	});
});
