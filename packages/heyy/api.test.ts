import { HeyyAPIError, makeHeyyRequest } from './client';

/**
 * Live smoke tests against the real API. Gated on `HEYY_API_KEY`.
 *
 * Every call here is read-only: a search with no query and a page of one. No
 * create, update or delete is exercised, because those change the workspace and
 * there is no sandbox in the API.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/heyy test:live`.
 */
const API_KEY = process.env.HEYY_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'HEYY_API_KEY is not set, so the Heyy live smoke tests are skipped. Create a key at app.heyy.io under Settings, API keys, and export it to run them.',
	);
}

/** The smallest search body, so no filter syntax has to be right to pass. */
const oneRow = { pagination: { page: 0, limit: 1 } };

// unknown: the raw client returns untyped JSON; each test narrows what it reads.
async function search(path: string) {
	return makeHeyyRequest(API_KEY as string, {
		method: 'POST',
		path,
		body: oneRow,
	});
}

describeIfKey('Heyy live API', () => {
	it('returns a page of contacts with total', async () => {
		const raw = (await search('/contacts/search')) as {
			data: unknown[]; // unknown: rows are narrowed per test.
			pagination: { page: number; limit: number; total: number };
			success: boolean;
		};

		expect(raw.success).toBe(true);
		expect(Array.isArray(raw.data)).toBe(true);
		expect(raw.data.length).toBeLessThanOrEqual(1);
		expect(typeof raw.pagination.total).toBe('number');
	});

	it('returns the workspace channels', async () => {
		const raw = (await search('/channels/search')) as { data: unknown[] }; // unknown: only the array's presence matters here.
		expect(Array.isArray(raw.data)).toBe(true);
	});

	it('returns the attributes defined on the workspace', async () => {
		const raw = (await search('/attributes/search')) as { data: unknown[] }; // unknown: as above.
		expect(Array.isArray(raw.data)).toBe(true);
	});

	it('returns the labels', async () => {
		const raw = (await search('/labels/search')) as { data: unknown[] }; // unknown: as above.
		expect(Array.isArray(raw.data)).toBe(true);
	});

	it('answers 401 with its own envelope for a bad key', async () => {
		const failure = await makeHeyyRequest('definitely-not-a-key', {
			method: 'POST',
			path: '/contacts/search',
			body: {},
		}).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toBeInstanceOf(HeyyAPIError);
		expect((failure as HeyyAPIError).status).toBe(401);
		expect((failure as HeyyAPIError).messageKey).toBe('unauthorized');
	});
});
