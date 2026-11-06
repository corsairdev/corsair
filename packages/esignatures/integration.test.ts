import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ESignaturesAPIError } from './client';
import { esignatures } from './index';
import { contract, contractId, errorBody } from './test-fixtures';

async function createClient(options: Parameters<typeof esignatures>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'esignatures', 'default');
	const corsair = createCorsair({
		plugins: [esignatures(options)],
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

describe('eSignatures plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.esignatures.keys.issue_new_dek();
			await expect(corsair.esignatures.api.templates.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key as an HTTP Basic header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.esignatures.keys.issue_new_dek();
			await corsair.esignatures.keys.set_api_key('es-stored-key');
			respond({ data: [] });

			await corsair.esignatures.api.templates.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe(
				`Basic ${Buffer.from('es-stored-key:').toString('base64')}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a contract with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'es-test-key' });
		try {
			respond({ data: { contract } });

			const result = await corsair.esignatures.api.contracts.get({
				contract_id: contractId,
			});

			expect(result.contract?.title).toBe('Rental agreement');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://esignatures.com/api/contracts/${contractId}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'es-bad-key' });
		try {
			respond(errorBody('Invalid secret token'), 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.esignatures.api.templates
				.list({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ESignaturesAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

// Live smoke against the real API; CI never runs it.
const describeIfKey = process.env.ESIGNATURES_API_KEY
	? describe
	: describe.skip;

describeIfKey('eSignatures live API', () => {
	it('lists templates with the configured key', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.ESIGNATURES_API_KEY,
		});
		try {
			const result = await corsair.esignatures.api.templates.list({});
			for (const row of result.templates) {
				expect(typeof row.template_id).toBe('string');
			}
		} finally {
			testDb.cleanup();
		}
	});
});
