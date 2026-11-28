import { appendFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { generatedCases } from './__fixtures__/generated-cases';
import { dub } from './index';

/**
 * Live suite: all 63 operations against a real Dub workspace.
 *
 *   DUB_API_KEY=dub_...              a workspace key with All permissions
 *   DUB_LIVE_LOG=/path/run.jsonl     optional: one JSON line per step
 *   DUB_TEST_DOMAIN=sub.example.com  optional: a domain you own, added and
 *                                    removed again (DNS is not touched)
 *
 * It creates its own links, tags, folders and (with DUB_TEST_DOMAIN) a domain
 * and deletes them at the end. Features the workspace's plan lacks (folders,
 * conversion tracking, customers, the Partners program) answer 403 on Dub's
 * free plan; those steps are recorded as `plan` and the suite goes on. The
 * partner program calls (commissions, bounties, messages, discount codes,
 * applications) send made-up ids: run the suite only on a workspace with no
 * partner program, where Dub refuses them before acting. domains.register is
 * never called (it claims a real domain).
 */
const apiKey = process.env.DUB_API_KEY;
const logPath = process.env.DUB_LIVE_LOG;
const testDomain = process.env.DUB_TEST_DOMAIN;
const pauseMs = Number(process.env.DUB_LIVE_PAUSE_MS ?? 1500);
if (!apiKey) {
	console.warn(
		'Skipping Dub live test: DUB_API_KEY is not set, so no live request runs.',
	);
}

const live = apiKey ? describe : describe.skip;

type Outcome = 'ok' | 'plan' | 'not_found' | 'not_called' | 'error';

// unknown: whatever the step returned or threw, summarised for the log.
function record(step: string, outcome: Outcome, detail: unknown) {
	if (!logPath) return;
	appendFileSync(
		logPath,
		`${JSON.stringify({ step, outcome, detail, at: new Date().toISOString() })}\n`,
	);
}

// unknown: any operation's result; only ids and counts go to the log.
function summarise(result: unknown): unknown {
	if (Array.isArray(result)) return { items: result.length };
	if (typeof result === 'string') return { chars: result.length };
	if (result && typeof result === 'object') {
		const value = result as Record<string, unknown>;
		return { id: value.id, keys: Object.keys(value).slice(0, 8) };
	}
	return result;
}

live('Dub live', () => {
	jest.setTimeout(300_000);
	// Built in beforeAll, so a skipped suite opens no database.
	let testDb: ReturnType<typeof createTestDatabase> | undefined;
	let api: ReturnType<typeof makeClient>;
	function makeClient(db: ReturnType<typeof createTestDatabase>['db']) {
		return createCorsair({
			plugins: [dub({ key: apiKey })],
			database: db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		}).dub.api;
	}
	const stamp = Date.now().toString(36);
	const cleanup: Array<[string, () => Promise<unknown>]> = [];
	const outcomes: Record<string, Outcome> = {};

	/**
	 * Runs one operation. A 403 (the plan lacks the feature) is `plan`; with
	 * `allowNotFound`, a 404 for a made-up id proves the route and auth work.
	 */
	async function step<T>(
		name: string,
		run: () => Promise<T>,
		options: { allowPlan?: boolean; allowNotFound?: boolean } = {},
	): Promise<T | undefined> {
		// Dub's free plan allows 60 requests a minute, and analytics less.
		await new Promise((resolve) => setTimeout(resolve, pauseMs));
		try {
			const result = await run();
			record(name, 'ok', summarise(result));
			outcomes[name] = 'ok';
			return result;
		} catch (error) {
			const status = error instanceof ApiError ? error.status : undefined;
			const message = error instanceof Error ? error.message : String(error);
			// The free plan's analytics quota is zero: Dub answers 429 with
			// X-RateLimit-Limit: 0 rather than 403.
			const noQuota =
				error instanceof ApiError &&
				status === 429 &&
				error.rateLimitLimit === 0;
			if (options.allowPlan !== false && (status === 403 || noQuota)) {
				record(name, 'plan', message);
				outcomes[name] = 'plan';
				return undefined;
			}
			// Only a 404 for a made-up id proves the lookup ran; a 400 is a bad request.
			if (options.allowNotFound && status === 404) {
				record(name, 'not_found', message);
				outcomes[name] = 'not_found';
				return undefined;
			}
			record(name, 'error', message);
			outcomes[name] = 'error';
			throw error;
		}
	}

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'dub', 'default');
		api = makeClient(testDb.db);
	});

	afterAll(async () => {
		const leftovers: string[] = [];
		try {
			for (const [name, undo] of cleanup.reverse()) {
				try {
					await undo();
				} catch (error) {
					// Already gone is fine; anything else is a leftover to report.
					if (!(error instanceof ApiError && error.status === 404)) {
						leftovers.push(name);
					}
				}
			}
			record('cleanup', leftovers.length ? 'error' : 'ok', { leftovers });
			record('summary', 'ok', outcomes);
		} finally {
			testDb?.cleanup();
		}
		if (leftovers.length)
			throw new Error(`left behind: ${leftovers.join(', ')}`);
	});

	let linkId = '';
	let linkKey = '';

	it('links: create, read, update, upsert, bulk, count, delete', async () => {
		// A per-run destination: upsert matches by url, so a fixed url could
		// pick up another link.
		const destination = `https://corsair.dev/?live=dub-${stamp}`;
		const created = await step('links.create', () =>
			api.links.create({
				url: destination,
				key: `corsair-${stamp}`,
				externalId: `corsair-live-${stamp}`,
				comments: 'Corsair plugin live test',
			}),
		);
		if (!created) throw new Error('links.create failed');
		linkId = created.id;
		linkKey = created.key ?? '';
		cleanup.push([`link ${linkId}`, () => api.links.delete({ linkId })]);

		const got = await step('links.get', () => api.links.get({ linkId }));
		expect(got?.id).toBe(linkId);
		const list = await step('links.list', () =>
			api.links.list({ search: `corsair-${stamp}` }),
		);
		expect(list?.items.map((l) => l.id)).toContain(linkId);
		await step('links.count', () => api.links.count({}));
		await step('links.update', () =>
			api.links.update({ linkId, comments: 'updated by the live suite' }),
		);
		const upserted = await step('links.upsert', () =>
			api.links.upsert({ url: destination, key: linkKey }),
		);
		expect(upserted?.id).toBe(linkId);

		const bulk = await step('links.bulkCreate', () =>
			api.links.bulkCreate({
				links: [
					{ url: 'https://corsair.dev/?bulk=1', key: `corsair-b1-${stamp}` },
					{ url: 'https://corsair.dev/?bulk=2', key: `corsair-b2-${stamp}` },
				],
			}),
		);
		const bulkIds = (bulk ?? [])
			.map((entry) => ('id' in entry ? (entry.id as string) : undefined))
			.filter((id): id is string => Boolean(id));
		// Cleanup first, so a failed assertion below leaves nothing behind.
		for (const id of bulkIds) {
			cleanup.push([`link ${id}`, () => api.links.delete({ linkId: id })]);
		}
		expect(bulkIds).toHaveLength(2);
		await step('links.bulkUpdate', () =>
			api.links.bulkUpdate({
				linkIds: bulkIds,
				data: { comments: 'bulk updated' },
			}),
		);
		await step('links.bulkDelete', () =>
			api.links.bulkDelete({ linkIds: bulkIds }),
		);
	});

	it('analytics, events and QR', async () => {
		await step('analytics.retrieve', () =>
			api.analytics.retrieve({ linkId, interval: '24h' }),
		);
		await step('events.list', () => api.events.list({ interval: '24h' }));
		const qr = await step('qr.get', () =>
			api.qr.get({ url: `https://dub.sh/${linkKey}` }),
		);
		expect(qr).toBeDefined();
	});

	it('tags, folders, domains', async () => {
		const tag = await step('tags.create', () =>
			api.tags.create({ name: `corsair-${stamp}` }),
		);
		if (tag) {
			cleanup.push([`tag ${tag.id}`, () => api.tags.delete({ id: tag.id })]);
			await step('tags.update', () =>
				api.tags.update({ id: tag.id, name: `corsair-${stamp}-2` }),
			);
		}
		await step('tags.list', () => api.tags.list({}));
		if (tag) {
			await step('tags.delete', () => api.tags.delete({ id: tag.id }));
		}

		const folder = await step('folders.create', () =>
			api.folders.create({ name: `corsair-${stamp}` }),
		);
		await step('folders.list', () => api.folders.list({}));
		if (folder) {
			cleanup.push([
				`folder ${folder.id}`,
				() => api.folders.delete({ id: folder.id }),
			]);
			await step('folders.update', () =>
				api.folders.update({ id: folder.id, name: `corsair-${stamp}-2` }),
			);
			await step('folders.delete', () => api.folders.delete({ id: folder.id }));
		} else {
			await step(
				'folders.update',
				() => api.folders.update({ id: 'fold_missing', name: 'x' }),
				{ allowNotFound: true },
			);
			await step(
				'folders.delete',
				() => api.folders.delete({ id: 'fold_missing' }),
				{ allowNotFound: true },
			);
		}

		await step('domains.list', () => api.domains.list({}));
		await step('domains.checkStatus', () =>
			api.domains.checkStatus({ domains: `corsair-${stamp}.link` }),
		);
		if (!testDomain) {
			for (const name of [
				'domains.create',
				'domains.update',
				'domains.delete',
			]) {
				record(name, 'not_called', 'DUB_TEST_DOMAIN not set');
				outcomes[name] = 'not_called';
			}
		}
		if (testDomain) {
			const domain = await step('domains.create', () =>
				api.domains.create({ slug: testDomain }),
			);
			if (domain) {
				cleanup.push([
					`domain ${testDomain}`,
					() => api.domains.delete({ slug: testDomain }),
				]);
				await step('domains.update', () =>
					api.domains.update({ slug: testDomain, archived: true }),
				);
				await step('domains.delete', () =>
					api.domains.delete({ slug: testDomain }),
				);
			}
		}
	});

	it('conversion tracking and customers', async () => {
		await step('track.lead', () =>
			api.track.lead({
				clickId: '',
				eventName: 'Corsair live test',
				customerExternalId: `corsair-${stamp}`,
			}),
		);
		await step('track.sale', () =>
			api.track.sale({
				customerExternalId: `corsair-${stamp}`,
				amount: 0,
				eventName: 'Corsair live test',
			}),
		);
		await step(
			'track.open',
			() => api.track.open({ deepLink: `https://dub.sh/${linkKey}` }),
			{ allowNotFound: true },
		);
		await step('customers.list', () => api.customers.list({}));
		await step(
			'customers.get',
			() => api.customers.get({ id: `ext_corsair-${stamp}` }),
			{ allowNotFound: true },
		);
		await step(
			'customers.update',
			() => api.customers.update({ id: `ext_corsair-${stamp}`, name: 'x' }),
			{ allowNotFound: true },
		);
		await step(
			'customers.delete',
			() => api.customers.delete({ id: `ext_corsair-${stamp}` }),
			{ allowNotFound: true },
		);
	});

	it('partner program and the other generated routes', async () => {
		// Without a partner program Dub refuses these with 403 before acting.
		for (const testCase of generatedCases) {
			if (
				outcomes[testCase.name] ||
				['domains.checkStatus', 'track.open'].includes(testCase.name)
			) {
				continue;
			}
			if (testCase.name === 'domains.register') {
				// Claims a real .link domain on paid plans: never in a live suite.
				record(testCase.name, 'not_called', 'claims a real domain');
				outcomes[testCase.name] = 'not_called';
				continue;
			}
			const [group, action] = testCase.name.split('.') as [string, string];
			// unknown: the generated operations are looked up by name.
			const fn = (
				api as unknown as Record<
					string,
					Record<string, (input: unknown) => Promise<unknown>>
				>
			)[group]?.[action];
			if (!fn) throw new Error(`no operation ${testCase.name}`);
			await step(testCase.name, () => fn(testCase.input), {
				allowNotFound: true,
			});
		}
	});

	it('errors: an unknown link is a 404 ApiError with Dub’s code', async () => {
		const error = await api.links
			.get({ linkId: 'link_does_not_exist' })
			.catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect((error as Error).message).toMatch(/Dub 404 not_found/);
		record('error.links.get.404', 'ok', (error as Error).message);
	});

	it('links.delete, then every operation has an outcome', async () => {
		if (!linkId) throw new Error('links.create did not run');
		await step('links.delete', () => api.links.delete({ linkId }));
		const errors = Object.entries(outcomes).filter(([, o]) => o === 'error');
		expect(errors).toEqual([]);
		const expected = Object.keys(dub().endpointMeta ?? {}).sort();
		expect(expected).toHaveLength(63);
		expect(expected.filter((name) => !outcomes[name])).toEqual([]);
	});
});
