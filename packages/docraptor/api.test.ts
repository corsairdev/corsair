import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { docraptor } from './index';

/**
 * Live run of every operation with test-mode documents, which are free.
 * DocRaptor documents `YOUR_API_KEY_HERE` as a working test-mode key, so the
 * suite runs without a key; a real key is used when DOCRAPTOR_API_KEY is set.
 * The public key is refused documents.list (403), which the suite asserts.
 */
// Opt-in: a real key in DOCRAPTOR_API_KEY, or DOCRAPTOR_LIVE=1 for the
// public test key. Without either, the suite skips with a warning.
const apiKey =
	process.env.DOCRAPTOR_API_KEY ??
	(process.env.DOCRAPTOR_LIVE === '1' ? 'YOUR_API_KEY_HERE' : '');
const describeLive = apiKey ? describe : describe.skip;
if (!apiKey) {
	console.warn(
		'DOCRAPTOR_API_KEY is not set and DOCRAPTOR_LIVE is not 1; the live DocRaptor suite is skipped',
	);
}
const usingPublicKey = apiKey === 'YOUR_API_KEY_HERE';
const HTML =
	'<html><body><h1>Corsair live run</h1><p>test document</p></body></html>';

async function statusOf(promise: Promise<unknown>): Promise<number> {
	try {
		await promise;
		return 200;
	} catch (error) {
		const status = (error as { status?: unknown }).status;
		if (typeof status === 'number') return status;
		throw error;
	}
}

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

describeLive('DocRaptor live', () => {
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

	it('documents.create returns the PDF itself', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const file = await corsair.docraptor.api.documents.create({
				type: 'pdf',
				test: true,
				name: 'corsair-sync',
				document_content: HTML,
			});
			expect(file.contentType).toBe('application/pdf');
			expect(file.filename).toBe('corsair-sync.pdf');
			expect(file.byteLength).toBeGreaterThan(1000);
			expect(
				Buffer.from(file.contentBase64 ?? '', 'base64')
					.subarray(0, 5)
					.toString(),
			).toBe('%PDF-');
		} finally {
			testDb.cleanup();
		}
	}, 120_000);

	it('documents.download fetches a finished async document', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const created = await corsair.docraptor.api.documents.createAsync({
				type: 'pdf',
				test: true,
				document_content: HTML,
			});
			let status = await corsair.docraptor.api.documents.status({
				statusId: created.status_id,
			});
			for (let i = 0; status.status !== 'completed' && i < 15; i += 1) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				status = await corsair.docraptor.api.documents.status({
					statusId: created.status_id,
				});
			}
			const file = await corsair.docraptor.api.documents.download({
				downloadId: status.download_id ?? '',
			});
			expect(file.contentType).toBe('application/pdf');
			expect(file.byteLength).toBeGreaterThan(1000);
		} finally {
			testDb.cleanup();
		}
	}, 120_000);

	it('documents.createHosted then documents.expire', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const hosted = await corsair.docraptor.api.documents.createHosted({
				type: 'pdf',
				test: true,
				document_content: HTML,
				hosted_download_limit: 2,
			});
			expect(hosted.download_url).toContain('://');
			const expired = await corsair.docraptor.api.documents.expire({
				downloadId: hosted.download_id,
			});
			expect(expired).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	}, 120_000);

	it('documents.createHostedAsync queues a hosted document', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const created = await corsair.docraptor.api.documents.createHostedAsync({
				type: 'pdf',
				test: true,
				document_content: HTML,
			});
			expect(created.status_id).toBeTruthy();
		} finally {
			testDb.cleanup();
		}
	}, 120_000);

	it('documents.list (403 with the public test key)', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const run = corsair.docraptor.api.documents.list({ per_page: 2 });
			if (usingPublicKey) {
				expect(await statusOf(run)).toBe(403);
			} else {
				expect(Array.isArray((await run).documents)).toBe(true);
			}
		} finally {
			testDb.cleanup();
		}
	}, 60_000);

	it('ips.list reads the outbound addresses', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.docraptor.api.ips.list({});
			expect(result.ips.length).toBeGreaterThan(3);
		} finally {
			testDb.cleanup();
		}
	}, 60_000);
});
