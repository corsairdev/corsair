jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	createResponse,
	getResponse,
	listResponse,
	tablesResponse,
	updateResponse,
} from './test-fixtures';
import {
	BASE,
	currentFetch,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	noContent,
	queryParam,
	restoreFetchMock,
	sentBody,
	sentHeader,
	TEST_HOST,
	TEST_KEY,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const SYS_ID = '9d385017c611228701d22104cc95c371';

describe('ServiceNow request shapes', () => {
	it('sends HTTP Basic auth built from the JSON credential pair', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(makeCtx(), { table: 'incident' });

		const expected = `Basic ${Buffer.from('admin:secret').toString('base64')}`;
		expect(sentHeader('Authorization')).toBe(expected);
	});

	it('targets the configured instance, not a shared host', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(makeCtx(), { table: 'incident' });

		expect(lastCall().url.startsWith(`${BASE}/table/incident`)).toBe(true);
		expect(new URL(lastCall().url).host).toBe(TEST_HOST);
	});

	it('accepts a host pasted with a scheme and trailing slash', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(
			makeCtx({ host: 'https://acme.service-now.com/' }),
			{ table: 'incident' },
		);

		// The scheme is stripped and the base rebuilt exactly once, so the path
		// is not doubled and no trailing slash survives.
		expect(lastCall().url).toBe(`${BASE}/table/incident`);
		expect(lastCall().url).not.toContain('service-now.com//');
	});

	it('lists records with the query, fields and paging', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(makeCtx(), {
			table: 'incident',
			sysparm_query: 'active=true^ORDERBYDESCsys_created_on',
			sysparm_fields: 'number,short_description,state',
			sysparm_limit: 20,
			sysparm_offset: 40,
		});

		expect(lastCall().init.method).toBe('GET');
		expect(queryParam('sysparm_query')).toBe(
			'active=true^ORDERBYDESCsys_created_on',
		);
		expect(queryParam('sysparm_fields')).toBe('number,short_description,state');
		expect(queryParam('sysparm_limit')).toBe('20');
		expect(queryParam('sysparm_offset')).toBe('40');
	});

	it('omits unset query parameters', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(makeCtx(), { table: 'incident' });

		expect(queryParam('sysparm_query')).toBeNull();
		expect(queryParam('sysparm_limit')).toBeNull();
		expect(queryParam('sysparm_offset')).toBeNull();
	});

	it('encodes the table name in the path', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(makeCtx(), { table: 'u_my table' });

		expect(lastCall().url).toBe(`${BASE}/table/u_my%20table`);
	});

	it('reads one record by sys_id', async () => {
		mockFetch(jsonResponse(getResponse));

		await endpoints.records.get(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
			sysparm_display_value: 'all',
		});

		expect(lastCall().url.startsWith(`${BASE}/table/incident/${SYS_ID}`)).toBe(
			true,
		);
		expect(queryParam('sysparm_display_value')).toBe('all');
	});

	it('creates a record with the fields as the body', async () => {
		mockFetch(jsonResponse(createResponse));

		await endpoints.records.create(makeCtx(), {
			table: 'incident',
			fields: {
				short_description: 'Printer offline',
				caller_id: '6816f79cc0a8016401c5a33be7409464',
			},
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url.startsWith(`${BASE}/table/incident`)).toBe(true);
		expect(sentBody()).toEqual({
			short_description: 'Printer offline',
			caller_id: '6816f79cc0a8016401c5a33be7409464',
		});
	});

	it('updates a record with PATCH, not PUT', async () => {
		mockFetch(jsonResponse(updateResponse));

		await endpoints.records.update(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
			fields: { state: '3' },
		});

		// PUT replaces every unset field with empty; PATCH changes only what is sent.
		expect(lastCall().init.method).toBe('PATCH');
		expect(lastCall().url).toBe(`${BASE}/table/incident/${SYS_ID}`);
		expect(sentBody()).toEqual({ state: '3' });
	});

	it('deletes a record and echoes its identifiers', async () => {
		mockFetch(noContent());

		const result = await endpoints.records.delete(makeCtx(), {
			table: 'incident',
			sys_id: SYS_ID,
		});

		expect(lastCall().init.method).toBe('DELETE');
		// A 204 carries no body, so the identifiers come from the request.
		expect(result).toEqual({
			deleted: true,
			table: 'incident',
			sys_id: SYS_ID,
		});
	});

	it('lists tables with a default field selection', async () => {
		mockFetch(jsonResponse(tablesResponse));

		await endpoints.tables.list(makeCtx(), {});

		expect(lastCall().url.startsWith(`${BASE}/table/sys_db_object`)).toBe(true);
		// Without a selection this table returns dozens of columns per row.
		expect(queryParam('sysparm_fields')).toBe('name,label,super_class,sys_id');
	});

	it('lets a caller override the table field selection', async () => {
		mockFetch(jsonResponse(tablesResponse));

		await endpoints.tables.list(makeCtx(), { sysparm_fields: 'name,label' });

		expect(queryParam('sysparm_fields')).toBe('name,label');
	});

	it('keeps name in a selection that omits it', async () => {
		mockFetch(jsonResponse(tablesResponse));

		await endpoints.tables.list(makeCtx(), { sysparm_fields: 'sys_id,label' });

		// ServiceNow returns only the fields asked for, and `name` is what a
		// caller passes as `table`, so it must survive the selection.
		expect(queryParam('sysparm_fields')).toBe('sys_id,label,name');
	});

	it('uses the stored host when the option is absent', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(
			makeCtx({ host: null, storedHost: 'stored.service-now.com' }),
			{ table: 'incident' },
		);

		// The option wins when set, but a plugin configured once with
		// keys.set_host must still work with no per-call option.
		expect(new URL(lastCall().url).host).toBe('stored.service-now.com');
	});

	it('builds the host from a stored instance name', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(
			makeCtx({ host: null, storedHost: 'stored' }),
			{ table: 'incident' },
		);

		expect(lastCall().url).toBe(
			'https://stored.service-now.com/api/now/table/incident',
		);
	});

	it('prefers the host option over a stored one', async () => {
		mockFetch(jsonResponse(listResponse));

		await endpoints.records.list(
			makeCtx({
				host: 'option.service-now.com',
				storedHost: 'stored.service-now.com',
			}),
			{ table: 'incident' },
		);

		expect(new URL(lastCall().url).host).toBe('option.service-now.com');
	});

	// The stored host is tenant input. Anything that is not a ServiceNow
	// instance must fail before a request leaves, because the request carries
	// the Basic credentials.
	it.each([
		'stored.example.com',
		'https://internal.example.com/',
		'169.254.169.254',
		'localhost:8443',
		'acme.service-now.com.example.com',
	])('sends nothing to a stored host of %s', async (storedHost) => {
		await expect(
			endpoints.records.list(makeCtx({ host: null, storedHost }), {
				table: 'incident',
			}),
		).rejects.toThrow(/instance name or \{instance\}\.service-now\.com/);

		expect(currentFetch()).not.toHaveBeenCalled();
	});

	it('sends nothing to a host option outside ServiceNow', async () => {
		await expect(
			endpoints.records.list(makeCtx({ host: 'option.example.com' }), {
				table: 'incident',
			}),
		).rejects.toThrow(/instance name or \{instance\}\.service-now\.com/);

		expect(currentFetch()).not.toHaveBeenCalled();
	});

	it('sends a credential pair the client can parse', async () => {
		// The pair travels JSON-encoded because keyBuilder returns one string.
		expect(JSON.parse(TEST_KEY)).toEqual({
			username: 'admin',
			password: 'secret',
		});
	});
});
