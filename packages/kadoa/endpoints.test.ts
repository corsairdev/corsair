import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { kadoaErrorCode } from './client';
import {
	Changes,
	Locations,
	Schemas,
	Triggers,
	Variables,
	Workflows,
} from './endpoints';
import {
	changes,
	dataNotPublished,
	history,
	jobFinished,
	jobStatus,
	locations,
	pipelineCrowded,
	runConflict,
	runStarted,
	schemaDefinition,
	schemasList,
	triggers,
	unauthorized,
	validationError,
	variable,
	variables,
	variablesList,
	workflow,
	workflowData,
	workflowDetail,
	workflowsList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tk-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// pause, schedule and workflow delete answer text/plain.
function respondText(body: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'text/plain' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allTags: parsed.searchParams.getAll('tags'),
		allTemplateIds: parsed.searchParams.getAll('templateId'),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.kadoa.com');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('workflows.list', () => {
	it('GETs v4/workflows with no filters and keeps every workflow', async () => {
		respond(workflowsList);

		const result = (await invoke(Workflows.list, {})) as {
			workflows: typeof workflowsList.workflows;
			nextSkip: number | null;
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows',
			query: {},
			body: undefined,
		});
		expect(result.workflows).toEqual(workflowsList.workflows);
		expect(result.nextSkip).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.list',
			{ count: 2, total: 2 },
			'completed',
		);
	});

	it('sends every filter the caller asked for', async () => {
		respond(workflowsList);

		await invoke(Workflows.list, {
			search: 'catalog',
			skip: 25,
			limit: 50,
			state: 'ACTIVE',
			runState: 'FAILED',
			displayState: ['ACTIVE', 'PAUSED'],
			tags: ['pricing', 'stock'],
			statusFilters: ['group:attention'],
			monitoring: false,
			updateInterval: 'HOURLY',
			scheduleType: 'RECURRING',
			templateId: ['tpl_01'],
			includeDeleted: true,
		});

		const sent = lastRequest();
		// A list goes as a repeated parameter, which Kadoa documents alongside
		// the comma-separated form; Object.fromEntries keeps only the last of a
		// repeated name, so those two are checked separately.
		expect(sent.query).toEqual({
			search: 'catalog',
			skip: '25',
			limit: '50',
			state: 'ACTIVE',
			runState: 'FAILED',
			displayState: 'ACTIVE,PAUSED',
			statusFilters: 'group:attention',
			monitoring: 'false',
			updateInterval: 'HOURLY',
			scheduleType: 'RECURRING',
			includeDeleted: 'true',
			tags: 'stock',
			templateId: 'tpl_01',
		});
		expect(sent.allTags).toEqual(['pricing', 'stock']);
		expect(sent.allTemplateIds).toEqual(['tpl_01']);
	});

	it('offers the next skip while a page comes back full', async () => {
		const page = Array.from({ length: 2 }, (_, index) => ({
			...workflow,
			id: `wf_${index}`,
		}));
		respond({ workflows: page });

		await expect(
			invoke(Workflows.list, { skip: 4, limit: 2 }),
		).resolves.toMatchObject({ nextSkip: 6 });
	});

	it('reports no next skip on a short page', async () => {
		respond({ workflows: [workflow] });

		await expect(invoke(Workflows.list, { limit: 5 })).resolves.toMatchObject({
			nextSkip: null,
		});
	});

	it('keeps states and fields it does not know', async () => {
		respond({
			workflows: [{ id: 'wf_x', state: 'SOMETHING_NEW', brandNew: 'kept' }],
		});

		await expect(invoke(Workflows.list, {})).resolves.toMatchObject({
			workflows: [{ id: 'wf_x', state: 'SOMETHING_NEW', brandNew: 'kept' }],
		});
	});

	it.each([
		[{ state: 'active' }],
		[{ displayState: [] }],
		[{ skip: -1 }],
		[{ limit: 0 }],
		[{ updateInterval: 'EVERY_10_MINUTES' }],
		[{ includeDeleted: 'yes' }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a body that is not a workflow list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Workflows.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it.each([
		['an empty body', ''],
		['a body that is not JSON', '{"workflows": ['],
	])('rejects %s instead of reporting no workflows', async (_label, text) => {
		fetchMock.mockResolvedValueOnce(
			new Response(text, {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await expect(invoke(Workflows.list, {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('workflows.get', () => {
	it('GETs one workflow by ID', async () => {
		respond(workflowDetail);

		await expect(
			invoke(Workflows.get, { workflowId: 'wf_01HZX6' }),
		).resolves.toMatchObject({
			id: 'wf_01HZX6',
			scheduleTimezone: 'UTC',
			entity: 'Product',
		});
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6',
			query: {},
		});
	});

	it('encodes the workflow ID into one path segment', async () => {
		respond(workflowDetail);

		await invoke(Workflows.get, { workflowId: '../../v4/me' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe('https://api.kadoa.com/v4/workflows/..%2F..%2Fv4%2Fme');
	});

	it('surfaces an unknown workflow', async () => {
		respond({ error: true, message: 'Workflow not found' }, 404);

		await expect(
			invoke(Workflows.get, { workflowId: 'wf_nope' }),
		).rejects.toMatchObject({
			status: 404,
			message: 'Kadoa 404: Workflow not found',
		});
	});

	it.each([[{}], [{ workflowId: '' }], [{ workflowId: 42 }]])(
		'rejects %j before calling Kadoa',
		async (input) => {
			await expect(invoke(Workflows.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('workflows.create', () => {
	it('POSTs a prompt workflow and returns its id', async () => {
		respond(
			{
				error: false,
				success: true,
				workflowId: 'wf_new',
				message: 'Workflow created',
			},
			201,
		);

		await expect(
			invoke(Workflows.create, {
				urls: ['https://acme.example/products'],
				name: 'Product Catalog',
				userPrompt: 'Collect every product name and price from the listing.',
				interval: 'DAILY',
				tags: ['pricing'],
			}),
		).resolves.toMatchObject({ workflowId: 'wf_new', success: true });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/workflows',
			body: {
				urls: ['https://acme.example/products'],
				name: 'Product Catalog',
				userPrompt: 'Collect every product name and price from the listing.',
				interval: 'DAILY',
				tags: ['pricing'],
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	it('sends only the fields the caller gave', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			userPrompt: 'Extract every listing on this page.',
		});

		expect(lastRequest().body).toEqual({
			urls: ['https://acme.example/p'],
			userPrompt: 'Extract every listing on this page.',
		});
	});

	it('builds from an existing schema', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			schemaId: 'sch_01HZX8',
		});

		expect(lastRequest().body).toEqual({
			urls: ['https://acme.example/p'],
			schemaId: 'sch_01HZX8',
		});
	});

	it('builds from inline entity and fields', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			entity: 'Product',
			fields: [
				{
					name: 'title',
					fieldType: 'SCHEMA',
					dataType: 'STRING',
					description: 'The product name',
				},
				{
					name: 'category',
					fieldType: 'SCHEMA',
					dataType: 'STRING',
					description: 'The product category',
					isKey: true,
				},
			],
		});

		expect(lastRequest().body).toEqual({
			urls: ['https://acme.example/p'],
			entity: 'Product',
			fields: [
				{
					name: 'title',
					fieldType: 'SCHEMA',
					dataType: 'STRING',
					description: 'The product name',
				},
				{
					name: 'category',
					fieldType: 'SCHEMA',
					dataType: 'STRING',
					description: 'The product category',
					isKey: true,
				},
			],
		});
	});

	it('takes entity or fields alone as hints on a prompt workflow', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			userPrompt: 'Collect every product and its price.',
			entity: 'Product',
		});

		expect(lastRequest().body).toEqual({
			urls: ['https://acme.example/p'],
			userPrompt: 'Collect every product and its price.',
			entity: 'Product',
		});
	});

	it('sends a null limit for no limit', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			userPrompt: 'Collect every product and its price.',
			limit: null,
		});

		expect(lastRequest().body).toMatchObject({ limit: null });
	});

	it('builds from a template, pinning its version', async () => {
		respond(
			{ error: false, success: true, workflowId: 'wf_new', message: 'ok' },
			201,
		);

		await invoke(Workflows.create, {
			urls: ['https://acme.example/p'],
			templateId: 'tpl_01',
			templateVersion: 3,
		});

		expect(lastRequest().body).toEqual({
			urls: ['https://acme.example/p'],
			templateId: 'tpl_01',
			templateVersion: 3,
		});
	});

	it.each([
		[{ urls: ['https://acme.example/p'] }],
		[{ urls: [], userPrompt: 'Collect every product and its price.' }],
		[
			{
				urls: ['not-a-url'],
				userPrompt: 'Collect every product and its price.',
			},
		],
		[{ urls: ['https://a.example'], userPrompt: 'short' }],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				templateVersion: 2,
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				templateId: 'tpl_01',
				schemaId: 'sch_01',
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				schemaId: 'sch_01',
				entity: 'Product',
			},
		],
		[{ urls: ['https://a.example'], entity: 'Product' }],
		[
			{
				urls: ['https://a.example'],
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'The product name',
					},
				],
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				entity: 'Product',
				fields: [{ name: 'title', fieldType: 'SCHEMA' }],
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				entity: 'Product',
				fields: [
					{
						name: 'cat',
						fieldType: 'CLASSIFICATION',
						categories: [{ title: 'A', definition: 'First' }],
						dataType: 'STRING',
					},
				],
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				entity: 'Product',
				fields: [{ name: 'has.dot', fieldType: 'SCHEMA', dataType: 'STRING' }],
			},
		],
		[
			{
				urls: ['https://a.example'],
				userPrompt: 'Collect every product and its price.',
				location: { type: 'manual' },
			},
		],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a source list spanning several sites', async () => {
		respond({ error: 'Sources span several websites' }, 422);

		await expect(
			invoke(Workflows.create, {
				urls: ['https://a.example/x', 'https://b.example/y'],
				userPrompt: 'Collect every product and its price.',
			}),
		).rejects.toMatchObject({
			status: 422,
			message: 'Kadoa 422: Sources span several websites',
		});
	});
});

describe('workflows.updateMetadata', () => {
	it('PUTs only the fields the caller changed', async () => {
		respond({ success: true, message: 'Workflow updated' });

		await expect(
			invoke(Workflows.updateMetadata, {
				workflowId: 'wf_01HZX6',
				name: 'Catalog v2',
				limit: null,
				updateInterval: 'HOURLY',
			}),
		).resolves.toEqual({ success: true, message: 'Workflow updated' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/workflows/wf_01HZX6/metadata',
			body: { name: 'Catalog v2', limit: null, updateInterval: 'HOURLY' },
		});
	});

	it('sends monitored fields', async () => {
		respond({ success: true, message: 'Workflow updated' });

		await invoke(Workflows.updateMetadata, {
			workflowId: 'wf_01HZX6',
			monitoring: {
				fields: [{ fieldName: 'price', operator: 'changed' }],
			},
		});

		expect(lastRequest().body).toEqual({
			monitoring: { fields: [{ fieldName: 'price', operator: 'changed' }] },
		});
	});

	it('accepts the ten-minute interval Kadoa allows here, unlike on create', async () => {
		respond({ success: true, message: 'Workflow updated' });

		await invoke(Workflows.updateMetadata, {
			workflowId: 'wf_01HZX6',
			updateInterval: 'EVERY_10_MINUTES',
		});

		expect(lastRequest().body).toEqual({ updateInterval: 'EVERY_10_MINUTES' });
	});

	it.each([
		[{ workflowId: 'wf_01HZX6' }],
		[{ workflowId: 'wf_01HZX6', updateInterval: 'TWO_HOURLY' }],
		[{ workflowId: 'wf_01HZX6', limit: 0 }],
		[{ workflowId: 'wf_01HZX6', urls: [] }],
		[{ workflowId: 'wf_01HZX6', monitoring: { fields: [] } }],
		[{ workflowId: 'wf_01HZX6', tags: ['x'] }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.updateMetadata, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('workflows.delete', () => {
	it('DELETEs the workflow and returns Kadoa’s message', async () => {
		respondText('Workflow deleted');

		await expect(
			invoke(Workflows.remove, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual({ message: 'Workflow deleted' });
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v4/workflows/wf_01HZX6',
			body: undefined,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.delete',
			{ workflowId: 'wf_01HZX6' },
			'completed',
		);
	});

	it('accepts a JSON message from a gateway in front of Kadoa', async () => {
		respond({ message: 'Workflow deleted' });

		await expect(
			invoke(Workflows.remove, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual({ message: 'Workflow deleted' });
	});

	it('throws rather than report a delete that returned nothing', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const error = await caught(invoke(Workflows.remove, { workflowId: 'wf' }));

		expect(error).toBeInstanceOf(Error);
		expect(String(error)).toContain('no message');
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('workflows.run', () => {
	it('PUTs a run with no body and returns the job ID', async () => {
		respond(runStarted);

		await expect(
			invoke(Workflows.run, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual(runStarted);
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/workflows/wf_01HZX6/run',
			body: {},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.run',
			{ workflowId: 'wf_01HZX6', jobId: 'job_01HZX7' },
			'completed',
		);
	});

	it('sends variables and a record limit', async () => {
		respond(runStarted);

		await invoke(Workflows.run, {
			workflowId: 'wf_01HZX6',
			variables: { region: 'eu-west' },
			limit: 100,
		});

		expect(lastRequest().body).toEqual({
			variables: { region: 'eu-west' },
			limit: 100,
		});
	});

	it('sends preview on its own', async () => {
		respond(runStarted);

		await invoke(Workflows.run, { workflowId: 'wf_01HZX6', preview: true });

		expect(lastRequest().body).toEqual({ preview: true });
	});

	it('surfaces a workflow that is not ready to run', async () => {
		respond(runConflict, 409);

		await expect(
			invoke(Workflows.run, { workflowId: 'wf_01HZX6' }),
		).rejects.toMatchObject({
			status: 409,
			body: { reason: 'PREVIEW_AWAITS_CUSTOMER_CONFIRMATION' },
			message:
				'Kadoa 409 PREVIEW_AWAITS_CUSTOMER_CONFIRMATION: Workflow is not ready to run',
		});
	});

	it('surfaces a crowded pipeline as a rate limit', async () => {
		respond(pipelineCrowded, 429);

		const error = await caught(invoke(Workflows.run, { workflowId: 'wf' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 429 });
		expect(kadoaErrorCode(error)).toBe('PIPELINE_CROWDED');
	});

	it.each([
		[{ workflowId: 'wf', preview: true, limit: 10 }],
		[{ workflowId: 'wf', limit: 0 }],
		[{ workflowId: 'wf', variables: { region: 3 } }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.run, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe.each([
	['pause', Workflows.pause],
	['resume', Workflows.resume],
	['stop', Workflows.stop],
])('workflows.%s', (action, endpoint) => {
	it(`PUTs to the ${action} route`, async () => {
		respond({
			message: `Workflow ${action === 'stop' ? 'run is being stopped' : action}`,
		});

		await invoke(endpoint, { workflowId: 'wf_01HZX6' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/v4/workflows/wf_01HZX6/${action}`,
			query: {},
			body: undefined,
		});
	});

	it.each([[{}], [{ workflowId: '' }], [{ workflowId: null }]])(
		'rejects %j before calling Kadoa',
		async (input) => {
			await expect(invoke(endpoint, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('workflows.pause', () => {
	it('reads the plain-text answer as the message', async () => {
		respondText('Workflow paused');

		await expect(
			invoke(Workflows.pause, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual({ message: 'Workflow paused' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.pause',
			{ workflowId: 'wf_01HZX6' },
			'completed',
		);
	});
});

describe('workflows.resume', () => {
	it('returns the message and no job on a 200', async () => {
		respond({ message: 'Workflow unpaused' });

		await expect(
			invoke(Workflows.resume, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual({ message: 'Workflow unpaused' });
	});

	it('keeps the preview job ID a 202 returns', async () => {
		respond(
			{ message: 'A new preview was started', jobId: 'job_preview' },
			202,
		);

		await expect(
			invoke(Workflows.resume, { workflowId: 'wf_01HZX6' }),
		).resolves.toMatchObject({ jobId: 'job_preview' });
	});

	it('surfaces a workflow that cannot resume from its state', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 400 }));

		await expect(
			invoke(Workflows.resume, { workflowId: 'wf_01HZX6' }),
		).rejects.toMatchObject({ status: 400 });
	});
});

describe('workflows.stop', () => {
	it('returns the stopping message', async () => {
		respond({ message: 'Workflow run is being stopped' });

		await expect(
			invoke(Workflows.stop, { workflowId: 'wf_01HZX6' }),
		).resolves.toEqual({ message: 'Workflow run is being stopped' });
	});
});

describe('workflows.schedule', () => {
	it('PUTs the UTC date and returns the plain-text message', async () => {
		respondText('Workflow scheduled');

		await expect(
			invoke(Workflows.schedule, {
				workflowId: 'wf_01HZX6',
				date: '2026-11-20T06:00:00.000Z',
			}),
		).resolves.toEqual({ message: 'Workflow scheduled' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/workflows/wf_01HZX6/schedule',
			body: { date: '2026-11-20T06:00:00.000Z' },
		});
	});

	it.each([
		[{ workflowId: 'wf' }],
		[{ workflowId: 'wf', date: 'next tuesday' }],
		[{ workflowId: 'wf', date: '2026-11-20' }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.schedule, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('workflows.history', () => {
	it('GETs the run history with no paging parameters', async () => {
		respond(history);

		const result = (await invoke(Workflows.history, {
			workflowId: 'wf_01HZX6',
		})) as {
			workflowRuns: typeof history.workflowRuns;
			nextPage: number | null;
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6/history',
			query: {},
		});
		expect(result.workflowRuns).toHaveLength(2);
		expect(result.nextPage).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.history',
			{ workflowId: 'wf_01HZX6', count: 2 },
			'completed',
		);
	});

	it('sends paging, a run ID and a status filter', async () => {
		respond(history);

		await invoke(Workflows.history, {
			workflowId: 'wf_01HZX6',
			page: 2,
			limit: 50,
			runId: 'run_02',
			status: 'failed',
		});

		expect(lastRequest().query).toEqual({
			page: '2',
			limit: '50',
			runId: 'run_02',
			status: 'failed',
		});
	});

	it('offers the next page while totalPages says there is one', async () => {
		respond({
			...history,
			pagination: { page: 1, limit: 1, totalPages: 2, totalCount: 2 },
			workflowRuns: [history.workflowRuns[0]],
		});

		await expect(
			invoke(Workflows.history, { workflowId: 'wf', limit: 1 }),
		).resolves.toMatchObject({ nextPage: 2 });
	});

	it('offers the next page without pagination when the page is full', async () => {
		respond({ workflowId: 'wf', workflowRuns: history.workflowRuns });

		await expect(
			invoke(Workflows.history, { workflowId: 'wf', limit: 2 }),
		).resolves.toMatchObject({ nextPage: 2 });
	});

	it.each([
		[{ workflowId: 'wf', limit: 1001 }],
		[{ workflowId: 'wf', limit: 0 }],
		[{ workflowId: 'wf', page: 0 }],
		[{ workflowId: 'wf', status: 'FINISHED' }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.history, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads who stopped a run, which Kadoa sends as an object', async () => {
		respond({
			...history,
			workflowRuns: [
				{
					id: 'run_03',
					state: 'STOPPED',
					startedBy: 'API',
					stoppedBy: { kind: 'user', name: 'Ada', via: 'dashboard' },
				},
			],
		});

		await expect(
			invoke(Workflows.history, { workflowId: 'wf' }),
		).resolves.toMatchObject({
			workflowRuns: [{ id: 'run_03', stoppedBy: { kind: 'user' } }],
		});
	});

	it('rejects a page with no workflowRuns instead of reporting no runs', async () => {
		respond({
			workflowId: 'wf',
			totalCount: 3,
			pagination: history.pagination,
		});

		await expect(
			invoke(Workflows.history, { workflowId: 'wf' }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('workflows.data', () => {
	it('GETs a page of rows and keeps the record fields', async () => {
		respond(workflowData);

		const result = (await invoke(Workflows.data, {
			workflowId: 'wf_01HZX6',
		})) as { data: typeof workflowData.data; nextPage: number | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6/data',
			query: {},
		});
		expect(result.data).toEqual(workflowData.data);
		expect(result.nextPage).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.workflows.data',
			{ workflowId: 'wf_01HZX6', rows: 2, total: 2 },
			'completed',
		);
	});

	it('sends filters JSON-encoded, row IDs comma-separated and the sort', async () => {
		respond(workflowData);

		await invoke(Workflows.data, {
			workflowId: 'wf_01HZX6',
			runId: 'run_01',
			sortBy: 'price',
			order: 'desc',
			filters: [{ field: 'price', operator: 'GREATER_THAN', value: '10' }],
			page: 2,
			limit: 50,
			rowIds: ['r1', 'r2'],
		});

		expect(lastRequest().query).toEqual({
			runId: 'run_01',
			sortBy: 'price',
			order: 'desc',
			filters: '[{"field":"price","operator":"GREATER_THAN","value":"10"}]',
			page: '2',
			limit: '50',
			rowIds: 'r1,r2',
		});
	});

	it('streams every row when the limit is 0 and offers no next page', async () => {
		respond({ ...workflowData, pagination: undefined });

		await expect(
			invoke(Workflows.data, { workflowId: 'wf', limit: 0 }),
		).resolves.toMatchObject({ nextPage: null });
		expect(lastRequest().query.limit).toBe('0');
	});

	it('offers the next page while totalPages says there is one', async () => {
		respond({
			...workflowData,
			pagination: { totalCount: 60, page: 1, totalPages: 3, limit: 25 },
		});

		await expect(
			invoke(Workflows.data, { workflowId: 'wf' }),
		).resolves.toMatchObject({ nextPage: 2 });
	});

	it('uses the documented default page size to judge a full page', async () => {
		respond({
			...workflowData,
			pagination: undefined,
			data: Array.from({ length: 25 }, (_, index) => ({ title: `p${index}` })),
		});

		await expect(
			invoke(Workflows.data, { workflowId: 'wf' }),
		).resolves.toMatchObject({ nextPage: 2 });
	});

	it('surfaces a run whose data was never published', async () => {
		respond(dataNotPublished, 409);

		await expect(
			invoke(Workflows.data, { workflowId: 'wf' }),
		).rejects.toMatchObject({ status: 409 });
	});

	it.each([
		[{ workflowId: 'wf', limit: -1 }],
		[{ workflowId: 'wf', page: 0 }],
		[{ workflowId: 'wf', order: 'up' }],
		[{ workflowId: 'wf', filters: [] }],
		[{ workflowId: 'wf', filters: [{ field: 'price' }] }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Workflows.data, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends an IN filter with an array and an IS_NULL filter with no value', async () => {
		respond(workflowData);

		await invoke(Workflows.data, {
			workflowId: 'wf',
			filters: [
				{ field: 'department', operator: 'IN', value: ['Sales', 'Marketing'] },
				{ field: 'closedAt', operator: 'IS_NULL' },
				{ field: 'postedAt', operator: 'WITHIN_LAST_DAYS', value: 7 },
			],
		});

		expect(lastRequest().query.filters).toBe(
			'[{"field":"department","operator":"IN","value":["Sales","Marketing"]},{"field":"closedAt","operator":"IS_NULL"},{"field":"postedAt","operator":"WITHIN_LAST_DAYS","value":7}]',
		);
	});

	it('gives a streamed read the five minutes Kadoa allows', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		respond({ ...workflowData, pagination: undefined });

		await invoke(Workflows.data, { workflowId: 'wf', limit: 0 });

		expect(timeout).toHaveBeenCalledWith(300_000);
		timeout.mockRestore();
	});

	it('rejects a page with no data array instead of reporting no rows', async () => {
		respond({ workflowId: 'wf', pagination: { totalCount: 40, page: 1 } });

		await expect(
			invoke(Workflows.data, { workflowId: 'wf' }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('workflows.jobStatus', () => {
	it('GETs the job under its workflow', async () => {
		respond(jobStatus);

		await expect(
			invoke(Workflows.jobStatus, {
				workflowId: 'wf_01HZX6',
				jobId: 'job_01HZX7',
			}),
		).resolves.toMatchObject({ id: 'job_01HZX7', state: 'IN_PROGRESS' });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6/jobs/job_01HZX7',
		});
	});

	it('reads a finished job', async () => {
		respond(jobFinished);

		await expect(
			invoke(Workflows.jobStatus, { workflowId: 'wf', jobId: 'job' }),
		).resolves.toMatchObject({ state: 'FINISHED' });
	});

	it.each([[{}], [{ workflowId: 'wf' }], [{ jobId: 'job' }]])(
		'rejects %j before calling Kadoa',
		async (input) => {
			await expect(invoke(Workflows.jobStatus, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('workflows.connectors', () => {
	it('GETs the destinations delivering a workflow', async () => {
		respond({
			connectors: [
				{
					name: 'Warehouse',
					provider: 'snowflake',
					destination: 'ACME.ANALYTICS.PRODUCTS',
					formats: ['json'],
				},
			],
		});

		await expect(
			invoke(Workflows.connectors, { workflowId: 'wf_01HZX6' }),
		).resolves.toMatchObject({ connectors: [{ provider: 'snowflake' }] });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6/connectors',
		});
	});

	it('returns an empty list when nothing delivers the workflow', async () => {
		respond({ connectors: [] });

		await expect(
			invoke(Workflows.connectors, { workflowId: 'wf' }),
		).resolves.toEqual({ connectors: [] });
	});
});

describe('schemas.list', () => {
	it('GETs every schema', async () => {
		respond(schemasList);

		await expect(invoke(Schemas.list, {})).resolves.toEqual(schemasList);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/schemas/',
		});
	});

	it('keeps a secret-shaped schema it does not know', async () => {
		respond({
			error: false,
			data: [{ id: 'sch_x', name: 'X', extra: 'kept' }],
		});

		await expect(invoke(Schemas.list, {})).resolves.toMatchObject({
			data: [{ id: 'sch_x', extra: 'kept' }],
		});
	});
});

describe('schemas.get', () => {
	it('GETs one schema', async () => {
		respond({ error: false, data: schemaDefinition });

		await expect(
			invoke(Schemas.get, { schemaId: 'sch_01HZX8' }),
		).resolves.toMatchObject({ data: { id: 'sch_01HZX8', entity: 'Product' } });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/schemas/sch_01HZX8',
		});
	});

	it('reads a field whose example is a list of samples', async () => {
		respond({
			error: false,
			data: {
				...schemaDefinition,
				schema: [{ ...schemaDefinition.schema[0], example: ['A', 'B'] }],
			},
		});

		await expect(
			invoke(Schemas.get, { schemaId: 'sch_01HZX8' }),
		).resolves.toMatchObject({
			data: { schema: [{ example: ['A', 'B'] }] },
		});
	});

	it('surfaces an unknown schema', async () => {
		respond({ error: true, message: 'Schema not found' }, 404);

		await expect(
			invoke(Schemas.get, { schemaId: 'sch_nope' }),
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('schemas.create', () => {
	it('POSTs typed fields and returns the schema ID', async () => {
		respond(
			{
				error: false,
				success: true,
				schemaId: 'sch_new',
				message: 'Schema created',
			},
			201,
		);

		await expect(
			invoke(Schemas.create, {
				name: 'Product',
				entity: 'Product',
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'The product name',
						isKey: true,
					},
				],
			}),
		).resolves.toMatchObject({ schemaId: 'sch_new' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/schemas/',
			body: {
				name: 'Product',
				entity: 'Product',
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'The product name',
						isKey: true,
					},
				],
			},
		});
	});

	it('sends a classification field as its own shape', async () => {
		respond(
			{ error: false, success: true, schemaId: 'sch_new', message: 'ok' },
			201,
		);

		await invoke(Schemas.create, {
			name: 'Review',
			fields: [
				{
					name: 'sentiment',
					fieldType: 'CLASSIFICATION',
					categories: [
						{ title: 'Positive', definition: 'The review praises the product' },
						{ title: 'Negative', definition: 'The review criticises it' },
					],
				},
			],
		});

		expect(lastRequest().body).toEqual({
			name: 'Review',
			fields: [
				{
					name: 'sentiment',
					fieldType: 'CLASSIFICATION',
					categories: [
						{ title: 'Positive', definition: 'The review praises the product' },
						{ title: 'Negative', definition: 'The review criticises it' },
					],
				},
			],
		});
	});

	it('drops the keys the chosen field shape does not use', async () => {
		respond(
			{ error: false, success: true, schemaId: 'sch_new', message: 'ok' },
			201,
		);

		await invoke(Schemas.create, {
			name: 'Review',
			fields: [
				{
					name: 'sentiment',
					fieldType: 'CLASSIFICATION',
					categories: [{ title: 'A', definition: 'First' }],
					mapper: 'categorize',
				},
			],
		});

		expect(lastRequest().body).toEqual({
			name: 'Review',
			fields: [
				{
					name: 'sentiment',
					fieldType: 'CLASSIFICATION',
					categories: [{ title: 'A', definition: 'First' }],
				},
			],
		});
	});

	it.each([
		[{ name: 'Product' }],
		[{ name: '', fields: [] }],
		[{ name: 'Product', fields: [{ name: 'title', fieldType: 'SCHEMA' }] }],
		[
			{
				name: 'Product',
				fields: [
					{
						name: 'cat',
						fieldType: 'CLASSIFICATION',
						categories: [{ title: 'A', definition: 'First' }],
						dataType: 'STRING',
					},
				],
			},
		],
		[
			{
				name: 'Product',
				fields: [{ name: 'title', fieldType: 'SCHEMA', dataType: 'TEXT' }],
			},
		],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Schemas.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		[
			'a SCHEMA field with no description',
			{ name: 'title', fieldType: 'SCHEMA', dataType: 'STRING' },
		],
		[
			'a CLASSIFICATION field with no categories',
			{ name: 'kind', fieldType: 'CLASSIFICATION' },
		],
	])('rejects %s before calling Kadoa', async (_label, field) => {
		await expect(
			invoke(Schemas.create, { name: 'Product', fields: [field] }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('schemas.update', () => {
	it('PUTs a new revision of the fields', async () => {
		respond({
			error: false,
			success: true,
			message: 'Schema updated',
			updatedSchema: schemaDefinition,
		});

		await expect(
			invoke(Schemas.update, {
				schemaId: 'sch_01HZX8',
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'Product title',
					},
					{
						name: 'price',
						fieldType: 'SCHEMA',
						dataType: 'MONEY',
						description: 'Listed price',
					},
				],
			}),
		).resolves.toMatchObject({ updatedSchema: { id: 'sch_01HZX8' } });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/schemas/sch_01HZX8',
			body: {
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'Product title',
					},
					{
						name: 'price',
						fieldType: 'SCHEMA',
						dataType: 'MONEY',
						description: 'Listed price',
					},
				],
			},
		});
	});

	it('renames a schema without touching its fields', async () => {
		respond({ error: false, success: true, message: 'Schema updated' });

		await invoke(Schemas.update, { schemaId: 'sch_01HZX8', name: 'Catalog' });

		expect(lastRequest().body).toEqual({ name: 'Catalog' });
	});

	it.each([
		[{ schemaId: 'sch' }],
		[{ schemaId: 'sch', name: '' }],
		[{ schemaId: 'sch', fields: [] }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Schemas.update, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('clears the entity with null', async () => {
		respond({ error: false, success: true, message: 'Schema updated' });

		await invoke(Schemas.update, { schemaId: 'sch', entity: null });

		expect(lastRequest().body).toEqual({ entity: null });
	});
});

describe('schemas.delete', () => {
	it('DELETEs the schema and returns the message', async () => {
		respond({ error: false, success: true, message: 'Schema deleted' });

		await expect(
			invoke(Schemas.remove, { schemaId: 'sch_01HZX8' }),
		).resolves.toMatchObject({ message: 'Schema deleted' });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v4/schemas/sch_01HZX8',
		});
	});

	it('throws on a success body with no message', async () => {
		respond({ error: false, success: true });

		await expect(
			invoke(Schemas.remove, { schemaId: 'sch' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('changes.list', () => {
	it('GETs recent changes with no filters', async () => {
		respond(changes);

		await expect(invoke(Changes.list, {})).resolves.toMatchObject({
			changes: [{ id: 'chg_01' }],
			nextSkip: null,
		});
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v4/changes' });
		expect(lastRequest().query).toEqual({});
	});

	it('sends the workflow IDs, the window and the excluded fields', async () => {
		respond(changes);

		await invoke(Changes.list, {
			workflowIds: ['wf_01', 'wf_02'],
			startDate: '2026-11-01',
			endDate: '2026-11-12',
			skip: 50,
			limit: 25,
			exclude: ['differences'],
		});

		expect(lastRequest().query).toEqual({
			workflowIds: 'wf_01,wf_02',
			startDate: '2026-11-01',
			endDate: '2026-11-12',
			skip: '50',
			limit: '25',
			exclude: 'differences',
		});
	});

	it('offers the next skip while a page comes back full', async () => {
		respond({
			changesCount: 2,
			changes: changes.changes.concat(changes.changes),
		});

		await expect(
			invoke(Changes.list, { skip: 10, limit: 2 }),
		).resolves.toMatchObject({ nextSkip: 12 });
	});

	it.each([
		[{ workflowIds: [] }],
		[{ limit: 0 }],
		[{ limit: 101 }],
		[{ skip: -1 }],
		[{ exclude: ['data', 'history'] }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Changes.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('offers the next skip after a full page of the default size', async () => {
		const page = Array.from({ length: 25 }, (_, index) => ({
			...changes.changes[0],
			id: `chg_${index}`,
		}));
		respond({ changesCount: 25, changes: page });

		await expect(invoke(Changes.list, {})).resolves.toMatchObject({
			nextSkip: 25,
		});
	});

	it('follows totalCount when Kadoa sends one', async () => {
		respond({
			...changes,
			pagination: { totalCount: 3, page: 1, totalPages: 1, limit: 1 },
		});

		await expect(
			invoke(Changes.list, { skip: 1, limit: 1 }),
		).resolves.toMatchObject({ nextSkip: 2 });
	});

	it('rejects a body with no changes array instead of reporting no changes', async () => {
		respond({ changesCount: 50 });

		await expect(invoke(Changes.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('changes.get', () => {
	it('GETs one change with its differences', async () => {
		respond(changes.changes[0]);

		await expect(
			invoke(Changes.get, { changeId: 'chg_01' }),
		).resolves.toMatchObject({
			id: 'chg_01',
			differencesCounts: { changed: 1 },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/changes/chg_01',
		});
	});
});

describe('variables.list', () => {
	it('GETs the team variables', async () => {
		respond(variablesList);

		const result = (await invoke(Variables.list, {})) as {
			variables: typeof variables;
		};
		expect(result.variables).toHaveLength(2);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/variables/',
		});
	});

	it('sends the workflow filter and the includeWorkflows flag', async () => {
		respond(variablesList);

		await invoke(Variables.list, {
			workflowId: 'wf_01',
			includeWorkflows: true,
		});

		expect(lastRequest().query).toEqual({
			workflowId: 'wf_01',
			includeWorkflows: 'true',
		});
	});

	it('logs only the count, never a value', async () => {
		respond(variablesList);

		await invoke(Variables.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kadoa.variables.list',
			{ count: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('eu-west');
	});
});

describe('variables.get', () => {
	it('GETs one variable', async () => {
		respond(variable);

		await expect(
			invoke(Variables.get, { variableId: 'var_01' }),
		).resolves.toMatchObject({ variable: { key: 'region' } });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/variables/var_01',
		});
	});

	it('keeps a secret that comes back without a value', async () => {
		respond({ variable: variables[1], error: null });

		await expect(
			invoke(Variables.get, { variableId: 'var_02' }),
		).resolves.toMatchObject({ variable: { dataType: 'SECRET' } });
	});
});

describe('variables.create', () => {
	it('POSTs a plain variable', async () => {
		respond(variable);

		await invoke(Variables.create, {
			key: 'region',
			value: 'eu-west',
			dataType: 'STRING',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/variables/',
			body: { key: 'region', value: 'eu-west', dataType: 'STRING' },
		});
	});

	it('POSTs a plain variable with an empty value', async () => {
		respond(variable);

		await invoke(Variables.create, {
			key: 'suffix',
			value: '',
			dataType: 'STRING',
		});

		expect(lastRequest().body).toEqual({
			key: 'suffix',
			value: '',
			dataType: 'STRING',
		});
	});

	it('rejects a Kadoa-managed secret with an empty value', async () => {
		await expect(
			invoke(Variables.create, {
				key: 'apiLogin',
				value: '',
				dataType: 'SECRET',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('POSTs a Kadoa-managed secret', async () => {
		respond({ variable: variables[1], error: null });

		await invoke(Variables.create, {
			key: 'apiLogin',
			value: 'hunter2',
			dataType: 'SECRET',
		});

		expect(lastRequest().body).toEqual({
			key: 'apiLogin',
			value: 'hunter2',
			dataType: 'SECRET',
		});
	});

	it('POSTs a customer-managed secret with no value', async () => {
		respond({ variable: variables[1], error: null });

		await invoke(Variables.create, {
			key: 'apiLogin',
			dataType: 'SECRET',
			managementMode: 'CUSTOMER_MANAGED',
			providerConnectionId: '1f8a2c3e-0b44-4d55-9a6e-7c8d9e0f1a2b',
			resourceReference: 'projects/acme/secrets/kadoa-login',
		});

		expect(lastRequest().body).toEqual({
			key: 'apiLogin',
			dataType: 'SECRET',
			managementMode: 'CUSTOMER_MANAGED',
			providerConnectionId: '1f8a2c3e-0b44-4d55-9a6e-7c8d9e0f1a2b',
			resourceReference: 'projects/acme/secrets/kadoa-login',
		});
	});

	it('never logs a secret value', async () => {
		respond({ variable: variables[1], error: null });

		await invoke(Variables.create, {
			key: 'apiLogin',
			value: 'hunter2',
			dataType: 'SECRET',
		});

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('hunter2');
	});

	it.each([
		[{ key: 'region' }],
		[{ key: '', value: 'x' }],
		[{ key: 'region', value: 'x', managementMode: 'KADOA_MANAGED' }],
		[{ key: 'secret', dataType: 'SECRET' }],
		[
			{
				key: 'secret',
				value: 'x',
				dataType: 'SECRET',
				providerConnectionId: 'c',
			},
		],
		[
			{
				key: 'secret',
				dataType: 'SECRET',
				managementMode: 'CUSTOMER_MANAGED',
			},
		],
		[
			{
				key: 'secret',
				value: 'x',
				dataType: 'SECRET',
				managementMode: 'CUSTOMER_MANAGED',
				providerConnectionId: 'c',
				resourceReference: 'r',
			},
		],
		[{ key: 'region', value: 'x', dataType: 'DATE' }],
	])('rejects %j before calling Kadoa', async (input) => {
		await expect(invoke(Variables.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('variables.update', () => {
	it('PATCHes a new value', async () => {
		respond(variable);

		await invoke(Variables.update, {
			variableId: 'var_01',
			value: 'us-east',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/v4/variables/var_01',
			body: { value: 'us-east' },
		});
	});

	it('sends only the key when that is all that changes', async () => {
		respond(variable);

		await invoke(Variables.update, { variableId: 'var_01', key: 'zone' });

		expect(lastRequest().body).toEqual({ key: 'zone' });
	});

	it.each([[{ variableId: 'var_01' }], [{ variableId: 'var_01', key: '' }]])(
		'rejects %j before calling Kadoa',
		async (input) => {
			await expect(invoke(Variables.update, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('variables.delete', () => {
	it('DELETEs the variable', async () => {
		respond({ variable: variables[0], error: null });

		await invoke(Variables.remove, { variableId: 'var_01' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v4/variables/var_01',
		});
	});

	it('surfaces a secret still bound to a connection', async () => {
		respond({ error: true, message: 'Secret is still in use' }, 409);

		await expect(
			invoke(Variables.remove, { variableId: 'var_02' }),
		).rejects.toMatchObject({ status: 409 });
	});
});

describe('triggers.list', () => {
	it('GETs the outgoing and incoming triggers', async () => {
		respond(triggers);

		await expect(
			invoke(Triggers.list, { workflowId: 'wf_01HZX6' }),
		).resolves.toMatchObject({
			triggers: [{ eventType: 'workflow_data_change' }],
			incoming: [],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/workflows/wf_01HZX6/triggers',
		});
	});

	it('rejects a workflow with an empty id before calling Kadoa', async () => {
		await expect(invoke(Triggers.list, { workflowId: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('locations.list', () => {
	it('GETs every country a workflow can scrape from', async () => {
		respond(locations);

		await expect(invoke(Locations.list, {})).resolves.toEqual(locations);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/locations',
		});
	});
});

describe('error envelopes', () => {
	it('reads the status and message out of a 401', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Workflows.list, {})).rejects.toMatchObject({
			status: 401,
			message: 'Kadoa 401: Unauthorized',
			request: { method: 'GET' },
		});
	});

	it('prefers the message field of a validation body', async () => {
		respond(validationError, 400);

		await expect(
			invoke(Schemas.create, {
				name: 'Product',
				fields: [
					{
						name: 'title',
						fieldType: 'SCHEMA',
						dataType: 'STRING',
						description: 'Product title',
					},
				],
			}),
		).rejects.toMatchObject({
			status: 400,
			message: 'Kadoa 400: name must be longer than or equal to 1 characters',
		});
	});

	it('keeps the API key out of the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Workflows.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps a 5xx as core ApiError with its status', async () => {
		respond({ error: 'Internal service error' }, 503);

		const error = await caught(invoke(Workflows.list, {}));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 503,
			message: 'Kadoa 503: Internal service error',
		});
	});
});
