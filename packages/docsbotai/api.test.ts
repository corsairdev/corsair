import { ApiError, request } from 'corsair/http';
import type { DocsbotaiAPIError } from './client';
import type { DocsbotaiContext } from './index';
import { docsbotai, docsbotaiEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const ctx = { key: 'secret-key' } as DocsbotaiContext;
const plugin = docsbotai({ key: 'secret-key' });
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
const ids = { teamId: 'team', botId: 'bot' };

// Contract fixtures exercise each published operation through the plugin boundary.
const cases: Array<{
	name: string;
	call: () => Promise<unknown>;
	method: string;
	url: string;
	response: unknown;
	body?: unknown;
	query?: unknown;
	host?: string;
}> = [
	{
		name: 'teams.list',
		call: () => endpoints.teams.list(ctx, {}),
		method: 'GET',
		url: '/teams',
		response: [{ id: 'team' }],
	},
	{
		name: 'teams.get',
		call: () => endpoints.teams.get(ctx, ids),
		method: 'GET',
		url: '/teams/team',
		response: { id: 'team' },
	},
	{
		name: 'teams.update',
		call: () => endpoints.teams.update(ctx, { teamId: 'team', name: 'New' }),
		method: 'PUT',
		url: '/teams/team',
		body: { name: 'New' },
		response: { id: 'team', name: 'New' },
	},
	{
		name: 'teams.listMembers',
		call: () => endpoints.teams.listMembers(ctx, ids),
		method: 'GET',
		url: '/teams/team/members',
		response: [{ uid: 'user' }],
	},
	{
		name: 'bots.list',
		call: () => endpoints.bots.list(ctx, { teamId: 'team', page: 2 }),
		method: 'GET',
		url: '/teams/team/bots',
		query: { page: 2 },
		response: [{ id: 'bot' }],
	},
	{
		name: 'bots.get',
		call: () => endpoints.bots.get(ctx, ids),
		method: 'GET',
		url: '/teams/team/bots/bot',
		response: { id: 'bot' },
	},
	{
		name: 'bots.create',
		call: () => endpoints.bots.create(ctx, { teamId: 'team', name: 'Bot' }),
		method: 'POST',
		url: '/teams/team/bots',
		body: { name: 'Bot' },
		response: { id: 'bot' },
	},
	{
		name: 'bots.update',
		call: () => endpoints.bots.update(ctx, { ...ids, name: 'New' }),
		method: 'PUT',
		url: '/teams/team/bots/bot',
		body: { name: 'New' },
		response: { id: 'bot' },
	},
	{
		name: 'bots.delete',
		call: () => endpoints.bots.delete(ctx, ids),
		method: 'DELETE',
		url: '/teams/team/bots/bot',
		response: { message: 'deleted' },
	},
	{
		name: 'bots.stats',
		call: () => endpoints.bots.stats(ctx, { ...ids, timeDelta: 30 }),
		method: 'GET',
		url: '/teams/team/bots/bot/stats',
		query: { timeDelta: 30 },
		response: { totalCount: 1 },
	},
	{
		name: 'bots.reports',
		call: () => endpoints.bots.reports(ctx, { ...ids, month: '2026-01' }),
		method: 'GET',
		url: '/teams/team/bots/bot/reports',
		query: { month: '2026-01' },
		response: { availableReports: [], report: null },
	},
	{
		name: 'sources.list',
		call: () => endpoints.sources.list(ctx, { ...ids, page: 2 }),
		method: 'GET',
		url: '/teams/team/bots/bot/sources',
		query: { page: 2 },
		response: { sources: [], pagination: { page: 2 } },
	},
	{
		name: 'sources.get',
		call: () => endpoints.sources.get(ctx, { ...ids, sourceId: 's' }),
		method: 'GET',
		url: '/teams/team/bots/bot/sources/s',
		response: { id: 's', file: null },
	},
	{
		name: 'sources.create',
		call: () =>
			endpoints.sources.create(ctx, {
				...ids,
				type: 'url',
				url: 'https://example.com',
			}),
		method: 'POST',
		url: '/teams/team/bots/bot/sources',
		body: { type: 'url', url: 'https://example.com' },
		response: { id: 's' },
	},
	{
		name: 'sources.retry',
		call: () => endpoints.sources.retry(ctx, { ...ids, sourceId: 's' }),
		method: 'PUT',
		url: '/teams/team/bots/bot/sources/s',
		response: { id: 's' },
	},
	{
		name: 'sources.delete',
		call: () => endpoints.sources.delete(ctx, { ...ids, sourceId: 's' }),
		method: 'DELETE',
		url: '/teams/team/bots/bot/sources/s',
		response: { message: 'deleted' },
	},
	{
		name: 'sources.getUploadUrl',
		call: () =>
			endpoints.sources.getUploadUrl(ctx, { ...ids, fileName: 'file.pdf' }),
		method: 'GET',
		url: '/teams/team/bots/bot/upload-url',
		query: { fileName: 'file.pdf' },
		response: { url: 'https://storage.example.com', file: 'file.pdf' },
	},
	{
		name: 'questions.list',
		call: () => endpoints.questions.list(ctx, { ...ids, page: 2 }),
		method: 'GET',
		url: '/teams/team/bots/bot/questions',
		query: { page: 2 },
		response: { questions: [], pagination: {} },
	},
	{
		name: 'questions.delete',
		call: () => endpoints.questions.delete(ctx, { ...ids, questionId: 'q' }),
		method: 'DELETE',
		url: '/teams/team/bots/bot/questions/q',
		response: { message: 'deleted' },
	},
	{
		name: 'questions.rate',
		call: () =>
			endpoints.questions.rate(ctx, { ...ids, answerId: 'a', rating: 1 }),
		method: 'PUT',
		url: '/teams/team/bots/bot/rate/a',
		body: { rating: 1 },
		response: true,
		host: 'chat',
	},
	{
		name: 'conversations.list',
		call: () => endpoints.conversations.list(ctx, { ...ids, page: 2 }),
		method: 'GET',
		url: '/teams/team/bots/bot/conversations',
		query: { page: 2 },
		response: { conversations: [], pagination: {} },
	},
	{
		name: 'conversations.delete',
		call: () =>
			endpoints.conversations.delete(ctx, { ...ids, conversationId: 'c' }),
		method: 'DELETE',
		url: '/teams/team/bots/bot/conversations/c',
		response: { message: 'deleted' },
	},
	{
		name: 'conversations.captureLead',
		call: () =>
			endpoints.conversations.captureLead(ctx, {
				...ids,
				conversationId: 'c',
				metadata: { email: 'a@example.com' },
			}),
		method: 'POST',
		url: '/teams/team/bots/bot/conversations/c/lead',
		body: { metadata: { email: 'a@example.com' } },
		response: true,
		host: 'chat',
	},
	{
		name: 'conversations.ticket',
		call: () =>
			endpoints.conversations.ticket(ctx, { ...ids, conversationId: 'c' }),
		method: 'GET',
		url: '/teams/team/bots/bot/conversations/c/ticket',
		response: { subject: 'Help', message: 'Please help' },
		host: 'chat',
	},
	{
		name: 'leads.list',
		call: () => endpoints.leads.list(ctx, { ...ids, page: 2 }),
		method: 'GET',
		url: '/teams/team/bots/bot/leads',
		query: { page: 2 },
		response: { leads: [], pagination: {} },
	},
	{
		name: 'leads.delete',
		call: () => endpoints.leads.delete(ctx, { ...ids, leadId: 'l' }),
		method: 'DELETE',
		url: '/teams/team/bots/bot/leads/l',
		response: { message: 'deleted' },
	},
	{
		name: 'research.list',
		call: () => endpoints.research.list(ctx, { ...ids, page: 2 }),
		method: 'GET',
		url: '/teams/team/bots/bot/research',
		query: { page: 2 },
		response: { jobs: [], pagination: {} },
	},
	{
		name: 'search.search',
		call: () => endpoints.search.search(ctx, { ...ids, query: 'hello' }),
		method: 'POST',
		url: '/teams/team/bots/bot/search',
		body: { query: 'hello' },
		response: [{ content: 'text' }],
		host: 'chat',
	},
	{
		name: 'webhooks.list',
		call: () => endpoints.webhooks.list(ctx, ids),
		method: 'GET',
		url: '/teams/team/bots/bot/webhooks',
		response: [{ id: 'hook' }],
	},
	{
		name: 'webhooks.get',
		call: () => endpoints.webhooks.get(ctx, { ...ids, webhookId: 'hook' }),
		method: 'GET',
		url: '/teams/team/bots/bot/webhooks/hook',
		response: { id: 'hook' },
	},
	{
		name: 'webhooks.create',
		call: () =>
			endpoints.webhooks.create(ctx, {
				...ids,
				targetUrl: 'https://example.com/hook',
				events: ['lead.created'],
			}),
		method: 'POST',
		url: '/teams/team/bots/bot/webhooks',
		body: { targetUrl: 'https://example.com/hook', events: ['lead.created'] },
		response: { id: 'hook' },
	},
	{
		name: 'webhooks.update',
		call: () =>
			endpoints.webhooks.update(ctx, {
				...ids,
				webhookId: 'hook',
				status: 'active',
			}),
		method: 'PATCH',
		url: '/teams/team/bots/bot/webhooks/hook',
		body: { status: 'active' },
		response: { id: 'hook' },
	},
	{
		name: 'webhooks.delete',
		call: () => endpoints.webhooks.delete(ctx, { ...ids, webhookId: 'hook' }),
		method: 'DELETE',
		url: '/teams/team/bots/bot/webhooks/hook',
		response: { message: 'success', id: 'hook' },
	},
];

describe('DocsBot API boundary', () => {
	beforeEach(() => mockRequest.mockReset());

	it.each(cases)(
		'$name forwards and parses its contract',
		async ({ call, method, url, response, body, query, host }) => {
			mockRequest.mockResolvedValue(response);
			expect(await call()).toEqual(response);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE:
						host === 'chat'
							? 'https://api.docsbot.ai'
							: 'https://docsbot.ai/api',
					TOKEN: 'secret-key',
				}),
				expect.objectContaining({ method, url, body, query }),
				expect.anything(),
			);
		},
	);

	it('keeps endpoint metadata and schemas in sync', () => {
		const paths = Object.entries(endpoints)
			.flatMap(([group, operations]) =>
				Object.keys(operations).map((name) => `${group}.${name}`),
			)
			.sort();
		expect(Object.keys(docsbotaiEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(
			[...cases.map(({ name }) => name), 'sources.uploadFile'].sort(),
		).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
	});

	it('forwards pagination and parses nullable source files', async () => {
		mockRequest.mockResolvedValue({
			sources: [{ id: 's', file: null }],
			pagination: { page: 2, hasMorePages: false },
		});
		const result = await endpoints.sources.list(ctx, {
			...ids,
			page: 2,
			limit: 20,
		});
		expect(result.sources[0]?.file).toBeNull();
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://docsbot.ai/api',
				TOKEN: 'secret-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/teams/team/bots/bot/sources',
				query: { page: 2, limit: 20 },
			}),
			expect.anything(),
		);
	});

	it('retries a source with a bodyless PUT', async () => {
		mockRequest.mockResolvedValue({ id: 'source', file: null });
		await endpoints.sources.retry(ctx, { ...ids, sourceId: 'source' });
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'PUT',
			url: '/teams/team/bots/bot/sources/source',
			body: undefined,
		});
	});

	it('leaves semantic search defaults to DocsBot and uses the chat host', async () => {
		mockRequest.mockResolvedValue([
			{ title: null, url: null, fileId: null, page: null, content: 'text' },
		]);
		await endpoints.search.search(ctx, { ...ids, query: 'hello' });
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://api.docsbot.ai',
			TOKEN: 'secret-key',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			body: { query: 'hello' },
		});
	});

	it('accepts legacy and paginated bot listings', async () => {
		mockRequest.mockResolvedValueOnce([{ id: 'b' }]).mockResolvedValueOnce({
			bots: [{ id: 'b' }],
			totalCount: 1,
			page: 0,
			pageSize: 10,
			totalPages: 1,
		});
		expect(await endpoints.bots.list(ctx, { teamId: 'team' })).toEqual([
			{ id: 'b' },
		]);
		expect(
			await endpoints.bots.list(ctx, { teamId: 'team', pageSize: 10 }),
		).toMatchObject({ bots: [{ id: 'b' }] });
	});

	it('rejects unsafe path segments and missing admin credentials', async () => {
		await expect(
			endpoints.bots.get(ctx, { teamId: '..', botId: 'b' }),
		).rejects.toThrow();
		await expect(
			endpoints.teams.list({ key: '' } as DocsbotaiContext, {}),
		).rejects.toThrow('auth-missing');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('preserves deleted question fields and forwards non-first-page filters', async () => {
		mockRequest.mockResolvedValue({
			questions: [
				{ id: 'q', deleted: true, question: null, answer: null, sources: null },
			],
			pagination: { page: 3 },
		});
		const response = await endpoints.questions.list(ctx, {
			...ids,
			page: 3,
			couldAnswer: false,
		});
		expect(response.questions[0]).toMatchObject({
			deleted: true,
			question: null,
			answer: null,
			sources: null,
		});
		expect(mockRequest.mock.calls[0]?.[1].query).toEqual({
			page: 3,
			couldAnswer: false,
		});
	});

	it('forwards webhook subscription fields without path identifiers', async () => {
		mockRequest.mockResolvedValue({
			id: 'hook',
			targetUrl: 'https://example.com/hook',
			events: ['lead.created'],
			status: 'active',
		});
		const result = await endpoints.webhooks.create(ctx, {
			...ids,
			targetUrl: 'https://example.com/hook',
			events: ['lead.created'],
		});
		expect(result.id).toBe('hook');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/teams/team/bots/bot/webhooks',
			body: { targetUrl: 'https://example.com/hook', events: ['lead.created'] },
		});
	});

	it('surfaces rate limits without replaying a write', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/teams/team/bots' },
				{
					url: 'https://docsbot.ai/api/teams/team/bots',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'rate limited' },
				},
				'Too Many Requests',
				{ retryAfter: 10 },
			),
		);
		await expect(
			endpoints.bots.create(ctx, { teamId: 'team', name: 'Bot' }),
		).rejects.toMatchObject({
			name: 'DocsbotaiAPIError',
			message: 'rate limited',
			status: 429,
			retryAfter: 10,
		} satisfies Partial<DocsbotaiAPIError>);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[2].rateLimitConfig.maxRetries).toBe(0);
	});

	it('does not send credentials for public chat requests', async () => {
		mockRequest.mockResolvedValue([]);
		await endpoints.search.search({ key: '' } as DocsbotaiContext, {
			...ids,
			query: 'hello',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://api.docsbot.ai',
			TOKEN: undefined,
		});
	});

	it('encodes allowed path segments only after validation', async () => {
		mockRequest.mockResolvedValue({ id: 'bot' });
		await endpoints.bots.get(ctx, { teamId: 'team %', botId: 'bot' });
		expect(mockRequest.mock.calls[0]?.[1].url).toBe(
			'/teams/team%20%25/bots/bot',
		);
	});

	it('rejects insecure storage URLs and reports upload failures without leaking the URL', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(null, { status: 403 }));
		try {
			await expect(
				endpoints.sources.uploadFile(ctx, {
					uploadUrl: 'http://example.com/file',
					data: new Uint8Array(),
				}),
			).rejects.toThrow('HTTPS');
			expect(fetchMock).not.toHaveBeenCalled();
			await expect(
				endpoints.sources.uploadFile(ctx, {
					uploadUrl: 'https://storage.example.com/file?signature=secret',
					data: new Uint8Array(),
				}),
			).rejects.toThrow('Storage upload failed (403)');
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('uploads raw bytes without the DocsBot API key', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(null, { status: 200 }));
		try {
			await endpoints.sources.uploadFile(ctx, {
				uploadUrl:
					'https://storage.googleapis.com/bucket/object?signature=secret',
				data: new Uint8Array([0, 255, 1]),
			});
			const [url, options] = fetchMock.mock.calls[0] ?? [];
			expect(String(url)).toContain('storage.googleapis.com');
			expect(options).toMatchObject({
				method: 'PUT',
				credentials: 'omit',
				redirect: 'error',
				headers: { 'Content-Type': 'application/octet-stream' },
			});
			expect(
				Array.from(new Uint8Array(await (options?.body as Blob).arrayBuffer())),
			).toEqual([0, 255, 1]);
			expect(JSON.stringify(options?.headers)).not.toContain('secret-key');
		} finally {
			fetchMock.mockRestore();
		}
	});
});
