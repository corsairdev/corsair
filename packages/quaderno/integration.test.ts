import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { quaderno } from './index';
import {
	authorizationFixture,
	contactFixture,
	pingFixture,
} from './test-fixtures';

async function createClient(options: Parameters<typeof quaderno>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'quaderno', 'default');
	const corsair = createCorsair({
		plugins: [quaderno(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementationOnce(
		async () =>
			new Response(body === undefined ? null : JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('quaderno through createCorsair', () => {
	/**
	 * The test that proves the runtime, not a fixture, resolves both credentials.
	 * Quaderno is per-account, so the host itself has to come from the stored
	 * `account_name`: with it missing, there is no URL to call.
	 */
	it('builds the account host from the stored account name', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_api_key('stored-quaderno-key');
			await corsair.quaderno.keys.set_account_name('acme-123456');
			respond(pingFixture);

			await corsair.quaderno.api.ping({});

			const { url, headers } = lastRequest();
			expect(url).toContain('https://acme-123456.quadernoapp.com/api/ping');
			// Basic auth with the key as username and an empty password.
			expect(headers.get('authorization')).toBe(
				`Basic ${Buffer.from('stored-quaderno-key:').toString('base64')}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails fast with AuthMissingError when the key is missing', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_account_name('acme-123456');

			await expect(corsair.quaderno.api.contacts.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses to build a URL when the account name is missing', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_api_key('stored-quaderno-key');

			await expect(corsair.quaderno.api.contacts.list({})).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	/**
	 * The discovery flow the docs promise: a key with no account name must still
	 * be able to ask which account it belongs to. `authorization` goes to the bare
	 * `quadernoapp.com` host for exactly this reason.
	 */
	it('reaches authorization with no account name stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_api_key('stored-quaderno-key');
			respond(authorizationFixture);

			const result = await corsair.quaderno.api.authorization({});

			const { url } = lastRequest();
			expect(url).toContain('https://quadernoapp.com/api/authorization');
			expect(url).not.toContain('quadernoapp.com/api/authorization?');
			expect(result.identity.href).toContain('example-000000');
		} finally {
			testDb.cleanup();
		}
	});

	it('lets an inline account override the stored one', async () => {
		const { corsair, testDb } = await createClient({
			account: 'inline-account',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_api_key('stored-key');
			await corsair.quaderno.keys.set_account_name('stored-account');
			respond(pingFixture);

			await corsair.quaderno.api.ping({});

			expect(lastRequest().url).toContain('inline-account.quadernoapp.com');
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			await corsair.quaderno.keys.issue_new_dek();
			await corsair.quaderno.keys.set_api_key('stored-key');
			await corsair.quaderno.keys.set_account_name('acct');
			respond({ status: 'OK' });

			await corsair.quaderno.api.ping({});

			expect(lastRequest().headers.get('authorization')).toBe(
				`Basic ${Buffer.from('inline-key:').toString('base64')}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends no body and no content type on a bodyless DELETE', async () => {
		const { corsair, testDb } = await createClient({
			key: 'k',
			account: 'acct',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			respond(undefined, 204);

			const result = await corsair.quaderno.api.contacts.delete({ id: 5 });

			const { init, headers } = lastRequest();
			expect(init.body).toBeUndefined();
			expect(headers.get('content-type')).toBeNull();
			// A 204 has no body, so the endpoint reports the delete itself.
			expect(result.deleted).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 through the plugin error handlers', async () => {
		const { corsair, testDb } = await createClient({
			key: 'k',
			account: 'acct',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			respond({ error: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond(contactFixture, 200);

			const result = await corsair.quaderno.api.contacts.create({
				first_name: 'Amelia',
				email: 'a@example.com',
			});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.contact.id).toBe(78395726);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write on a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'k',
			account: 'acct',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			respond({ error: 'boom' }, 502);

			await expect(
				corsair.quaderno.api.contacts.create({
					first_name: 'Amelia',
					email: 'a@example.com',
				}),
			).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'k',
			account: 'acct',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			respond({ error: 'boom' }, 502);
			respond(pingFixture, 200);

			const result = await corsair.quaderno.api.ping({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.status).toBe('OK');
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a missing record as a not-found error, not an auth one', async () => {
		const { corsair, testDb } = await createClient({
			key: 'k',
			account: 'acct',
		});
		try {
			await corsair.quaderno.keys.issue_new_dek();
			respond({ error: 'Unauthorized access or contact does not exist.' }, 401);

			const error = await corsair.quaderno.api.contacts.get({ id: 1 }).catch(
				// unknown: a rejection can be any value until the instanceof check below.
				(caught: unknown) => caught,
			);

			expect(error).toBeInstanceOf(Error);
			if (!(error instanceof Error)) throw error;
			expect(error.name).toBe('QuadernoAPIError');
			// The message names the real cause, and it is not retried.
			expect(error.message).toContain('does not exist');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
