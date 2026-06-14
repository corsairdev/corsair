import { request } from 'corsair/http';
import { makeSupabaseRequest } from './client';
import type { SupabaseContext } from './index';
import { supabase, supabaseEndpointSchemas } from './index';

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

const mockCtx = {
	key: 'test-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as SupabaseContext;

describe('Supabase plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = supabase();
		const endpoints = plugin.endpoints as Record<string, unknown>;

		expect(countLeaves(endpoints)).toBe(121);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(121);
		expect(Object.keys(supabaseEndpointSchemas)).toHaveLength(121);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('supports api key and oauth auth configuration', () => {
		const plugin = supabase({ authType: 'oauth_2' });

		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.authConfig).toEqual({
			api_key: {},
			oauth_2: {},
		});
		expect(plugin.oauthConfig).toMatchObject({
			providerName: 'Supabase',
			authUrl: 'https://api.supabase.com/v1/oauth/authorize',
			tokenUrl: 'https://api.supabase.com/v1/oauth/token',
			requiresRegisteredRedirect: true,
		});
	});
});

describe('Supabase request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth and JSON bodies to the Management API', async () => {
		await makeSupabaseRequest('/v1/projects', 'test-token', {
			method: 'POST',
			body: { name: 'demo' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.supabase.com',
				TOKEN: 'test-token',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/projects',
				body: { name: 'demo' },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('keeps query params for non-GET methods and supports HEAD and OPTIONS', async () => {
		await makeSupabaseRequest('/v1/projects/ref/actions', 'test-token', {
			method: 'HEAD',
			query: { limit: 10 },
		});
		await makeSupabaseRequest('/v1/upload/resumable', 'test-token', {
			method: 'OPTIONS',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'HEAD',
			query: { limit: 10 },
		});
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			method: 'OPTIONS',
		});
	});
});

describe('Supabase endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to official API routes', async () => {
		const plugin = supabase({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listAllProjects: (ctx: SupabaseContext, input: {}) => Promise<unknown>;
				getProject: (
					ctx: SupabaseContext,
					input: { ref: string },
				) => Promise<unknown>;
			};
			database: {
				applyMigration: (
					ctx: SupabaseContext,
					input: { ref: string; body: { query: string } },
				) => Promise<unknown>;
			};
			edgeFunctions: {
				getFunction: (
					ctx: SupabaseContext,
					input: { ref: string; functionSlug: string },
				) => Promise<unknown>;
			};
			secrets: {
				getProjectApiKey: (
					ctx: SupabaseContext,
					input: { ref: string; id: string },
				) => Promise<unknown>;
			};
			oauth: {
				exchangeOauthToken: (
					ctx: SupabaseContext,
					input: {
						body: {
							grant_type: string;
							code: string;
							client_id: string;
							client_secret: string;
							redirect_uri: string;
						};
					},
				) => Promise<unknown>;
			};
		};

		await endpoints.projects.listAllProjects(mockCtx, {});
		await endpoints.projects.getProject(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
		});
		await endpoints.database.applyMigration(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
			body: { query: 'create table todos(id int);' },
		});
		await endpoints.edgeFunctions.getFunction(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
			functionSlug: 'hello-world',
		});
		await endpoints.secrets.getProjectApiKey(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
			id: 'key-id',
		});
		await endpoints.oauth.exchangeOauthToken(mockCtx, {
			body: {
				grant_type: 'authorization_code',
				code: 'auth-code',
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_uri: 'https://example.com/callback',
			},
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ method: 'GET', url: '/v1/projects' }),
				expect.objectContaining({
					method: 'GET',
					url: '/v1/projects/abcdefghijklmnopqrst',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/v1/projects/abcdefghijklmnopqrst/database/migrations',
					body: { query: 'create table todos(id int);' },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/v1/projects/abcdefghijklmnopqrst/functions/hello-world',
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/v1/projects/abcdefghijklmnopqrst/api-keys/key-id',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/v1/oauth/token',
					body: expect.stringContaining('grant_type=authorization_code'),
					mediaType: 'application/x-www-form-urlencoded',
				}),
			]),
		);
		expect(mockRequest.mock.calls.at(-1)?.[1].body).toContain(
			'client_secret=client-secret',
		);
	});

	it('routes project-hosted APIs through the project base URL', async () => {
		const plugin = supabase({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			edgeFunctions: {
				invokeEdgeFunction: (
					ctx: SupabaseContext,
					input: { ref: string; functionSlug: string; body: { hello: string } },
				) => Promise<unknown>;
			};
		};

		await endpoints.edgeFunctions.invokeEdgeFunction(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
			functionSlug: 'hello-world',
			body: { hello: 'world' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://abcdefghijklmnopqrst.supabase.co',
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/functions/v1/hello-world',
				body: { hello: 'world' },
			}),
		);
	});

	it('builds safe read-only SQL helper bodies', async () => {
		const plugin = supabase({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			database: {
				selectFromTable: (
					ctx: SupabaseContext,
					input: {
						ref: string;
						schema: string;
						table: string;
						columns: string[];
						limit: number;
						offset: number;
					},
				) => Promise<unknown>;
			};
		};

		await endpoints.database.selectFromTable(mockCtx, {
			ref: 'abcdefghijklmnopqrst',
			schema: 'public',
			table: 'todos',
			columns: ['id', 'name'],
			limit: 5,
			offset: 10,
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/projects/abcdefghijklmnopqrst/database/query/read-only',
			body: {
				query: 'select "id", "name" from "public"."todos" limit 5 offset 10',
			},
		});
	});
});
