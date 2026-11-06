import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { snowflake } from './index';
import { REQUEST_ID, resultSet, STATEMENT_HANDLE } from './test-fixtures';

async function createClient(options: Parameters<typeof snowflake>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'snowflake', 'default');
	const corsair = createCorsair({
		plugins: [snowflake(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function firstUrl(): URL {
	const url = fetchMock.mock.calls[0]?.[0];
	if (typeof url !== 'string') throw new Error('expected a fetch url');
	return new URL(url);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Snowflake plugin through createCorsair', () => {
	it('fails before fetch when no key is configured', async () => {
		const { corsair, testDb } = await createClient({ account: 'acme-prod' });
		try {
			await corsair.snowflake.keys.issue_new_dek();
			await expect(
				corsair.snowflake.api.statements.get({
					statementHandle: STATEMENT_HANDLE,
				}),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('fails before fetch when the account credential is missing', async () => {
		const { corsair, testDb } = await createClient({ key: 'pat-test' });
		try {
			await expect(
				corsair.snowflake.api.statements.get({
					statementHandle: STATEMENT_HANDLE,
				}),
			).rejects.toThrow(/auth-missing:snowflake:account/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key, account, and token type', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.snowflake.keys.issue_new_dek();
			await corsair.snowflake.keys.set_api_key('stored-pat');
			await corsair.snowflake.keys.set_account('acme-prod');
			await corsair.snowflake.keys.set_tokenType('PROGRAMMATIC_ACCESS_TOKEN');
			respond(resultSet);

			await corsair.snowflake.api.statements.submit({
				statement: 'SELECT 1',
				requestId: REQUEST_ID,
			});

			const url = firstUrl();
			expect(url.origin).toBe('https://acme-prod.snowflakecomputing.com');
			expect(url.pathname).toBe('/api/v2/statements');
			expect(url.searchParams.get('requestId')).toBe(REQUEST_ID);
			const init = fetchMock.mock.calls[0]?.[1];
			if (typeof init !== 'object' || init === null || !('headers' in init)) {
				throw new Error('expected request headers');
			}
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe('Bearer stored-pat');
			expect(headers.get('x-snowflake-authorization-token-type')).toBe(
				'PROGRAMMATIC_ACCESS_TOKEN',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 once and then returns the result', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pat-test',
			account: 'acme-prod',
		});
		try {
			respond({ code: '390505', message: 'Too many requests.' }, 429, {
				'Retry-After': '1',
			});
			respond(resultSet);

			const result = await corsair.snowflake.api.statements.submit({
				statement: 'SELECT 1',
			});

			expect(result.statementHandle).toBe(STATEMENT_HANDLE);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 422 or a 500', async () => {
		const { corsair, testDb } = await createClient({
			key: 'pat-test',
			account: 'acme-prod',
		});
		try {
			respond(
				{
					code: '000904',
					message: 'SQL compilation error',
					statementHandle: STATEMENT_HANDLE,
				},
				422,
			);
			await expect(
				corsair.snowflake.api.statements.submit({
					statement: 'SELECT missing',
				}),
			).rejects.toMatchObject({ status: 422, code: '000904' });
			expect(fetchMock).toHaveBeenCalledTimes(1);

			respond({ message: 'Internal error' }, 500);
			await expect(
				corsair.snowflake.api.statements.submit({ statement: 'SELECT 1' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
