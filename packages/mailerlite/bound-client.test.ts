import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mailerlite } from './index';
import { groupsListResponse } from './test-fixtures';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

/**
 * Drives the real account key manager rather than a fixture. A fixture can
 * supply a method the runtime never creates for an `api_key` account; only a
 * bound client proves the key builder resolves credentials the manager actually
 * exposes, with no explicit key configured.
 */
beforeEach(() => {
	installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(restoreFetchMock);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mailerlite', 'default');
	const corsair = createCorsair({
		plugins: [mailerlite()],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

describe('mailerlite bound client without an explicit key', () => {
	it('resolves the stored key from the account key manager and calls the API', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.mailerlite.keys.issue_new_dek();
			await corsair.mailerlite.keys.set_api_key('stored-ml-key');

			mockFetch(jsonResponse(groupsListResponse));

			const result = await corsair.mailerlite.api.groups.list({});

			expect(result.data).toHaveLength(1);
			const init = jest.mocked(globalThis.fetch).mock.calls[0]?.[1];
			expect(new Headers(init?.headers).get('Authorization')).toBe(
				'Bearer stored-ml-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails the call before any request when no key exists', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.mailerlite.keys.issue_new_dek();

			await expect(corsair.mailerlite.api.groups.list({})).rejects.toThrow(
				AuthMissingError,
			);
			expect(jest.mocked(globalThis.fetch)).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
