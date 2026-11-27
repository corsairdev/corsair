import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { docraptor } from './index';

/**
 * Live smoke: one test-mode async document, polled to completion. No binary
 * is ever fetched (the corsair client reads bodies as text and a PDF would
 * be garbled), and documents.list is skipped because test-mode keys are
 * denied it. Test-mode documents are free and not hosted, so expire does
 * not apply; the completed shape itself is the assertion.
 *
 * DocRaptor documents `YOUR_API_KEY_HERE` as a working test-mode key, so the
 * suite runs without a key; a real key is used when DOCCRAPTOR_API_KEY is set.
 */
const apiKey = process.env.DOCCRAPTOR_API_KEY ?? 'YOUR_API_KEY_HERE';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'docraptor', 'default');
	const corsair = createCorsair({
		plugins: [docraptor({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describe('DocRaptor live smoke', () => {
	it('creates a test document asynchronously, polls it to completed, and reads the download_url', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const created = await corsair.docraptor.api.documents.createAsync({
				type: 'pdf',
				test: true,
				name: 'corsair smoke',
				document_content: '<html><body><p>corsair smoke test</p></body></html>',
			});
			expect(created.status_id).toBeTruthy();

			let status = await corsair.docraptor.api.documents.status({
				statusId: created.status_id,
			});
			for (
				let attempts = 0;
				status.status !== 'completed' &&
				status.status !== 'failed' &&
				attempts < 15;
				attempts += 1
			) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				status = await corsair.docraptor.api.documents.status({
					statusId: created.status_id,
				});
			}

			expect(status.status).toBe('completed');
			expect(status.download_id).toBeTruthy();
			expect(status.download_url).toContain('://');
			expect(status.number_of_pages).toBeGreaterThanOrEqual(1);
		} finally {
			testDb.cleanup();
		}
	}, 120_000);
});
