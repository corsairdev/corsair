import { request } from 'corsair/http';
import { makeAffindaRequest } from './client';
import type { AffindaContext } from './index';
import { affinda, affindaEndpointSchemas } from './index';

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
	// Test-only partial mock; AffindaContext requires full plugin/db surface not needed here.
} as unknown as AffindaContext;

describe('Affinda plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = affinda();
		// Test-only: treat nested endpoints as a tree for leaf-count traversal.
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(119);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(119);
		expect(Object.keys(affindaEndpointSchemas)).toHaveLength(119);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(affindaEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = affinda();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('Affinda request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Bearer Authorization header and JSON bodies', async () => {
		await makeAffindaRequest('/documents', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.affinda.com/v3',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/documents',
			}),
		);
	});

	it('does not let caller headers override Authorization', async () => {
		await makeAffindaRequest('/documents', 'test-api-key', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer attacker',
				'X-Custom': 'ok',
			},
		});

		const config = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(config.HEADERS.Authorization).toBe('Bearer test-api-key');
		expect(config.HEADERS['X-Custom']).toBe('ok');
	});
});

describe('Affinda endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = affinda({ key: 'test-api-key' });
		// Test-only: narrow to representative document endpoints for route-mapping assertions.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			documents: {
				getDocuments: (
					ctx: AffindaContext,
					input: { workspace?: string },
				) => Promise<unknown>;
				createDocument: (
					ctx: AffindaContext,
					input: { url?: string; workspace?: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.documents.getDocuments(mockCtx, { workspace: 'ws123' });
		await endpoints.documents.createDocument(mockCtx, {
			url: 'https://example.com/resume.pdf',
			workspace: 'ws123',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/documents',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/documents',
					body: {
						url: 'https://example.com/resume.pdf',
						workspace: 'ws123',
					},
				}),
			]),
		);
	});

	it('resolves mismatched path-param schema fields into Affinda URLs', async () => {
		const plugin = affinda({ key: 'test-api-key' });
		// Test-only: exercise routes whose schema id field differs from path placeholder.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			workspaces: {
				deleteWorkspace: (
					ctx: AffindaContext,
					input: { workspace_id: string },
				) => Promise<unknown>;
				getUsageByWorkspace: (
					ctx: AffindaContext,
					input: { workspace_id: string },
				) => Promise<unknown>;
				updateWorkspace: (
					ctx: AffindaContext,
					input: { workspace_id: string; name?: string },
				) => Promise<unknown>;
			};
			resthooks: {
				deleteResthookSubscription: (
					ctx: AffindaContext,
					input: { identifier: number },
				) => Promise<unknown>;
				getResthookSubscription: (
					ctx: AffindaContext,
					input: { identifier: number },
				) => Promise<unknown>;
				updateResthookSubscription: (
					ctx: AffindaContext,
					input: { identifier: number; targetUrl?: string },
				) => Promise<unknown>;
			};
			tags: {
				getTag: (
					ctx: AffindaContext,
					input: { tag_id: number },
				) => Promise<unknown>;
			};
		};

		await endpoints.workspaces.deleteWorkspace(mockCtx, {
			workspace_id: 'ws-1',
		});
		await endpoints.resthooks.deleteResthookSubscription(mockCtx, {
			identifier: 42,
		});
		await endpoints.tags.getTag(mockCtx, { tag_id: 7 });
		await endpoints.resthooks.getResthookSubscription(mockCtx, {
			identifier: 42,
		});
		await endpoints.workspaces.getUsageByWorkspace(mockCtx, {
			workspace_id: 'ws-1',
		});
		await endpoints.resthooks.updateResthookSubscription(mockCtx, {
			identifier: 42,
			targetUrl: 'https://example.com/hook',
		});
		await endpoints.workspaces.updateWorkspace(mockCtx, {
			workspace_id: 'ws-1',
			name: 'Renamed',
		});

		const urls = mockRequest.mock.calls.map((call) => call[1].url);
		expect(urls).toEqual(
			expect.arrayContaining([
				'/workspaces/ws-1',
				'/resthook_subscriptions/42',
				'/tags/7',
				'/workspaces/ws-1/usage',
			]),
		);

		const updateResthook = mockRequest.mock.calls.find(
			(call) =>
				call[1].method === 'PATCH' &&
				call[1].url === '/resthook_subscriptions/42',
		);
		expect(updateResthook?.[1].body).toEqual({
			targetUrl: 'https://example.com/hook',
		});

		const updateWorkspace = mockRequest.mock.calls.find(
			(call) =>
				call[1].method === 'PATCH' && call[1].url === '/workspaces/ws-1',
		);
		expect(updateWorkspace?.[1].body).toEqual({ name: 'Renamed' });
		expect(updateWorkspace?.[1].body).not.toHaveProperty('workspace_id');
	});
});
