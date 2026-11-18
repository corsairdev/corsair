import { HeyyAPIError } from './client';
import {
	attributesSearch,
	channelsSearch,
	contactsSearch,
	labelsSearch,
} from './endpoints';
import type { HeyyContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `HEYY_API_KEY`.
 *
 * These call the endpoint functions rather than the raw client, so the response
 * mapping and every output schema run against a real payload. A suite that only
 * checked the envelope would pass while a bound call rejected the same
 * response.
 *
 * Every call here is read-only: a search with a page of one. No create, update
 * or delete is exercised, because those change the workspace and there is no
 * sandbox in the API.
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

// Safe: the endpoints read only ctx.key and log through ctx, which the shared
// logEventFromContext tolerates without a database.
const ctx = { key: API_KEY, database: undefined } as unknown as HeyyContext;

/** The smallest search body, so no filter syntax has to be right to pass. */
const oneRow = { pagination: { page: 0, limit: 1 } };

describeIfKey('Heyy live API', () => {
	it('returns a page of contacts through the endpoint and its output schema', async () => {
		const result = await contactsSearch(ctx, oneRow);

		// The output schema already parsed this, so these are the fields a caller
		// receives, not the raw body.
		expect(Array.isArray(result.contacts)).toBe(true);
		expect(result.contacts.length).toBeLessThanOrEqual(1);
		expect(typeof result.pagination.total).toBe('number');
		expect(result.success).toBe(true);
	});

	it('returns the channels through the endpoint and its output schema', async () => {
		const result = await channelsSearch(ctx, oneRow);

		expect(Array.isArray(result.channels)).toBe(true);
		expect(typeof result.pagination.total).toBe('number');
	});

	it('returns the attributes through the endpoint and its output schema', async () => {
		const result = await attributesSearch(ctx, oneRow);

		expect(Array.isArray(result.attributes)).toBe(true);
		expect(typeof result.pagination.total).toBe('number');
	});

	it('returns the labels through the endpoint and its output schema', async () => {
		const result = await labelsSearch(ctx, oneRow);

		expect(Array.isArray(result.labels)).toBe(true);
		expect(typeof result.pagination.total).toBe('number');
	});

	it('answers 401 with its own envelope for a bad key', async () => {
		const badCtx = { key: 'definitely-not-a-key' } as unknown as HeyyContext;

		const failure = await contactsSearch(badCtx, oneRow).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toBeInstanceOf(HeyyAPIError);
		expect((failure as HeyyAPIError).status).toBe(401);
		expect((failure as HeyyAPIError).messageKey).toBe('unauthorized');
	});
});
