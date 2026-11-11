import { EventbriteAPIError, makeEventbriteRequest } from './client';
import {
	EVENTBRITE_WEBHOOK_ACTIONS,
	EventbriteEndpointOutputSchemas,
} from './endpoints/types';
import { createHarness } from './test-helpers';

/**
 * Live smoke tests against the real Eventbrite API. CI skips this file by name
 * (`api.test.ts`), so it is opt-in:
 *
 * ```bash
 * EVENTBRITE_API_KEY=... pnpm --filter @corsair-dev/eventbrite test:live
 * ```
 *
 * These call the raw client, so anything an endpoint derives before `parse`
 * has to be applied here too; nothing below derives a field, so the raw bodies
 * go straight through the output schemas.
 *
 * Only public reads are exercised. Orders, attendees, ticket classes, venues
 * and webhooks need a token whose user owns the organization and has organizer
 * access to the event, which a bare private token does not: those routes answer
 * 403 NOT_AUTHORIZED rather than proving the plugin wrong.
 */
const KEY = process.env.EVENTBRITE_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

const h = createHarness();

if (!KEY) {
	// A skipped run must not read as a green one.
	console.warn(
		'[eventbrite] EVENTBRITE_API_KEY is not set; live smoke tests are skipped.',
	);
}

// A long-running, publicly listed event, so the read stays valid for a while.
const PUBLIC_EVENT_ID = process.env.EVENTBRITE_EVENT_ID ?? '2000937221092';
const PUBLIC_VENUE_ID = process.env.EVENTBRITE_VENUE_ID ?? '299411783';

describeIfKey('Eventbrite live smoke', () => {
	it('reads the authenticated user and parses it', async () => {
		const raw = await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: '/users/me/',
		});

		const parsed = EventbriteEndpointOutputSchemas.usersMe.parse(raw);
		expect(parsed.id).toBeTruthy();
	});

	it('lists the categories with a live pagination block', async () => {
		const raw = await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: '/categories/',
			query: { page_size: 5 },
		});

		const body = raw as { categories: Array<{ id: string }> };
		expect(body.categories.length).toBeGreaterThan(0);
		expect(body.categories[0]?.id).toBeTruthy();
	});

	it('walks the subcategories to the second page with a continuation token', async () => {
		const first = (await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: '/subcategories/',
			query: { page_size: 2 },
		})) as {
			subcategories: Array<{ id: string }>;
			pagination: { continuation?: string | null; has_more_items?: boolean };
		};

		expect(first.subcategories).toHaveLength(2);
		expect(first.pagination.has_more_items).toBe(true);
		expect(first.pagination.continuation).toBeTruthy();

		const second = (await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: '/subcategories/',
			query: {
				page_size: 2,
				continuation: first.pagination.continuation ?? '',
			},
		})) as { subcategories: Array<{ id: string }> };

		expect(second.subcategories[0]?.id).not.toBe(first.subcategories[0]?.id);
	});

	it('reads a public event through the event output schema', async () => {
		const raw = await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: `/events/${PUBLIC_EVENT_ID}/`,
			query: { expand: 'venue,organizer,category,format' },
		});

		const event = EventbriteEndpointOutputSchemas.eventsGet.parse(raw);
		expect(event.id).toBe(PUBLIC_EVENT_ID);
		expect(event.start?.timezone).toBeTruthy();
		expect(event.venue?.id).toBeTruthy();
	});

	it('reads a public venue through the venue output schema', async () => {
		const raw = await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: `/venues/${PUBLIC_VENUE_ID}/`,
		});

		const venue = EventbriteEndpointOutputSchemas.venueGet.parse(raw);
		expect(venue.id).toBe(PUBLIC_VENUE_ID);
		expect(venue.name).toBeTruthy();
	});

	it('lists a public venue’s events', async () => {
		const raw = await makeEventbriteRequest(KEY as string, {
			method: 'GET',
			path: `/venues/${PUBLIC_VENUE_ID}/events/`,
			query: { status: 'live' },
		});

		const page = EventbriteEndpointOutputSchemas.eventsListByVenue.parse(raw);
		expect(Array.isArray(page.events)).toBe(true);
	});

	it('turns a missing event into a NOT_FOUND error rather than an empty body', async () => {
		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest(KEY as string, {
				method: 'GET',
				path: '/events/123456789012/',
			}),
		);

		expect(caught).toBeInstanceOf(EventbriteAPIError);
		expect(caught.status).toBe(404);
		expect(caught.code).toBe('NOT_FOUND');
	});

	it('rejects a bad token with INVALID_AUTH, which is what a wrong key looks like', async () => {
		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('not-a-real-token', {
				method: 'GET',
				path: '/users/me/',
			}),
		);

		expect(caught).toBeInstanceOf(EventbriteAPIError);
		expect(caught.status).toBe(401);
		expect(caught.code).toBe('INVALID_AUTH');
	});

	it('keeps the documented webhook action list in sync with the API', () => {
		// Not a live call: the action list is copied from the API reference, and
		// this pins that `attendee.*` is what Eventbrite documents (it rewrites
		// two of them to `barcode.*` on delivery, which is why the list omits
		// those names).
		expect(EVENTBRITE_WEBHOOK_ACTIONS).toContain('attendee.checked_in');
		expect(EVENTBRITE_WEBHOOK_ACTIONS).toContain('order.placed');
	});
});
