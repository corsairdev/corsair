import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StackAIAPIError, stackai } from './index';

const id = '00000000-0000-4000-8000-000000000000';
const summary = {
	run_id: id,
	project_id: null,
	status: 'running',
	error: null,
	created_at: '2026-01-01T00:00:00Z',
	started_at: null,
	completed_at: null,
	run_type: null,
	created_by: null,
	usage: { total_tokens: 0, details: [] },
	parent_run_id: null,
	parent_project_id: null,
};
const run = {
	...summary,
	input: null,
	output: null,
	citations: null,
	pending_input: null,
};
const plugin = stackai({ key: 'test-key', baseURL: 'https://private.example' });
const ctx = {
	key: 'test-key',
	options: { baseURL: 'https://private.example' },
} as never;
let fetchMock: jest.SpyInstance;
function reply(
	body: object,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json', ...headers },
		}),
	);
}
function request() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init, headers: new Headers(init.headers) };
}
beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('Unexpected fetch');
	});
});
afterEach(() => {
	fetchMock.mockRestore();
});

describe('StackAI public endpoints', () => {
	it('exports input and output registries for every registered operation', () => {
		const endpointSchemas = plugin.endpointSchemas!;
		expect(Object.keys(EndpointInputSchemas).sort()).toEqual(
			Object.keys(endpointSchemas).sort(),
		);
		expect(Object.keys(EndpointOutputSchemas).sort()).toEqual(
			Object.keys(endpointSchemas).sort(),
		);
		for (const key of Object.keys(EndpointInputSchemas) as Array<
			keyof typeof EndpointInputSchemas
		>) {
			expect(EndpointInputSchemas[key]).toBe(endpointSchemas[key]?.input);
			expect(EndpointOutputSchemas[key]).toBe(endpointSchemas[key]?.output);
		}
	});

	it('reads a project schema with an encoded path and version', async () => {
		const body = {
			data: {
				input_kind: 'start_node',
				inputs: [{ id: 'in-0', name: 'Prompt' }],
				outputs: [],
			},
		};
		reply(body);
		expect(
			await plugin.endpoints!.projects.ioSchema(ctx, {
				project_id: 'project one',
				version: 2,
			}),
		).toEqual(body);
		const r = request();
		expect(r.url.pathname).toBe('/v2/projects/project%20one/io-schema');
		expect(r.url.searchParams.get('version')).toBe('2');
		expect(r.headers.get('authorization')).toBe('Bearer test-key');
		expect(r.init.method).toBe('GET');
	});
	it('starts a run and preserves both the body and Location', async () => {
		reply({ data: run }, 201, { location: `/v2/runs/${id}` });
		const input = {
			project_id: 'project',
			input: { 'in-0': 'hello' },
			project_version: null,
		};
		expect(await plugin.endpoints!.runs.start(ctx, input)).toEqual({
			body: { data: run },
			location: `/v2/runs/${id}`,
		});
		const r = request();
		expect(r.url.pathname).toBe('/v2/runs');
		expect(r.init.method).toBe('POST');
		expect(JSON.parse(String(r.init.body))).toEqual(input);
	});
	it('forwards a subsequent page and preserves nullable run fields', async () => {
		reply({
			data: [summary],
			next_cursor: null,
			current_cursor: 'next/+',
			prev_cursor: null,
		});
		const result = await plugin.endpoints!.runs.list(ctx, {
			cursor: 'next/+',
			page_size: 7,
			status: 'running',
		});
		expect(result.data?.[0]?.project_id).toBeNull();
		expect(result.next_cursor).toBeNull();
		const r = request();
		expect(r.url.searchParams.get('cursor')).toBe('next/+');
		expect(r.url.searchParams.get('page_size')).toBe('7');
		expect(r.url.searchParams.get('status')).toBe('running');
	});
	it('reads a run with nullable output', async () => {
		reply({ data: run });
		expect(
			(await plugin.endpoints!.runs.get(ctx, { run_id: id })).data.output,
		).toBeNull();
		expect(request().url.pathname).toBe(`/v2/runs/${id}`);
	});
	it('cancels without sending a body and preserves Location', async () => {
		reply({}, 202, { location: `/v2/runs/${id}` });
		expect(await plugin.endpoints!.runs.cancel(ctx, { run_id: id })).toEqual({
			body: {},
			location: `/v2/runs/${id}`,
		});
		expect(request().url.pathname).toBe(`/v2/runs/${id}/cancel`);
		expect(request().init.body).toBeUndefined();
	});
	it('resumes with the provider wire body', async () => {
		reply({}, 202);
		expect(
			await plugin.endpoints!.runs.resume(ctx, {
				run_id: id,
				resume_token: 'secret',
				response: 'yes',
				response_type: 'approval',
			}),
		).toEqual({ body: {}, location: null });
		expect(request().url.pathname).toBe(`/v2/runs/${id}/resume`);
		expect(JSON.parse(String(request().init.body))).toEqual({
			resume_token: 'secret',
			response: 'yes',
			response_type: 'approval',
		});
	});
	it('rejects dangerous paths, invalid pages and invalid outputs', async () => {
		await expect(
			plugin.endpoints!.projects.ioSchema(ctx, { project_id: '../other' }),
		).rejects.toThrow();
		await expect(
			plugin.endpoints!.runs.get(ctx, { run_id: '..' }),
		).rejects.toThrow();
		await expect(
			plugin.endpoints!.runs.list(ctx, { page_size: 1001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
		reply({ data: { status: 'running' } });
		await expect(
			plugin.endpoints!.runs.get(ctx, { run_id: id }),
		).rejects.toThrow();
	});
	it('retains provider error details and never replays a failed write', async () => {
		reply({ detail: ['busy'] }, 429, { 'retry-after': '2' });
		// A thrown value is not necessarily an Error; the assertion narrows it.
		let error: unknown;
		try {
			await plugin.endpoints!.runs.start(ctx, { project_id: 'p', input: {} });
		} catch (caught) {
			error = caught;
		}
		expect(error).toBeInstanceOf(StackAIAPIError);
		expect(error).toMatchObject({
			status: 429,
			body: { detail: ['busy'] },
			retryAfter: 2000,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(
			(await errorHandlers.RATE_LIMIT_ERROR.handler(error as Error)).maxRetries,
		).toBe(0);
	});
	it('rejects missing credentials before making a request', async () => {
		await expect(
			plugin.endpoints!.runs.list({ key: '', options: {} } as never, {}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
