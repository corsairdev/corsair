/**
 * Exercises every Bubble endpoint wrapper end-to-end against a stubbed
 * network: the HTTP method/path/query/body each one builds, the cache
 * writes/evictions they perform, and what reaches the event log. Network
 * access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { Meta, Things, Workflows } from './endpoints';
import { BubbleEndpointInputSchemas } from './endpoints/types';
import { bubbleEndpointSchemas } from './index';
import { BubbleThingEntity } from './schema/database';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Things.get>[0];

function makeCtx() {
	const db = { things: makeStore() };
	const ctx = {
		key: 'test-bubble-key',
		options: { appName: 'rentalunits' },
		db,
		keys: {
			get_appName: async () => 'rentalunits',
			get_api_key: async () => 'test-bubble-key',
		},
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

/** A Bubble thing exactly as the manual's GET /obj/{typename}/{uid} sample returns. */
const THING = {
	_id: '1671702337369x488321592367327900',
	'Unit name': 'Unit A',
	'Created By': 'example@example.com',
	'Created Date': '2022-12-22T09:45:37.369Z',
	'Modified Date': '2022-12-22T09:45:37.417Z',
};

function jsonResponse(body: unknown, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		headers: { get: () => 'application/json' },
		json: async () => body,
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

function noContentResponse() {
	return {
		ok: true,
		status: 204,
		statusText: 'No Content',
		headers: { get: () => undefined },
		json: async () => undefined,
		text: async () => '',
	} as unknown as Response;
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastHeaders: Record<string, string> = {};

function header(
	headers: Record<string, string>,
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name.toLowerCase()) return value;
	}
	return undefined;
}

// The shared transport dispatches a `Request`, so `init.headers` is a real
// `Headers` instance and `init.body` may be a stream. Normalize both here.
async function captureInit(init?: RequestInit) {
	const headers: Record<string, string> = {};
	if (init?.headers) {
		const raw = init.headers as Headers;
		if (typeof raw.get === 'function') {
			for (const [name, value] of raw.entries()) headers[name] = value;
		} else {
			Object.assign(headers, raw);
		}
	}
	let body: string | undefined;
	if (init?.body != null) {
		body =
			typeof init.body === 'string'
				? init.body
				: await new (
						globalThis as unknown as {
							Response: new (b: unknown) => { text(): Promise<string> };
						}
					).Response(init.body).text();
	}
	return { headers, body };
}

beforeEach(() => {
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	lastHeaders = {};
	mockLogEvent.mockClear();

	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const urlStr = String(url);
		lastUrl = urlStr;
		lastMethod = init?.method ?? 'GET';
		const captured = await captureInit(init);
		lastBody = captured.body;
		lastHeaders = captured.headers;

		const path = new URL(urlStr).pathname;
		if (lastMethod === 'GET' && path.endsWith('/unit/abc')) {
			return jsonResponse({ response: THING });
		}
		if (lastMethod === 'GET' && path.endsWith('/unit')) {
			return jsonResponse({
				response: { cursor: 0, count: 1, remaining: 0, results: [THING] },
			});
		}
		if (lastMethod === 'POST' && path.endsWith('/unit/bulk')) {
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: { get: () => 'text/plain' },
				json: async () => {
					throw new Error('not json');
				},
				text: async () =>
					'{"status":"success","id":"1"}\n{"status":"error","message":"bad row"}\n',
			} as unknown as Response;
		}
		if (lastMethod === 'POST' && path.endsWith('/unit')) {
			return jsonResponse({ status: 'success', id: 'created-id' });
		}
		if (path.includes('/wf/')) {
			return jsonResponse({ status: 'success' });
		}
		if (path.endsWith('/meta/swagger.json')) {
			return jsonResponse({ swagger: '2.0', info: { title: 'app' } });
		}
		if (
			lastMethod === 'PATCH' ||
			lastMethod === 'PUT' ||
			lastMethod === 'DELETE'
		) {
			return noContentResponse();
		}
		return jsonResponse({});
	}) as unknown as typeof global.fetch;
});

describe('things.get', () => {
	it('GETs obj/{typeName}/{thingId}, caches the thing, and records the event', async () => {
		const { ctx, db } = makeCtx();

		const result = await Things.get(ctx, {
			typeName: 'unit',
			thingId: 'abc',
		});

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/obj/unit/abc',
		);
		expect(result).toEqual(THING);
		expect(db.things.upsertByEntityId).toHaveBeenCalledWith(THING._id, THING);
		expect(db.things.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.get',
			expect.objectContaining({ typeName: 'unit', thingId: 'abc' }),
			'completed',
		);
	});
});

describe('things.list', () => {
	it('builds the pagination/constraints/sorting query and caches results', async () => {
		const { ctx, db } = makeCtx();

		const result = await Things.list(ctx, {
			typeName: 'unit',
			limit: 10,
			cursor: 0,
			constraints: [
				{ key: 'Unit name', constraint_type: 'equals', value: 'Unit A' },
			],
			sortField: 'unitnumber',
			descending: true,
			excludeRemaining: true,
			additionalSortFields: [{ sortField: 'unitname', descending: true }],
		});

		expect(lastMethod).toBe('GET');
		const decoded = decodeURIComponent(lastUrl);
		expect(decoded).toContain('limit=10');
		expect(decoded).toContain('cursor=0');
		expect(decoded).toContain(
			'constraints=[{"key":"Unit name","constraint_type":"equals","value":"Unit A"}]',
		);
		expect(decoded).toContain('sort_field=unitnumber');
		expect(decoded).toContain('descending=true');
		expect(decoded).toContain('exclude_remaining=true');
		expect(decoded).toContain(
			'additional_sort_fields=[{"sort_field":"unitname","descending":true}]',
		);
		expect(result).toEqual({
			response: { cursor: 0, count: 1, remaining: 0, results: [THING] },
		});
		expect(db.things.upsertByEntityId).toHaveBeenCalledWith(THING._id, THING);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.list',
			expect.objectContaining({ returned: 1, typeName: 'unit' }),
			'completed',
		);
	});

	it('omits unset pagination keys entirely', async () => {
		const { ctx } = makeCtx();

		await Things.list(ctx, { typeName: 'unit' });

		expect(lastUrl).not.toContain('?');
	});
});

describe('things.create', () => {
	it('POSTs obj/{typeName} with the field values', async () => {
		const { ctx } = makeCtx();

		const result = await Things.create(ctx, {
			typeName: 'unit',
			fields: { 'Unit name': 'Unit B', unitnumber: 4 },
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://rentalunits.bubbleapps.io/api/1.1/obj/unit');
		expect(header(lastHeaders, 'Content-Type')).toBe('application/json');
		expect(lastBody).toBe('{"Unit name":"Unit B","unitnumber":4}');
		expect(result).toEqual({ status: 'success', id: 'created-id' });
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.create',
			expect.objectContaining({ id: 'created-id' }),
			'completed',
		);
	});
});

describe('things.bulkCreate', () => {
	it('POSTs a text/plain JSONL body and parses per-line results', async () => {
		const { ctx } = makeCtx();

		const result = await Things.bulkCreate(ctx, {
			typeName: 'unit',
			records: [{ 'Unit name': 'A' }, { 'Unit name': 'B' }],
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/obj/unit/bulk',
		);
		expect(header(lastHeaders, 'Content-Type')).toBe('text/plain');
		expect(lastBody).toBe('{"Unit name":"A"}\n{"Unit name":"B"}');
		expect(result).toEqual({
			count: 2,
			items: [
				{ status: 'success', id: '1' },
				{ status: 'error', message: 'bad row' },
			],
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.bulkCreate',
			expect.objectContaining({ attempted: 2, completed: 2 }),
			'completed',
		);
	});
});

describe('things.update / replace / delete', () => {
	it('PATCHes selected fields and evicts the cached thing', async () => {
		const { ctx, db } = makeCtx();

		await Things.update(ctx, {
			typeName: 'unit',
			thingId: 'abc',
			fields: { 'Unit name': 'Unit C' },
		});

		expect(lastMethod).toBe('PATCH');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/obj/unit/abc',
		);
		expect(lastBody).toBe('{"Unit name":"Unit C"}');
		expect(db.things.deleteByEntityId).toHaveBeenCalledWith('abc');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.update',
			expect.objectContaining({ typeName: 'unit', thingId: 'abc' }),
			'completed',
		);
	});

	it('PUTs a full replace and evicts the cached thing', async () => {
		const { ctx, db } = makeCtx();

		await Things.replace(ctx, {
			typeName: 'unit',
			thingId: 'abc',
			fields: { 'Unit name': 'Unit D' },
		});

		expect(lastMethod).toBe('PUT');
		expect(lastBody).toBe('{"Unit name":"Unit D"}');
		expect(db.things.deleteByEntityId).toHaveBeenCalledWith('abc');
	});

	it('DELETEs a thing and evicts the cached snapshot', async () => {
		const { ctx, db } = makeCtx();

		await Things.delete(ctx, { typeName: 'unit', thingId: 'abc' });

		expect(lastMethod).toBe('DELETE');
		expect(lastBody).toBeUndefined();
		expect(db.things.deleteByEntityId).toHaveBeenCalledWith('abc');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.things.delete',
			expect.objectContaining({ typeName: 'unit', thingId: 'abc' }),
			'completed',
		);
	});
});

describe('workflows.runGet', () => {
	it('GETs wf/{workflowName} with query-string parameters', async () => {
		const { ctx } = makeCtx();

		const result = await Workflows.runGet(ctx, {
			workflowName: 'notify_user',
			params: { email: 'user@example.com' },
		});

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/wf/notify_user?email=user%40example.com',
		);
		expect(lastBody).toBeUndefined();
		expect(result).toEqual({ status: 'success' });
	});
});

describe('meta.getSwagger', () => {
	it('GETs /api/1.1/meta/swagger.json', async () => {
		const { ctx } = makeCtx();

		const result = await Meta.getSwagger(ctx, {});

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/meta/swagger.json',
		);
		expect(result).toEqual({ swagger: '2.0', info: { title: 'app' } });
	});
});

describe('workflows.run', () => {
	it('POSTs wf/{workflowName} with the parameters', async () => {
		const { ctx } = makeCtx();

		const result = await Workflows.run(ctx, {
			workflowName: 'notify_user',
			params: { email: 'user@example.com' },
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/wf/notify_user',
		);
		expect(lastBody).toBe('{"email":"user@example.com"}');
		expect(result).toEqual({ status: 'success' });
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bubble.workflows.run',
			expect.objectContaining({ workflowName: 'notify_user' }),
			'completed',
		);
	});
});

describe('bubbleEndpointSchemas', () => {
	it('declares an input/output schema for every endpoint', () => {
		expect(Object.keys(bubbleEndpointSchemas)).toEqual([
			'things.get',
			'things.list',
			'things.create',
			'things.bulkCreate',
			'things.update',
			'things.replace',
			'things.delete',
			'workflows.run',
			'workflows.runGet',
			'meta.getSwagger',
		]);
		for (const [key, schemas] of Object.entries(bubbleEndpointSchemas)) {
			expect(key).toContain('.');
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
		}
	});

	it('parses a real Bubble GET record against the thing entity schema', () => {
		expect(BubbleThingEntity.safeParse(THING).success).toBe(true);
	});

	it('parses is_empty constraints without a value', () => {
		const parsed = BubbleEndpointInputSchemas.thingsList.safeParse({
			typeName: 'rentalunit',
			constraints: [{ key: 'Unit name', constraint_type: 'is_empty' }],
		});
		expect(parsed.success).toBe(true);
	});

	it('parses the manual constraints shape', () => {
		const parsed = BubbleEndpointInputSchemas.thingsList.safeParse({
			typeName: 'rentalunit',
			constraints: [
				{ key: 'unitname', constraint_type: 'equals', value: 'Unit A' },
				{ key: 'unitnumber', constraint_type: 'greater than', value: 3 },
			],
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects nested undefined in create and replace field maps', () => {
		const nested = { nested: { x: undefined as unknown as string } };
		expect(
			BubbleEndpointInputSchemas.thingsCreate.safeParse({
				typeName: 'unit',
				fields: nested,
			}).success,
		).toBe(false);
		expect(
			BubbleEndpointInputSchemas.thingsReplace.safeParse({
				typeName: 'unit',
				thingId: 'abc',
				fields: nested,
			}).success,
		).toBe(false);
	});

	it('rejects a bulk-create batch over Bubble’s 1,000-record cap', () => {
		const parsed = BubbleEndpointInputSchemas.thingsBulkCreate.safeParse({
			typeName: 'unit',
			records: Array.from({ length: 1001 }, () => ({ name: 'x' })),
		});
		expect(parsed.success).toBe(false);
	});
});
