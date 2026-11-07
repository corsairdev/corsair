import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { happyscribe } from './index';
import { notFound, serverError, transcription } from './test-fixtures';

async function createClient(options: Parameters<typeof happyscribe>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'happyscribe', 'default');
	const corsair = createCorsair({
		plugins: [happyscribe(options)],
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

describe('HappyScribe plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.happyscribe.keys.issue_new_dek();
			await expect(
				corsair.happyscribe.api.transcriptions.list({ organizationId: 123 }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key as a Bearer token', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.happyscribe.keys.issue_new_dek();
			await corsair.happyscribe.keys.set_api_key('hs-stored-key');
			respond(transcriptionList());

			await corsair.happyscribe.api.transcriptions.list({
				organizationId: 123,
			});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer hs-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 404 on delete', async () => {
		const { corsair, testDb } = await createClient({ key: 'hs-test-key' });
		try {
			respond(notFound, 404);

			await expect(
				corsair.happyscribe.api.transcriptions.delete({
					fileId: transcription.id,
				}),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces a 503 with its status and no key in the message', async () => {
		const { corsair, testDb } = await createClient({ key: 'hs-secret-key' });
		try {
			respond(serverError, 503);
			respond(serverError, 503);
			respond(serverError, 503);

			const error = (await corsair.happyscribe.api.transcriptions
				.list({ organizationId: 123 })
				.catch((e: unknown) => e)) as { message?: string; status?: number };
			// unknown: the rejection is an HappyScribeAPIError, typed loosely
			// here to assert on status and message without importing the
			// class into the bound-client contract under test.
			expect(error.status).toBe(503);
			expect(error.message).not.toContain('hs-secret-key');
		} finally {
			testDb.cleanup();
		}
	});
});

// Live smoke: read-only calls against the real API when a key is present.
const describeIfKey = process.env.HAPPYSCRIBE_API_KEY
	? describe
	: describe.skip;

describeIfKey('live Happy Scribe', () => {
	const key = process.env.HAPPYSCRIBE_API_KEY as string;

	it('lists organizations from the live account', async () => {
		const { corsair, testDb } = await createClient({ key });
		try {
			const result = await corsair.happyscribe.api.organizations.list({});
			expect(result.organizations.length).toBeGreaterThan(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a bad key with a 401 from the live API', async () => {
		const { corsair, testDb } = await createClient({ key: 'wrong-key' });
		try {
			await expect(
				corsair.happyscribe.api.organizations.list({}),
			).rejects.toMatchObject({ status: 401 });
		} finally {
			testDb.cleanup();
		}
	});
});

function transcriptionList() {
	return {
		results: [
			{
				id: '9josdjdfo09j309omsldknslkjndfjknsdfs',
				name: 'interview2.mov',
				state: 'automatic_done',
				language: 'en-GB',
			},
		],
		_links: {},
	};
}
