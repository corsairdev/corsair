import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { commcare } from './index';
import { serverError, user } from './test-fixtures';

async function createClient(options: Parameters<typeof commcare>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'commcare', 'default');
	const corsair = createCorsair({
		plugins: [commcare(options)],
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

describe('CommCare plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.commcare.keys.issue_new_dek();
			await expect(
				corsair.commcare.api.users.list({
					domain: 'my-project',
					username: 'jdoe@my-project.commcarehq.org',
				}),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key with the ApiKey scheme and username', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.commcare.keys.issue_new_dek();
			await corsair.commcare.keys.set_api_key('cc-stored-key');
			respond(user);

			await corsair.commcare.api.users.get({
				domain: 'my-project',
				username: 'jdoe@my-project.commcarehq.org',
				userId: user.id!,
			});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe(
				'ApiKey jdoe@my-project.commcarehq.org:cc-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 404 on delete', async () => {
		const { corsair, testDb } = await createClient({ key: 'cc-test-key' });
		try {
			respond({ message: 'Not found.' }, 404);

			await expect(
				corsair.commcare.api.users.delete({
					domain: 'my-project',
					username: 'jdoe@my-project.commcarehq.org',
					userId: user.id!,
				}),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces a 503 with its status and no key in the message', async () => {
		const { corsair, testDb } = await createClient({ key: 'cc-secret-key' });
		try {
			respond(serverError, 503);
			respond(serverError, 503);
			respond(serverError, 503);

			// unknown: the rejection is a CommCareAPIError, typed loosely here
			// to assert on status and message without importing the class into
			// the bound-client contract under test.
			const error = (await corsair.commcare.api.users
				.get({
					domain: 'my-project',
					username: 'jdoe@my-project.commcarehq.org',
					userId: user.id!,
				})
				.catch((e: unknown) => e)) as { message?: string; status?: number };
			expect(error.status).toBe(503);
			expect(error.message).not.toContain('cc-secret-key');
		} finally {
			testDb.cleanup();
		}
	});
});

// Live smoke: read-only calls against the real API. ApiKey auth needs the
// key, its owner's username and the project, so all three must be set.
const describeIfKey =
	process.env.COMMCARE_API_KEY &&
	process.env.COMMCARE_USERNAME &&
	process.env.COMMCARE_DOMAIN
		? describe
		: describe.skip;

describeIfKey('live CommCare', () => {
	const key = process.env.COMMCARE_API_KEY as string;
	const username = process.env.COMMCARE_USERNAME as string;
	const domain = process.env.COMMCARE_DOMAIN as string;

	it('lists users from the live project', async () => {
		const { corsair, testDb } = await createClient({ key });
		try {
			const result = await corsair.commcare.api.users.list({
				domain,
				username,
			});
			// A new project can have no mobile workers yet.
			expect(Array.isArray(result.objects)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a bad key with a 401 from the live API', async () => {
		const { corsair, testDb } = await createClient({ key: 'wrong-key' });
		try {
			await expect(
				corsair.commcare.api.users.list({ domain, username }),
			).rejects.toMatchObject({ status: 401 });
		} finally {
			testDb.cleanup();
		}
	});
});
