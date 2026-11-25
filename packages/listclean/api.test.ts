/**
 * Live smoke tests against the real Listclean API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/listclean test:live`.
 *
 * Read-only: it never starts a batch, downloads results or deletes a list.
 * verify.verifyEmail spends one credit; the other calls are free. Every
 * answer is parsed through its output schema, so a field the real API sends
 * differently than typed fails here rather than in production.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { listclean } from './index';

const API_KEY = process.env.LISTCLEAN_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'listclean', 'default');
	const corsair = createCorsair({
		plugins: [listclean({ key: API_KEY })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

describeIfKey('Listclean live smoke', () => {
	it('reads the credit balance', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.listclean.api.account.getCredits({});
			expect(typeof result.credits).toBe('number');
			expect(result.credits).toBeGreaterThanOrEqual(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists the bulk lists', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.listclean.api.lists.listLists({});
			expect(Array.isArray(result.lists)).toBe(true);
			for (const list of result.lists) {
				expect(typeof list.list_id).toBe('number');
				expect(['SUBMITTED', 'INPROCESS', 'COMPLETED']).toContain(list.status);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('reads verification logs for one day', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.listclean.api.verify.getVerificationLogs({
				start_date: '2026-11-24',
				end_date: '2026-11-25',
				limit: 10,
			});
			expect(Array.isArray(result)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads analytics for one day', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.listclean.api.verify.getAnalytics({
				start_date: '2026-11-24',
				end_date: '2026-11-25',
			});
			// The inner shapes are undocumented; the parse only asserts the
			// three keys exist as the spec declares.
			expect('total_summary' in result).toBe(true);
			expect('datewise_summary' in result).toBe(true);
			expect('graph_summary' in result).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('verifies one address, spending one credit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.listclean.api.verify.verifyEmail({
				email: 'test@example.com',
			});
			expect(['clean', 'dirty', 'unknown', 'error']).toContain(result.status);
			expect(result.email).toBe('test@example.com');
		} finally {
			testDb.cleanup();
		}
	});
});
