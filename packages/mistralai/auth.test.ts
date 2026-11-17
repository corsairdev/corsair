import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mistralai } from './index';
import { mockFetch } from './test-fixtures';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Mistral AI with no stored key', () => {
	it('throws AuthMissingError before any request, so Corsair can offer a connect link', async () => {
		const fetchMock = mockFetch();
		const testDb = createTestDatabase();
		try {
			await createIntegrationAndAccount(testDb.db, 'mistralai', 'default');
			const corsair = createCorsair({
				plugins: [mistralai()],
				database: testDb.db,
				kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
			});
			await corsair.mistralai.keys.issue_new_dek();

			await expect(
				corsair.mistralai.api.models.list({}),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
