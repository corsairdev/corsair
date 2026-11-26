import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moretrees } from './index';

/**
 * Live suite. CI skips this file.
 *
 *   MORETREES_PUBLIC_LIVE=1 pnpm test:live
 *     runs projects.list, which More Trees serves without a key.
 *   MORETREES_API_KEY=... MORETREES_ACCOUNT_CODE=... pnpm test:live
 *     adds the account, forest and project-tree reads and the CO2
 *     calculation (getTree answers 401 without a key).
 *   ... MORETREES_PLANT_DRY_RUN=1 pnpm test:live
 *     adds trees.plant with test: true (More Trees evaluates it and persists
 *     nothing). The suite never sends test: false: that plants real trees and
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

describeIfKey('moretrees live: project tree and CO2', () => {
	jest.setTimeout(30_000);

	it('lists projects and round-trips a 64-bit tree ID through getTree', async () => {
		const projects = await api().projects.list({});
		expect(projects.data.length).toBeGreaterThan(0);

		// Prefer a tree whose ID is past 2^53, to prove the exact round trip.
		const isBig = (id?: string | null) => (id ?? '').length > 15;
		const target =
			projects.data.find((p) => p.trees?.some((t) => isBig(t.id))) ??
			projects.data[0];
		const tree = target?.trees?.find((t) => isBig(t.id)) ?? target?.trees?.[0];
		expect(target?.id).toBeTruthy();
		expect(tree?.id).toBeTruthy();

		const detail = await api().projects.getTree({
			projectId: target?.id as string,
			treeId: tree?.id as string,
		});
		expect(detail.treeId).toBe(tree?.id);
		expect(detail.projectId).toBe(target?.id);
		console.log(
			`projects.list: ${projects.data.length} projects; getTree ${target?.id}/${tree?.id} -> projectTreeId ${detail.projectTreeId}, ${detail.numberOfCredits} credits`,
		);
	});

	it('calculates CO2 for a project tree', async () => {
		const projects = await api().projects.list({});
		const first = projects.data[0];
		const detail = await api().projects.getTree({
			projectId: first?.id as string,
			treeId: first?.trees?.[0]?.id as string,
		});
		const result = await api().projects.calculateCo2({
			totalTreesByProjectTree: {
				[detail.projectTreeId as string]: {
					receivedAndPlantedTrees: 2,
					giftedAndPlantedTrees: 0,
				},
			},
		});
		expect(typeof result.totalCo2 === 'number' || result.totalCo2 == null).toBe(
			true,
		);
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
	});

	it('looks the account up by code', async () => {
		const result = await api().account.lookup({ accountCodes: [accountCode] });
		expect(Array.isArray(result)).toBe(true);
	});

	it('reads the forest', async () => {
		const result = await api().forest.get({});
		expect(
			typeof result.forest_name === 'string' || result.forest_name == null,
		).toBe(true);
	});
});

describeIfDryRun('moretrees live: dry-run planting', () => {
	jest.setTimeout(30_000);

	it('evaluates a test-mode plant for self without spending credits', async () => {
		const before = await api().account.get({});
		const result = await api().trees.plant({
			test: true,
			plant_for_others: false,
			quantity: 1,
		});
		const after = await api().account.get({});
		expect(result.test).toBe(true);
		expect(after.credit_balance).toBe(before.credit_balance);
	});
});
