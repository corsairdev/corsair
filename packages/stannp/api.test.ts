import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { stannp } from './index';

// Read-only live smoke, runs only with STANNP_API_KEY set (a free Stannp
// account works; set STANNP_REGION=eu for a UK/EU account). No send: the
// writes post real mail or take payment.
const hasKey = Boolean(process.env.STANNP_API_KEY);
if (!hasKey) {
	console.warn('Skipping stannp live tests: STANNP_API_KEY is not set.');
}
const describeIfKey = hasKey ? describe : describe.skip;

const region = process.env.STANNP_REGION === 'eu' ? 'eu' : 'us';

describeIfKey('stannp live API', () => {
	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'stannp', 'default');
		const corsair = createCorsair({
			plugins: [stannp({ key: process.env.STANNP_API_KEY, region })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	// Every read goes through its output schema before any assertion, so a
	// field typed differently from the live answer fails here and not in a
	// caller's code.
	it('reads the balance', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.stannp.api.account.balance({});
			expect(typeof result.balance).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('lists templates through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.stannp.api.tools.templates({});
			expect(Array.isArray(result)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists folders through the output schema', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.stannp.api.files.listFolders({});
			expect(Array.isArray(result)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('summarises reporting for a past window', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// A window before the account existed, so the answer is all zeros
			// and costs nothing.
			const result = await corsair.stannp.api.reporting.summary({
				startdate: '2019-01-01',
				enddate: '2019-01-31',
			});
			expect(typeof result.total).toBe('number');
		} finally {
			testDb.cleanup();
		}
	});
});
