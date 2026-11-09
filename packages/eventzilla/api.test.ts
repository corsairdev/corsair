import { EventzillaAPIError, makeEventzillaRequest } from './client';
import { withNextOffset } from './endpoints/events';
import { EventzillaEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke against the real API. Read-only and deliberately few calls: the
 * provider's own limits are undocumented, so the suite does one cheap request
 * plus whatever the account happens to have.
 *
 * Run with `EVENTZILLA_API_KEY=... pnpm test:live` from `packages/eventzilla`.
 * CI skips `api.test.ts` by name.
 */
const API_KEY = process.env.EVENTZILLA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	// unknown: a rejection can be any value until the instanceof check narrows it.
	promise: Promise<unknown>,
): Promise<EventzillaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EventzillaAPIError);
	if (!(error instanceof EventzillaAPIError)) throw error;
	return error;
}

if (!API_KEY) {
	console.warn(
		'[eventzilla] EVENTZILLA_API_KEY is not set: the live smoke tests are skipped, not passing.',
	);
}

describeIfKey('Eventzilla live smoke', () => {
	it('lists categories', async () => {
		const raw = await makeEventzillaRequest(API_KEY as string, {
			method: 'GET',
			path: '/categories',
		});

		// The 200-with-an-error-body case the client turns into a throw.
		const result = Outputs.categoriesList.parse(raw);
		expect(Array.isArray(result.categories)).toBe(true);
	});

	it('lists events, and reads the first one back', async () => {
		const raw = await makeEventzillaRequest(API_KEY as string, {
			method: 'GET',
			path: '/events',
			query: { limit: 1 },
		});

		// The endpoint derives `next_offset` and turns the empty-list message into
		// an empty page before parsing; the live suite has to do the same or it
		// parses a shape the endpoint never returns.
		const result = Outputs.eventsList.safeParse(withNextOffset(raw, 'events'));
		expect(result.success).toBe(true);
		if (!result.success) return;

		// An account with no events answers the empty-list message, which is a
		// valid result rather than a failure.
		const event = result.data.events[0];
		if (!event?.id) {
			expect(result.data.events).toEqual([]);
			return;
		}

		const singleRaw = await makeEventzillaRequest(API_KEY as string, {
			method: 'GET',
			path: `/events/${event.id}`,
		});
		const single = Outputs.eventsGet.safeParse(singleRaw);
		expect(single.success).toBe(true);
	});

	it('reports a refused key as an auth error', async () => {
		const error = await failure(
			makeEventzillaRequest('not-a-real-key', {
				method: 'GET',
				path: '/events',
			}),
		);
		expect(error.kind).toBe('unauthorized');
	});

	it("reports the docs' nonexistent check-in route as an invalid route", async () => {
		const error = await failure(
			makeEventzillaRequest(API_KEY as string, {
				method: 'POST',
				path: '/attendee/checkin',
				body: { barcode: 'x', eventcheckin: true },
			}),
		);
		expect(error.kind).toBe('invalid_route');
	});
});
