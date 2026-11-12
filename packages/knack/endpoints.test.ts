import { logEventFromContext } from 'corsair/core';
import { KnackAPIError, packKnackCredentials } from './client';
import { Applications, Objects, Records } from './endpoints';
import {
	application,
	deleteResult,
	emptyRecordList,
	malformedRecordId,
	objectDetail,
	objectMissing,
	objectsList,
	pagePastEnd,
	record,
	recordId,
	recordList,
	recordMissing,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const CREDENTIALS = {
	applicationId: '6af358626e7887956647723f',
	apiKey: 'b81e8bc4-4519-4257-82fc-b0508a6728a2',
};
const PACKED_KEY = packKnackCredentials(CREDENTIALS);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each returns its own output type, so the shared
// return is the raw envelope, and the schema under test decides the real shape.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: PACKED_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or plain text.
function respond(body: unknown, status = 200) {
	const isText = typeof body === 'string';
	fetchMock.mockResolvedValueOnce(
		new Response(isText ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': isText ? 'text/plain' : 'application/json',
			},
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the body is whatever the endpoint serialised.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.headers.get('x-knack-application-id')).toBe(
		CREDENTIALS.applicationId,
	);
	expect(sent.headers.get('x-knack-rest-api-key')).toBe(CREDENTIALS.apiKey);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('applications.get', () => {
	it('GETs the application named by the connected credentials', async () => {
		respond(application);

		const result = await invoke(Applications.get, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: `/v1/applications/${CREDENTIALS.applicationId}`,
			method: 'GET',
		});
		expect(result).toEqual(application);
	});

	// The app id is part of the credential pair, so no input can ask for a
	// different app than the account is connected to.
	it('takes no input that could select another app', async () => {
		respond(application);

		await invoke(Applications.get, { applicationId: 'someone-elses-app' });

		expect(lastRequest().path).toBe(
			`/v1/applications/${CREDENTIALS.applicationId}`,
		);
	});

	it('accepts metadata with the object list absent', async () => {
		respond({ application: { id: 'app', name: 'Bare' } });

		const result = (await invoke(Applications.get, {})) as {
			application: { name?: string };
		};

		expect(result.application.name).toBe('Bare');
	});
});

describe('objects.list', () => {
	it('GETs /objects and returns every table', async () => {
		respond(objectsList);

		const result = await invoke(Objects.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/v1/objects', method: 'GET' });
		expect(result).toEqual(objectsList);
	});

	it('fails when the objects list is absent', async () => {
		respond({ items: [] });

		await expect(invoke(Objects.list, {})).rejects.toThrow();
	});
});

describe('objects.get', () => {
	it('GETs /objects/{key} and returns the definition', async () => {
		respond(objectDetail);

		const result = await invoke(Objects.get, { object_key: 'object_3' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/objects/object_3',
			method: 'GET',
		});
		expect(result).toEqual(objectDetail);
	});

	// A key that is not in the app answers 200 with `{}`, so returning that as
	// a blank object would report a table that does not exist.
	it('throws when Knack answers an empty body for an absent key', async () => {
		respond(objectMissing);

		await expect(
			invoke(Objects.get, { object_key: 'object_999' }),
		).rejects.toThrow(/empty body rather than a 404/);
	});

	it('rejects a key that is not in the object_N form without calling the API', async () => {
		await expect(
			invoke(Objects.get, { object_key: 'Accounts' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('records.list', () => {
	it('GETs the records of an object', async () => {
		respond(recordList);

		const result = await invoke(Records.list, { object_key: 'object_3' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/objects/object_3/records',
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(recordList);
	});

	it('sends paging and sorting as query parameters', async () => {
		respond(recordList);

		await invoke(Records.list, {
			object_key: 'object_3',
			page: 3,
			rows_per_page: 10,
			sort_field: 'field_23',
			sort_order: 'desc',
		});

		expect(lastRequest().query).toEqual({
			page: '3',
			rows_per_page: '10',
			sort_field: 'field_23',
			sort_order: 'desc',
		});
	});

	// Knack ignores a sort order sent without a field, so it is not sent alone.
	it('drops a sort order with no sort field', async () => {
		respond(recordList);

		await invoke(Records.list, { object_key: 'object_3', sort_order: 'desc' });

		expect(lastRequest().query).toEqual({});
	});

	// The index in the parameter name is what makes Knack apply the filter: the
	// unindexed form is silently ignored and every record comes back.
	it('sends filters with the index Knack requires', async () => {
		respond(recordList);

		await invoke(Records.list, {
			object_key: 'object_1',
			filters: [{ field: 'field_4', operator: 'is', value: 'active' }],
		});

		const sent = lastRequest();
		expect(sent.query['filters[0][field]']).toBe('field_4');
		expect(sent.query['filters[0][operator]']).toBe('is');
		expect(sent.query['filters[0][value]']).toBe('active');
		expect(sent.query['filters[field]']).toBeUndefined();
	});

	it('numbers each filter in a list', async () => {
		respond(recordList);

		await invoke(Records.list, {
			object_key: 'object_1',
			filters: [
				{ field: 'field_4', operator: 'is', value: 'active' },
				{ field: 'field_1', operator: 'contains', value: 'Billing' },
			],
		});

		const sent = lastRequest();
		expect(sent.query['filters[1][field]']).toBe('field_1');
		expect(sent.query['filters[1][operator]']).toBe('contains');
		expect(sent.query['filters[1][value]']).toBe('Billing');
	});

	it('rejects an unknown filter operator before sending', async () => {
		await expect(
			invoke(Records.list, {
				object_key: 'object_1',
				filters: [{ field: 'field_4', operator: 'equals', value: 'x' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// Knack's filter reference lists `higher than` and `lower than` for number,
	// rating and timer fields, and `is any`, `is before` and `is after` for
	// choice and date fields. The schema must accept the documented names.
	it.each([
		'higher than',
		'lower than',
		'is any',
		'is before',
		'is after',
		'is today',
	])('accepts the documented operator %s', async (operator) => {
		respond(recordList);

		await invoke(Records.list, {
			object_key: 'object_1',
			filters: [{ field: 'field_4', operator, value: '10' }],
		});

		expect(lastRequest().query['filters[0][operator]']).toBe(operator);
	});

	// `is greater than` and its relatives are not Knack operators; a number
	// comparison is `higher than` / `lower than`.
	it.each(['is greater than', 'is less than', 'is between'])(
		'rejects the undocumented operator %s',
		async (operator) => {
			await expect(
				invoke(Records.list, {
					object_key: 'object_1',
					filters: [{ field: 'field_4', operator, value: '10' }],
				}),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	// `is blank` and `is not blank` take no value in Knack's filter reference.
	it('sends a blank check without a value', async () => {
		respond(recordList);

		await invoke(Records.list, {
			object_key: 'object_1',
			filters: [{ field: 'field_4', operator: 'is blank' }],
		});

		const sent = lastRequest();
		expect(sent.query['filters[0][operator]']).toBe('is blank');
		expect(sent.query['filters[0][value]']).toBeUndefined();
	});

	// Every operator that compares against something needs the value; without
	// it Knack gets an operator alone and its answer is undocumented.
	it.each([
		'is',
		'is not',
		'contains',
		'does not contain',
		'starts with',
		'ends with',
		'higher than',
		'lower than',
		'is before',
		'is after',
	])('rejects %s without a value before sending', async (operator) => {
		await expect(
			invoke(Records.list, {
				object_key: 'object_1',
				filters: [{ field: 'field_4', operator }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// Knack returns at most 1,000 records a page.
	it('rejects rows_per_page above 1000 before sending', async () => {
		await expect(
			invoke(Records.list, { object_key: 'object_1', rows_per_page: 5000 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a filter field that is not a field key', async () => {
		await expect(
			invoke(Records.list, {
				object_key: 'object_1',
				filters: [{ field: 'Name', operator: 'is', value: 'x' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// A page past the end is a 200 with 0 pages and no records, not an error.
	it('reports an empty page rather than failing', async () => {
		respond(pagePastEnd);

		const result = (await invoke(Records.list, {
			object_key: 'object_3',
			page: 5,
		})) as typeof pagePastEnd;

		expect(result.total_records).toBe(0);
		expect(result.current_page).toBe(5);
	});
});

describe('records.get', () => {
	it('GETs /objects/{key}/records/{id} and returns the record', async () => {
		respond(record);

		const result = await invoke(Records.get, {
			object_key: 'object_3',
			record_id: recordId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: `/v1/objects/object_3/records/${recordId}`,
			method: 'GET',
		});
		expect(result).toEqual(record);
	});

	// An id that does not exist answers 200 with an empty records list, so this
	// must raise rather than return a record with no fields.
	it('throws when a missing id answers an empty list', async () => {
		respond(recordMissing);

		await expect(
			invoke(Records.get, {
				object_key: 'object_3',
				record_id: '000000000000000000000000',
			}),
		).rejects.toThrow(/empty list rather than a 404/);
	});

	it('surfaces a malformed id as a KnackAPIError', async () => {
		respond(malformedRecordId, 400);

		await expect(
			invoke(Records.get, { object_key: 'object_3', record_id: recordId }),
		).rejects.toThrow(KnackAPIError);
	});

	// A record id is 24 hex characters, so anything else cannot exist.
	it('rejects a record id of the wrong shape before sending', async () => {
		await expect(
			invoke(Records.get, { object_key: 'object_3', record_id: 'abc' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('records.create', () => {
	it('POSTs the fields as the request body', async () => {
		respond(record);

		const result = await invoke(Records.create, {
			object_key: 'object_3',
			fields: { field_23: 'Fixture Record' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/objects/object_3/records',
			method: 'POST',
			body: { field_23: 'Fixture Record' },
		});
		expect(result).toEqual(record);
	});

	// Knack silently drops a body with the wrong content type and still answers
	// 200, so the writer must set it exactly.
	it('sends the JSON content type', async () => {
		respond(record);

		await invoke(Records.create, {
			object_key: 'object_3',
			fields: { field_23: 'x' },
		});

		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	// A `_raw` mirror is read-only, and Knack rejects it, so it fails here first.
	// Knack's own POST example writes an address as an object and a link as
	// `{ url }`; name, email and date fields take objects too.
	it('sends compound field values as objects', async () => {
		respond(record);

		const fields = {
			field_16: { street: '123 Fake St.', city: 'Amonate', zip: '24601' },
			field_17: { url: 'https://example.com' },
			field_20: { first: 'Ada', last: 'Lovelace' },
		};
		await invoke(Records.create, { object_key: 'object_1', fields });

		expect(lastRequest().body).toEqual(fields);
	});

	it('rejects a read-only _raw field without calling the API', async () => {
		await expect(
			invoke(Records.create, {
				object_key: 'object_3',
				fields: { field_23: 'x', field_23_raw: 'x' },
			}),
		).rejects.toThrow(/read-only/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a read-only _html field without calling the API', async () => {
		await expect(
			invoke(Records.create, {
				object_key: 'object_3',
				fields: { field_27_html: '<span></span>' },
			}),
		).rejects.toThrow(/read-only/);
	});

	it('rejects an empty field map', async () => {
		await expect(
			invoke(Records.create, { object_key: 'object_3', fields: {} }),
		).rejects.toThrow();
	});

	// Knack accepts an unknown key and silently ignores it, so a column label or
	// a typo would look like a successful write that changed nothing.
	it('rejects a column label used as a field key', async () => {
		await expect(
			invoke(Records.create, {
				object_key: 'object_3',
				fields: { Name: 'Acme' },
			}),
		).rejects.toThrow(/not a Knack field key/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a near-miss field key', async () => {
		await expect(
			invoke(Records.create, {
				object_key: 'object_3',
				fields: { field_23_typo: 'Acme' },
			}),
		).rejects.toThrow(/not a Knack field key/);
	});

	// A `_raw` mirror gets its own message, because it is a real key that is
	// read-only rather than a typo.
	it('reports a read-only mirror differently from a typo', async () => {
		await expect(
			invoke(Records.create, {
				object_key: 'object_3',
				fields: { field_23_raw: 'Acme' },
			}),
		).rejects.toThrow(/read-only/);
	});
});

describe('records.update', () => {
	it('PUTs the fields to the record path', async () => {
		respond(record);

		const result = await invoke(Records.update, {
			object_key: 'object_3',
			record_id: recordId,
			fields: { field_23: 'Updated' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: `/v1/objects/object_3/records/${recordId}`,
			method: 'PUT',
			body: { field_23: 'Updated' },
		});
		expect(result).toEqual(record);
	});

	it('rejects a read-only _raw field', async () => {
		await expect(
			invoke(Records.update, {
				object_key: 'object_3',
				record_id: recordId,
				fields: { field_23_raw: 'x' },
			}),
		).rejects.toThrow(/read-only/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('records.delete', () => {
	it('DELETEs the record and reports the confirmation', async () => {
		respond(deleteResult);

		const result = await invoke(Records.delete, {
			object_key: 'object_3',
			record_id: recordId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: `/v1/objects/object_3/records/${recordId}`,
			method: 'DELETE',
		});
		expect(result).toEqual(deleteResult);
	});

	// A 200 without the flag is not a deletion, and the schema has to reject it.
	it('fails when the answer carries no delete flag', async () => {
		respond({});

		await expect(
			invoke(Records.delete, {
				object_key: 'object_3',
				record_id: recordId,
			}),
		).rejects.toThrow();
	});

	it('fails when the flag is not true', async () => {
		respond({ delete: false });

		await expect(
			invoke(Records.delete, {
				object_key: 'object_3',
				record_id: recordId,
			}),
		).rejects.toThrow();
	});
});

describe('logging', () => {
	it('records a completed event naming the operation', async () => {
		respond(emptyRecordList);

		await invoke(Records.list, { object_key: 'object_3' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'knack.records.list',
			expect.objectContaining({ object_key: 'object_3', records: 0, total: 0 }),
			'completed',
		);
	});

	// The field values are caller business data, so only their count is logged.
	it('logs a write by field count rather than field values', async () => {
		respond(record);

		await invoke(Records.create, {
			object_key: 'object_3',
			fields: { field_23: 'Confidential Client Name' },
		});

		const logged = JSON.stringify(mockLog.mock.calls.at(-1));
		expect(logged).not.toContain('Confidential Client Name');
		expect(logged).toContain('"fields":1');
	});
});
