import type { EventzillaContext } from './index';
import { eventzilla } from './index';
import {
	categoriesFixture,
	checkinFixture,
	checkinRevertedFixture,
	checkinUnknownBarcodeFixture,
	checkoutConfirmedFixture,
	checkoutCreatedFixture,
	checkoutPrepareFixture,
	eventListFixture,
	orderCancelledFixture,
	orderConfirmedFixture,
	salesToggledFixture,
	singleEventFixture,
	ticketTypeFixture,
	ticketTypesFixture,
	transactionLookupFixture,
	transactionsFixture,
	usersFixture,
} from './test-fixtures';

const API_KEY = 'ez-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

type Logged = { accountIdRequested: boolean };

function makeContext(logged: Logged) {
	// Safe: the endpoints read `key` and the log path reads `$getAccountId` and
	// `database`. The log writer tolerates a missing database (it warns and
	// returns null), so it is left undefined and only the account lookup is
	// asserted. The real context is exercised in integration.test.ts.
	const ctx = {
		key: API_KEY,
		$getAccountId: jest.fn(async () => {
			logged.accountIdRequested = true;
			return 'account-1';
		}),
	} as const;
	// unknown: only `key` and the log path's two members are read; the endpoint
	// code never touches the rest of the context. integration.test.ts runs the
	// same endpoints against a real context.
	return ctx as unknown as EventzillaContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = eventzilla({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

/**
 * Invokes one endpoint with a minimal context. `In` is the endpoint's input type
 * and `Out` its parsed output, so an assertion on the result is checked against
 * the real schema shape rather than a cast.
 */
async function run<In, Out>(
	input: In,
	fn: (ctx: EventzillaContext, input: In) => Promise<Out>,
) {
	const logged: Logged = { accountIdRequested: false };
	const ctx = makeContext(logged);
	const result = await fn(ctx, input);
	return { result, logged };
}

describe('event endpoints', () => {
	it('events.list GETs /events with status, category and paging', async () => {
		respond(eventListFixture);

		const { result, logged } = await run(
			{ status: 'live', category: 'Business', offset: 20, limit: 5 },
			endpoints.events.list,
		);

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events');
		expect(parsed.searchParams.get('status')).toBe('live');
		expect(parsed.searchParams.get('category')).toBe('Business');
		expect(parsed.searchParams.get('offset')).toBe('20');
		expect(parsed.searchParams.get('limit')).toBe('5');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(result.events).toHaveLength(1);
		expect(logged.accountIdRequested).toBe(true);
	});

	it('events.list omits paging and filters the caller did not ask for', async () => {
		respond(eventListFixture);

		await run({}, endpoints.events.list);

		const { parsed } = lastCall();
		expect(parsed.searchParams.toString()).toBe('');
	});

	it('events.list derives next_offset from pagination', async () => {
		respond({
			pagination: [{ offset: 0, limit: 1, total: 50 }],
			events: eventListFixture.events,
		});

		const { result } = await run({ limit: 1 }, endpoints.events.list);

		expect((result as { next_offset: number | null }).next_offset).toBe(1);
	});

	it('events.list answers null next_offset on the last page', async () => {
		respond({
			pagination: [{ offset: 0, limit: 20, total: 1 }],
			events: eventListFixture.events,
		});

		const { result } = await run({}, endpoints.events.list);

		expect((result as { next_offset: number | null }).next_offset).toBeNull();
	});

	it('events.get GETs /events/{id}', async () => {
		respond(singleEventFixture);

		const { result } = await run({ eventid: 2138988852 }, endpoints.events.get);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events/2138988852');
		expect(result.events).toHaveLength(1);
	});

	it('events.transactions GETs the event transactions with paging', async () => {
		respond(transactionsFixture);

		const { result } = await run(
			{ eventid: 2138988852, offset: 0, limit: 10 },
			endpoints.events.transactions,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events/2138988852/transactions');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(result.transactions).toHaveLength(1);
	});

	it('events.attendees GETs the attendee list with no query', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					attendees: [
						{
							first_name: 'Amelia',
							is_attended: 'No',
							bar_code: 'EZ1',
						},
					],
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const { result } = await run(
			{ eventid: 2138988852 },
			endpoints.events.attendees,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events/2138988852/attendees');
		expect(parsed.searchParams.toString()).toBe('');
		const rows = result.attendees;
		expect(rows[0]?.attended).toBe(false);
	});

	it('events.attendees keeps is_attended as sent beside the derived flag', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					attendees: [{ is_attended: 'Yes', bar_code: 'EZ2' }],
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const { result } = await run({ eventid: 1 }, endpoints.events.attendees);

		const row = result.attendees[0];
		expect(row?.is_attended).toBe('Yes');
		expect(row?.attended).toBe(true);
	});
});

describe('ticket endpoints', () => {
	it('tickets.list GETs the event ticket types', async () => {
		respond(ticketTypesFixture);

		const { result } = await run(
			{ eventid: 2138988852 },
			endpoints.tickets.list,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events/2138988852/tickets');
		expect(result.tickets).toHaveLength(1);
	});

	it('tickets.create POSTs /events/{id}/ticket-types without the ids', async () => {
		respond(ticketTypeFixture, 201);

		await run(
			{
				eventid: 2138988852,
				ticket_type_name: 'Early bird admission',
				quantity_total: 150,
				ticket_type_description: 'Discounted admission.',
				sales_start_date: '2026-02-05',
				sales_start_time: '09:00',
				sales_end_date: '2026-04-20',
				sales_end_time: '23:00',
				limit_minimum: 1,
				limit_maximum: 10,
				is_visible: true,
				boxoffice_only: false,
			},
			endpoints.tickets.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/events/2138988852/ticket-types');
		expect(body.ticket_type_name).toBe('Early bird admission');
		// The event id names the path, never the body.
		expect(body).not.toHaveProperty('eventid');
		expect(body).not.toHaveProperty('ticket_type_id');
	});

	it('tickets.update PATCHes the ticket type and sends its id only in the path', async () => {
		respond(ticketTypeFixture);

		await run(
			{
				eventid: 2138988852,
				ticket_type_id: 2138120411,
				ticket_type_name: 'Early bird admission',
				quantity_total: 200,
				ticket_type_description: 'Discounted admission.',
				sales_start_date: '2026-02-05',
				sales_start_time: '09:00',
				sales_end_date: '2026-04-20',
				sales_end_time: '23:00',
				limit_minimum: 1,
				limit_maximum: 10,
				is_visible: true,
				boxoffice_only: false,
			},
			endpoints.tickets.update,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PATCH');
		expect(parsed.pathname).toBe(
			'/api/v2/events/2138988852/ticket-types/2138120411',
		);
		expect(body.quantity_total).toBe(200);
		expect(body).not.toHaveProperty('ticket_type_id');
		expect(body).not.toHaveProperty('eventid');
	});

	it('categories.list GETs /categories with no input', async () => {
		respond(categoriesFixture);

		const { result } = await run({}, endpoints.categories.list);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/categories');
		expect(result.categories).toHaveLength(4);
	});

	it('users.list GETs /users with paging', async () => {
		respond(usersFixture);

		const { result } = await run(
			{ offset: 0, limit: 20 },
			endpoints.users.list,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/users');
		expect(parsed.searchParams.get('limit')).toBe('20');
		expect(result.users).toHaveLength(1);
	});

	it('users.get GETs /users/{id}', async () => {
		respond({ user: usersFixture.users });

		const { result } = await run({ userid: 2130004479 }, endpoints.users.get);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/users/2130004479');
		expect(result.user).toHaveLength(1);
	});

	it('transactions.get GETs a reference number as one segment', async () => {
		respond(transactionLookupFixture);

		const { result } = await run(
			{ identifier: '20260520145-178028' },
			endpoints.transactions.get,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/transactions/20260520145-178028');
		expect(result.transaction).toHaveLength(1);
	});

	it('transactions.get sends a numeric checkout id unchanged', async () => {
		respond(transactionLookupFixture);

		await run({ identifier: '2138868785' }, endpoints.transactions.get);

		expect(lastCall().parsed.pathname).toBe('/api/v2/transactions/2138868785');
	});
});

describe('order and sales endpoints', () => {
	it('orders.cancel POSTs the checkout id, event id and comments', async () => {
		respond(orderCancelledFixture);

		await run(
			{
				checkout_id: 21388601015,
				eventid: 2138988852,
				comments: 'Cancelled at buyer request.',
			},
			endpoints.orders.cancel,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/events/order/cancel');
		expect(body).toEqual({
			checkout_id: 21388601015,
			eventid: 2138988852,
			comments: 'Cancelled at buyer request.',
		});
	});

	it('orders.confirm POSTs and leaves sendemail out when unset', async () => {
		respond(orderConfirmedFixture);

		await run(
			{
				checkout_id: 21388601015,
				eventid: 2138988852,
				comments: 'Confirmed by organizer.',
			},
			endpoints.orders.confirm,
		);

		const { body } = lastCall();
		expect(body.orderconfirm ?? body.checkout_id).toBeDefined();
		expect(body).not.toHaveProperty('sendemail');
	});

	it('orders.confirm sends sendemail false rather than dropping it', async () => {
		respond(orderConfirmedFixture);

		await run(
			{
				checkout_id: 1,
				eventid: 2,
				comments: 'no email',
				sendemail: false,
			},
			endpoints.orders.confirm,
		);

		expect(lastCall().body.sendemail).toBe(false);
	});

	it('sales.toggle POSTs the boolean status, not a string', async () => {
		respond(salesToggledFixture);

		await run({ eventid: 2138988852, status: true }, endpoints.sales.toggle);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/events/togglesales');
		expect(body.status).toBe(true);
		expect(typeof body.status).toBe('boolean');
	});
});

describe('checkout endpoints', () => {
	it('checkout.prepare GETs eventid and dateid as two segments', async () => {
		respond(checkoutPrepareFixture);

		await run(
			{ eventid: 2138988852, dateid: 2138985706 },
			endpoints.checkout.prepare,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe(
			'/api/v2/checkout/prepare/2138988852/2138985706',
		);
	});

	it('checkout.create POSTs the ticket types and discount code', async () => {
		respond(checkoutCreatedFixture);

		await run(
			{
				eventid: 2138988852,
				eventdateid: 2138985706,
				ticket_types: [{ ticket_type_id: 2138120411, quantity: 2 }],
				discount_code: 'SAAS20',
			},
			endpoints.checkout.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/checkout/create');
		expect(body.ticket_types).toEqual([
			{ ticket_type_id: 2138120411, quantity: 2 },
		]);
		expect(body.discount_code).toBe('SAAS20');
	});

	it('checkout.fillOrder POSTs buyer and ticket details', async () => {
		respond(checkoutCreatedFixture);

		await run(
			{
				eventid: 2138988852,
				eventdateid: 2138985706,
				checkout_id: 21388601015,
				buyerdetails: [
					{
						buyer_firstname: 'Amelia',
						buyer_lastname: 'Chen',
						buyer_email: 'amelia.chen@example.com',
					},
				],
				tickets: [
					{
						ticket_price_id: 1362622,
						first_name: 'Amelia',
						last_name: 'Chen',
						email: 'amelia.chen@example.com',
					},
				],
				payment_id: 2138979179,
			},
			endpoints.checkout.fillOrder,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/checkout/fillorder');
		expect(body.payment_id).toBe(2138979179);
		expect(body.tickets[0].ticket_price_id).toBe(1362622);
	});

	it('checkout.confirm POSTs the payment status', async () => {
		respond(checkoutConfirmedFixture);

		await run(
			{
				eventid: 2138988852,
				eventdateid: 2138985706,
				checkout_id: 21388601015,
				payment_status: 'success',
			},
			endpoints.checkout.confirm,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/checkout/confirm');
		expect(body.payment_status).toBe('success');
	});
});

describe('attendee endpoints', () => {
	it('attendees.get GETs /attendees/{id}', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					attendees: [{ id: 2139049165, is_attended: 'No', bar_code: 'EZ1' }],
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const { result } = await run(
			{ attendeeid: 2139049165 },
			endpoints.attendees.get,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/attendees/2139049165');
		expect(result.attendees[0]?.attended).toBe(false);
	});

	/**
	 * The route the docs name (`/attendee/checkin`) does not exist: it answers a
	 * 403 `Missing Authentication Token`. `/attendees/checkin` is the live one.
	 */
	it('attendees.checkin POSTs /attendees/checkin, not the documented path', async () => {
		respond(checkinFixture);

		await run(
			{ barcode: 'EZ202605200001', eventcheckin: true },
			endpoints.attendees.checkin,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/v2/attendees/checkin');
		expect(parsed.pathname).not.toBe('/api/v2/attendee/checkin');
		expect(body.eventcheckin).toBe(true);
		expect(typeof body.eventcheckin).toBe('boolean');
	});

	/**
	 * The P1: `checkedIn` has to be on the returned payload, not just the log,
	 * because Eventzilla answers HTTP 200 even when the check-in failed.
	 */
	it('attendees.checkin returns checkedIn on the response', async () => {
		respond(checkinFixture);

		const { result } = await run(
			{ barcode: 'EZ202605200001', eventcheckin: true },
			endpoints.attendees.checkin,
		);

		expect(result.checkedIn).toBe(true);
		expect(result.checkinstatus.status).toBe('Checkin');
	});

	it('attendees.checkin reports a failed check-in as checkedIn false', async () => {
		respond(checkinRevertedFixture);

		const { result } = await run(
			{ barcode: 'EZ202605200001', eventcheckin: true },
			endpoints.attendees.checkin,
		);

		expect(result.checkedIn).toBe(false);
	});

	it('attendees.checkin answers checkedIn null when the provider said nothing', async () => {
		respond(checkinUnknownBarcodeFixture);

		const { result } = await run(
			{ barcode: 'nope', eventcheckin: true },
			endpoints.attendees.checkin,
		);

		expect(result.checkedIn).toBeNull();
	});

	it('attendees.checkin sends a revert as the boolean false', async () => {
		respond({
			checkinstatus: { ...checkinFixture.checkinstatus, status: null },
		});

		await run(
			{ barcode: 'EZ202605200001', eventcheckin: false },
			endpoints.attendees.checkin,
		);

		expect(lastCall().body.eventcheckin).toBe(false);
	});
});

describe('auth', () => {
	it('sends the stored key on every operation', async () => {
		respond(eventListFixture);
		await run({}, endpoints.events.list);
		expect(lastCall().headers.get('x-api-key')).toBe(API_KEY);

		respond(salesToggledFixture);
		await run({ eventid: 1, status: true }, endpoints.sales.toggle);
		expect(lastCall().headers.get('x-api-key')).toBe(API_KEY);
	});
});

/**
 * `boxoffice_only`, `is_visible` and `allow_partial_payment` are documented as
 * a boolean or one of eight strings. The list is the provider's to extend, so a
 * spelling outside it must not fail the whole read, or lose the response of a
 * write that already happened.
 */
describe('boolean-like output fields', () => {
	it('tickets.list accepts a boolean string outside the documented list', async () => {
		respond({
			tickets: [
				{
					...ticketTypesFixture.tickets[0],
					boxoffice_only: 'TRUE',
					is_visible: 'Y',
					allow_partial_payment: '',
				},
			],
		});

		const { result } = await run({ eventid: 1 }, endpoints.tickets.list);

		expect(result.tickets[0]?.boxoffice_only).toBe('TRUE');
		expect(result.tickets[0]?.is_visible).toBe('Y');
	});

	it('tickets.create returns the created ticket type when a flag is spelled differently', async () => {
		respond({ ...ticketTypeFixture, boxoffice_only: 'FALSE', is_visible: '1' });

		const { result } = await run(
			{
				eventid: 1,
				ticket_type_name: 'General',
				quantity_total: 10,
				ticket_type_description: '',
				sales_start_date: '2026-02-05',
				sales_start_time: '09:00',
				sales_end_date: '2026-04-20',
				sales_end_time: '23:00',
				limit_minimum: 1,
				limit_maximum: 2,
				is_visible: true,
				boxoffice_only: false,
			},
			endpoints.tickets.create,
		);

		expect(result.ticket_type_id).toBe(ticketTypeFixture.ticket_type_id);
	});
});

/**
 * Eventzilla answers an empty list with HTTP 200 and only a message
 * (`{"message":"No events found"}` was captured live on /events). The client
 * lets every `No … found` body through as "not an error", so each list route
 * has to read it as an empty list: left alone it fails the output schema, and
 * an event nobody has registered for yet reads as a broken response.
 */
describe('the empty-list message on unpaged lists', () => {
	it('events.attendees reads it as no attendees', async () => {
		respond({ message: 'No attendees found' });

		const { result } = await run({ eventid: 1 }, endpoints.events.attendees);

		expect(result.attendees).toEqual([]);
		expect(result.message).toBe('No attendees found');
	});

	it('attendees.get reads it as no attendee', async () => {
		respond({ message: 'No attendees found' });

		const { result } = await run({ attendeeid: 1 }, endpoints.attendees.get);

		expect(result.attendees).toEqual([]);
	});

	it('tickets.list reads it as no ticket types', async () => {
		respond({ message: 'No tickets found' });

		const { result } = await run({ eventid: 1 }, endpoints.tickets.list);

		expect(result.tickets).toEqual([]);
		expect(result.message).toBe('No tickets found');
	});

	it('still rejects a payload that is neither a list nor the empty message', async () => {
		respond({ attendees: 'not an array' });

		await expect(
			run({ eventid: 1 }, endpoints.events.attendees),
		).rejects.toThrow();
	});
});
