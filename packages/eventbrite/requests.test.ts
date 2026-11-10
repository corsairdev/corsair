import type { EventbriteAPIError } from './client';
import {
	Attendees,
	Discounts,
	Events,
	Orders,
	Questions,
	TicketClasses,
	Users,
	Venues,
	Webhooks,
} from './endpoints';
import {
	argumentsError,
	canceledResult,
	deletedResult,
	displaySettings,
	emptyOrganizationsPage,
	eventbriteEvent,
	eventsPage,
	publishedResult,
	question,
	ticketClass,
	ticketClassesPage,
	unpublishedResult,
	user,
	venue,
	webhooksPage,
} from './test-fixtures';
import { createHarness, invoke, mockLog } from './test-helpers';

// Hoisted by ts-jest into this file; a mock declared in test-helpers.ts would
// run after these imports and leave the real logger bound.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const EVENT = '2000937221092';
const ORG = '154830740213';

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
	mockLog.mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('events.get', () => {
	it('GETs the event and keeps the object as sent', async () => {
		h.respond(eventbriteEvent);

		const result = await invoke(Events.get, { event_id: EVENT });

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/`,
		});
		expect(result).toEqual(eventbriteEvent);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'eventbrite.events.get',
			{ eventId: EVENT },
			'completed',
		);
	});

	it('joins the expand list into one comma-separated value', async () => {
		h.respond(eventbriteEvent);

		await invoke(Events.get, {
			event_id: EVENT,
			expand: ['venue', 'organizer', 'ticket_availability'],
		});

		expect(h.lastRequest().query).toEqual({
			expand: 'venue,organizer,ticket_availability',
		});
	});
});

describe('events.listByOrganization', () => {
	it('sends every filter and pages with continuation', async () => {
		h.respond(eventsPage);

		await invoke(Events.listByOrganization, {
			organization_id: ORG,
			status: ['live', 'started'],
			order_by: 'start_asc',
			time_filter: 'current_future',
			venue_filter: ['299411783'],
			organizer_filter: ['8515431666'],
			event_ids: [EVENT],
			event_ids_to_exclude: ['1', '2'],
			show_series_parent: false,
			page_size: 100,
			continuation: 'eyJwYWdlIjogMn0',
		});

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/organizations/${ORG}/events/`,
		});
		expect(h.lastRequest().query).toEqual({
			status: 'live,started',
			order_by: 'start_asc',
			time_filter: 'current_future',
			venue_filter: '299411783',
			organizer_filter: '8515431666',
			event_ids: EVENT,
			event_ids_to_exclude: '1,2',
			show_series_parent: 'false',
			page_size: '100',
			continuation: 'eyJwYWdlIjogMn0',
		});
	});

	it('rejects a page size above the 300 Eventbrite enforces', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.listByOrganization, {
				organization_id: ORG,
				page_size: 301,
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.listByVenue', () => {
	it('GETs the venue feed with the date range', async () => {
		h.respond(eventsPage);

		await invoke(Events.listByVenue, {
			venue_id: '299411783',
			status: ['live'],
			only_public: true,
			'start_date.range_start': '2027-01-01T00:00:00Z',
			'start_date.range_end': '2027-12-31T00:00:00Z',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/venues/299411783/events/',
		});
		expect(h.lastRequest().query).toEqual({
			status: 'live',
			only_public: 'true',
			'start_date.range_start': '2027-01-01T00:00:00Z',
			'start_date.range_end': '2027-12-31T00:00:00Z',
		});
	});
});

describe('events.listBySeries', () => {
	it('GETs the series occurrences', async () => {
		h.respond(eventsPage);

		await invoke(Events.listBySeries, {
			event_series_id: EVENT,
			time_filter: 'past',
			order_by: 'created_desc',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/series/${EVENT}/events/`,
		});
		expect(h.lastRequest().query).toEqual({
			time_filter: 'past',
			order_by: 'created_desc',
		});
	});
});

describe('events.create', () => {
	it('POSTs the event wrapped in `event`, with the html name wrapper', async () => {
		h.respond(eventbriteEvent);

		await invoke(Events.create, {
			organization_id: ORG,
			event: {
				name: { html: 'Launch Night' },
				start: { timezone: 'America/New_York', utc: '2027-06-01T14:00:00Z' },
				end: { timezone: 'America/New_York', utc: '2027-06-01T18:00:00Z' },
				currency: 'USD',
				venue_id: '299411783',
			},
		});

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/organizations/${ORG}/events/`,
		});
		expect(h.lastRequest().body).toEqual({
			event: {
				name: { html: 'Launch Night' },
				start: { timezone: 'America/New_York', utc: '2027-06-01T14:00:00Z' },
				end: { timezone: 'America/New_York', utc: '2027-06-01T18:00:00Z' },
				currency: 'USD',
				venue_id: '299411783',
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'eventbrite.events.create',
			{ organizationId: ORG, eventId: EVENT, status: 'live' },
			'completed',
		);
	});

	it('rejects summary with description before sending anything', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: { html: 'Launch' },
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T18:00:00Z' },
					currency: 'USD',
					summary: 'Short',
					description: { html: '<p>Long</p>' },
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects online_event with a venue_id', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: { html: 'Launch' },
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T18:00:00Z' },
					currency: 'USD',
					online_event: true,
					venue_id: '299411783',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an end that is not after the start', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: { html: 'Launch' },
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					currency: 'USD',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a name sent as a bare string, which Eventbrite refuses', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: 'Launch',
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T18:00:00Z' },
					currency: 'USD',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a currency that is not a 3-letter code', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: { html: 'Launch' },
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T18:00:00Z' },
					currency: 'DOLLARS',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.update', () => {
	it('POSTs only the changed fields, wrapped in `event`', async () => {
		h.respond(eventbriteEvent);

		await invoke(Events.update, {
			event_id: EVENT,
			event: { name: { html: 'Renamed' } },
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/`,
			body: { event: { name: { html: 'Renamed' } } },
		});
	});

	it('rejects an empty change set instead of spending a request', async () => {
		const caught = await h.failure<Error>(
			invoke(Events.update, {
				event_id: EVENT,
				event: {},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.publish / unpublish / cancel / delete', () => {
	it('POSTs publish and returns the published flag', async () => {
		h.respond(publishedResult);

		const result = await invoke(Events.publish, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/publish/`,
		});
		expect(result).toEqual({ published: true });
	});

	it('POSTs unpublish and returns the unpublished flag', async () => {
		h.respond(unpublishedResult);

		const result = await invoke(Events.unpublish, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/unpublish/`,
		});
		expect(result).toEqual({ unpublished: true });
	});

	it('POSTs cancel and returns the canceled flag', async () => {
		h.respond(canceledResult);

		const result = await invoke(Events.cancel, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/cancel/`,
		});
		expect(result).toEqual({ canceled: true });
	});

	it('DELETEs the event and returns the deleted flag', async () => {
		h.respond(deletedResult);

		const result = await invoke(Events.remove, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/v3/events/${EVENT}/`,
		});
		expect(result).toEqual({ deleted: true });
	});

	it('rejects a publish that answers `published: false` rather than passing it on', async () => {
		h.respond({ published: false });

		const caught = await h.failure(invoke(Events.publish, { event_id: EVENT }));

		// A refused publish is a documented 400 with a code; a 200 saying false
		// would mean the flag disagrees with the status, so it fails the parse.
		expect(caught.name).toBe('ZodError');
	});
});

describe('events.copy', () => {
	it('POSTs the copy fields bare, since this route rejects an `event` wrapper', async () => {
		h.respond(eventbriteEvent);

		await invoke(Events.copy, {
			event_id: EVENT,
			name: 'Copy of the conference',
			timezone: 'America/New_York',
			start_date: '2027-06-01T14:00:00Z',
			end_date: '2027-06-01T18:00:00Z',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/copy/`,
		});
		expect(h.lastRequest().body).toEqual({
			name: 'Copy of the conference',
			timezone: 'America/New_York',
			start_date: '2027-06-01T14:00:00Z',
			end_date: '2027-06-01T18:00:00Z',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'eventbrite.events.copy',
			{ sourceEventId: EVENT, eventId: EVENT },
			'completed',
		);
	});
});

describe('events.description', () => {
	it('GETs the rendered HTML description', async () => {
		h.respond({ description: '<div>Hello</div>' });

		const result = await invoke(Events.description, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/description/`,
		});
		expect(result).toEqual({ description: '<div>Hello</div>' });
	});
});

describe('events.displaySettings / updateDisplaySettings', () => {
	it('GETs the display settings', async () => {
		h.respond(displaySettings);

		const result = await invoke(Events.displaySettings, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/display_settings/`,
		});
		expect(result).toMatchObject({ show_map: true });
	});

	it('POSTs them wrapped in `display_settings`, which this route requires', async () => {
		h.respond(displaySettings);

		await invoke(Events.updateDisplaySettings, {
			event_id: EVENT,
			display_settings: { show_map: false, show_remaining: true },
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/display_settings/`,
			body: { display_settings: { show_map: false, show_remaining: true } },
		});
	});
});

describe('ticketClasses.list', () => {
	it('GETs the ticket classes with the category filter joined', async () => {
		h.respond(ticketClassesPage);

		const result = await invoke(TicketClasses.list, {
			event_id: EVENT,
			category: ['admission', 'donation'],
			include_holds: true,
		});

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/ticket_classes/`,
		});
		expect(h.lastRequest().query).toEqual({
			category: 'admission,donation',
			include_holds: 'true',
		});
		expect(result).toMatchObject({
			pagination: { object_count: 2 },
			ticket_classes: [{ id: '3453243480', on_sale_status: 'AVAILABLE' }],
		});
	});
});

describe('ticketClasses.listForSale', () => {
	it('GETs the purchasable classes', async () => {
		h.respond(ticketClassesPage);

		await invoke(TicketClasses.listForSale, {
			event_id: EVENT,
			pos: 'at_the_door',
			code: 'CORSAIR20',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/ticket_classes/for_sale/`,
		});
		expect(h.lastRequest().query).toEqual({
			pos: 'at_the_door',
			code: 'CORSAIR20',
		});
	});
});

describe('ticketClasses.get / create / update / delete', () => {
	it('GETs one ticket class', async () => {
		h.respond(ticketClass);

		const result = await invoke(TicketClasses.get, {
			event_id: EVENT,
			ticket_class_id: '3453243480',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/ticket_classes/3453243480/`,
		});
		expect(result).toMatchObject({ id: '3453243480', free: true });
	});

	it('POSTs a priced ticket class wrapped in `ticket_class`', async () => {
		h.respond({ ...ticketClass, cost: null, free: false });

		await invoke(TicketClasses.create, {
			event_id: EVENT,
			ticket_class: {
				name: 'Early bird',
				cost: 'USD,4500',
				capacity: 50,
				auto_hide: true,
				sales_channels: ['online'],
			},
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/ticket_classes/`,
		});
		expect(h.lastRequest().body).toEqual({
			ticket_class: {
				name: 'Early bird',
				cost: 'USD,4500',
				capacity: 50,
				auto_hide: true,
				sales_channels: ['online'],
			},
		});
	});

	it('POSTs an update to the ticket class path', async () => {
		h.respond(ticketClass);

		await invoke(TicketClasses.update, {
			event_id: EVENT,
			ticket_class_id: '3453243480',
			ticket_class: { capacity: 80 },
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/ticket_classes/3453243480/`,
			body: { ticket_class: { capacity: 80 } },
		});
	});

	it('DELETEs a ticket class', async () => {
		h.respond({ deleted: true });

		const result = await invoke(TicketClasses.remove, {
			event_id: EVENT,
			ticket_class_id: '3453243480',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/v3/events/${EVENT}/ticket_classes/3453243480/`,
		});
		expect(result).toEqual({ deleted: true });
	});

	it('rejects a cost whose currency is not a 3-letter code', async () => {
		const caught = await h.failure<Error>(
			invoke(TicketClasses.create, {
				event_id: EVENT,
				ticket_class: {
					name: 'Early bird',
					cost: 'DOLLARS,4500',
					capacity: 50,
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a charged ticket with no cost', async () => {
		const caught = await h.failure<Error>(
			invoke(TicketClasses.create, {
				event_id: EVENT,
				ticket_class: { name: 'Early bird', capacity: 50 },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a free ticket that also has a cost', async () => {
		const caught = await h.failure<Error>(
			invoke(TicketClasses.create, {
				event_id: EVENT,
				ticket_class: { name: 'Free', free: true, cost: 'USD,0', capacity: 10 },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a non-donation ticket with neither capacity nor an inventory tier', async () => {
		const caught = await h.failure<Error>(
			invoke(TicketClasses.create, {
				event_id: EVENT,
				ticket_class: { name: 'Free', free: true },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});
});

describe('questions', () => {
	it('GETs the custom questions', async () => {
		h.respond({ questions: [question], pagination: { object_count: 1 } });

		const result = await invoke(Questions.list, { event_id: EVENT });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/questions/`,
		});
		expect(result).toMatchObject({ questions: [{ id: '323787959' }] });
	});

	it('GETs one question', async () => {
		h.respond(question);

		await invoke(Questions.get, {
			event_id: EVENT,
			question_id: '323787959',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/questions/323787959/`,
		});
	});

	it('POSTs a question wrapped in `question`', async () => {
		h.respond(question);

		await invoke(Questions.create, {
			event_id: EVENT,
			question: {
				question: { html: 'Which session?' },
				type: 'dropdown',
				choices: [
					{ answer: { html: 'Morning' } },
					{ answer: { html: 'Evening' } },
				],
				respondent: 'attendee',
			},
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/events/${EVENT}/questions/`,
		});
		expect(h.lastRequest().body).toMatchObject({
			question: {
				question: { html: 'Which session?' },
				type: 'dropdown',
			},
		});
	});

	it('DELETE a question', async () => {
		h.respond({ deleted: true });

		const result = await invoke(Questions.remove, {
			event_id: EVENT,
			question_id: '323787959',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/v3/events/${EVENT}/questions/323787959/`,
		});
		expect(result).toEqual({ deleted: true });
	});

	it('rejects a multiple-choice question with no choices', async () => {
		const caught = await h.failure<Error>(
			invoke(Questions.create, {
				event_id: EVENT,
				question: {
					question: { html: 'Which session?' },
					type: 'dropdown',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a waiver question with no waiver text', async () => {
		const caught = await h.failure<Error>(
			invoke(Questions.create, {
				event_id: EVENT,
				question: { question: { html: 'Do you accept?' }, type: 'waiver' },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('GETs the default questions with include_all', async () => {
		h.respond({ questions: [{ id: 'first_name' }], pagination: {} });

		await invoke(Questions.listCanned, {
			event_id: EVENT,
			include_all: true,
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/canned_questions/`,
		});
		expect(h.lastRequest().query).toEqual({ include_all: 'true' });
	});
});

describe('attendees', () => {
	it('GETs the attendee list with the attendee_ids filter joined', async () => {
		h.respond({
			attendees: [
				{
					id: '1234567890',
					event_id: EVENT,
					profile: { email: 'jordan@example.com' },
				},
			],
			pagination: { object_count: 1 },
		});

		const result = await invoke(Attendees.list, {
			event_id: EVENT,
			status: 'attending',
			attendee_ids: ['1234567890', '1234567891'],
			changed_since: '2026-01-01T00:00:00Z',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/attendees/`,
		});
		expect(h.lastRequest().query).toEqual({
			status: 'attending',
			attendee_ids: '1234567890,1234567891',
			changed_since: '2026-01-01T00:00:00Z',
		});
		// A list log carries no email or name.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'eventbrite.attendees.list',
			{ eventId: EVENT, status: 'attending', count: 1 },
			'completed',
		);
	});

	it('GETs one attendee', async () => {
		h.respond({ id: '1234567890', event_id: EVENT });

		await invoke(Attendees.get, {
			event_id: EVENT,
			attendee_id: '1234567890',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/attendees/1234567890/`,
		});
	});
});

describe('orders', () => {
	it('GETs one order and logs only its id', async () => {
		h.respond({ id: '9876543210', email: 'jordan@example.com' });

		await invoke(Orders.get, { order_id: '9876543210' });

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/orders/9876543210/',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'eventbrite.orders.get',
			{ orderId: '9876543210' },
			'completed',
		);
	});

	it("GETs an organization's orders with the email filters joined", async () => {
		h.respond({ orders: [], pagination: { object_count: 0 } });

		await invoke(Orders.listByOrganization, {
			organization_id: ORG,
			status: 'all_not_deleted',
			only_emails: ['a@example.com', 'b@example.com'],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/organizations/${ORG}/orders/`,
		});
		expect(h.lastRequest().query).toEqual({
			status: 'all_not_deleted',
			only_emails: 'a@example.com,b@example.com',
		});
	});

	it("GETs an event's orders with the refund status filter joined", async () => {
		h.respond({ orders: [], pagination: { object_count: 0 } });

		await invoke(Orders.listByEvent, {
			event_id: EVENT,
			status: 'active',
			refund_request_statuses: ['pending', 'completed'],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/events/${EVENT}/orders/`,
		});
		expect(h.lastRequest().query).toEqual({
			status: 'active',
			refund_request_statuses: 'pending,completed',
		});
	});

	it("GETs a user's orders, accepting `me`", async () => {
		h.respond({ orders: [], pagination: { object_count: 0 } });

		await invoke(Orders.listByUser, { user_id: 'me' });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/users/me/orders/',
		});
	});
});

describe('users', () => {
	it('GETs /users/me/', async () => {
		h.respond(user);

		const result = await invoke(Users.me);

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/users/me/',
		});
		expect(result).toMatchObject({ id: '3020861203176' });
	});

	it('GETs one user by id', async () => {
		h.respond(user);

		await invoke(Users.get, { user_id: '3020861203176' });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/users/3020861203176/',
		});
	});

	it("GETs the user's organizations, and keeps an empty page as sent", async () => {
		h.respond(emptyOrganizationsPage);

		// unknown: the assertion is that the list is empty, so no element type
		// is needed.
		const result = (await invoke(Users.list, { user_id: 'me' })) as {
			organizations: unknown[];
			pagination: { page_count: number };
		};

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/users/me/organizations/',
		});
		expect(result.organizations).toEqual([]);
		expect(result.pagination.page_count).toBe(0);
	});

	it('defaults the organizations route to the authenticated user', async () => {
		h.respond(emptyOrganizationsPage);

		await invoke(Users.list);

		expect(h.lastRequest().path).toBe('/v3/users/me/organizations/');
	});
});

describe('venues', () => {
	it('GETs one venue', async () => {
		h.respond(venue);

		const result = await invoke(Venues.get, { venue_id: '299411783' });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/venues/299411783/',
		});
		expect(result).toMatchObject({ name: 'Rakuten Crimson House' });
	});

	it("GETs an organization's venues", async () => {
		h.respond({ venues: [venue], pagination: { object_count: 1 } });

		await invoke(Venues.list, { organization_id: ORG });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/organizations/${ORG}/venues/`,
		});
	});

	it('POSTs a venue wrapped in `venue`', async () => {
		h.respond(venue);

		await invoke(Venues.create, {
			organization_id: ORG,
			venue: {
				name: 'Rakuten Crimson House',
				address: { address_1: '1-14-1 Tamagawa', country: 'JP' },
			},
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/organizations/${ORG}/venues/`,
		});
		expect(h.lastRequest().body).toEqual({
			venue: {
				name: 'Rakuten Crimson House',
				address: { address_1: '1-14-1 Tamagawa', country: 'JP' },
			},
		});
	});

	it('rejects a country that is not a 2-letter code', async () => {
		const caught = await h.failure<Error>(
			invoke(Venues.create, {
				organization_id: ORG,
				venue: { name: 'Place', address: { country: 'JPN' } },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('POSTs a venue update to the venue path', async () => {
		h.respond(venue);

		await invoke(Venues.update, {
			venue_id: '299411783',
			venue: { capacity: 200 },
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v3/venues/299411783/',
			body: { venue: { capacity: 200 } },
		});
	});
});

describe('discounts', () => {
	it('GETs one discount', async () => {
		h.respond({ id: '12345', code: 'CORSAIR20' });

		await invoke(Discounts.get, { discount_id: '12345' });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v3/discounts/12345/',
		});
	});

	it('POSTs a discount wrapped in `discount`', async () => {
		h.respond({ id: '12345', code: 'CORSAIR20' });

		await invoke(Discounts.create, {
			organization_id: ORG,
			discount: {
				code: 'CORSAIR20',
				type: 'coded',
				percent_off: '20',
				event_id: EVENT,
				quantity_available: 100,
			},
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/organizations/${ORG}/discounts/`,
		});
		expect(h.lastRequest().body).toEqual({
			discount: {
				code: 'CORSAIR20',
				type: 'coded',
				percent_off: '20',
				event_id: EVENT,
				quantity_available: 100,
			},
		});
	});

	it('rejects a discount with neither amount_off nor percent_off', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.create, {
				organization_id: ORG,
				discount: { code: 'CORSAIR', type: 'coded' },
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects both amount_off and percent_off', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.create, {
				organization_id: ORG,
				discount: {
					code: 'CORSAIR',
					type: 'coded',
					amount_off: '10',
					percent_off: '20',
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a relative date that is not a multiple of 60 seconds', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.create, {
				organization_id: ORG,
				discount: {
					code: 'CORSAIR',
					type: 'coded',
					percent_off: '20',
					start_date_relative: 90,
				},
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('GETs the discounts for one scope, filtering by exact code', async () => {
		h.respond({ discounts: [{ id: '12345' }] });

		await invoke(Discounts.list, {
			organization_id: ORG,
			scope: 'event',
			event_id: EVENT,
			code: 'CORSAIR20',
			order_by: 'code_asc',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/organizations/${ORG}/discounts/`,
		});
		expect(h.lastRequest().query).toEqual({
			scope: 'event',
			event_id: EVENT,
			code: 'CORSAIR20',
			order_by: 'code_asc',
		});
	});

	it('rejects event scope without an event_id, which Eventbrite 400s', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.list, {
				organization_id: ORG,
				scope: 'event',
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an event_id with multi_events scope', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.list, {
				organization_id: ORG,
				scope: 'multi_events',
				event_id: EVENT,
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects order_by without a code filter, which Eventbrite 400s', async () => {
		const caught = await h.failure<Error>(
			invoke(Discounts.list, {
				organization_id: ORG,
				scope: 'user',
				order_by: 'code_asc',
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('DELETEs a discount and reports success from the returned body', async () => {
		h.respond({ id: '12345', code: 'CORSAIR20' });

		const result = (await invoke(Discounts.remove, {
			discount_id: '12345',
		})) as { deleted: boolean; discount: { id: string } | null };

		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v3/discounts/12345/',
		});
		expect(result.deleted).toBe(true);
		expect(result.discount).toMatchObject({ id: '12345' });
	});
});

describe('webhooks', () => {
	it("GETs an organization's webhook subscriptions", async () => {
		h.respond(webhooksPage);

		const result = (await invoke(Webhooks.list, {
			organization_id: ORG,
		})) as { webhooks: Array<{ id: string }> };

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/organizations/${ORG}/webhooks/`,
		});
		expect(result.webhooks[0]?.id).toBe('2006536');
	});

	it('POSTs the subscription bare with actions joined into a string', async () => {
		h.respond({
			id: '2006536',
			actions: ['event.created', 'order.placed'],
			user_id: ORG,
		});

		await invoke(Webhooks.create, {
			organization_id: ORG,
			endpoint_url: 'https://myawesomeapp.com/webhook',
			actions: ['event.created', 'order.placed'],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/organizations/${ORG}/webhooks/`,
		});
		// No `webhook` wrapper: this route rejects it as an unknown parameter.
		expect(h.lastRequest().body).toEqual({
			endpoint_url: 'https://myawesomeapp.com/webhook',
			actions: 'event.created,order.placed',
		});
	});

	it('rejects an endpoint that is not a URL', async () => {
		const caught = await h.failure<Error>(
			invoke(Webhooks.create, {
				organization_id: ORG,
				endpoint_url: 'not-a-url',
				actions: ['event.created'],
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an action Eventbrite does not emit', async () => {
		const caught = await h.failure<Error>(
			invoke(Webhooks.create, {
				organization_id: ORG,
				endpoint_url: 'https://myawesomeapp.com/webhook',
				actions: ['attendee.created'],
			}),
		);

		expect(caught.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('DELETEs a webhook subscription', async () => {
		h.respond({});

		const result = (await invoke(Webhooks.remove, {
			webhook_id: '2006536',
		})) as { deleted: boolean };

		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v3/webhooks/2006536/',
		});
		expect(result.deleted).toBe(true);
	});
});

describe('error surfacing', () => {
	it('keeps the provider code on a documented 400 through the endpoint', async () => {
		h.respond(argumentsError, 400);

		const caught = await h.failure<EventbriteAPIError>(
			invoke(Events.create, {
				organization_id: ORG,
				event: {
					name: { html: 'Launch' },
					start: { timezone: 'UTC', utc: '2027-06-01T14:00:00Z' },
					end: { timezone: 'UTC', utc: '2027-06-01T18:00:00Z' },
					currency: 'USD',
				},
			}),
		);

		expect(caught.code).toBe('ARGUMENTS_ERROR');
		expect(caught.message).toContain('event.name.html');
	});
});
