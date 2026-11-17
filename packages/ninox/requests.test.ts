import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NinoxPluginOptions, RecordsUpdateInput } from './index';
import { ninox, ninoxEndpointsNested } from './index';
import {
	changes,
	conflict,
	createdRows,
	deletedRows,
	fields,
	modules,
	rows,
	singleRow,
	tableNotFound,
	tables,
	unauthorizedText,
	updatedRows,
	upsertedRows,
	workspace,
} from './test-fixtures';

const API_KEY = 'ninox-workspace-key';
const WORKSPACE = 'abcdefghijkl';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: {} as NinoxPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = ninoxEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the body is the JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('request shape', () => {
	it('sends the workspace key as a bearer token', async () => {
		const { url, init } = await capture(
			endpoints.workspace.get,
			{ workspaceId: WORKSPACE },
			workspace,
		);

		expect(url).toBe(`https://go.ninox.com/api/v1/workspace/${WORKSPACE}`);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('rejects a workspace id that is not twelve characters', async () => {
		await expect(
			endpoints.workspace.get(makeContext() as never, { workspaceId: 'short' }),
		).rejects.toThrow(/12-character/);
	});
});

describe('workspace.get', () => {
	it('reads the module list out of the data envelope', async () => {
		const { result } = await capture(
			endpoints.workspace.get,
			{ workspaceId: WORKSPACE },
			workspace,
		);

		const list = asRecord(result)?.modules;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
		expect(asRecord(Array.isArray(list) ? list[0] : null)?.name).toBe('CRM');
	});
});

describe('modules.list', () => {
	it('lifts data and keeps page_info', async () => {
		const { result, url } = await capture(
			endpoints.modules.list,
			{ workspaceId: WORKSPACE, limit: 50 },
			modules,
		);

		expect(new URL(url).searchParams.get('limit')).toBe('50');
		const page = asRecord(result);
		expect(page?.modules).toHaveLength(2);
		expect(asRecord(page?.page_info)?.has_more).toBe(false);
	});

	it('rejects a limit above the documented 100', async () => {
		await expect(
			endpoints.modules.list(makeContext() as never, {
				workspaceId: WORKSPACE,
				limit: 500,
			}),
		).rejects.toThrow();
	});
});

describe('tables.list and fields.list', () => {
	it('addresses the module by name', async () => {
		const { result, url } = await capture(
			endpoints.tables.list,
			{ workspaceId: WORKSPACE, moduleName: 'CRM' },
			tables,
		);

		expect(new URL(url).pathname).toBe(
			`/api/v1/workspace/${WORKSPACE}/modules/CRM/tables`,
		);
		expect(asRecord(result)?.tables).toHaveLength(1);
	});

	it('percent-encodes a module name with a space or ampersand', async () => {
		const { url } = await capture(
			endpoints.tables.list,
			{ workspaceId: WORKSPACE, moduleName: 'Sales & CRM' },
			tables,
		);

		// A raw & would split the path; the name is one segment.
		expect(url).toContain('modules/Sales%20%26%20CRM/tables');
		expect(url).not.toContain('modules/Sales & CRM');
	});

	it('reads the field names and types a record write must use', async () => {
		const { result, url } = await capture(
			endpoints.fields.list,
			{ workspaceId: WORKSPACE, moduleName: 'CRM', tableName: 'Contacts' },
			fields,
		);

		expect(new URL(url).pathname).toBe(
			`/api/v1/workspace/${WORKSPACE}/modules/CRM/tables/Contacts/fields`,
		);
		const list = asRecord(result)?.fields;
		const email = asRecord(
			Array.isArray(list)
				? list.find((f) => asRecord(f)?.name === 'Email')
				: null,
		);
		expect(email?.unique).toBe(true);
		const status = asRecord(
			Array.isArray(list)
				? list.find((f) => asRecord(f)?.name === 'Status')
				: null,
		);
		expect(status?.type).toBe('choice');
	});
});

describe('records.list', () => {
	it('joins the field list and passes the JSON filter', async () => {
		const { result, url } = await capture(
			endpoints.records.list,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				fields: ['Name', 'Email'],
				filter: '{"Email":"dana@northwind.example"}',
				sort: 'Name,-id',
			},
			rows,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe(
			`/api/v1/workspace/${WORKSPACE}/modules/CRM/tables/Contacts/records`,
		);
		expect(parsed.searchParams.get('fields')).toBe('Name,Email');
		expect(parsed.searchParams.get('filter')).toBe(
			'{"Email":"dana@northwind.example"}',
		);
		expect(parsed.searchParams.get('sort')).toBe('Name,-id');
		const list = asRecord(result)?.rows;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
	});

	it('keeps values keyed by the table’s field names', async () => {
		const { result } = await capture(
			endpoints.records.list,
			{ workspaceId: WORKSPACE, moduleName: 'CRM', tableName: 'Contacts' },
			rows,
		);

		const list = asRecord(result)?.rows;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		const values = asRecord(first?.values);
		expect(values?.Name).toBe('Dana Okafor');
		// A cell can be a string, number, boolean or null, never an object.
		expect(typeof values?.Email).toBe('string');
	});
});

describe('records.get', () => {
	it('uses the singular record path and the numeric id', async () => {
		const { result, url } = await capture(
			endpoints.records.get,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				recordId: 12,
			},
			singleRow,
		);

		// Ninox spells this route `record`, not `records`.
		expect(new URL(url).pathname).toBe(
			`/api/v1/workspace/${WORKSPACE}/modules/CRM/tables/Contacts/record/12`,
		);
		expect(asRecord(asRecord(result)?.values)?.Name).toBe('Dana Okafor');
	});

	it('rejects a non-integer record id', async () => {
		await expect(
			endpoints.records.get(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				recordId: 1.5,
			}),
		).rejects.toThrow();
	});
});

describe('records.create', () => {
	it('posts the records and returns the new ids', async () => {
		const { result, init, url } = await capture(
			endpoints.records.create,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				records: [
					{ Name: 'Dana Okafor', Email: 'dana@northwind.example' },
					{ Name: 'Sam Rivera', Email: 'sam@northwind.example' },
				],
			},
			createdRows,
			{ status: 201 },
		);

		expect(new URL(url).pathname).toContain('/records');
		expect(init.method).toBe('POST');
		const body = sentBody(init);
		expect(body.records).toHaveLength(2);
		expect(asRecord(result)?.ids).toEqual(['14', '15']);
	});

	it('sends a multi field as an array of option ids', async () => {
		// Live 11-17: a multi cell came back as ["1","2"] and was written that way.
		const { init } = await capture(
			endpoints.records.create,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				records: [{ Name: 'Ada', Tags: ['1', '2'] }],
			},
			createdRows,
			{ status: 201 },
		);
		expect(sentBody(init).records).toEqual([{ Name: 'Ada', Tags: ['1', '2'] }]);
	});

	it('rejects a cell that is an object rather than a scalar', async () => {
		await expect(
			endpoints.records.create(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				// Cast past the type: the point is that the schema refuses a nested
				// cell at runtime for a caller passing untyped input.
				records: [{ Name: { nested: true } } as never],
			}),
		).rejects.toThrow();
	});

	it('rejects an empty batch', async () => {
		await expect(
			endpoints.records.create(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				records: [],
			}),
		).rejects.toThrow();
	});
});

describe('records.update', () => {
	it('posts the id and the fields to write', async () => {
		const { result, init } = await capture(
			endpoints.records.update,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				records: [{ id: 12, Name: 'Dana O.' }],
			},
			updatedRows,
		);

		expect(init.method).toBe('PATCH');
		const records = sentBody(init).records;
		const first = asRecord(Array.isArray(records) ? records[0] : null);
		expect(first?.id).toBe(12);
		expect(first?.Name).toBe('Dana O.');
		expect(asRecord(result)?.updatedIds).toEqual(['12']);
	});

	it('passes _expected through and the override flag', async () => {
		const { init, url } = await capture(
			endpoints.records.update,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				override: true,
				records: [
					{
						id: 12,
						_expected: { Email: 'dana@northwind.example' },
						Name: 'Dana O.',
					},
				],
			},
			updatedRows,
		);

		expect(new URL(url).searchParams.get('override')).toBe('true');
		const records = sentBody(init).records;
		const first = asRecord(Array.isArray(records) ? records[0] : null);
		expect(asRecord(first?._expected)?.Email).toBe('dana@northwind.example');
	});

	it('reports a stale _expected as a conflict', async () => {
		await expect(
			capture(
				endpoints.records.update,
				{
					workspaceId: WORKSPACE,
					moduleName: 'CRM',
					tableName: 'Contacts',
					records: [{ id: 12, _expected: { Name: 'Old' }, Name: 'New' }],
				},
				conflict,
				{ status: 409 },
			),
		).rejects.toThrow(/override=true/);
	});
});

describe('records.delete', () => {
	it('sends the ids in a records array and reports what was deleted', async () => {
		const { result, init } = await capture(
			endpoints.records.delete,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				recordIds: [12, 13],
			},
			deletedRows,
		);

		expect(init.method).toBe('DELETE');
		// The delete body is `{ records: [...] }`, not a bare array.
		expect(sentBody(init).records).toEqual([12, 13]);
		expect(asRecord(result)?.deletedIds).toEqual(['12', '13']);
	});

	it('rejects an empty id list', async () => {
		await expect(
			endpoints.records.delete(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				recordIds: [],
			}),
		).rejects.toThrow();
	});
});

describe('records.upsert', () => {
	it('posts the match field and reports created and updated separately', async () => {
		const { result, url, init } = await capture(
			endpoints.records.upsert,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				matchField: 'Email',
				records: [{ Email: 'dana@northwind.example', Name: 'Dana O.' }],
			},
			upsertedRows,
		);

		expect(new URL(url).pathname).toContain('/records/upsert');
		expect(sentBody(init).matchField).toBe('Email');
		const data = asRecord(result);
		expect(data?.createdIds).toEqual(['16']);
		expect(data?.updatedIds).toEqual(['12']);
	});
});

describe('records.changes', () => {
	it('passes since and lifts asOf out of meta as the next cursor', async () => {
		const { result, url } = await capture(
			endpoints.records.changes,
			{
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				since: '2026-11-16T09:00:00Z',
			},
			changes,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toContain('/records/changes');
		expect(parsed.searchParams.get('since')).toBe('2026-11-16T09:00:00Z');
		const page = asRecord(result);
		expect(page?.changes).toHaveLength(2);
		// asOf is lifted out of meta so it can be fed straight back as since.
		expect(page?.asOf).toBe('2026-11-16T10:05:00Z');
	});

	it('rejects a since that is not an ISO instant', async () => {
		await expect(
			endpoints.records.changes(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				since: 'yesterday',
			}),
		).rejects.toThrow();
	});
});

describe('structure, views and scripts', () => {
	const base = `https://go.ninox.com/api/v1/workspace/${WORKSPACE}/modules/my_app`;

	it('reads one module and one table by name', async () => {
		const mod = await capture(
			endpoints.modules.get,
			{ workspaceId: WORKSPACE, moduleName: 'my_app' },
			{ data: { moduleId: 'A', name: 'my_app', labels: { '': 'My app' } } },
		);
		expect(mod.url).toBe(base);
		expect(asRecord(asRecord(mod.result)?.module)?.moduleId).toBe('A');

		const table = await capture(
			endpoints.tables.get,
			{ workspaceId: WORKSPACE, moduleName: 'my_app', tableName: 'orders' },
			{ data: { name: 'orders', fields: [{ name: 'qty', type: 'number' }] } },
		);
		expect(table.url).toBe(`${base}/tables/orders`);
		const fieldsOut = asRecord(asRecord(table.result)?.table)?.fields;
		expect(Array.isArray(fieldsOut) ? fieldsOut.length : 0).toBe(1);
	});

	it('creates a table with the body Ninox documents', async () => {
		const { url, init } = await capture(
			endpoints.tables.create,
			{
				workspaceId: WORKSPACE,
				moduleName: 'my_app',
				table: { name: 'orders', labels: { '': 'Orders' } },
			},
			{ data: { name: 'orders', labels: { '': 'Orders' } } },
			{ status: 201 },
		);
		expect(url).toBe(`${base}/tables`);
		expect(init.method).toBe('POST');
		expect(sentBody(init)).toEqual({
			name: 'orders',
			labels: { '': 'Orders' },
		});
	});

	it('creates a multi field with label options', async () => {
		const field = {
			name: 'tags',
			labels: { '': 'Tags' },
			type: 'multi' as const,
			options: [{ label: 'red' }, { label: 'blue' }],
		};
		const { url, init } = await capture(
			endpoints.fields.create,
			{
				workspaceId: WORKSPACE,
				moduleName: 'my_app',
				tableName: 'orders',
				field,
			},
			{ data: { name: 'tags', type: 'multi' } },
			{ status: 201 },
		);
		expect(url).toBe(`${base}/tables/orders/fields`);
		expect(sentBody(init)).toEqual(field);
	});

	it('deletes a field and a table on an empty 204', async () => {
		const field = await capture(
			endpoints.fields.delete,
			{
				workspaceId: WORKSPACE,
				moduleName: 'my_app',
				tableName: 'orders',
				fieldName: 'temp',
			},
			// fetch refuses a body on a 204 mock; an empty 200 is the same to core.
			'',
		);
		expect(field.url).toBe(`${base}/tables/orders/fields/temp`);
		expect(field.init.method).toBe('DELETE');
		expect(field.result).toEqual({ deleted: true, name: 'temp' });

		const table = await capture(
			endpoints.tables.delete,
			{ workspaceId: WORKSPACE, moduleName: 'my_app', tableName: 'orders' },
			// fetch refuses a body on a 204 mock; an empty 200 is the same to core.
			'',
		);
		expect(table.result).toEqual({ deleted: true, name: 'orders' });
	});

	it('lists views from the data envelope', async () => {
		const { url, result } = await capture(
			endpoints.views.list,
			{ workspaceId: WORKSPACE, moduleName: 'my_app', tableName: 'orders' },
			{ data: [{ id: 'v1', name: 'All' }] },
		);
		expect(url).toBe(`${base}/tables/orders/views`);
		const views = asRecord(result)?.views;
		expect(Array.isArray(views) ? views.length : 0).toBe(1);
	});

	it('runs a script and returns its result', async () => {
		const { url, init, result } = await capture(
			endpoints.scripts.execute,
			{
				workspaceId: WORKSPACE,
				moduleName: 'my_app',
				script: 'count(select orders)',
				mode: 'wait',
			},
			{ data: 2 },
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe(`/api/v1/workspace/${WORKSPACE}/script/exec`);
		expect(parsed.searchParams.get('mode')).toBe('wait');
		expect(sentBody(init)).toEqual({
			moduleName: 'my_app',
			script: 'count(select orders)',
		});
		expect(result).toEqual({ result: 2 });
	});

	it('returns the run when Ninox queues the script', async () => {
		const { result } = await capture(
			endpoints.scripts.execute,
			{
				workspaceId: WORKSPACE,
				moduleName: 'my_app',
				script: 'x',
				mode: 'background',
			},
			// Live 11-17: mode=background answered 202 with this body.
			{ run: { id: 'e2dbc8l4707p', status: 'running' } },
			{ status: 202 },
		);
		expect(asRecord(asRecord(result)?.run)?.id).toBe('e2dbc8l4707p');
	});

	it('keeps a script result that happens to hold a runId as the result', async () => {
		const { result } = await capture(
			endpoints.scripts.execute,
			{ workspaceId: WORKSPACE, moduleName: 'my_app', script: 'x' },
			{ data: { runId: 'mine' } },
		);
		expect(result).toEqual({ result: { runId: 'mine' } });
	});
});

describe('workspace envelope checks', () => {
	it('fails on a malformed modules value instead of reading it as empty', async () => {
		await expect(
			capture(
				endpoints.workspace.get,
				{ workspaceId: WORKSPACE },
				{ data: { modules: 'invalid' } },
			),
		).rejects.toThrow();
	});

	it('rejects a nested object in a field on update, as on create', async () => {
		await expect(
			endpoints.records.update(makeContext() as never, {
				workspaceId: WORKSPACE,
				moduleName: 'CRM',
				tableName: 'Contacts',
				records: [{ id: 12, Name: { nested: true } }],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('lets a typed caller pass _expected beside the field values', () => {
		// Type-level check: this object must satisfy RecordsUpdateInput's record type.
		const record: RecordsUpdateInput['records'][number] = {
			id: 12,
			Status: 'Won',
			_expected: { Status: 'Open' },
		};
		expect(record._expected).toEqual({ Status: 'Open' });
	});
});

describe('ninox error reporting', () => {
	it('reads the JSON error message', async () => {
		const error = await capture(
			endpoints.tables.list,
			{ workspaceId: WORKSPACE, moduleName: 'Nope' },
			tableNotFound,
			{ status: 404 },
		).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).toContain('Table not found');
		expect(String(error)).toContain('404');
	});

	it('reads the edge’s bare text 401', async () => {
		const error = await capture(
			endpoints.workspace.get,
			{ workspaceId: WORKSPACE },
			unauthorizedText,
			{ status: 401, contentType: 'text/plain' },
		).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).toContain('Unauthorized');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(
			endpoints.workspace.get,
			{ workspaceId: WORKSPACE },
			unauthorizedText,
			{ status: 401, contentType: 'text/plain' },
		).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).not.toContain(API_KEY);
	});
});

describe('ninox plugin definition', () => {
	it('registers as ninox with api_key auth and no webhooks', () => {
		const plugin = ninox();
		expect(plugin.id).toBe('ninox');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 19 catalog operations', () => {
		const nested = Object.entries(ninoxEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'fields.create',
			'fields.delete',
			'fields.list',
			'modules.get',
			'modules.list',
			'records.changes',
			'records.create',
			'records.delete',
			'records.get',
			'records.list',
			'records.update',
			'records.upsert',
			'scripts.execute',
			'tables.create',
			'tables.delete',
			'tables.get',
			'tables.list',
			'views.list',
			'workspace.get',
		]);
	});

	it('marks the delete destructive and the writes as writes', () => {
		const meta = ninox().endpointMeta ?? {};
		expect(meta['records.delete']?.riskLevel).toBe('destructive');
		expect(meta['records.delete']?.irreversible).toBe(true);
		expect(meta['records.create']?.riskLevel).toBe('write');
		expect(meta['records.update']?.riskLevel).toBe('write');
		expect(meta['records.upsert']?.riskLevel).toBe('write');
		// The change feed is a read even though it is a poll.
		expect(meta['records.changes']?.riskLevel).toBe('read');
		for (const name of [
			'tables.delete',
			'fields.delete',
			'scripts.execute',
		] as const) {
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
		expect(meta['tables.create']?.riskLevel).toBe('write');
		expect(meta['fields.create']?.riskLevel).toBe('write');
		expect(meta['views.list']?.riskLevel).toBe('read');
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = ninox();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({ plugins: [ninox({ key: 'k' })] });
		expect(corsair.ninox).toBeDefined();
	});
});
