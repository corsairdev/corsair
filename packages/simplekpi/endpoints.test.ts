import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { segment, simplekpiProblem } from './client';
import {
	BreakdownItems,
	CategoryKpis,
	KpiCategories,
	KpiEntries,
	Kpis,
	KpiUnits,
	Lookups,
	Reports,
	Users,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	breakdownItem,
	category,
	entry,
	frequency,
	icon,
	kpi,
	notFoundProblem,
	nothingStored,
	reportRow,
	unit,
	user,
	validationProblem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'skpi_test_key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: UnknownJson, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body
			? (JSON.parse(String(init.body)) as UnknownJson)
			: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.simplekpi.com');
	// A literal Bearer header, per the API's only documented auth method.
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('kpis', () => {
	it('lists with the paging query and returns the bare array', async () => {
		respond([kpi]);

		const result = await invoke(Kpis.list, { page: 2, rows: 100 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v1/kpis' });
		expect(lastRequest().query).toEqual({ page: '2', rows: '100' });
		expect(result).toEqual([kpi]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplekpi.kpis.list',
			{ count: 1 },
			'completed',
		);
	});

	it('POSTs a create and returns the stored KPI', async () => {
		respond(kpi, 201);

		const result = await invoke(Kpis.create, {
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
			category_id: 5478,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/kpis');
		expect(sent.body).toEqual({
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
			category_id: 5478,
		});
		expect(result).toMatchObject({ id: 1234 });
	});

	it('rejects a create without a real icon or unit id', async () => {
		await expect(
			invoke(Kpis.create, {
				name: 'New Sales',
				frequency_id: 'W',
				value_direction: 'U',
				aggregate_function: 'SUM',
			}),
		).rejects.toThrow(/icon_id|unit_id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a lowercase aggregate function', async () => {
		await expect(
			invoke(Kpis.create, {
				name: 'New Sales',
				icon_id: 1,
				unit_id: 123,
				frequency_id: 'W',
				value_direction: 'U',
				aggregate_function: 'sum',
			}),
		).rejects.toThrow(/aggregate_function/);
	});

	it('GETs one KPI', async () => {
		respond(kpi);

		const result = await invoke(Kpis.get, { id: 1234 });

		expect(lastRequest().path).toBe('/v1/kpis/1234');
		expect(result).toMatchObject({ id: 1234, is_calculated: false });
	});

	it('PUTs the whole KPI and keeps the id in the path only', async () => {
		respond(kpi);

		await invoke(Kpis.update, {
			id: 1234,
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/v1/kpis/1234');
		expect(sent.body).toEqual({
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
		});
	});

	it('DELETEs and reports the id', async () => {
		respondEmpty();

		const result = await invoke(Kpis.remove, { id: 1234 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/kpis/1234',
		});
		expect(result).toEqual({ id: 1234, deleted: true });
	});

	it.each([[{}], [[]], [null], ['']])(
		'throws when a delete answers the JSON body %j instead of a 204',
		async (body) => {
			respond(body as UnknownJson);

			await expect(invoke(Kpis.remove, { id: 1234 })).rejects.toThrow(
				/bodyless/,
			);
		},
	);

	it('throws when a delete answers a body', async () => {
		respond({ ok: true });

		await expect(invoke(Kpis.remove, { id: 1234 })).rejects.toThrow(
			/documents this route as bodyless/,
		);
	});
});

describe('kpiCategories', () => {
	it('lists, creates, reads, updates and deletes', async () => {
		respond([category]);
		expect(await invoke(KpiCategories.list, {})).toEqual([category]);
		expect(lastRequest().path).toBe('/v1/kpicategories');

		respond(category, 201);
		await invoke(KpiCategories.create, { name: 'Sales' });
		expect(lastRequest().body).toEqual({ name: 'Sales' });

		respond(category);
		await invoke(KpiCategories.get, { id: 5478 });
		expect(lastRequest().path).toBe('/v1/kpicategories/5478');

		respond(category);
		await invoke(KpiCategories.update, { id: 5478, name: 'Revenue' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/kpicategories/5478',
		});

		respondEmpty();
		const deleted = await invoke(KpiCategories.remove, { id: 5478 });
		expect(deleted).toEqual({ id: 5478, deleted: true });
	});

	it('rejects a category name above the documented 50 characters', async () => {
		await expect(
			invoke(KpiCategories.create, { name: 'x'.repeat(51) }),
		).rejects.toThrow(/name/);
	});
});

describe('kpiCategories.kpis', () => {
	it('uses the nested path for every operation', async () => {
		respond([kpi]);
		await invoke(CategoryKpis.list, { category_id: 5478 });
		expect(lastRequest().path).toBe('/v1/kpicategories/5478/kpis');

		respond(kpi, 201);
		await invoke(CategoryKpis.create, {
			category_id: 5478,
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
		});
		expect(lastRequest().path).toBe('/v1/kpicategories/5478/kpis');
		expect(lastRequest().body).not.toHaveProperty('category_id');

		respond(kpi);
		await invoke(CategoryKpis.get, { category_id: 5478, id: 1234 });
		expect(lastRequest().path).toBe('/v1/kpicategories/5478/kpis/1234');

		respond(kpi);
		await invoke(CategoryKpis.update, {
			category_id: 5478,
			id: 1234,
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/kpicategories/5478/kpis/1234',
		});

		respondEmpty();
		await invoke(CategoryKpis.remove, { category_id: 5478, id: 1234 });
		expect(lastRequest().path).toBe('/v1/kpicategories/5478/kpis/1234');
	});
});

describe('breakdownItems', () => {
	it('lists with paging only, since the API has no breakdown filter', async () => {
		respond([breakdownItem]);

		const result = await invoke(BreakdownItems.list, { page: 1 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/breakdownitems',
		});
		expect(lastRequest().query).toEqual({ page: '1' });
		expect(result).toEqual([breakdownItem]);
	});

	it('reads an id sent as a numeric string, which the spec allows', async () => {
		respond({ ...breakdownItem, id: '77', breakdown_id: '12' });

		const result = (await invoke(BreakdownItems.get, { id: 77 })) as {
			id: number;
			breakdown_id: number;
		};

		expect(result.id).toBe(77);
		expect(result.breakdown_id).toBe(12);
	});

	it('creates, reads, updates and deletes', async () => {
		respond(breakdownItem, 201);
		await invoke(BreakdownItems.create, { name: 'EMEA', breakdown_id: 12 });
		expect(lastRequest().body).toEqual({ name: 'EMEA', breakdown_id: 12 });

		respond(breakdownItem);
		await invoke(BreakdownItems.get, { id: 77 });
		expect(lastRequest().path).toBe('/v1/breakdownitems/77');

		respond(breakdownItem);
		await invoke(BreakdownItems.update, { id: 77, name: 'EMEA North' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/breakdownitems/77',
		});

		respond(breakdownItem);
		await invoke(BreakdownItems.update, {
			id: 77,
			name: 'EMEA North',
			is_archived: true,
			sort_order: 3,
		});
		// A PUT replaces the item, so the archive flag and order must survive.
		expect(lastRequest().body).toEqual({
			name: 'EMEA North',
			is_archived: true,
			sort_order: 3,
		});

		respondEmpty();
		expect(await invoke(BreakdownItems.remove, { id: 77 })).toEqual({
			id: 77,
			deleted: true,
		});
	});
});

describe('kpiEntries', () => {
	it('lists with the documented camelCase filters', async () => {
		respond([entry]);

		const result = await invoke(KpiEntries.list, {
			kpiId: 1234,
			dateFrom: '2026-08-01',
			dateTo: '2026-08-31',
			rows: 100,
		});

		expect(lastRequest().path).toBe('/v1/kpientries');
		expect(lastRequest().query).toEqual({
			kpiId: '1234',
			dateFrom: '2026-08-01',
			dateTo: '2026-08-31',
			rows: '100',
		});
		expect(result).toEqual([entry]);
	});

	it('POSTs an entry and returns it', async () => {
		respond(entry, 201);

		const result = await invoke(KpiEntries.create, {
			kpi_id: 1234,
			entry_date: '2026-08-03T00:00:00',
			actual: 42,
			target: 50,
			setActual: true,
			setTarget: true,
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/kpientries');
		// The camelCase flags are the API's own exceptions and go out verbatim.
		expect(sent.body).toEqual({
			kpi_id: 1234,
			entry_date: '2026-08-03T00:00:00',
			actual: 42,
			target: 50,
			setActual: true,
			setTarget: true,
		});
		expect(result).toMatchObject({ id: 987654 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplekpi.kpiEntries.create',
			{ kpiId: 1234, entryId: 987654, stored: true },
			'completed',
		);
	});

	it('accepts the nothing-stored answer and logs it as not stored', async () => {
		respond(nothingStored);

		const result = await invoke(KpiEntries.create, {
			kpi_id: 1234,
			entry_date: '2026-08-03',
		});

		expect(result).toMatchObject({ stored: false });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplekpi.kpiEntries.create',
			{ kpiId: 1234, entryId: undefined, stored: false },
			'completed',
		);
	});

	it('rejects a body that sends both user_id and email', async () => {
		await expect(
			invoke(KpiEntries.create, {
				kpi_id: 1234,
				entry_date: '2026-08-03',
				user_id: 12,
				email: 'alex@example.com',
			}),
		).rejects.toThrow(/user_id or email, not both/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('GETs, PUTs and DELETEs one entry', async () => {
		respond(entry);
		await invoke(KpiEntries.get, { id: 987654 });
		expect(lastRequest().path).toBe('/v1/kpientries/987654');

		respond(entry);
		await invoke(KpiEntries.update, {
			id: 987654,
			kpi_id: 1234,
			entry_date: '2026-08-03',
			actual: 50,
			setActual: true,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/kpientries/987654',
		});

		respondEmpty();
		expect(await invoke(KpiEntries.remove, { id: 987654 })).toEqual({
			id: 987654,
			deleted: true,
		});
	});

	it('POSTs a batch and reports the counts', async () => {
		respond({ rows_added: 9, rows_rejected: 1 });

		const result = await invoke(KpiEntries.createBatch, {
			entries: [
				{ kpi_id: 1234, entry_date: '2026-08-03', actual: 1 },
				{ kpi_id: 1234, entry_date: '2026-08-10', actual: 2 },
			],
			hasActuals: true,
		});

		expect(lastRequest().path).toBe('/v1/kpientries/list');
		expect(result).toEqual({ rows_added: 9, rows_rejected: 1 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplekpi.kpiEntries.createBatch',
			{ submitted: 2, added: 9, rejected: 1 },
			'completed',
		);
	});

	it('throws when a batch rejects every row, because it still answers 200', async () => {
		respond({ rows_added: 0, rows_rejected: 2 });

		await expect(
			invoke(KpiEntries.createBatch, {
				entries: [
					{ kpi_id: 9, entry_date: '2026-08-03', actual: 1 },
					{ kpi_id: 9, entry_date: '2026-08-10', actual: 2 },
				],
			}),
		).rejects.toThrow(/rejected all 2 rows/);
	});
});

describe('lookups', () => {
	it('lists and reads frequencies', async () => {
		respond([frequency]);
		expect(await invoke(Lookups.frequenciesList, {})).toEqual([frequency]);
		expect(lastRequest().path).toBe('/v1/kpifrequencies');

		respond(frequency);
		expect(await invoke(Lookups.frequenciesGet, { id: 'W' })).toEqual(
			frequency,
		);
		expect(lastRequest().path).toBe('/v1/kpifrequencies/W');
	});

	it('lists and reads icons', async () => {
		respond([icon]);
		expect(await invoke(Lookups.iconsList, {})).toEqual([icon]);
		expect(lastRequest().path).toBe('/v1/kpiicons');

		respond(icon);
		expect(await invoke(Lookups.iconsGet, { id: 1 })).toEqual(icon);
		expect(lastRequest().path).toBe('/v1/kpiicons/1');
	});
});

describe('kpiUnits', () => {
	it('creates a unit with both formats', async () => {
		respond(unit, 201);

		await invoke(KpiUnits.create, {
			name: 'Pounds',
			entry_format: '#,##0.00',
			display_format: '#,##0',
			is_percentage: false,
		});

		expect(lastRequest().body).toEqual({
			name: 'Pounds',
			entry_format: '#,##0.00',
			display_format: '#,##0',
			is_percentage: false,
		});
	});

	it('lists, reads, updates and deletes', async () => {
		respond([unit]);
		await invoke(KpiUnits.list, {});
		expect(lastRequest().path).toBe('/v1/kpiunits');

		respond(unit);
		await invoke(KpiUnits.get, { id: 123 });
		expect(lastRequest().path).toBe('/v1/kpiunits/123');

		respond(unit);
		await invoke(KpiUnits.update, {
			id: 123,
			name: 'Pounds',
			entry_format: '#,##0.00',
			display_format: '#,##0',
		});
		expect(lastRequest()).toMatchObject({ method: 'PUT' });

		respondEmpty();
		expect(await invoke(KpiUnits.remove, { id: 123 })).toEqual({
			id: 123,
			deleted: true,
		});
	});

	it('rejects a unit name above the documented 25 characters', async () => {
		await expect(
			invoke(KpiUnits.create, {
				name: 'x'.repeat(26),
				entry_format: '#,##0',
				display_format: '#,##0',
			}),
		).rejects.toThrow(/name/);
	});
});

describe('reports.allDataEntries filters', () => {
	it('sends the user and breakdown item filters as comma lists', async () => {
		respond([]);

		await invoke(Reports.allDataEntries, {
			kpiIDs: [1, 2],
			userIDs: [7, 8],
			groupItemIDs: [77],
		});

		expect(lastRequest().query).toMatchObject({
			kpiIDs: '1,2',
			userIDs: '7,8',
			groupItemIDs: '77',
		});
	});
});

describe('reports.allDataEntries', () => {
	it('joins the KPI ids into a comma separated filter', async () => {
		respond([reportRow]);

		const result = await invoke(Reports.allDataEntries, {
			kpiIDs: [1234, 1235],
			dateFrom: '2026-08-01',
			dateTo: '2026-08-31',
		});

		expect(lastRequest().path).toBe('/v1/reports/alldataentries');
		expect(lastRequest().query).toEqual({
			kpiIDs: '1234,1235',
			dateFrom: '2026-08-01',
			dateTo: '2026-08-31',
		});
		expect(result).toEqual([reportRow]);
	});

	it('sends no KPI filter when none is given', async () => {
		respond([]);

		await invoke(Reports.allDataEntries, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('users', () => {
	it('lists and reads users without logging the email', async () => {
		respond([user]);
		expect(await invoke(Users.list, {})).toEqual([user]);
		expect(lastRequest().path).toBe('/v1/users');

		respond(user);
		await invoke(Users.get, { id: 12 });
		expect(lastRequest().path).toBe('/v1/users/12');
		// The email is a sign-in address, so only the id and role are logged.
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('alex@example.com');
	});
});

describe('client error handling', () => {
	it('reads the field map from a 400 and keeps the key out of util.inspect', async () => {
		respond(validationProblem, 400);
		const util = await import('node:util');

		const error = await invoke(Kpis.create, {
			name: 'New Sales',
			icon_id: 1,
			unit_id: 123,
			frequency_id: 'W',
			value_direction: 'U',
			aggregate_function: 'SUM',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		// Core's ApiError goes through unchanged (plugin rules R8).
		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(400);
		expect(simplekpiProblem(failure)?.fieldErrors).toEqual(
			validationProblem.errors,
		);
		expect(util.inspect(error, { depth: 10 })).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('keeps the trace id from a 404', async () => {
		respond(notFoundProblem, 404);

		const error = await invoke(Kpis.get, { id: 9999 }).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const problem = simplekpiProblem(error);
		expect((error as ApiError).status).toBe(404);
		expect(problem?.detail).toBe('No KPI with id 9999 on this account.');
		expect(problem?.traceId).toBe('00-abc-def-01');
	});

	it('reads nothing from an error that is not an ApiError', () => {
		expect(simplekpiProblem(new Error('offline'))).toBeUndefined();
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});
