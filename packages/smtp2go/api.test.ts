import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { smtp2go } from './index';

/**
 * Live smoke tests, gated on SMTP2GO_API_KEY. CI skips this file by design;
 * run it with `pnpm --filter @corsair-dev/smtp2go test:live`.
 *
 * Read-only and small: free accounts are capped at 200 sends a day and the
 * API throttles by IP after bursts of error responses, so nothing here sends
 * email. Create a key at https://app.smtp2go.com under Sending > API Keys.
 */
const describeIfKey = process.env.SMTP2GO_API_KEY ? describe : describe.skip;

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

describeIfKey('smtp2go live smoke', () => {
	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'smtp2go', 'default');
		const corsair = createCorsair({
			plugins: [smtp2go({ key: process.env.SMTP2GO_API_KEY })],
			database: testDb.db,
			kek: KEK,
		});
		return { corsair, testDb };
	}

	// Every answer routes through the operation's output schema, envelope and
	// all, so a field typed wrongly fails here rather than for a caller.
	it('reads the billing cycle', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.smtp2go.api.stats.cycle({});
			expect(result.data.cycle_max).toBeGreaterThanOrEqual(0);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('lists one small page of templates', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.smtp2go.api.templates.list({
				page_size: 5,
			});
			expect(Array.isArray(result.data.templates)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('lists suppressions', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.smtp2go.api.suppressions.list({
				limit: 5,
			});
			expect(Array.isArray(result.data.results)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('lists sender domains', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.smtp2go.api.domains.list({});
			expect(Array.isArray(result.data.domains)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
