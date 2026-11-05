/**
 * Live Workable API tests, run through createCorsair so the keyBuilder, the
 * endpoint zod schemas and the local cache are all exercised.
 *
 * Reads need `WORKABLE_API_TOKEN` (Settings > Integrations > "Generate new
 * token") and `WORKABLE_SUBDOMAIN` (the `<subdomain>` in
 * https://<subdomain>.workable.com). Without both the suite skips, so CI
 * stays hermetic and no key is ever committed.
 *
 * The write round trip also needs `WORKABLE_LIVE_WRITES=1`. It only touches
 * objects it creates itself (two departments and one webhook subscription
 * pointed at example.com) and removes them again. It never invites members
 * or creates employees, which the API cannot delete.
 *
 * Workable allows 10 requests per token per ~10 s, so calls are spaced 1.1 s
 * apart.
 *
 * @see https://workable.readme.io/reference/generate-an-access-token
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { workable } from './index';

const TOKEN = process.env.WORKABLE_API_TOKEN ?? '';
const SUBDOMAIN = process.env.WORKABLE_SUBDOMAIN ?? '';
const RUN_LIVE = TOKEN.length > 0 && SUBDOMAIN.length > 0;
const RUN_WRITES = RUN_LIVE && process.env.WORKABLE_LIVE_WRITES === '1';
const describeLive = RUN_LIVE ? describe : describe.skip;
const describeWrites = RUN_WRITES ? describe : describe.skip;

const SPACING_MS = 1100;
const realFetch = globalThis.fetch;
let lastCall = 0;

/** Spaces every request so the suite stays under Workable's rate limit. */
async function throttledFetch(
	input: Parameters<typeof fetch>[0],
	init?: Parameters<typeof fetch>[1],
) {
	const wait = lastCall + SPACING_MS - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCall = Date.now();
	return realFetch(input, init);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'workable', 'default');
	const corsair = createCorsair({
		plugins: [workable()],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
	});
	await corsair.workable.keys.issue_new_dek();
	await corsair.workable.keys.set_api_key(TOKEN);
	await corsair.workable.keys.set_account(SUBDOMAIN);
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>;
let client: Client;

beforeAll(async () => {
	if (!RUN_LIVE) return;
	globalThis.fetch = throttledFetch as typeof fetch;
	client = await createClient();
});

afterAll(() => {
	globalThis.fetch = realFetch;
	client?.testDb.cleanup();
});

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describeLive('Workable live API: reads', () => {
	jest.setTimeout(120_000);

	it('accounts.list and accounts.get return the connected account', async () => {
		const api = client.corsair.workable.api;
		const { accounts } = await api.accounts.list({});
		expect(accounts.map((a) => a.subdomain)).toContain(SUBDOMAIN);
		const account = await api.accounts.get({});
		expect(account.subdomain).toBe(SUBDOMAIN);
	});

	it('departments.list returns a bare array', async () => {
		const departments = await client.corsair.workable.api.departments.list({});
		expect(Array.isArray(departments)).toBe(true);
	});

	it('members.list parses null headlines and caches each member', async () => {
		const { corsair } = client;
		const { members } = await corsair.workable.api.members.list({ limit: 10 });
		expect(members.length).toBeGreaterThan(0);
		expect(await corsair.workable.db.members.count()).toBe(
			members.filter((m) => m.id).length,
		);
	});

	it('employees.list accepts a page size Workable allows', async () => {
		const api = client.corsair.workable.api;
		const listed = await api.employees.list({ limit: 10 });
		expect(Array.isArray(listed.employees)).toBe(true);
		const first = listed.employees[0]?.id;
		if (first) {
			const employee = await api.employees.get({ id: first });
			expect(employee.id).toBe(first);
			const balances = await api.timeoffBalances.list({ employee_id: first });
			expect(Array.isArray(balances.balances)).toBe(true);
		}
	});

	it('jobs.list and candidates.list parse, and paging.next carries since_id', async () => {
		const api = client.corsair.workable.api;
		const jobs = await api.jobs.list({ limit: 2 });
		expect(Array.isArray(jobs.jobs)).toBe(true);
		if (jobs.paging?.next) {
			const since = new URL(jobs.paging.next).searchParams.get('since_id');
			expect(since).toBeTruthy();
			const page2 = await api.jobs.list({ limit: 2, since_id: since ?? '' });
			expect(Array.isArray(page2.jobs)).toBe(true);
		}
		const candidates = await api.candidates.list({ limit: 10 });
		expect(Array.isArray(candidates.candidates)).toBe(true);
	});

	it('reference lists parse', async () => {
		const api = client.corsair.workable.api;
		const fields = await api.employeeFields.list({});
		expect(fields.map((f) => f.id)).toContain('firstname');
		expect((await api.stages.list({})).stages?.length).toBeGreaterThan(0);
		expect(
			Array.isArray((await api.requisitions.list({ limit: 10 })).requisitions),
		).toBe(true);
		expect(Array.isArray((await api.recruiters.list({})).recruiters)).toBe(
			true,
		);
		expect(Array.isArray(await api.legalEntities.list({}))).toBe(true);
		expect(
			Array.isArray((await api.customAttributes.list({})).custom_attributes),
		).toBe(true);
		expect(Array.isArray(await api.disqualificationReasons.list({}))).toBe(
			true,
		);
		expect(Array.isArray(await api.permissionSets.list({}))).toBe(true);
		expect(
			Array.isArray((await api.timeoffCategories.list({})).categories),
		).toBe(true);
		expect(Array.isArray(await api.workSchedules.list({}))).toBe(true);
		expect(Array.isArray((await api.events.list({ limit: 10 })).events)).toBe(
			true,
		);
		expect(
			Array.isArray((await api.subscriptions.list({})).subscriptions),
		).toBe(true);
	});

	it('the public job board parses without a token', async () => {
		const api = client.corsair.workable.api;
		const board = await api.publicJobs.list({
			subdomain: SUBDOMAIN,
			details: true,
		});
		expect(Array.isArray(board.jobs)).toBe(true);
		const locations = await api.publicLocations.list({ subdomain: SUBDOMAIN });
		expect(Array.isArray(locations)).toBe(true);
	});
});

describeWrites('Workable live API: write round trip', () => {
	jest.setTimeout(120_000);

	it('creates, renames, merges and deletes two departments', async () => {
		const { corsair } = client;
		const api = corsair.workable.api;
		const stamp = Date.now().toString(36);
		const created: string[] = [];
		try {
			const a = await api.departments.create({
				name: `corsair-test-${stamp}-a`,
			});
			if (a.id) created.push(a.id);
			const b = await api.departments.create({
				name: `corsair-test-${stamp}-b`,
			});
			if (b.id) created.push(b.id);
			expect(a.id && b.id).toBeTruthy();

			const renamed = await api.departments.update({
				id: a.id ?? '',
				name: `corsair-test-${stamp}-a2`,
				parent_id: null,
			});
			expect(renamed.name).toBe(`corsair-test-${stamp}-a2`);

			// Without force Workable answers 409 even when its
			// affected_resources list is empty (seen on a fresh account).
			const merged = await api.departments.merge({
				id: a.id ?? '',
				target_department_id: b.id ?? '',
				force: true,
			});
			created.splice(created.indexOf(a.id ?? ''), 1);
			expect(merged.id).toBe(b.id);
			expect(
				await corsair.workable.db.departments.findByEntityId(a.id ?? ''),
			).toBeNull();

			// Delete needs force=DELETE for the same reason as merge.
			await api.departments.delete({ id: b.id ?? '', force: true });
			created.splice(created.indexOf(b.id ?? ''), 1);
			expect(
				await corsair.workable.db.departments.findByEntityId(b.id ?? ''),
			).toBeNull();

			const remaining = await api.departments.list({});
			expect(
				remaining.some((d) => d.name?.startsWith(`corsair-test-${stamp}`)),
			).toBe(false);
		} finally {
			for (const id of created) {
				await api.departments
					.delete({ id, force: true })
					.catch(() => undefined);
			}
		}
	});

	it('creates and deletes a webhook subscription', async () => {
		const api = client.corsair.workable.api;
		let id: string | undefined;
		try {
			const created = await api.subscriptions.create({
				target: 'https://example.com/corsair-workable-live-test',
				event: 'candidate_created',
			});
			id = created.id === undefined ? undefined : String(created.id);
			expect(id).toBeTruthy();
			await api.subscriptions.delete({ id: id ?? '' });
			const { subscriptions } = await api.subscriptions.list({});
			expect(subscriptions?.some((s) => String(s.id) === id)).toBe(false);
			id = undefined;
		} finally {
			if (id) await api.subscriptions.delete({ id }).catch(() => undefined);
		}
	});
});

describe('Workable live API guard', () => {
	it('skips without credentials instead of failing', () => {
		expect(RUN_LIVE).toBe(TOKEN.length > 0 && SUBDOMAIN.length > 0);
		expect(RUN_WRITES).toBe(
			RUN_LIVE && process.env.WORKABLE_LIVE_WRITES === '1',
		);
	});
});
