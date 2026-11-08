import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { DataboxAPIError } from './client';
import { databox } from './index';
import {
	conflictInProgress,
	dashboardList,
	dataSourceList,
	ingestQueued,
	unauthorized,
	validationError,
} from './test-fixtures';

async function createClient(options: Parameters<typeof databox>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'databox', 'default');
	const corsair = createCorsair({
		plugins: [databox(options)],
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Databox plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.databox.keys.issue_new_dek();
			await expect(corsair.databox.api.auth.validateKey({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.databox.keys.issue_new_dek();
			await corsair.databox.keys.set_api_key('dbx-stored-key');
			respond({ requestId: 'r', status: 'success' });

			await corsair.databox.api.auth.validateKey({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('x-api-key')).toBe('dbx-stored-key');
			expect(headers.get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('lists dashboards with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'dbx-test-key' });
		try {
			respond(dashboardList);

			const result = await corsair.databox.api.dashboards.list({});

			expect(result.dashboards[0]?.name).toBe('Sales Overview');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.databox.com/v2/dashboards');
		} finally {
			testDb.cleanup();
		}
	});

	it('passes the accountId input through as x-account-id', async () => {
		const { corsair, testDb } = await createClient({ key: 'dbx-test-key' });
		try {
			respond(dataSourceList);

			await corsair.databox.api.dataSources.list({ accountId: 4754489 });

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-account-id')).toBe('4754489');
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a 2xx envelope error without retrying', async () => {
		const { corsair, testDb } = await createClient({ key: 'dbx-test-key' });
		try {
			respond(validationError('records'), 200);

			await expect(
				corsair.databox.api.datasets.ingestData({
					id: 1,
					records: [{ transaction_id: 'T-1' }],
				}),
			).rejects.toBeInstanceOf(DataboxAPIError);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'dbx-bad-key' });
		try {
			respond(unauthorized, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.databox.api.dataSources
				.list({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(DataboxAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write that hit a retryable 409-in-progress forever', async () => {
		const { corsair, testDb } = await createClient({ key: 'dbx-test-key' });
		try {
			respond(conflictInProgress, 409, { 'Retry-After': '0' });
			respond(ingestQueued);

			const result = await corsair.databox.api.datasets.ingestData({
				id: 1,
				records: [{ transaction_id: 'T-1' }],
			});

			// The 409 means the request was not applied, so one retry is safe.
			expect(result.ingestionId).toBe('a4283796-bfde-42cf-aa65-1830d6692966');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

// Live smoke, read-only. CI skips these; run locally with DATABOX_API_KEY set.
const describeIfKey = process.env.DATABOX_API_KEY ? describe : describe.skip;

describeIfKey('Databox live API (read-only)', () => {
	it('validates the key', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.databox.keys.issue_new_dek();
			await corsair.databox.keys.set_api_key(
				process.env.DATABOX_API_KEY as string,
			);

			await expect(corsair.databox.api.auth.validateKey({})).resolves.toEqual({
				valid: true,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('lists data sources and dashboards one page deep', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.databox.keys.issue_new_dek();
			await corsair.databox.keys.set_api_key(
				process.env.DATABOX_API_KEY as string,
			);

			const sources = await corsair.databox.api.dataSources.list({
				pageSize: 1,
			});
			expect(typeof sources.page).toBe('number');

			const dashboards = await corsair.databox.api.dashboards.list({
				pageSize: 1,
			});
			expect(typeof dashboards.page).toBe('number');
		} finally {
			testDb.cleanup();
		}
	});
});
