import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import { SnowflakeAPIError } from './client';
import { cancel, get, submit } from './endpoints';
import {
	cancelStatus,
	REQUEST_ID,
	resultSet,
	runningStatus,
	STATEMENT_HANDLE,
	statementMissing,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// never parameters: each endpoint is assignable here because parameters are
// contravariant, and the shared return stays unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function makeCtx(
	fields: {
		account?: string;
		tokenType?: string;
		storedAccount?: string | null;
		storedTokenType?: string | null;
	} = {},
) {
	return {
		key: 'pat-test',
		options: {
			account: fields.account,
			tokenType: fields.tokenType,
		},
		keys: {
			get_account: async () => fields.storedAccount ?? null,
			get_tokenType: async () => fields.storedTokenType ?? null,
		},
		$getAccountId: async () => 'test-account',
	};
}

function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	fields: Parameters<typeof makeCtx>[0] = { account: 'acme-prod' },
) {
	// The fake context only carries the key, account, and token type. A full
	// plugin context also carries a database these calls never touch.
	// unknown input: rejection cases pass values the schema does not accept.
	return endpoint(makeCtx(fields) as never, input as never);
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

function lastRequest() {
	const call = fetchMock.mock.calls.at(-1);
	if (!call) throw new Error('expected a fetch');
	const url = call[0];
	const init = call[1];
	if (typeof url !== 'string' || typeof init !== 'object' || init === null) {
		throw new Error('unexpected fetch arguments');
	}
	const headers = new Headers('headers' in init ? init.headers : undefined);
	const rawBody = 'body' in init ? init.body : undefined;
	return {
		url: new URL(url),
		method: 'method' in init ? init.method : undefined,
		headers,
		body: typeof rawBody === 'string' ? JSON.parse(rawBody) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('statements.submit', () => {
	it('posts the statement, required headers, and the account host', async () => {
		respond(resultSet);
		const result = await invoke(submit, {
			statement: 'SELECT secret FROM t',
			timeout: 604800,
			database: 'TESTDB',
			warehouse: 'TESTWH',
			bindings: { '1': { type: 'FIXED', value: '123' } },
			parameters: {
				query_tag: 'tag-1234',
				multi_statement_count: '2',
				client_result_chunk_size: 160,
			},
			async: true,
			nullable: false,
			requestId: REQUEST_ID,
		});
		expect(result).toMatchObject({
			statementHandle: STATEMENT_HANDLE,
			data: [['1']],
		});
		if (typeof result !== 'object' || result === null) {
			throw new Error('expected a result object');
		}
		expect(Object.hasOwn(result, 'vendorField')).toBe(true);

		const request = lastRequest();
		expect(request.url.origin).toBe('https://acme-prod.snowflakecomputing.com');
		expect(request.url.pathname).toBe('/api/v2/statements');
		expect(request.method).toBe('POST');
		expect(request.url.searchParams.get('async')).toBe('true');
		expect(request.url.searchParams.get('nullable')).toBe('false');
		expect(request.url.searchParams.get('requestId')).toBe(REQUEST_ID);
		expect(request.headers.get('authorization')).toBe('Bearer pat-test');
		expect(request.headers.get('user-agent')).toBe('corsair-snowflake/0.1.0');
		expect(request.body).toEqual({
			statement: 'SELECT secret FROM t',
			timeout: 604800,
			database: 'TESTDB',
			warehouse: 'TESTWH',
			bindings: { '1': { type: 'FIXED', value: '123' } },
			parameters: {
				query_tag: 'tag-1234',
				MULTI_STATEMENT_COUNT: '2',
				client_result_chunk_size: 160,
			},
		});
		expect(request.body.parameters).not.toHaveProperty('multi_statement_count');
	});

	it('sends multi_statement_count as MULTI_STATEMENT_COUNT, 0 included', async () => {
		respond({
			...resultSet,
			statementHandles: [STATEMENT_HANDLE, STATEMENT_HANDLE],
		});
		await invoke(submit, {
			statement: 'SELECT 1; SELECT 2;',
			parameters: { multi_statement_count: 0, timezone: 'Asia/Kolkata' },
		});
		expect(lastRequest().body.parameters).toEqual({
			MULTI_STATEMENT_COUNT: 0,
			timezone: 'Asia/Kolkata',
		});
	});

	it('logs the handle and row count, never the statement or bindings', async () => {
		respond(resultSet);
		await invoke(submit, {
			statement: 'SELECT secret FROM t',
			bindings: { '1': { type: 'TEXT', value: 'secret-value' } },
		});
		const payload = mockLog.mock.calls[0]?.[2];
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'snowflake.statements.submit',
			expect.objectContaining({
				statementHandle: STATEMENT_HANDLE,
				rows: 1,
				code: '090001',
			}),
			'completed',
		);
		const text = JSON.stringify(payload);
		expect(text).not.toContain('SELECT');
		expect(text).not.toContain('secret');
	});

	it('accepts a 202 with no rows and an empty data array', async () => {
		respond(runningStatus, 202);
		const running = await invoke(submit, { statement: 'SELECT 1', timeout: 0 });
		expect(running).toMatchObject({ statementHandle: STATEMENT_HANDLE });
		expect(
			typeof running === 'object' &&
				running !== null &&
				'data' in running &&
				running.data,
		).toBeFalsy();

		respond({ ...resultSet, data: [], vendorField: undefined });
		const empty = await invoke(submit, { statement: 'SELECT 1' });
		expect(empty).toMatchObject({ data: [] });
	});

	it('rejects bounds, enums, and retry without a request id before the wire', async () => {
		const rejected = [
			{ statement: '' },
			{ statement: 'SELECT 1', timeout: -1 },
			{ statement: 'SELECT 1', timeout: 604801 },
			{ statement: 'SELECT 1', timeout: 1.5 },
			{
				statement: 'SELECT 1',
				bindings: { '1': { type: 'INTEGER', value: '1' } },
			},
			{
				statement: 'SELECT 1',
				bindings: { '1': { type: 'FIXED', value: 123 } },
			},
			{ statement: 'SELECT 1', parameters: { NOT_A_PARAM: 'x' } },
			{ statement: 'SELECT 1', parameters: { client_result_chunk_size: 15 } },
			{ statement: 'SELECT 1', parameters: { client_result_chunk_size: 161 } },
			{ statement: 'SELECT 1', parameters: { rows_per_resultset: -1 } },
			{ statement: 'SELECT 1', parameters: { multi_statement_count: -1 } },
			{ statement: 'SELECT 1', retry: true },
			{ statement: 'SELECT 1', requestId: 'not-a-uuid' },
			{ statement: 'SELECT 1', extra: true },
		];
		for (const input of rejected) {
			await expect(invoke(submit, input)).rejects.toBeInstanceOf(ZodError);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends retry=true only together with the same request id', async () => {
		respond(resultSet);
		await invoke(submit, {
			statement: 'SELECT 1',
			requestId: REQUEST_ID,
			retry: true,
		});
		const request = lastRequest();
		expect(request.url.searchParams.get('retry')).toBe('true');
		expect(request.url.searchParams.get('requestId')).toBe(REQUEST_ID);
	});

	it('uses a stored account and token type when options omit them', async () => {
		respond(resultSet);
		await invoke(
			submit,
			{ statement: 'SELECT 1' },
			{
				storedAccount: 'xy12345.us-east-2.aws',
				storedTokenType: 'KEYPAIR_JWT',
			},
		);
		const request = lastRequest();
		expect(request.url.hostname).toBe(
			'xy12345.us-east-2.aws.snowflakecomputing.com',
		);
		expect(request.headers.get('x-snowflake-authorization-token-type')).toBe(
			'KEYPAIR_JWT',
		);
	});

	it('fails before fetch when the account is missing or the token type is not allowed', async () => {
		await expect(invoke(submit, { statement: 'SELECT 1' }, {})).rejects.toThrow(
			/auth-missing:snowflake:account/,
		);
		await expect(
			invoke(
				submit,
				{ statement: 'SELECT 1' },
				{ account: 'acme-prod', tokenType: 'oauth' },
			),
		).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('does not log when Snowflake rejects the statement', async () => {
		respond(statementMissing, 422);
		// unknown: the rejection is the API error under test.
		const error = await invoke(submit, { statement: 'SELECT missing' }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(SnowflakeAPIError);
		expect(error).toMatchObject({ status: 422, code: '000709' });
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('statements.get', () => {
	it('requests one partition and accepts the documented handle', async () => {
		respond(resultSet);
		await invoke(get, { statementHandle: STATEMENT_HANDLE, partition: 0 });
		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.url.pathname).toBe(`/api/v2/statements/${STATEMENT_HANDLE}`);
		expect(request.url.searchParams.get('partition')).toBe('0');
		expect(request.url.searchParams.get('nullable')).toBeNull();
		expect(request.body).toBeUndefined();
	});

	it('accepts a later partition that carries only data', async () => {
		// Live shape of ?partition=1: no handle, no metadata.
		respond({
			data: [
				['6563', 'he fluffily final requests s'],
				['6564', null],
			],
		});
		const result = await invoke(get, {
			statementHandle: STATEMENT_HANDLE,
			partition: 1,
		});
		expect(result).toEqual({
			statementHandle: STATEMENT_HANDLE,
			data: [
				['6563', 'he fluffily final requests s'],
				['6564', null],
			],
		});
		expect(lastRequest().url.searchParams.get('partition')).toBe('1');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'snowflake.statements.get',
			{ statementHandle: STATEMENT_HANDLE, rows: 2, partition: 1 },
			'completed',
		);
	});

	it('rejects a bad handle, a negative partition, and nullable', async () => {
		await expect(
			invoke(get, { statementHandle: 'abc' }),
		).rejects.toBeInstanceOf(ZodError);
		await expect(
			invoke(get, { statementHandle: STATEMENT_HANDLE, partition: -1 }),
		).rejects.toBeInstanceOf(ZodError);
		await expect(
			invoke(get, { statementHandle: STATEMENT_HANDLE, nullable: false }),
		).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('statements.cancel', () => {
	it('posts to the cancel path with no body', async () => {
		respond(cancelStatus);
		const result = await invoke(cancel, { statementHandle: STATEMENT_HANDLE });
		expect(result).toMatchObject({
			code: '000604',
			statementHandle: STATEMENT_HANDLE,
		});
		const request = lastRequest();
		expect(request.method).toBe('POST');
		expect(request.url.pathname).toBe(
			`/api/v2/statements/${STATEMENT_HANDLE}/cancel`,
		);
		expect(request.body).toBeUndefined();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'snowflake.statements.cancel',
			expect.objectContaining({ code: '000604' }),
			'completed',
		);
	});
});
