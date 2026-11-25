/**
 * Live smoke tests against the real linkhut API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/linkhut test:live`.
 *
 * Read-only: it never creates, updates or deletes anything.
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
			const day = await corsair.linkhut.api.posts.get({
				dt: `${latest}T00:00:00Z`,
			});
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
