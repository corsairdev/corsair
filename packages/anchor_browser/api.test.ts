import { request } from 'corsair/http';
import { makeAnchorBrowserRequest } from './client';
import type { AnchorBrowserContext } from './index';
import { anchor_browser, anchorBrowserEndpointSchemas } from './index';

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
		const plugin = anchor_browser();
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
		const plugin = anchor_browser();
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
		const plugin = anchor_browser({ key: 'test-api-key' });
		// Test-only: narrow to representative session endpoints for route-mapping assertions.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
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
		};

		await endpoints.sessions.listSessions(mockCtx, {});
		await endpoints.sessions.startBrowserSession(mockCtx, {
			browser: { profile: { name: 'demo-profile' } },
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/sessions',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/sessions',
					body: {
						browser: { profile: { name: 'demo-profile' } },
					},
				}),
			]),
		);
	});
});
