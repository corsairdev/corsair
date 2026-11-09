// unknown: response bodies are arbitrary JSON, so each test states its own.
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	authErrorBody,
	createResponse,
	emptyListResponse,
	getResponse,
	incidentRecord,
	incidentRecordDisplayAll,
	listResponse,
	notFoundBody,
	tablesResponse,
	updateResponse,
	validationErrorBody,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	noContent,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const SYS_ID = '9d385017c611228701d22104cc95c371';

describe('ServiceNow output parsing', () => {
	it('unwraps a record list from result', async () => {
		mockFetch(jsonResponse(listResponse));

		const result = await endpoints.records.list(makeCtx(), {
			table: 'incident',
		});

		expect(result.records).toHaveLength(1);
		expect(result.records[0]).toEqual(incidentRecord);
	});

	it('keeps raw string values as strings', async () => {
		mockFetch(jsonResponse(listResponse));

		const result = await endpoints.records.list(makeCtx(), {
			table: 'incident',
		});
		const record = result.records[0]!;

		// ServiceNow returns every raw value as a string, including booleans and
		// numbers, so a record must not coerce them.
		expect(record.state).toBe('2');
		expect(record.active).toBe('true');
	});

	it('keeps a reference field as the object the API sent', async () => {
		mockFetch(jsonResponse(listResponse));

		const result = await endpoints.records.list(makeCtx(), {
			table: 'incident',
		});

		expect(result.records[0]!.caller_id).toEqual({
			value: '6816f79cc0a8016401c5a33be7409464',
			link: 'https://acme.service-now.com/api/now/table/sys_user/6816f79cc0a8016401c5a33be7409464',
		});
	});

	it('parses an empty list', async () => {
		mockFetch(jsonResponse(emptyListResponse));

		const result = await endpoints.records.list(makeCtx(), {
			table: 'incident',
		});

		expect(result.records).toEqual([]);
	});

	it('unwraps one record from result', async () => {
		mockFetch(jsonResponse(getResponse));

		const result = await endpoints.records.get(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
		});

		expect(result.number).toBe('INC0010001');
		expect(result.sys_id).toBe(SYS_ID);
	});

	it('accepts the display_value=all shape, where every field is a pair', async () => {
		mockFetch(jsonResponse({ result: incidentRecordDisplayAll }));

		const result = await endpoints.records.get(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
			sysparm_display_value: 'all',
		});

		expect(result.state).toEqual({
			value: '2',
			display_value: 'In Progress',
		});
	});

	it('unwraps a created record', async () => {
		mockFetch(jsonResponse(createResponse));

		const result = await endpoints.records.create(makeCtx(), {
			table: 'incident',
			fields: { short_description: 'Printer offline' },
		});

		expect(result.sys_id).toBe('a1b2c3d4e5f60718293a4b5c6d7e8f90');
		expect(result.number).toBe('INC0010002');
	});

	it('unwraps an updated record', async () => {
		mockFetch(jsonResponse(updateResponse));

		const result = await endpoints.records.update(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
			fields: { state: '3' },
		});

		expect(result.state).toBe('3');
	});

	it('parses the table list', async () => {
		mockFetch(jsonResponse(tablesResponse));

		const result = await endpoints.tables.list(makeCtx(), {});

		expect(result.tables).toHaveLength(2);
		expect(result.tables[0]!.name).toBe('incident');
		expect(result.tables[1]!.name).toBe('u_custom_asset');
	});

	it('reports a delete from the identifiers, since 204 has no body', async () => {
		mockFetch(noContent());

		const result = await endpoints.records.delete(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
		});

		expect(result.deleted).toBe(true);
		expect(result.sys_id).toBe(SYS_ID);
	});
});

describe('ServiceNow shape rejections', () => {
	it('rejects a 2xx body with no result key', async () => {
		// A 200 that reports a failure in a shape we do not recognise must throw
		// rather than become an empty record.
		mockFetch(jsonResponse({ status: 'failure' }));

		await expect(
			endpoints.records.get(makeCtx(), {
				table: 'incident',
				sys_id: SYS_ID,
			}),
		).rejects.toThrow(/no result/);
	});

	it('rejects a list whose result is not an array', async () => {
		mockFetch(jsonResponse({ result: { sys_id: SYS_ID } }));

		await expect(
			endpoints.records.list(makeCtx(), { table: 'incident' }),
		).rejects.toThrow(/non-array record list/);
	});

	it('rejects a table list whose result is not an array', async () => {
		mockFetch(jsonResponse({ result: 'nope' }));

		await expect(endpoints.tables.list(makeCtx(), {})).rejects.toThrow(
			/non-array table list/,
		);
	});

	it('rejects a non-object body', async () => {
		mockFetch(jsonResponse(['not', 'an', 'envelope']));

		await expect(
			endpoints.records.list(makeCtx(), { table: 'incident' }),
		).rejects.toThrow(/unexpected record list body/);
	});

	it('rejects a sys_id that is not 32 hex characters', async () => {
		// Validated before sending, so a typo costs no API call.
		await expect(
			endpoints.records.get(makeCtx(), {
				table: 'incident',
				sys_id: 'not-a-sys-id',
			}),
		).rejects.toThrow(/sys_id/);
	});

	it('rejects an empty table name', async () => {
		await expect(
			endpoints.records.list(makeCtx(), { table: '' }),
		).rejects.toThrow();
	});
});

describe('ServiceNow error surfaces', () => {
	it('surfaces a 401 with the message and detail', async () => {
		mockFetch(jsonResponse(authErrorBody, { status: 401 }));

		// Both fields come off the fixture, so dropping `detail` fails here.
		await expect(
			endpoints.records.list(makeCtx(), { table: 'incident' }),
		).rejects.toMatchObject({
			status: 401,
			message: expect.stringContaining(
				authErrorBody.error.message,
			) as unknown as string,
			detail: authErrorBody.error.detail,
		});
	});

	it('surfaces a 404 for a missing table', async () => {
		mockFetch(jsonResponse(notFoundBody, { status: 404 }));

		await expect(
			endpoints.records.list(makeCtx(), { table: 'u_nope' }),
		).rejects.toThrow(/No Record found/);
	});

	it('surfaces a 400 with the specific detail', async () => {
		mockFetch(jsonResponse(validationErrorBody, { status: 400 }));

		await expect(
			endpoints.records.update(makeCtx(), {
				table: 'incident',
				sys_id: SYS_ID,
				fields: { state: 'bogus' },
			}),
		).rejects.toMatchObject({
			status: 400,
			message: expect.stringContaining(
				validationErrorBody.error.message,
			) as unknown as string,
			detail: validationErrorBody.error.detail,
		});
	});

	it('throws when the instance host is missing', async () => {
		const ctxWithoutHost = {
			key: JSON.stringify({ username: 'u', password: 'p' }),
			options: {},
			db: {},
			keys: { get_host: jest.fn().mockResolvedValue(null) },
		};
		// Safe: the endpoint reads only key, options, db and keys.get_host.
		const ctx = ctxWithoutHost as never;

		await expect(
			endpoints.records.list(ctx, { table: 'incident' }),
		).rejects.toThrow(/instance host is required/);
	});
});
