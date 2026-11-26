/**
 * Live smoke tests against the real linkhut API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/linkhut test:live`.
 *
 * Read-only by default. With LINKHUT_LIVE_WRITES=1 it also runs one round
 * trip on a made-up private bookmark (https://example.com/corsair-linkhut-live-<time>)
 * and a made-up tag: create, a create that must fail, update, read, tag
 * rename and delete, bookmark delete, and a read that must come back empty.
 *
 * A personal token is created at https://ln.ht/_/oauth/personal-token and
 * passed as LINKHUT_API_KEY. Every call runs through the bound client, so each
 * answer is parsed by its output schema before an assertion reads it. The
 * client spaces requests one second apart, the interval the etiquette page
 * asks for, and the suite makes nine calls in total.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { linkhut } from './index';

const API_KEY = process.env.LINKHUT_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;
if (!API_KEY) {
	console.warn('Skipping the Linkhut live suite: LINKHUT_API_KEY is not set.');
}
const LIVE_WRITES = Boolean(API_KEY) && process.env.LINKHUT_LIVE_WRITES === '1';
const describeIfWrites = LIVE_WRITES ? describe : describe.skip;

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'linkhut', 'default');
	const corsair = createCorsair({
		plugins: [linkhut({ key: API_KEY })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

describeIfKey('Linkhut live smoke', () => {
	it('reads the time of the last bookmark change', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.lastUpdated({});
			expect(result.update_time === undefined).toBe(false);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the most recent bookmarks', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.recent({ count: 5 });
			expect(result.posts.length).toBeLessThanOrEqual(5);
			for (const bookmark of result.posts) {
				expect(typeof bookmark.href).toBe('string');
				expect(['yes', 'no']).toContain(bookmark.shared);
				expect(['yes', 'no']).toContain(bookmark.toread);
				expect(bookmark.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('reads one page of every bookmark', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.all({ results: 5 });
			expect(result.posts.length).toBeLessThanOrEqual(5);
			expect(result.results).toBe(5);
			expect(result.start).toBe(0);
			if (result.posts.length === 5) {
				expect(result.nextStart).toBe(5);
			} else {
				expect(result.nextStart).toBeNull();
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('counts the bookmarks of each day', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.dates({});
			for (const count of Object.values(result.dates)) {
				expect(count).toBeGreaterThan(0);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('reads one day of bookmarks', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const dates = await corsair.linkhut.api.posts.dates({});
			const latest = Object.keys(dates.dates).sort().at(-1);
			if (!latest) return;
			const day = await corsair.linkhut.api.posts.get({ dt: latest });
			expect(Array.isArray(day.posts)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('suggests tags for a bookmarked url', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const recent = await corsair.linkhut.api.posts.recent({ count: 1 });
			const url = recent.posts[0]?.href ?? 'https://example.com/';
			const result = await corsair.linkhut.api.posts.suggest({ url });
			expect(Array.isArray(result.popular)).toBe(true);
			expect(Array.isArray(result.recommended)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the change manifest of every bookmark', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.allHashes({});
			for (const entry of result.hashes) {
				expect(entry.url).toMatch(/^[0-9a-f]{32}$/);
				expect(entry.meta).toMatch(/^[0-9a-f]{32}$/);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('answers no posts for a url that is not saved', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.linkhut.api.posts.get({
				url: 'https://example.com/corsair-linkhut-never-saved',
			});
			expect(result.posts).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the tag counts', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const tags = await corsair.linkhut.api.tags.get({});
			for (const count of Object.values(tags)) {
				expect(count).toBeGreaterThan(0);
			}
		} finally {
			testDb.cleanup();
		}
	});
});

describeIfWrites('Linkhut live round trip (LINKHUT_LIVE_WRITES=1)', () => {
	it('creates, updates, retags and deletes one made-up private bookmark', async () => {
		const { corsair, testDb } = await createClient();
		const stamp = Date.now();
		const url = `https://example.com/corsair-linkhut-live-${stamp}`;
		const tag = `corsair-live-${stamp}`;
		const renamed = `${tag}-renamed`;
		const api = corsair.linkhut.api;
		try {
			await expect(
				api.posts.add({
					url,
					description: 'Corsair live test',
					tags: [tag],
					shared: 'no',
				}),
			).resolves.toEqual({ result_code: 'done' });
			// A second create for the same url fails with result_code at HTTP 200.
			await expect(
				api.posts.add({ url, description: 'again', shared: 'no' }),
			).rejects.toMatchObject({ status: 200 });
			await expect(
				api.posts.add({
					url,
					description: 'Corsair live test, updated',
					tags: [tag],
					shared: 'no',
					replace: 'yes',
				}),
			).resolves.toEqual({ result_code: 'done' });
			const saved = await api.posts.get({ url, meta: 'yes' });
			expect(saved.posts[0]?.description).toBe('Corsair live test, updated');
			expect(saved.posts[0]?.shared).toBe('no');
			await api.tags.rename({ old: tag, new: renamed });
			const tags = await api.tags.get({});
			expect(tags[renamed]).toBe(1);
			await api.tags.delete({ tag: renamed });
		} finally {
			await api.posts.delete({ url }).catch(() => undefined);
			const gone = await api.posts.get({ url });
			expect(gone.posts).toEqual([]);
			testDb.cleanup();
		}
	}, 60_000);
});
