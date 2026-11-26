import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moretrees } from './index';

/**
 * Live suite. CI skips this file.
 *
 *   MORETREES_PUBLIC_LIVE=1 pnpm test:live
 *     runs projects.list, which More Trees serves without a key.
 *   MORETREES_API_KEY=... MORETREES_ACCOUNT_CODE=... pnpm test:live
 *     adds the account and forest reads and the CO2 calculation.
 *   ... MORETREES_PLANT_DRY_RUN=1 pnpm test:live
 *     adds trees.plant with test: true (More Trees evaluates it and persists
 *     nothing; on a zero balance it answers 400 MTT-6006, which the test
 *     expects). The suite never sends test: false: that plants real trees and
 *     spends credits.
 */
const apiKey = process.env.MORETREES_API_KEY ?? '';
const accountCode = process.env.MORETREES_ACCOUNT_CODE ?? '';
const hasKey = Boolean(apiKey && accountCode);
const publicLive = hasKey || process.env.MORETREES_PUBLIC_LIVE === '1';
const plantDryRun = hasKey && process.env.MORETREES_PLANT_DRY_RUN === '1';

const describeIfPublic = publicLive ? describe : describe.skip;
const describeIfKey = hasKey ? describe : describe.skip;
const describeIfDryRun = plantDryRun ? describe : describe.skip;

if (!hasKey) {
	const missing = [
		!apiKey && 'MORETREES_API_KEY',
		!accountCode && 'MORETREES_ACCOUNT_CODE',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(
		`Skipping More Trees keyed live tests: set ${missing}.${publicLive ? ' Running the public project routes only.' : ' Set MORETREES_PUBLIC_LIVE=1 to run the public project routes.'}`,
	);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moretrees', 'default');
	const corsair = createCorsair({
		plugins: [
			// The project routes need no key; a placeholder satisfies the key
			// builder when only the public block runs.
			moretrees({
				key: apiKey || 'public-routes-only',
				accountCode: accountCode || undefined,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let client: Awaited<ReturnType<typeof createClient>> | undefined;

beforeAll(async () => {
	if (publicLive) client = await createClient();
});

afterAll(() => {
	client?.testDb.cleanup();
});

function api() {
	return (client as NonNullable<typeof client>).corsair.moretrees.api;
}

describeIfPublic('moretrees live: public project routes', () => {
	jest.setTimeout(30_000);

	it('lists projects with exact 64-bit tree IDs', async () => {
		const projects = await api().projects.list({});
		expect(projects.data.length).toBeGreaterThan(0);
		const ids = projects.data.flatMap((p) => (p.trees ?? []).map((t) => t.id));
		for (const id of ids) expect(id).toMatch(/^\d+$/);
		console.log(
			`projects.list: ${projects.data.length} projects, total ${projects.total}; tree IDs ${ids.join(', ')}`,
		);
	});
});

// A project tree ID that More Trees knows (probed 11-26). Project tree IDs
// are not tree IDs, and the route that maps one to the other answers 401 to
// a customer key, so the suite uses a fixed one.
const KNOWN_PROJECT_TREE_ID = '26';

describeIfKey('moretrees live: CO2 calculation', () => {
	jest.setTimeout(30_000);

	it('calculates CO2 for a project tree', async () => {
		const result = await api().projects.calculateCo2({
			totalTreesByProjectTree: {
				[KNOWN_PROJECT_TREE_ID]: {
					receivedAndPlantedTrees: 10,
					giftedAndPlantedTrees: 5,
				},
			},
		});
		expect(typeof result.totalCo2).toBe('number');
		expect(result.supportedProjects).toBe(1);
		console.log(
			`projects.calculateCo2: totalCo2 ${result.totalCo2}, supportedProjects ${result.supportedProjects}`,
		);
	});
});

describeIfKey('moretrees live: account reads', () => {
	jest.setTimeout(30_000);

	it('reads the stored account', async () => {
		const result = await api().account.get({});
		expect(typeof result.credit_balance).toBe('number');
		console.log(
			`account.get: credit_balance is a number, forest_slug set ${Boolean(result.forest_slug)}`,
		);
	});

	it('reads the forest', async () => {
		const result = await api().forest.get({});
		expect(
			typeof result.forest_name === 'string' || result.forest_name == null,
		).toBe(true);
		console.log(`forest.get: forest_name set ${Boolean(result.forest_name)}`);
	});
});

describeIfDryRun('moretrees live: dry-run planting', () => {
	jest.setTimeout(30_000);

	it('evaluates a test-mode plant for self without spending credits', async () => {
		const before = await api().account.get({});
		const attempt = api()
			.trees.plant({ test: true, plant_for_others: false, quantity: 1 })
			.then(
				(result) => ({ result, error: undefined }),
				(error: unknown) => ({ result: undefined, error }),
			);
		const { result, error } = await attempt;
		const after = await api().account.get({});

		if ((before.credit_balance ?? 0) > 0) {
			expect(error).toBeUndefined();
			expect(result?.test).toBe(true);
		} else {
			// Test mode still runs the balance check (checked 11-26).
			expect(error).toMatchObject({ status: 400 });
			expect(String((error as Error).message)).toContain('MTT-6006');
		}
		expect(after.credit_balance).toBe(before.credit_balance);
		console.log(
			`trees.plant test:true -> ${error ? `status ${(error as { status?: number }).status}` : `test ${result?.test}`}; credit balance unchanged`,
		);
	});
});
