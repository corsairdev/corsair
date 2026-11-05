import { request } from 'corsair/http';
import { AnchorBrowserAPIError, makeAnchorBrowserRequest } from './client';
import { errorHandlers } from './error-handlers';
import { anchorBrowserEndpointSchemas, anchorbrowser } from './index';
import { AnchorBrowserSchema } from './schema';
import {
	AnchorBrowserProfile,
	AnchorBrowserSession,
	AnchorBrowserTask,
} from './schema/database';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

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

describe('AnchorBrowser plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = anchorbrowser();
		// Test-only: treat nested endpoints as a tree for leaf traversal.
		const paths = endpointPaths(
			plugin.endpoints as Record<string, unknown>,
		).sort();

		expect(paths).toHaveLength(64);
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

	it('gives every operation a risk level and description', () => {
		const plugin = anchorbrowser();
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description: string }
		>;

		for (const [name, entry] of Object.entries(meta)) {
			expect(['read', 'write', 'admin', 'destructive']).toContain(
				entry.riskLevel,
			);
			expect(entry.description.length).toBeGreaterThan(0);
			expect(name).not.toHaveLength(0);
		}
	});

	it('registers the three cached entities', () => {
		expect(Object.keys(AnchorBrowserSchema.entities).sort()).toEqual([
			'profiles',
			'sessions',
			'tasks',
		]);
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
			expect.objectContaining({ method: 'GET', url: '/sessions' }),
		);
	});

	it('omits a body on GET requests', async () => {
		await makeAnchorBrowserRequest('/sessions', 'k', {
			method: 'GET',
			body: { nope: true },
		});

		expect(mockRequest.mock.calls[0]?.[1]?.body).toBeUndefined();
	});
});

/**
 * Entity schemas are asserted against the payload shapes the live API returns,
 * so a schema that drifts from the documented response is caught here.
 */
describe('AnchorBrowser database schema', () => {
	it('accepts a live session payload from both create and get responses', () => {
		expect(() =>
			AnchorBrowserSession.parse({
				id: 'sess-1',
				cdp_url: 'wss://example/cdp',
				live_view_url: 'https://example/live',
			}),
		).not.toThrow();

		expect(() =>
			AnchorBrowserSession.parse({
				session_id: 'sess-2',
				team_id: 'team-1',
				status: 'running',
				duration: 12,
				credits_used: 0.5,
				configuration: {},
				playground: false,
				proxy_bytes: 0,
				tokens: {},
				steps: 3,
				tags: [],
				created_at: '2026-08-21T04:35:21.670Z',
			}),
		).not.toThrow();
	});

	it('accepts a live task payload keyed by id', () => {
		const parsed = AnchorBrowserTask.parse({
			id: 'task-1',
			name: 'Count Active Contracts',
			description: 'Navigate and count',
			language: 'workflow',
			teamId: 'team-1',
			taskVersionId: 'ver-1',
			latestVersion: '1',
			isDraft: false,
			aiFallbackEnabled: true,
			createdAt: '2026-08-21T04:35:21.670Z',
			updatedAt: '2026-08-21T04:35:21.670Z',
		});

		expect(parsed.id).toBe('task-1');
	});

	it('accepts a null task description, as the API returns', () => {
		expect(() =>
			AnchorBrowserTask.parse({ id: 't', description: null }),
		).not.toThrow();
	});

	it('accepts a documented profile payload', () => {
		expect(() =>
			AnchorBrowserProfile.parse({
				name: 'profile-1',
				description: 'demo',
				source: 'session',
				session_id: 'sess-1',
				status: 'ready',
				created_at: '2026-08-21T04:35:21.670Z',
			}),
		).not.toThrow();
	});

	it('preserves unknown fields so newer API responses still cache', () => {
		const parsed = AnchorBrowserSession.parse({
			session_id: 's',
			brand_new_field: 42,
		});
		expect(parsed).toHaveProperty('brand_new_field', 42);
	});
});

describe('AnchorBrowser error handling', () => {
	function apiError(status: number, method?: 'GET' | 'POST' | 'DELETE') {
		const error = new AnchorBrowserAPIError(`status ${status}`, { method });
		// `status` is derived from the ApiError cause; set it directly here.
		Object.defineProperty(error, 'status', { value: status });
		return error;
	}

	it('retries rate limits regardless of method', async () => {
		for (const method of ['GET', 'POST', 'DELETE'] as const) {
			const error = apiError(429, method);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler();
			expect(result.maxRetries).toBeGreaterThan(0);
		}
	});

	it('retries a 5xx on GET', async () => {
		const error = apiError(500, 'GET');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect((await errorHandlers.SERVER_ERROR.handler(error)).maxRetries).toBe(
			2,
		);
	});

	it('never replays a 5xx on a mutating request', async () => {
		for (const method of ['POST', 'DELETE'] as const) {
			const error = apiError(503, method);
			expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
			expect((await errorHandlers.SERVER_ERROR.handler(error)).maxRetries).toBe(
				0,
			);
		}
	});

	it('does not retry auth or not-found errors', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
		expect((await errorHandlers.NOT_FOUND_ERROR.handler()).maxRetries).toBe(0);
	});
});
