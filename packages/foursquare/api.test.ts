/**
 * Live smoke tests against the real Foursquare Places API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/foursquare test:live`.
 *
 * Read-only: every operation in this plugin is a GET.
 *
 * Foursquare bills per call and a free account runs out of credits, which
 * arrives as a **429** whose message says so. That case is skipped rather than
 * failed, because it says nothing about the plugin.
 */
import { FoursquareAPIError } from './client';
import { foursquare } from './index';

const KEY = process.env.FOURSQUARE_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

const CHICAGO = { near: 'Chicago, IL' };

/** True when the call failed only because the account is out of credits. */
function isOutOfCredits(error: unknown): boolean {
	return error instanceof FoursquareAPIError && error.isCreditExhausted;
}

describeIfKey('Foursquare live smoke', () => {
	const plugin = foursquare({ key: KEY });
	// Safe: the endpoints read only the key from the context.
	const ctx = { key: KEY } as never;

	let placeId: string | undefined;

	it('searches places and remembers one for the detail calls', async () => {
		const result = await plugin.endpoints!.places.search(ctx, {
			query: 'coffee',
			...CHICAGO,
			limit: 1,
		});

		expect(result.results.length).toBeGreaterThan(0);
		const place = result.results[0]!;
		expect(typeof place.fsq_place_id).toBe('string');
		expect(typeof place.name).toBe('string');
		// The docs' schema omits this, but a real search always sends it.
		expect(result.context).toBeDefined();
		// `ll` was not sent, so the API geocoded `near`.
		expect(typeof place.latitude).toBe('number');

		placeId = place.fsq_place_id;
	});

	it('reads one place by id, with extended_location', async () => {
		if (!placeId) return;
		const place = await plugin.endpoints!.places.get(ctx, {
			fsq_place_id: placeId,
		});

		expect(place.fsq_place_id).toBe(placeId);
		expect(place.location?.locality).toBe('Chicago');
		expect(place.extended_location).toBeDefined();
	});

	it('autocompletes with ll, which is the only location input it takes', async () => {
		const result = await plugin.endpoints!.places.autocomplete(ctx, {
			query: 'star',
			ll: '41.8781,-87.6298',
		});

		expect(result.results.length).toBeGreaterThan(0);
		const first = result.results[0]!;
		// `text` is an object, not a string; a strict pre-probe schema failed here.
		expect(typeof first.text?.primary).toBe('string');
	});

	it('lists tips, or reports that credits ran out', async () => {
		if (!placeId) return;
		try {
			const result = await plugin.endpoints!.places.tips(ctx, {
				fsq_place_id: placeId,
				limit: 2,
			});
			expect(Array.isArray(result.tips)).toBe(true);
		} catch (error) {
			if (!isOutOfCredits(error)) throw error;
			// A free account exhausts its credits; that is not a plugin defect.
			console.warn('Skipped tips: no API credits remaining');
		}
	});

	it('lists photos, or reports that credits ran out', async () => {
		if (!placeId) return;
		try {
			const result = await plugin.endpoints!.places.photos(ctx, {
				fsq_place_id: placeId,
				limit: 2,
			});
			expect(Array.isArray(result.photos)).toBe(true);
		} catch (error) {
			if (!isOutOfCredits(error)) throw error;
			console.warn('Skipped photos: no API credits remaining');
		}
	});

	it('parses a response that asked for only one field', async () => {
		// The regression Greptile caught: `fields=name` alone returns no
		// fsq_place_id, so the plugin adds the id back to the selection.
		const result = await plugin.endpoints!.places.search(ctx, {
			...CHICAGO,
			fields: ['name'],
			limit: 1,
		});

		expect(result.results.length).toBeGreaterThan(0);
		expect(typeof result.results[0]?.fsq_place_id).toBe('string');
		expect(typeof result.results[0]?.name).toBe('string');
	});

	it('pages a search with nextCursor and gets different places', async () => {
		const first = await plugin.endpoints!.places.search(ctx, {
			...CHICAGO,
			limit: 3,
		});

		expect(first.results).toHaveLength(3);
		// The cursor comes from the `link` response header, which the plugin reads
		// itself because the shared client cannot return a header and a body.
		expect(typeof first.nextCursor).toBe('string');

		const second = await plugin.endpoints!.places.search(ctx, {
			...CHICAGO,
			limit: 3,
			// nextCursor is nullish on the last page; this page has one.
			cursor: first.nextCursor ?? undefined,
		});

		expect(second.results).toHaveLength(3);
		const firstIds = first.results.map((place) => place.fsq_place_id);
		const secondIds = second.results.map((place) => place.fsq_place_id);
		expect(secondIds).not.toEqual(firstIds);
		// No overlap: the second page continues rather than repeating.
		expect(secondIds.some((id) => firstIds.includes(id))).toBe(false);
	});

	it('surfaces the documented 404 for an unknown place', async () => {
		await expect(
			plugin.endpoints!.places.get(ctx, { fsq_place_id: 'doesnotexist' }),
		).rejects.toThrow(/not found/i);
	});
});
