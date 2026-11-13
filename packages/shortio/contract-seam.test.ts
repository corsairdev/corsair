import { ApiError, request } from 'corsair/http';
import { ShortioAPIError } from './client';
import type { ShortioContext } from './index';
import { shortio, shortioEndpointMeta, shortioEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));
const mockRequest = request as jest.Mock;
const ctx = { key: 'secret-key' } as ShortioContext;
// Fixture-selected handlers have heterogeneous inputs and outputs, which each
// handler validates; no single concrete signature describes the whole registry.
const groups = shortio().endpoints as unknown as Record<
	string,
	Record<string, (ctx: ShortioContext, input: unknown) => Promise<unknown>>
>;
// The dynamic fixture input is validated by the selected public endpoint.
function call(
	group: string,
	name: string,
	context: ShortioContext,
	input: unknown,
) {
	const handler = groups[group]?.[name];
	if (!handler) throw new Error(`Missing endpoint ${group}.${name}`);
	return handler(context, input);
}
const link = {
	originalURL: 'https://example.com',
	path: null,
	idString: 'lnk_123',
	id: '123',
	shortURL: 'http://short.example/a',
	secureShortURL: 'https://short.example/a',
	expiredURL: null,
	FolderId: null,
};
const domain = {
	id: 1,
	hostname: 'short.example',
	unicodeHostname: 'short.example',
	state: 'configured',
	createdAt: '2024-01-01',
	updatedAt: '2024-01-01',
	TeamId: null,
	hasFavicon: false,
	hideReferer: false,
	linkType: 'random',
	cloaking: false,
	hideVisitorIp: false,
	enableAI: false,
	httpsLevel: 'redirect',
	httpsLinks: null,
	clientStorage: {},
	caseSensitive: false,
	incrementCounter: '0',
	robots: 'allow',
	exportEnabled: false,
};
const fixtures = [
	{
		group: 'links',
		name: 'list',
		input: { domain_id: 1, limit: 2, pageToken: 'next' },
		method: 'GET',
		path: '/api/links',
		query: { domain_id: 1, limit: 2, pageToken: 'next' },
		response: { count: 1, links: [link], nextPageToken: null },
	},
	{
		group: 'links',
		name: 'get',
		input: { linkId: 'lnk_123', domainId: '1' },
		method: 'GET',
		path: '/links/lnk_123',
		query: { domainId: '1' },
		response: link,
	},
	{
		group: 'links',
		name: 'expand',
		input: { domain: 'short.example', path: 'a' },
		method: 'GET',
		path: '/links/expand',
		query: { domain: 'short.example', path: 'a' },
		response: link,
	},
	{
		group: 'links',
		name: 'create',
		input: {
			domain: 'short.example',
			originalURL: 'https://example.com',
			redirectType: 301,
			expiredURL: null,
		},
		method: 'POST',
		path: '/links',
		body: {
			domain: 'short.example',
			originalURL: 'https://example.com',
			redirectType: 301,
			expiredURL: null,
		},
		response: { ...link, success: true, duplicate: false },
	},
	{
		group: 'links',
		name: 'update',
		input: {
			linkId: 'lnk_123',
			domain_id: '1',
			body: { originalURL: 'https://new.example', iphoneURL: null },
		},
		method: 'POST',
		path: '/links/lnk_123',
		query: { domain_id: '1' },
		body: { originalURL: 'https://new.example', iphoneURL: null },
		response: link,
	},
	{
		group: 'links',
		name: 'delete',
		input: { link_id: 'lnk_123_456' },
		method: 'DELETE',
		path: '/links/lnk_123_456',
		response: { success: true, idString: 'lnk_123_456' },
	},
	{
		group: 'links',
		name: 'archive',
		input: { link_id: 'lnk_123', domain_id: '1' },
		method: 'POST',
		path: '/links/archive',
		body: { link_id: 'lnk_123', domain_id: '1' },
		response: { success: true },
	},
	{
		group: 'links',
		name: 'unarchive',
		input: { link_id: 'lnk_123' },
		method: 'POST',
		path: '/links/unarchive',
		body: { link_id: 'lnk_123' },
		response: { success: true },
	},
	{
		group: 'links',
		name: 'archiveBulk',
		input: { link_ids: ['lnk_123'], domain_id: '1' },
		method: 'POST',
		path: '/links/archive_bulk',
		body: { link_ids: ['lnk_123'], domain_id: '1' },
		response: { success: true },
	},
	{
		group: 'links',
		name: 'unarchiveBulk',
		input: { link_ids: ['lnk_123'] },
		method: 'POST',
		path: '/links/unarchive_bulk',
		body: { link_ids: ['lnk_123'] },
		response: { success: true },
	},
	{
		group: 'links',
		name: 'deleteBulk',
		input: { link_ids: ['lnk_123'] },
		method: 'DELETE',
		path: '/links/delete_bulk',
		body: { link_ids: ['lnk_123'] },
		response: { success: true },
	},
	{
		group: 'domains',
		name: 'list',
		input: { limit: 10, offset: 20, noTeamId: false },
		method: 'GET',
		path: '/api/domains',
		query: { limit: 10, offset: 20, noTeamId: false },
		response: [{ ...domain, isFavorite: false }],
	},
	{
		group: 'domains',
		name: 'get',
		input: { domainId: 1 },
		method: 'GET',
		path: '/domains/1',
		response: { ...domain, ipExclusions: [], userPlan: 'standard' },
	},
];

beforeEach(() => mockRequest.mockReset());
describe('Short.io public request seam', () => {
	it('registers all 13 contract operations', () => {
		const registered = Object.entries(groups)
			.flatMap(([group, handlers]) =>
				Object.keys(handlers).map((name) => `${group}.${name}`),
			)
			.sort();
		expect(fixtures).toHaveLength(13);
		expect(registered).toEqual(
			fixtures.map(({ group, name }) => `${group}.${name}`).sort(),
		);
		expect(Object.keys(shortioEndpointSchemas).sort()).toEqual(registered);
		expect(shortioEndpointMeta['links.deleteBulk'].riskLevel).toBe(
			'destructive',
		);
	});
	it.each(fixtures)(
		'$group.$name accepts its fixed contract fixture',
		(fixture) => {
			// safeParse accepts arbitrary untrusted values for all heterogeneous schemas.
			const schemas = shortioEndpointSchemas as Record<
				string,
				{
					input: { safeParse(value: unknown): { success: boolean } };
					output: { safeParse(value: unknown): { success: boolean } };
				}
			>;
			const schema = schemas[`${fixture.group}.${fixture.name}`];
			expect(schema?.input.safeParse(fixture.input).success).toBe(true);
			expect(schema?.output.safeParse(fixture.response).success).toBe(true);
			expect(schema?.input.safeParse(null).success).toBe(false);
			expect(schema?.output.safeParse(null).success).toBe(false);
		},
	);
	it.each(fixtures)(
		'$group.$name sends the documented request and validates the output',
		async (fixture) => {
			mockRequest.mockResolvedValue(fixture.response);
			expect(
				await call(fixture.group, fixture.name, ctx, fixture.input),
			).toEqual(fixture.response);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, options, transport] = mockRequest.mock.calls[0];
			expect(config).toEqual(
				expect.objectContaining({
					BASE: 'https://api.short.io',
					HEADERS: { Authorization: 'secret-key' },
				}),
			);
			expect(config.TOKEN).toBeUndefined();
			expect(options).toEqual(
				expect.objectContaining({
					method: fixture.method,
					url: fixture.path,
					query: 'query' in fixture ? fixture.query : undefined,
					body: 'body' in fixture ? fixture.body : undefined,
					mediaType: 'body' in fixture ? 'application/json' : undefined,
				}),
			);
			expect(transport.rateLimitConfig.maxRetries).toBe(0);
		},
	);
	it.each(['', '.', '..', 'a/b', 'a\\b', 'a"b', "a'b", 'a?b', 'a#b'])(
		'rejects unsafe path ID %s',
		async (linkId) => {
			for (const [name, input] of [
				['get', { linkId }],
				['update', { linkId }],
				['delete', { link_id: linkId }],
			] as const) {
				await expect(call('links', name, ctx, input)).rejects.toThrow();
			}
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);
	it('checks documented identifier patterns and encodes valid path segments', async () => {
		await expect(
			call('links', 'get', ctx, { linkId: 'invalid' }),
		).rejects.toThrow();
		await expect(
			call('links', 'delete', ctx, { link_id: 'lnk_1' }),
		).rejects.toThrow();
		mockRequest.mockResolvedValue({ success: true });
		await call('links', 'delete', ctx, { link_id: 'lnk_a b_c' });
		expect(mockRequest.mock.calls[0][1].url).toBe('/links/lnk_a%20b_c');
	});
	it('rejects missing credentials and oversized bulk input before transport', async () => {
		await expect(
			call('links', 'get', { key: ' ' } as ShortioContext, { linkId: 'lnk_1' }),
		).rejects.toThrow();
		await expect(
			call('links', 'deleteBulk', ctx, { link_ids: Array(151).fill('lnk_1') }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('rejects malformed provider output', async () => {
		mockRequest.mockResolvedValue({ originalURL: 'https://example.com' });
		await expect(
			call('links', 'get', ctx, { linkId: 'lnk_1' }),
		).rejects.toThrow();
	});
	it('sends a bodyless update when no request body is supplied', async () => {
		mockRequest.mockResolvedValue(link);
		await call('links', 'update', ctx, { linkId: 'lnk_1' });
		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/links/lnk_1',
				body: undefined,
				mediaType: undefined,
			}),
		);
	});
	it('preserves 429 status, body, and retry-after without replaying writes', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/links' },
				{
					url: 'https://api.short.io/links',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'rate limit' },
				},
				'Rate limited',
				{ retryAfter: 3000 },
			),
		);
		// JavaScript may throw values that are not Error instances.
		let caught: unknown;
		try {
			await call('links', 'create', ctx, {
				domain: 'short.example',
				originalURL: 'https://example.com',
			});
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(ShortioAPIError);
		expect(caught).toMatchObject({
			status: 429,
			retryAfter: 3000,
			body: { error: 'rate limit' },
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const handler = shortio().errorHandlers?.RATE_LIMIT_ERROR;
		const context = {
			pluginId: 'shortio',
			operation: 'links.create',
			input: {},
			originalError: caught as Error,
		};
		expect(handler?.match(caught as Error, context)).toBe(true);
		expect(await handler?.handler(caught as Error, context)).toMatchObject({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});
});
