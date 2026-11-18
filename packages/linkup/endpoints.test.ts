import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { LinkupContext } from './context';
import {
	fetchPage,
	getAnswer,
	getCredits,
	getResearch,
	getTask,
	listResearch,
	listTasks,
	search,
	searchStructured,
} from './endpoints/read';
import { createResearch, createResponse, createTasks } from './endpoints/write';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key?: string, db?: Record<string, unknown>): LinkupContext {
	// A real database is present whenever tables are passed in.
	return {
		key,
		db,
		database: db ? {} : undefined,
	} as unknown as LinkupContext;
}

function table() {
	return { upsertByEntityId: jest.fn().mockResolvedValue(undefined) };
}

function call(n = 0) {
	return mockRequest.mock.calls[n]?.[1];
}

// Shapes from the live API (11-17).
const TASK = {
	createdAt: '2026-11-17T12:40:01.000Z',
	error: null,
	id: '4b26323e-c449-45ec-bf92-cd969ae98f7b',
	status: 'processing',
	updatedAt: '2026-11-17T12:40:02.000Z',
	input: {
		q: 'When did the Oslo Opera House open?',
		outputType: 'sourcedAnswer',
	},
	output: null,
	type: 'research',
};

// Tables are jest mocks of the db client; their exact type doesn't matter here.
describe('linkup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('reads the balance with a Bearer token and core 429 retries', async () => {
		mockRequest.mockResolvedValue({ balance: 19.975 });
		const credits = table();
		const result = await getCredits(context('sekrit', { credits }), {});
		expect(result.credit).toEqual({ id: 'balance', balance: 19.975 });
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: 'Bearer sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
		expect(credits.upsertByEntityId).toHaveBeenCalled();
	});

	it('skips saves when core has no database', async () => {
		const upsert = jest
			.fn()
			.mockRejectedValue(new Error('Database not configured'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockRequest.mockResolvedValue({ balance: 1 });
		const ctx = {
			db: { credits: { upsertByEntityId: upsert } },
			database: undefined,
		} as unknown as LinkupContext;
		await getCredits(ctx, {});
		expect(upsert).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("searches with filters and returns each result's content", async () => {
		mockRequest.mockResolvedValue({
			results: [
				{
					type: 'text',
					name: 'Corsair',
					url: 'https://corsair.dev/blog/x',
					content: 'Corsair connects agents to apps.',
					favicon: null,
				},
			],
		});
		const sources = table();
		const result = await search(context(undefined, { sources }), {
			q: 'corsair',
			depth: 'standard',
			maxResults: 3,
			includeImages: false,
			fromDate: '2026-01-01',
			includeDomains: ['corsair.dev'],
		});
		expect(call()).toEqual({
			method: 'POST',
			url: '/v1/search',
			body: {
				q: 'corsair',
				depth: 'standard',
				outputType: 'searchResults',
				maxResults: 3,
				includeImages: false,
				fromDate: '2026-01-01',
				includeDomains: ['corsair.dev'],
			},
			mediaType: 'application/json',
		});
		expect(result.results[0]?.content).toBe('Corsair connects agents to apps.');
		expect(sources.upsertByEntityId).toHaveBeenCalledWith(
			'https://corsair.dev/blog/x',
			{ id: 'https://corsair.dev/blog/x', name: 'Corsair', type: 'text' },
		);
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('corsair');
	});

	it('rejects a domain filter that is not a domain', async () => {
		await expect(
			search(context(), { q: 'x', includeDomains: ['https://a.com/x'] }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('gets a sourced answer', async () => {
		mockRequest.mockResolvedValue({
			answer: 'Oslo.',
			sources: [
				{
					name: 'Oslo',
					url: 'https://en.wikipedia.org/wiki/Oslo',
					snippet: 'Oslo is',
				},
			],
		});
		const result = await getAnswer(context(), {
			q: 'Capital of Norway?',
			includeInlineCitations: true,
		});
		expect(call()?.body).toEqual({
			q: 'Capital of Norway?',
			depth: 'fast',
			outputType: 'sourcedAnswer',
			includeInlineCitations: true,
		});
		expect(result).toEqual({
			answer: 'Oslo.',
			sources: [
				{
					name: 'Oslo',
					url: 'https://en.wikipedia.org/wiki/Oslo',
					snippet: 'Oslo is',
				},
			],
		});
	});

	it('sends a structured schema as a JSON string and splits data from sources', async () => {
		mockRequest.mockResolvedValue({
			data: { city: 'Oslo', population: 729437 },
			sources: [{ name: 'SSB', url: 'https://www.ssb.no', snippet: '' }],
		});
		const schema = {
			type: 'object',
			properties: { city: { type: 'string' } },
		};
		const result = await searchStructured(context(), {
			q: 'Population of Oslo',
			schema,
			includeSources: true,
		});
		expect(call()?.body).toEqual({
			q: 'Population of Oslo',
			depth: 'fast',
			outputType: 'structured',
			structuredOutputSchema: JSON.stringify(schema),
			includeSources: true,
		});
		expect(result.data).toEqual({ city: 'Oslo', population: 729437 });
		expect(result.sources).toHaveLength(1);
	});

	it('returns the body itself as data without includeSources', async () => {
		mockRequest.mockResolvedValue({ city: 'Oslo', population: 729437 });
		const result = await searchStructured(context(), {
			q: 'Population of Oslo',
			schema: { type: 'object' },
		});
		expect(result).toEqual({
			data: { city: 'Oslo', population: 729437 },
			sources: undefined,
		});
	});

	it('rejects a structured answer without its data envelope', async () => {
		mockRequest.mockResolvedValue({ sources: [] });
		await expect(
			searchStructured(context(), {
				q: 'x',
				schema: { type: 'object' },
				includeSources: true,
			}),
		).rejects.toThrow('missing data or sources');
	});

	it('accepts an empty page', async () => {
		mockRequest.mockResolvedValue({ markdown: '', favicon: '' });
		await expect(
			fetchPage(context(), { url: 'https://example.com/blank' }),
		).resolves.toEqual({ markdown: '' });
	});

	it('fetches a page with options', async () => {
		mockRequest.mockResolvedValue({
			markdown: '# Example Domain',
			favicon: 'https://example.com/favicon.ico',
			data: { title: 'Example Domain' },
		});
		const result = await fetchPage(context(), {
			url: 'https://example.com',
			mode: 'pro',
			renderJs: true,
			schema: { type: 'object' },
			instructions: 'Get the title',
		});
		expect(call()).toMatchObject({
			url: '/v1/fetch',
			body: {
				url: 'https://example.com',
				mode: 'pro',
				renderJs: true,
				schema: '{"type":"object"}',
				instructions: 'Get the title',
			},
		});
		expect(result).toEqual({
			markdown: '# Example Domain',
			data: { title: 'Example Domain' },
		});
	});

	it('returns the generated text of a response', async () => {
		mockRequest.mockResolvedValue({
			id: 'resp_1',
			object: 'response',
			model: 'linkup-standard',
			output_text: 'Example Domain is a placeholder page.',
			created_at: 1,
		});
		const responses = table();
		const result = await createResponse(context(undefined, { responses }), {
			input: 'What is example.com?',
			model: 'linkup-standard',
			instructions: 'Be brief.',
		});
		expect(call()?.body).toEqual({
			input: 'What is example.com?',
			model: 'linkup-standard',
			instructions: 'Be brief.',
		});
		expect(result.outputText).toBe('Example Domain is a placeholder page.');
		expect(responses.upsertByEntityId).toHaveBeenCalledWith('resp_1', {
			id: 'resp_1',
			model: 'linkup-standard',
			object: 'response',
		});
	});

	it('creates, gets and lists research tasks', async () => {
		mockRequest
			.mockResolvedValueOnce({ ...TASK, status: 'pending' })
			.mockResolvedValueOnce(TASK)
			.mockResolvedValueOnce({
				data: [TASK],
				metadata: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
			});
		const created = await createResearch(context(), {
			q: 'When did the Oslo Opera House open?',
		});
		const got = await getResearch(context(), { id: TASK.id });
		const listed = await listResearch(context(), {
			pageSize: 5,
			sortDirection: 'desc',
		});
		expect(call(0)?.body).toEqual({
			q: 'When did the Oslo Opera House open?',
			outputType: 'sourcedAnswer',
			reasoningDepth: 'S',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(90_000);
		expect(call(1)?.url).toBe(`/v1/research/${TASK.id}`);
		expect(call(2)).toMatchObject({
			url: '/v1/research',
			query: { pageSize: 5, sortDirection: 'desc' },
		});
		expect(created.task.status).toBe('pending');
		expect(got.task.output).toBeNull();
		expect(listed.meta?.total).toBe(1);
	});

	it('needs a schema for structured research', async () => {
		await expect(
			createResearch(context(), { q: 'x', outputType: 'structured' }),
		).rejects.toThrow('needs schema');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends a batch of tasks as an array and lists them with filters', async () => {
		const fetchTask = { ...TASK, id: 't1', type: 'fetch', status: 'pending' };
		mockRequest
			.mockResolvedValueOnce([fetchTask])
			.mockResolvedValueOnce({ ...fetchTask, status: 'completed' })
			.mockResolvedValueOnce({
				data: [fetchTask],
				metadata: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
				quota: { inFlight: 1, limit: 100 },
			});
		const created = await createTasks(context(), {
			tasks: [{ type: 'fetch', input: { url: 'https://example.com' } }],
		});
		const got = await getTask(context(), { id: 't1' });
		const listed = await listTasks(context(), {
			type: ['fetch'],
			status: ['completed', 'failed'],
		});
		expect(call(0)?.body).toEqual([
			{ type: 'fetch', input: { url: 'https://example.com' } },
		]);
		expect(call(1)?.url).toBe('/v1/tasks/t1');
		expect(call(2)?.query).toEqual({
			type: ['fetch'],
			status: ['completed', 'failed'],
		});
		expect(created.tasks).toHaveLength(1);
		expect(got.task.status).toBe('completed');
		expect(listed.quota).toEqual({ inFlight: 1, limit: 100 });
	});

	it('escapes a task id in the path', async () => {
		await expect(getTask(context(), { id: '../x' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/credits/balance' },
			{
				url: 'https://api.linkup.so/v1/credits/balance',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: { message: 'Unauthorized' } },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getCredits(context(), {})).rejects.toBe(error);
	});
});
