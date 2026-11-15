import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { esignatures } from './index';
import { contractId, errorBody, templateRow } from './test-fixtures';

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
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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

describe('eSignatures rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'es-test-key' });
		try {
			respond(errorBody('Slow down'), 429);
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ data: [templateRow] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

			const result = await corsair.esignatures.api.templates.list({});

			expect(result.templates).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a write, which the limit stopped before it ran', async () => {
		const { corsair, testDb } = await createClient({ key: 'es-test-key' });
		try {
			respond(errorBody('Slow down'), 429);
			respond({ status: 'withdrawn' });

			const result = await corsair.esignatures.api.contracts.withdraw({
				contract_id: contractId,
			});

			expect(result).toEqual({ status: 'withdrawn' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 404 for an unknown contract', async () => {
		const { corsair, testDb } = await createClient({ key: 'es-test-key' });
		try {
			respond(errorBody('Contract not found'), 404);

			await expect(
				corsair.esignatures.api.contracts.get({ contract_id: contractId }),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
