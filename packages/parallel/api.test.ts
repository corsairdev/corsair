import { createCorsair } from 'corsair/core';
import { parallel } from './index';

const api = createCorsair({ plugins: [parallel({ key: 'test-key' })] }).parallel
	.api;

afterEach(() => jest.restoreAllMocks());

test('search sends the v1 request and preserves nullable result fields', async () => {
	const output = {
		search_id: 'search_1',
		session_id: 'session_1',
		results: [{ url: 'https://example.com', title: null, excerpts: ['text'] }],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	const input = {
		search_queries: ['parallel api'],
		advanced_settings: { max_results: 3 },
	};
	expect(await api.search.search(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledTimes(1);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/search',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

test('extract sends nested advanced settings and preserves errors', async () => {
	const output = {
		extract_id: 'extract_1',
		session_id: 'session_1',
		results: [],
		errors: [
			{
				url: 'https://example.com',
				error_type: 'error',
				http_status_code: null,
				content: null,
			},
		],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	const input = {
		urls: ['https://example.com'],
		advanced_settings: { full_content: true, links: true },
	};
	expect(await api.extract.extract(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/extract',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

test('rejects empty search queries and obsolete top-level extract settings', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	await expect(api.search.search({ search_queries: [] })).rejects.toThrow();
	await expect(
		api.extract.extract({ urls: [], full_content: true } as never),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

test('surfaces rate limits without retrying the request', async () => {
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(
			new Response('{}', { status: 429, headers: { 'retry-after': '2' } }),
		);
	await expect(
		api.search.search({ search_queries: ['query'] }),
	).rejects.toMatchObject({ status: 429, retryAfter: 2000 });
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('image search forwards documented options and returns nullable dimensions', async () => {
	const input = {
		search_queries: ['a lighthouse'],
		mode: 'fast' as const,
		advanced_settings: { location: 'us', max_results: 3 },
	};
	const output = {
		search_id: 's',
		session_id: 'session',
		results: [
			{
				title: 'Lighthouse',
				image_url: 'https://example.com/image.png',
				source_page_url: 'https://example.com',
				width: null,
				height: 800,
			},
		],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.images.search(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/images/search',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

test('place search sends location and preserves weekly hours', async () => {
	const input = { query: 'ramen', location: 'Tokyo', open_now: true };
	const output = {
		search_id: 's',
		session_id: 'session',
		results: [
			{
				name: 'Ramen',
				phone: null,
				opening_hours: { monday: [{ opens: '09:00', closes: '20:00' }] },
			},
		],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.places.search(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/places/search',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

test('decision forwards questions and parses grounded answers', async () => {
	const input = {
		state: { company: 'Example' },
		questions: {
			viable: { type: 'noul' as const, instructions: 'Is it viable?' },
		},
		advanced_settings: { include_excerpts: false },
	};
	const output = {
		mode: 'fast',
		answers: { viable: { type: 'noul', noul: 0.8 } },
		usage: { input_tokens: 20, output_tokens: 0 },
		citations: [{ url: 'https://example.com', title: null, excerpts: [] }],
		decision_id: 'decisions_1',
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.decisions.create(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/decisions',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

test('discovery rejects missing query or incomplete coordinates before sending', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	await expect(api.images.search({ search_queries: [] })).rejects.toThrow();
	await expect(
		api.places.search({ query: 'coffee', latitude: 12 }),
	).rejects.toThrow();
	await expect(
		api.decisions.create({ state: null, questions: {} }),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

test.each([
	['clear', { memory_scope_key: 'my_scope' }, '/v1beta/memory/clear'],
	['evict', { kind: 'task', id: 'trun_1' }, '/v1beta/memory/evict'],
] as const)(
	'memory %s forwards JSON and handles 204',
	async (name, input, path) => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(null, { status: 204 }));
		const result =
			name === 'clear'
				? await api.memory.clear(input)
				: await api.memory.evict(input as { kind: 'task'; id: string });
		expect(result).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledWith(
			`https://api.parallel.ai${path}`,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify(input),
				headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
			}),
		);
	},
);

test('memory retrieve forwards filters and parses results', async () => {
	const input = { query: 'climate', limit: 2, kind: 'task' as const };
	const output = {
		results: [
			{
				kind: 'task',
				id: 'trun_1',
				updated_at: '2026-01-01T00:00:00Z',
				input_excerpt: 'q',
				output_excerpt: 'a',
			},
		],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.memory.retrieve(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1beta/memory/retrieve',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});

const monitorFixture = {
	type: 'event_stream',
	monitor_id: 'm_1',
	status: 'active',
	frequency: '1d',
	processor: 'lite',
	created_at: '2026-01-01T00:00:00Z',
	settings: { query: 'news' },
	webhook: null,
};
test.each([
	{
		name: 'create',
		method: 'POST',
		url: '/v1/monitors',
		input: {
			type: 'event_stream',
			frequency: '1d',
			settings: { query: 'news' },
			webhook: {
				url: 'https://example.com/hook',
				event_types: ['monitor.event.detected'],
			},
		},
		result: monitorFixture,
		call: (x: any) => api.monitors.create(x),
	},
	{
		name: 'list',
		method: 'GET',
		url: '/v1/monitors?cursor=page2&limit=5&type=event_stream&type=snapshot&status=active',
		input: {
			cursor: 'page2',
			limit: 5,
			type: ['event_stream', 'snapshot'],
			status: ['active'],
		},
		result: { monitors: [monitorFixture], next_cursor: null },
		call: (x: any) => api.monitors.list(x),
	},
	{
		name: 'stats',
		method: 'GET',
		url: '/v1/monitors/stats',
		input: {},
		result: { total: 1, processor_counts: { active: { lite: { '1d': 1 } } } },
		call: (x: any) => api.monitors.stats(x),
	},
	{
		name: 'get',
		method: 'GET',
		url: '/v1/monitors/m_1',
		input: { monitor_id: 'm_1' },
		result: monitorFixture,
		call: (x: any) => api.monitors.get(x),
	},
	{
		name: 'cancel',
		method: 'POST',
		url: '/v1/monitors/m_1/cancel',
		input: { monitor_id: 'm_1' },
		result: monitorFixture,
		call: (x: any) => api.monitors.cancel(x),
	},
	{
		name: 'trigger',
		method: 'POST',
		url: '/v1/monitors/m_1/trigger',
		input: { monitor_id: 'm_1' },
		result: undefined,
		call: (x: any) => api.monitors.trigger(x),
	},
	{
		name: 'events',
		method: 'GET',
		url: '/v1/monitors/m_1/events?cursor=page2&include_completions=true',
		input: { monitor_id: 'm_1', cursor: 'page2', include_completions: true },
		result: {
			events: [{ event_type: 'completion', timestamp: '2026-01-01T00:00:00Z' }],
			next_cursor: null,
		},
		call: (x: any) => api.monitors.events(x),
	},
	{
		name: 'update',
		method: 'POST',
		url: '/v1/monitors/m_1/update',
		input: { monitor_id: 'm_1', body: { webhook: null } },
		result: monitorFixture,
		call: (x: any) => api.monitors.update(x),
	},
])(
	'monitor $name reaches the request seam',
	async ({ name, method, url, input, result, call }) => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				result === undefined
					? new Response(null, { status: 204 })
					: new Response(JSON.stringify(result), { status: 200 }),
			);
		expect(await call(input)).toEqual(result);
		const body =
			name === 'create'
				? JSON.stringify(input)
				: name === 'update'
					? JSON.stringify((input as { body: unknown }).body)
					: undefined;
		expect(fetchMock).toHaveBeenCalledWith(
			`https://api.parallel.ai${url}`,
			expect.objectContaining({
				method,
				headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
			}),
		);
		const sentBody = fetchMock.mock.calls[0]?.[1]?.body;
		if (body === undefined) expect(sentBody).toBeUndefined();
		else expect(JSON.parse(String(sentBody))).toEqual(JSON.parse(body));
	},
);
test('monitor path parameters reject traversal and separators', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	for (const monitor_id of ['.', '..', '../other', 'a/b', 'a\\b', 'a"b', "a'b"])
		await expect(api.monitors.get({ monitor_id })).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

const taskRun = {
	run_id: 'trun_1',
	interaction_id: 'trun_1',
	status: 'queued',
	is_active: true,
	processor: 'base',
	created_at: null,
	modified_at: null,
};
const groupStatus = {
	num_task_runs: 1,
	task_run_status_counts: { queued: 1 },
	is_active: true,
	status_message: null,
	modified_at: null,
};
const taskInput = {
	processor: 'base',
	input: 'Research this',
	webhook: {
		url: 'https://example.com/hook',
		event_types: ['task_run.status'],
	},
};
test.each([
	{
		name: 'createGroup',
		method: 'POST',
		url: '/v1/tasks/groups',
		input: { metadata: { key: 'value' } },
		body: { metadata: { key: 'value' } },
		result: { taskgroup_id: 'tg_1', status: groupStatus, created_at: null },
		call: (x: any) => api.tasks.createGroup(x),
	},
	{
		name: 'getGroup',
		method: 'GET',
		url: '/v1/tasks/groups/tg_1',
		input: { taskgroup_id: 'tg_1' },
		result: { taskgroup_id: 'tg_1', status: groupStatus, created_at: null },
		call: (x: any) => api.tasks.getGroup(x),
	},
	{
		name: 'addGroupRuns',
		method: 'POST',
		url: '/v1/tasks/groups/tg_1/runs?refresh_status=false',
		input: {
			taskgroup_id: 'tg_1',
			refresh_status: false,
			body: { inputs: [taskInput] },
			parallel_beta: 'feature',
		},
		body: { inputs: [taskInput] },
		beta: 'feature',
		result: {
			status: groupStatus,
			run_ids: ['trun_1'],
			run_cursor: null,
			event_cursor: null,
		},
		call: (x: any) => api.tasks.addGroupRuns(x),
	},
	{
		name: 'getGroupRun',
		method: 'GET',
		url: '/v1/tasks/groups/tg_1/runs/trun_1',
		input: { taskgroup_id: 'tg_1', run_id: 'trun_1' },
		result: taskRun,
		call: (x: any) => api.tasks.getGroupRun(x),
	},
	{
		name: 'createRun',
		method: 'POST',
		url: '/v1/tasks/runs',
		input: { body: taskInput, parallel_beta: 'feature' },
		body: taskInput,
		beta: 'feature',
		result: taskRun,
		call: (x: any) => api.tasks.createRun(x),
	},
	{
		name: 'getRun',
		method: 'GET',
		url: '/v1/tasks/runs/trun_1',
		input: { run_id: 'trun_1' },
		result: taskRun,
		call: (x: any) => api.tasks.getRun(x),
	},
	{
		name: 'getRunInput',
		method: 'GET',
		url: '/v1/tasks/runs/trun_1/input',
		input: { run_id: 'trun_1' },
		result: taskInput,
		call: (x: any) => api.tasks.getRunInput(x),
	},
	{
		name: 'getResult',
		method: 'GET',
		url: '/v1/tasks/runs/trun_1/result?timeout=12',
		input: { run_id: 'trun_1', timeout: 12 },
		result: {
			run: taskRun,
			output: { type: 'text', basis: [], content: 'answer' },
		},
		call: (x: any) => api.tasks.getResult(x),
	},
])(
	'task $name reaches the request seam',
	async ({ method, url, input, result, call, body, beta }) => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify(result), { status: 200 }));
		expect(await call(input)).toEqual(result);
		expect(fetchMock).toHaveBeenCalledWith(
			`https://api.parallel.ai${url}`,
			expect.objectContaining({
				method,
				headers: expect.objectContaining({
					'x-api-key': 'test-key',
					...(beta ? { 'parallel-beta': beta } : {}),
				}),
			}),
		);
		const sentBody = fetchMock.mock.calls[0]?.[1]?.body;
		if (body === undefined) expect(sentBody).toBeUndefined();
		else expect(JSON.parse(String(sentBody))).toEqual(body);
	},
);
test('task IDs cannot escape their routes', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	await expect(
		api.tasks.getGroupRun({ taskgroup_id: 'tg_1', run_id: '../escape' }),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

const findallSchema = {
	objective: 'AI firms',
	entity_type: 'companies',
	match_conditions: [{ name: 'ai', description: 'AI company' }],
};
const findallRun = {
	findall_id: 'find_1',
	generator: 'base',
	status: { status: 'running', is_active: true, metrics: {} },
};
const findallInput = {
	...findallSchema,
	generator: 'base',
	match_limit: 5,
	webhook: { url: 'https://example.com/hook' },
};
test.each([
	{
		name: 'entitySearch',
		method: 'POST',
		url: '/v1beta/findall/entity-search',
		input: { entity_type: 'companies', objective: 'AI firms', match_limit: 5 },
		body: { entity_type: 'companies', objective: 'AI firms', match_limit: 5 },
		result: { entity_set_id: 'e_1', entities: [] },
		call: (x: any) => api.findall.entitySearch(x),
	},
	{
		name: 'ingest',
		method: 'POST',
		url: '/v1beta/findall/ingest',
		input: { objective: 'AI firms' },
		body: { objective: 'AI firms' },
		result: findallSchema,
		call: (x: any) => api.findall.ingest(x),
	},
	{
		name: 'createRun',
		method: 'POST',
		url: '/v1beta/findall/runs',
		input: findallInput,
		body: findallInput,
		result: findallRun,
		call: (x: any) => api.findall.createRun(x),
	},
	{
		name: 'getRun',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1',
		input: { findall_id: 'find_1' },
		result: findallRun,
		call: (x: any) => api.findall.getRun(x),
	},
	{
		name: 'cancel',
		method: 'POST',
		url: '/v1beta/findall/runs/find_1/cancel',
		input: { findall_id: 'find_1' },
		result: undefined,
		call: (x: any) => api.findall.cancel(x),
	},
	{
		name: 'enrich',
		method: 'POST',
		url: '/v1beta/findall/runs/find_1/enrich',
		input: {
			findall_id: 'find_1',
			body: { output_schema: { json_schema: { type: 'object' } } },
		},
		body: { output_schema: { json_schema: { type: 'object' } } },
		result: findallSchema,
		call: (x: any) => api.findall.enrich(x),
	},
	{
		name: 'extend',
		method: 'POST',
		url: '/v1beta/findall/runs/find_1/extend',
		input: { findall_id: 'find_1', body: { additional_match_limit: 10 } },
		body: { additional_match_limit: 10 },
		result: findallSchema,
		call: (x: any) => api.findall.extend(x),
	},
	{
		name: 'result',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1/result',
		input: { findall_id: 'find_1' },
		result: { run: findallRun, candidates: [], last_event_id: null },
		call: (x: any) => api.findall.result(x),
	},
	{
		name: 'schema',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1/schema',
		input: { findall_id: 'find_1' },
		result: findallSchema,
		call: (x: any) => api.findall.schema(x),
	},
])(
	'FindAll $name reaches the request seam',
	async ({ method, url, input, result, call, body }) => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				result === undefined
					? new Response(null, { status: 204 })
					: new Response(JSON.stringify(result), { status: 200 }),
			);
		expect(await call(input)).toEqual(result);
		expect(fetchMock).toHaveBeenCalledWith(
			`https://api.parallel.ai${url}`,
			expect.objectContaining({
				method,
				headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
			}),
		);
		const sentBody = fetchMock.mock.calls[0]?.[1]?.body;
		if (body === undefined) expect(sentBody).toBeUndefined();
		else expect(JSON.parse(String(sentBody))).toEqual(body);
	},
);

test('chat completion sends non-streaming request', async () => {
	const input = {
		model: 'base',
		messages: [{ role: 'user' as const, content: 'Hello' }],
		stream: false as const,
	};
	const output = {
		id: 'chat_1',
		choices: [
			{
				index: 0,
				delta: { role: 'assistant', content: 'Hi' },
				finish_reason: 'stop',
			},
		],
		created: 123,
		model: 'base',
		object: 'chat.completion',
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.chat.create(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1beta/chat/completions',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});
test('responses sends non-streaming request and preserves citations', async () => {
	const input = {
		model: 'parallel',
		input: 'What happened?',
		stream: false as const,
		reasoning: { effort: 'low' as const },
	};
	const output = {
		id: 'r_1',
		created_at: 123,
		object: 'response',
		parallel_tool_calls: false,
		output: [
			{
				id: 'msg_1',
				type: 'message',
				role: 'assistant',
				status: 'completed',
				content: [{ type: 'output_text', text: 'Answer', annotations: [] }],
			},
		],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.responses.create(input)).toEqual(output);
	expect(fetchMock).toHaveBeenCalledWith(
		'https://api.parallel.ai/v1/responses',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify(input),
			headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
		}),
	);
});
test('streaming requests are rejected instead of parsed as JSON', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	await expect(
		api.chat.create({ model: 'base', messages: [], stream: true } as never),
	).rejects.toThrow();
	await expect(
		api.responses.create({
			model: 'parallel',
			input: 'x',
			stream: true,
		} as never),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

test('task result allows the provider default long-poll interval', async () => {
	const timeout = jest.spyOn(AbortSignal, 'timeout');
	jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(
			JSON.stringify({
				run: taskRun,
				output: { type: 'text', basis: [], content: 'answer' },
			}),
			{ status: 200 },
		),
	);
	await api.tasks.getResult({ run_id: 'trun_1' });
	expect(timeout).toHaveBeenCalledWith(630_000);
});
test('missing API keys are rejected before transport', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	const noKey = createCorsair({ plugins: [parallel()] }).parallel.api;
	await expect(
		noKey.search.search({ search_queries: ['test'] }),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

test('response tools and data sources remain on the wire', async () => {
	const input: Parameters<typeof api.responses.create>[0] = {
		model: 'parallel',
		input: 'Research',
		tools: [
			{
				type: 'mcp',
				server_label: 'reference',
				server_url: 'https://example.com/mcp',
				require_approval: 'never',
			},
			{ type: 'web_search', filters: { allowed_domains: ['example.com'] } },
		],
		data_sources: { free: ['partner'] },
	};
	const output = {
		id: 'r_1',
		created_at: 123,
		object: 'response',
		parallel_tool_calls: true,
		output: [],
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.responses.create(input)).toEqual(output);
	expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual(input);
});

test('snapshot monitor retains its baseline task identifier', async () => {
	const output = {
		...monitorFixture,
		type: 'snapshot',
		settings: { task_run_id: 'trun_1', query: 'news' },
		output: { latest_snapshot: null },
	};
	jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(output), { status: 200 }));
	expect(await api.monitors.get({ monitor_id: 'm_1' })).toEqual(output);
});

test('task auto schemas remain intact in requests', async () => {
	const input = {
		body: {
			processor: 'base',
			input: 'Research',
			task_spec: { output_schema: { type: 'auto' as const } },
		},
	};
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(taskRun), { status: 200 }));
	expect(await api.tasks.createRun(input)).toEqual(taskRun);
	expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual(
		input.body,
	);
});
