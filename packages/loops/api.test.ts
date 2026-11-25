import { loops } from './index';

/**
 * Live smoke tests, run with `pnpm --filter @corsair-dev/loops test:live` and
 * a real key. CI never runs this file. Every call is read-only and parsed
 * through the operation's output schema, so a shape drift fails here too.
 * Get a key at https://app.loops.so/settings?page=api (Settings -> API).
 */
const describeIfKey = process.env.LOOPS_API_KEY ? describe : describe.skip;

if (!process.env.LOOPS_API_KEY) {
	console.warn(
		'LOOPS_API_KEY is not set: skipping the Loops live smoke tests.',
	);
}

const corsair = loops({ key: process.env.LOOPS_API_KEY ?? '' });
const api = corsair.endpoints!;

// The endpoints read only key, options and db from the context.
// unknown: the live fixture leaves out the rest of the runtime context.
function liveCtx() {
	return {
		key: process.env.LOOPS_API_KEY!,
		options: {},
		db: {},
	} as unknown as Parameters<typeof api.lists.list>[0];
}

describeIfKey('Loops live API', () => {
	it('verifies the key and names the team', async () => {
		const result = await api.apikey.verifyConnection(liveCtx(), {});

		expect(result.success).toBe(true);
		expect(typeof result.teamName).toBe('string');
	});

	it('finds contacts and answers an array', async () => {
		const result = await api.contacts.find(liveCtx(), {
			email: 'does-not-exist@example.com',
		});

		expect(Array.isArray(result)).toBe(true);
	});

	it('lists the contact properties', async () => {
		const result = await api.contacts.listProperties(liveCtx(), {
			list: 'all',
		});

		expect(Array.isArray(result)).toBe(true);
		for (const property of result) {
			expect(['string', 'number', 'boolean', 'date']).toContain(property.type);
		}
	});

	it('reads the suppression status for a contact', async () => {
		const email = process.env.LOOPS_TEST_EMAIL;
		if (!email) {
			console.warn(
				'Set LOOPS_TEST_EMAIL to a real contact to run the suppression check.',
			);
			return;
		}
		const find = await api.contacts.find(liveCtx(), { email });
		if (find.length === 0) {
			console.warn(`No contact found for LOOPS_TEST_EMAIL=${email}.`);
			return;
		}

		const result = await api.contacts.getSuppression(liveCtx(), { email });

		expect(typeof result.isSuppressed).toBe('boolean');
		expect(result.removalQuota.limit).toBeGreaterThan(0);
	});

	it('lists the mailing lists', async () => {
		const result = await api.lists.list(liveCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		for (const list of result) {
			expect(typeof list.id).toBe('string');
			expect(typeof list.name).toBe('string');
		}
	});
});
