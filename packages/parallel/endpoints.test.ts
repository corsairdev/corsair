import { createCorsair, runWithMode } from 'corsair/core';
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

test('retries a rate-limited request after Retry-After', async () => {
	const output = { search_id: 's', session_id: 'x', results: [] };
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValueOnce(
			new Response('{}', { status: 429, headers: { 'retry-after': '0' } }),
		)
		.mockResolvedValueOnce(
			new Response(JSON.stringify(output), { status: 200 }),
		);
	expect(await api.search.search({ search_queries: ['query'] })).toEqual(
		output,
	);
	expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('gives up after three rate-limit retries and keeps status and Retry-After', async () => {
	jest.spyOn(console, 'log').mockImplementation(() => {});
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(
			async () =>
				new Response('{}', { status: 429, headers: { 'retry-after': '0' } }),
		);
	await expect(
		api.search.search({ search_queries: ['query'] }),
	).rejects.toMatchObject({ status: 429, retryAfter: 0 });
	expect(fetchMock).toHaveBeenCalledTimes(4);
}, 20_000);

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

// The test.each tables below mix inputs for several endpoints, so each row's
// input is typed as object and its call casts it back to that endpoint's
// input type. Each row pairs an input with its own endpoint.
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
		call: (x: object) =>
			api.monitors.create(x as Parameters<typeof api.monitors.create>[0]),
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
		call: (x: object) =>
			api.monitors.list(x as Parameters<typeof api.monitors.list>[0]),
	},
	{
		name: 'stats',
		method: 'GET',
		url: '/v1/monitors/stats',
		input: {},
		result: { total: 1, processor_counts: { active: { lite: { '1d': 1 } } } },
		call: (x: object) =>
			api.monitors.stats(x as Parameters<typeof api.monitors.stats>[0]),
	},
	{
		name: 'get',
		method: 'GET',
		url: '/v1/monitors/m_1',
		input: { monitor_id: 'm_1' },
		result: monitorFixture,
		call: (x: object) =>
			api.monitors.get(x as Parameters<typeof api.monitors.get>[0]),
	},
	{
		name: 'cancel',
		method: 'POST',
		url: '/v1/monitors/m_1/cancel',
		input: { monitor_id: 'm_1' },
		result: monitorFixture,
		call: (x: object) =>
			api.monitors.cancel(x as Parameters<typeof api.monitors.cancel>[0]),
	},
	{
		name: 'trigger',
		method: 'POST',
		url: '/v1/monitors/m_1/trigger',
		input: { monitor_id: 'm_1' },
		result: undefined,
		call: (x: object) =>
			api.monitors.trigger(x as Parameters<typeof api.monitors.trigger>[0]),
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
		call: (x: object) =>
			api.monitors.events(x as Parameters<typeof api.monitors.events>[0]),
	},
	{
		name: 'update',
		method: 'POST',
		url: '/v1/monitors/m_1/update',
		input: { monitor_id: 'm_1', body: { webhook: null } },
		result: monitorFixture,
		call: (x: object) =>
			api.monitors.update(x as Parameters<typeof api.monitors.update>[0]),
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
					? JSON.stringify((input as { body: object }).body)
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
		call: (x: object) =>
			api.tasks.createGroup(x as Parameters<typeof api.tasks.createGroup>[0]),
	},
	{
		name: 'getGroup',
		method: 'GET',
		url: '/v1/tasks/groups/tg_1',
		input: { taskgroup_id: 'tg_1' },
		result: { taskgroup_id: 'tg_1', status: groupStatus, created_at: null },
		call: (x: object) =>
			api.tasks.getGroup(x as Parameters<typeof api.tasks.getGroup>[0]),
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
		call: (x: object) =>
			api.tasks.addGroupRuns(x as Parameters<typeof api.tasks.addGroupRuns>[0]),
	},
	{
		name: 'getGroupRun',
		method: 'GET',
		url: '/v1/tasks/groups/tg_1/runs/trun_1',
		input: { taskgroup_id: 'tg_1', run_id: 'trun_1' },
		result: taskRun,
		call: (x: object) =>
			api.tasks.getGroupRun(x as Parameters<typeof api.tasks.getGroupRun>[0]),
	},
	{
		name: 'createRun',
		method: 'POST',
		url: '/v1/tasks/runs',
		input: { body: taskInput, parallel_beta: 'feature' },
		body: taskInput,
		beta: 'feature',
		result: taskRun,
		call: (x: object) =>
			api.tasks.createRun(x as Parameters<typeof api.tasks.createRun>[0]),
	},
	{
		name: 'getRun',
		method: 'GET',
		url: '/v1/tasks/runs/trun_1',
		input: { run_id: 'trun_1' },
		result: taskRun,
		call: (x: object) =>
			api.tasks.getRun(x as Parameters<typeof api.tasks.getRun>[0]),
	},
	{
		name: 'getRunInput',
		method: 'GET',
		url: '/v1/tasks/runs/trun_1/input',
		input: { run_id: 'trun_1' },
		result: taskInput,
		call: (x: object) =>
			api.tasks.getRunInput(x as Parameters<typeof api.tasks.getRunInput>[0]),
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
		call: (x: object) =>
			api.tasks.getResult(x as Parameters<typeof api.tasks.getResult>[0]),
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
		call: (x: object) =>
			api.findall.entitySearch(
				x as Parameters<typeof api.findall.entitySearch>[0],
			),
	},
	{
		name: 'ingest',
		method: 'POST',
		url: '/v1beta/findall/ingest',
		input: { objective: 'AI firms' },
		body: { objective: 'AI firms' },
		result: findallSchema,
		call: (x: object) =>
			api.findall.ingest(x as Parameters<typeof api.findall.ingest>[0]),
	},
	{
		name: 'createRun',
		method: 'POST',
		url: '/v1beta/findall/runs',
		input: findallInput,
		body: findallInput,
		result: findallRun,
		call: (x: object) =>
			api.findall.createRun(x as Parameters<typeof api.findall.createRun>[0]),
	},
	{
		name: 'getRun',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1',
		input: { findall_id: 'find_1' },
		result: findallRun,
		call: (x: object) =>
			api.findall.getRun(x as Parameters<typeof api.findall.getRun>[0]),
	},
	{
		name: 'cancel',
		method: 'POST',
		url: '/v1beta/findall/runs/find_1/cancel',
		input: { findall_id: 'find_1' },
		result: undefined,
		call: (x: object) =>
			api.findall.cancel(x as Parameters<typeof api.findall.cancel>[0]),
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
		call: (x: object) =>
			api.findall.enrich(x as Parameters<typeof api.findall.enrich>[0]),
	},
	{
		name: 'extend',
		method: 'POST',
		url: '/v1beta/findall/runs/find_1/extend',
		input: { findall_id: 'find_1', body: { additional_match_limit: 10 } },
		body: { additional_match_limit: 10 },
		result: findallSchema,
		call: (x: object) =>
			api.findall.extend(x as Parameters<typeof api.findall.extend>[0]),
	},
	{
		name: 'result',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1/result',
		input: { findall_id: 'find_1' },
		result: { run: findallRun, candidates: [], last_event_id: null },
		call: (x: object) =>
			api.findall.result(x as Parameters<typeof api.findall.result>[0]),
	},
	{
		name: 'schema',
		method: 'GET',
		url: '/v1beta/findall/runs/find_1/schema',
		input: { findall_id: 'find_1' },
		result: findallSchema,
		call: (x: object) =>
			api.findall.schema(x as Parameters<typeof api.findall.schema>[0]),
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
test('chat and responses wait past the documented research-model latency', async () => {
	const timeout = jest.spyOn(AbortSignal, 'timeout');
	jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(async () => new Response('{}', { status: 200 }));
	await api.chat.create({ model: 'core', messages: [] }).catch(() => {});
	expect(timeout).toHaveBeenLastCalledWith(330_000);
	await api.responses
		.create({ model: 'parallel', input: 'x', reasoning: { effort: 'high' } })
		.catch(() => {});
	expect(timeout).toHaveBeenLastCalledWith(180_000);
	await api.search.search({ search_queries: ['x'] }).catch(() => {});
	expect(timeout).toHaveBeenLastCalledWith(60_000);
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

// Billing: https://docs.parallel.ai/getting-started/pricing.
// Schema generation and monitor updates are conservatively treated as billable.
// Paid runs and generations, cancels and deletes are destructive. Metered
// lookups (search, extract, image/place search, entity search) stay `read`,
// as R8 in .github/PLUGIN_PR_RULES.md and the Ahrefs plugin do.
const billableCalls = [
	() => api.chat.create({ model: 'base', messages: [] }),
	() => api.responses.create({ model: 'parallel', input: 'question' }),
	() => api.findall.ingest({ objective: 'firms' }),
	() =>
		api.findall.createRun({
			objective: 'firms',
			entity_type: 'companies',
			match_conditions: [],
			generator: 'base',
			match_limit: 5,
		}),
	() =>
		api.findall.enrich({
			findall_id: 'f',
			body: { output_schema: { json_schema: {} } },
		}),
	() =>
		api.findall.extend({
			findall_id: 'f',
			body: { additional_match_limit: 1 },
		}),
	() => api.tasks.addGroupRuns({ taskgroup_id: 'g', body: { inputs: [] } }),
	() => api.tasks.createRun({ body: { processor: 'base', input: 'question' } }),
	() =>
		api.monitors.create({
			type: 'event_stream',
			frequency: '1d',
			settings: { query: 'news' },
		}),
	() => api.monitors.trigger({ monitor_id: 'm' }),
	() => api.findall.cancel({ findall_id: 'f' }),
	() => api.monitors.update({ monitor_id: 'm', body: { frequency: '1d' } }),
	() =>
		api.decisions.create({
			state: null,
			questions: { q: { type: 'noul', instructions: 'question' } },
		}),
];

test.each(['cautious', 'strict', 'readonly'] as const)(
	'all potentially billable operations are blocked before network access in %s mode',
	async (mode) => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await runWithMode(mode, async () => {
			for (const call of billableCalls) await expect(call()).rejects.toThrow();
		});
		expect(fetchMock).not.toHaveBeenCalled();
	},
);

test('non-billable retrieval remains available in readonly mode', async () => {
	const response = { total: 1, processor_counts: {} };
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(response)));
	await runWithMode('readonly', async () =>
		expect(await api.monitors.stats({})).toEqual(response),
	);
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

test.each([
	{
		name: 'search',
		call: () => api.search.search({ search_queries: ['query'] }),
		body: { search_id: 's', session_id: 'x', results: [] },
	},
	{
		name: 'extract',
		call: () => api.extract.extract({ urls: ['https://example.com'] }),
		body: { extract_id: 'e', session_id: 'x', results: [], errors: [] },
	},
	{
		name: 'image search',
		call: () => api.images.search({ search_queries: ['query'] }),
		body: { search_id: 's', session_id: 'x', results: [] },
	},
	{
		name: 'place search',
		call: () => api.places.search({ query: 'coffee', location: 'London' }),
		body: { search_id: 's', session_id: 'x', results: [] },
	},
	{
		name: 'entity search',
		call: () =>
			api.findall.entitySearch({
				entity_type: 'companies',
				objective: 'firms',
			}),
		body: { entity_set_id: 'es', entities: [] },
	},
])('metered lookup $name runs in readonly mode', async ({ call, body }) => {
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
	await runWithMode('readonly', async () => expect(await call()).toEqual(body));
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

describe('response values Parallel adds later still parse', () => {
	const respond = (body: object) =>
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));

	test('task run status', async () => {
		const run = { ...taskRun, status: 'paused' };
		respond(run);
		expect(await api.tasks.getRun({ run_id: 'trun_1' })).toEqual(run);
	});

	test('monitor type, status, processor and webhook event', async () => {
		const monitor = {
			...monitorFixture,
			status: 'paused',
			processor: 'pro',
			webhook: {
				url: 'https://example.com/hook',
				event_types: ['monitor.execution.started'],
			},
		};
		respond(monitor);
		expect(await api.monitors.get({ monitor_id: 'm_1' })).toEqual(monitor);
	});

	test('monitor event type', async () => {
		const events = { events: [{ event_type: 'heartbeat' }], next_cursor: null };
		respond(events);
		expect(await api.monitors.events({ monitor_id: 'm_1' })).toEqual(events);
	});

	test('FindAll generator, status, termination reason and match status', async () => {
		const run = {
			findall_id: 'f',
			generator: 'ultra',
			status: {
				status: 'paused',
				is_active: false,
				metrics: {},
				termination_reason: 'budget_reached',
			},
		};
		const result = {
			run,
			candidates: [
				{
					candidate_id: 'c',
					name: 'n',
					url: 'https://x',
					match_status: 'pending',
				},
			],
		};
		respond(result);
		expect(await api.findall.result({ findall_id: 'f' })).toEqual(result);
	});

	test('memory kind and status', async () => {
		const body = {
			results: [
				{
					kind: 'session',
					id: 's',
					updated_at: '2026-01-01T00:00:00Z',
					input_excerpt: 'q',
				},
			],
		};
		respond(body);
		expect(await api.memory.retrieve({})).toEqual(body);
	});

	test('response output item type', async () => {
		const body = {
			id: 'resp_1',
			created_at: 1,
			object: 'response',
			parallel_tool_calls: false,
			output: [{ id: 'rs_1', type: 'reasoning', summary: [] }],
		};
		respond(body);
		expect(
			await api.responses.create({ model: 'parallel', input: 'q' }),
		).toEqual(body);
	});

	test('place rating', async () => {
		const body = {
			search_id: 's',
			session_id: 'x',
			results: [{ name: 'Cafe', rating: 'outstanding' }],
		};
		respond(body);
		expect(
			await api.places.search({ query: 'coffee', location: 'London' }),
		).toEqual(body);
	});
});

test('task run advanced fetch_policy reaches Parallel', async () => {
	const fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(taskRun), { status: 200 }));
	const body = {
		processor: 'lite',
		input: 'question',
		advanced_settings: { fetch_policy: { max_age_seconds: 3600 } },
	};
	await api.tasks.createRun({ body });
	expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual(body);
});

test("errors carry Parallel's message so the caller knows what to change", async () => {
	jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(
			JSON.stringify({
				type: 'error',
				error: {
					ref_id: 'ref',
					message:
						'Requests with an app API key must include a memory_scope_key.',
					detail: null,
				},
			}),
			{ status: 403, headers: { 'content-type': 'application/json' } },
		),
	);
	await expect(api.memory.retrieve({ limit: 3 })).rejects.toMatchObject({
		status: 403,
		message:
			'Parallel HTTP 403: Requests with an app API key must include a memory_scope_key.',
	});
});

test('errors without a JSON body still report the status', async () => {
	jest
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response('Bad gateway', { status: 502 }));
	await expect(api.monitors.stats({})).rejects.toMatchObject({
		status: 502,
		message: 'Parallel HTTP 502',
	});
});

describe('Flights, Hotels and Shopping search', () => {
	function respond(body: object) {
		return jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
	}
	const sentTo = (fetchMock: jest.SpyInstance, url: string, input: object) =>
		expect(fetchMock).toHaveBeenCalledWith(
			url,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify(input),
				headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
			}),
		);

	test('flights.search sends a round trip and parses both legs', async () => {
		const leg = (from: string, to: string) => ({
			departure_airport: from,
			departure_time: '2026-12-10 08:00',
			arrival_airport: to,
			arrival_time: '2026-12-10 16:20',
			duration_minutes: 380,
			stops: 0,
			segments: [
				{
					airline: 'United',
					flight_number: 'UA 1',
					departure_airport: from,
					departure_time: '2026-12-10 08:00',
					arrival_airport: to,
					arrival_time: '2026-12-10 16:20',
					aircraft: null,
					overnight: false,
				},
			],
			layovers: [],
		});
		const output = {
			search_id: 'search_f',
			session_id: 's',
			results: [
				{
					url: 'https://www.united.com/',
					price: 412.4,
					outbound: leg('SFO', 'JFK'),
					inbound: leg('JFK', 'SFO'),
				},
			],
			usage: [{ name: 'sku_flight_search', count: 1 }],
		};
		const fetchMock = respond(output);
		const input = {
			origins: ['SFO'],
			destinations: ['JFK', 'EWR'],
			departure_date: '2026-12-10',
			return_date: '2026-12-14',
			cabin: 'economy' as const,
			max_stops: 0,
			departure_hours: { earliest: 6, latest: 12 },
			advanced_settings: { max_results: 5 },
		};
		expect(await api.flights.search(input)).toEqual(output);
		sentTo(fetchMock, 'https://api.parallel.ai/v1/flights/search', input);
	});

	test('flights.search refuses bad airport codes and conflicting airline filters', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			api.flights.search({
				origins: ['sfo'],
				destinations: ['JFK'],
				departure_date: '2026-12-10',
			}),
		).rejects.toThrow();
		await expect(
			api.flights.search({
				origins: ['SFO'],
				destinations: ['JFK'],
				departure_date: '2026-12-10',
				include_airlines: ['UA'],
				exclude_airlines: ['AA'],
			}),
		).rejects.toThrow(/cannot be combined/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	test('hotels.search sends the stay and parses offers', async () => {
		const output = {
			search_id: 'search_h',
			session_id: 's',
			results: [
				{
					url: 'https://hotel.example',
					url_kind: 'property_website',
					name: 'Hotel Example',
					property_type: 'hotel',
					address: null,
					hotel_class: 4,
					rating: 'excellent',
					images: [],
					price_per_night: 210,
					total_price: 630,
					currency: 'USD',
					free_cancellation: true,
					offers: [
						{
							seller: 'Hotel Example',
							url: 'https://hotel.example/book',
							price_per_night: 210,
							total_price: 630,
							currency: 'USD',
							free_cancellation: true,
						},
					],
					amenities: ['Free Wi-Fi'],
				},
			],
		};
		const fetchMock = respond(output);
		const input = {
			location: 'Lisbon, Alfama',
			check_in_date: '2026-12-10',
			check_out_date: '2026-12-13',
			adults: 2,
			children_ages: [7],
			property_types: ['hotel' as const],
			hotel_classes: [4, 5],
			sort: 'price' as const,
		};
		expect(await api.hotels.search(input)).toEqual(output);
		sentTo(fetchMock, 'https://api.parallel.ai/v1/hotels/search', input);
	});

	test('hotels.search refuses a child older than 17 and unknown fields', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		const stay = {
			location: 'Lisbon',
			check_in_date: '2026-12-10',
			check_out_date: '2026-12-13',
		};
		await expect(
			api.hotels.search({ ...stay, children_ages: [18] }),
		).rejects.toThrow();
		await expect(
			api.hotels.search({ ...stay, guests: 2 } as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	test('shopping.search sends the market in advanced_settings and parses products', async () => {
		const output = {
			search_id: 'search_s',
			session_id: 's',
			results: [
				{
					url: 'https://store.example/desk',
					title: 'Standing desk',
					description: 'Electric, 140 x 70 cm',
					merchant: 'Store',
					price: 399,
					currency: 'EUR',
					condition: 'new',
					availability: 'in_stock',
					offers: [{ url: 'https://other.example/desk', price: 419 }],
				},
			],
		};
		const fetchMock = respond(output);
		const input = {
			search_queries: ['electric standing desk 140cm'],
			max_price: 500,
			condition: 'any' as const,
			advanced_settings: { max_results: 10, location: 'de' },
		};
		expect(await api.shopping.search(input)).toEqual(output);
		sentTo(fetchMock, 'https://api.parallel.ai/v1/shopping/search', input);
	});

	test('shopping.search refuses more than five queries', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			api.shopping.search({ search_queries: ['a', 'b', 'c', 'd', 'e', 'f'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('request fields Parallel added', () => {
	function respond(body: object) {
		return jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
	}

	test('fetch_policy.as_of goes through on search and extract', async () => {
		const fetchMock = respond({ search_id: 's', session_id: 'x', results: [] });
		const input = {
			search_queries: ['q'],
			advanced_settings: { fetch_policy: { as_of: '2025-06-01' } },
		};
		await api.search.search(input);
		expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(JSON.stringify(input));
	});

	test('places.search takes advanced_settings.max_results and returns description', async () => {
		const output = {
			search_id: 'p',
			session_id: 'x',
			results: [{ name: 'Cafe', description: 'Specialty coffee bar' }],
		};
		respond(output);
		expect(
			await api.places.search({
				query: 'coffee',
				location: 'London',
				advanced_settings: { max_results: 5 },
			}),
		).toEqual(output);
	});

	test('findall.createRun takes FindAll webhook events, not the Task one', async () => {
		const run = {
			findall_id: 'findall_1',
			generator: 'preview',
			status: { status: 'queued', is_active: true, metrics: {} },
		};
		const fetchMock = respond(run);
		const base = {
			objective: 'AI startups in Lisbon',
			entity_type: 'companies',
			match_conditions: [{ name: 'lisbon', description: 'Based in Lisbon' }],
			generator: 'preview' as const,
			match_limit: 5,
		};
		await api.findall.createRun({
			...base,
			webhook: {
				url: 'https://example.com/hooks/parallel',
				event_types: ['findall.candidate.matched', 'findall.run.completed'],
			},
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		await expect(
			api.findall.createRun({
				...base,
				webhook: {
					url: 'https://example.com/hooks/parallel',
					event_types: ['task_run.status'],
				},
			} as never),
		).rejects.toThrow();
	});
});
