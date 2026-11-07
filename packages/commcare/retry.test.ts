import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { commcare } from './index';
import { caseList, serverError } from './test-fixtures';

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

const USERNAME = 'jdoe@my-project.commcarehq.org';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'commcare', 'default');
	const corsair = createCorsair({
		plugins: [
			commcare({
				key: 'cc-test-key',
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('CommCare 5xx retries through the bound client', () => {
	it('retries a flagged read that got a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);
			respond(caseList);

			const result = await corsair.commcare.api.cases.list({
				domain: 'my-project',
				username: USERNAME,
			});
			expect(result.cases).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on submit, which may have gone through', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);

			await expect(
				corsair.commcare.api.submissions.submit({
					domain: 'my-project',
					username: USERNAME,
					appId: 'app-1',
					xml: '<xform></xform>',
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
