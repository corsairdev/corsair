import { withNextOffset } from './endpoints/events';
import {
	checkinSucceeded,
	EventzillaEndpointInputSchemas as Inputs,
	isAttendedFlag,
	nextOffset,
	EventzillaEndpointOutputSchemas as Outputs,
	shapeAttendees,
} from './endpoints/types';
import {
	attendeesFixture,
	categoriesFixture,
	checkinFixture,
	checkinRevertedFixture,
	checkinUnknownBarcodeFixture,
	checkoutConfirmedFixture,
	checkoutCreatedFixture,
	checkoutPrepareFixture,
	eventListFixture,
	noEventsFixture,
	orderCancelledFixture,
	orderConfirmedFixture,
	salesToggledFixture,
	singleEventFixture,
	singleUserFixture,
	ticketTypeFixture,
	ticketTypesFixture,
	transactionLookupFixture,
	transactionsFixture,
	usersFixture,
} from './test-fixtures';

/**
 * Every output schema is parsed against the response the docs publish for it,
 * so a shape the schema has drifted from fails here rather than in production.
 */
describe('output schemas accept the documented responses', () => {
	/**
	 * The paged responses are parsed the way the endpoint builds them: the raw
	 * body plus the derived `next_offset`. Parsing the bare documented body would
	 * test a shape the endpoint never returns.
	 */
	const cases = [
		[
			'events.list',
			Outputs.eventsList,
			withNextOffset(eventListFixture, 'events'),
		],
		['events.get', Outputs.eventsGet, singleEventFixture],
		[
			'events.transactions',
			Outputs.eventsTransactions,
			withNextOffset(transactionsFixture, 'transactions'),
		],
		['tickets.list', Outputs.ticketsList, ticketTypesFixture],
		['tickets.create', Outputs.ticketsCreate, ticketTypeFixture],
		['tickets.update', Outputs.ticketsUpdate, ticketTypeFixture],
		['categories.list', Outputs.categoriesList, categoriesFixture],
		['users.list', Outputs.usersList, withNextOffset(usersFixture, 'users')],
		['users.get', Outputs.usersGet, singleUserFixture],
		['transactions.get', Outputs.transactionsGet, transactionLookupFixture],
		['checkout.prepare', Outputs.checkoutPrepare, checkoutPrepareFixture],
		['checkout.create', Outputs.checkoutCreate, checkoutCreatedFixture],
		['checkout.fillOrder', Outputs.checkoutFillOrder, checkoutCreatedFixture],
		['checkout.confirm', Outputs.checkoutConfirm, checkoutConfirmedFixture],
		[
			'attendees.checkin',
			Outputs.attendeesCheckin,
			// The endpoint derives `checkedIn` before parsing, so the fixture is
			// shaped the same way rather than parsed raw.
			{ ...checkinFixture, checkedIn: true },
		],
		['orders.cancel', Outputs.ordersCancel, orderCancelledFixture],
		['orders.confirm', Outputs.ordersConfirm, orderConfirmedFixture],
		['sales.toggle', Outputs.salesToggle, salesToggledFixture],
	] as const;

	for (const [name, schema, fixture] of cases) {
		it(`${name} parses its documented response`, () => {
			// unknown: the fixture is one of several unrelated shapes, narrowed by
			// the schema under test.
			// unknown: the fixtures are unrelated shapes, narrowed by the schema.
			// unknown: the fixtures are unrelated shapes, narrowed by the schema.
			const result = (
				schema as { safeParse: (v: unknown) => { success: boolean } }
			).safeParse(fixture);
			expect(result.success).toBe(true);
		});
	}

	it('attendees responses parse with the derived `attended` flag added', () => {
		const shaped = {
			attendees: attendeesFixture.attendees.map((row) => ({
				...row,
				attended: isAttendedFlag(row.is_attended),
			})),
		};
		expect(Outputs.eventsAttendees.safeParse(shaped).success).toBe(true);
		expect(Outputs.attendeesGet.safeParse(shaped).success).toBe(true);
	});
});

describe('output schemas reject wrong shapes', () => {
	it('rejects an event list whose `events` is a string', () => {
		const result = Outputs.eventsList.safeParse({
			pagination: [{ offset: 0, limit: 20, total: 1 }],
			events: 'not an array',
		});
		expect(result.success).toBe(false);
	});

	it('rejects a categories body that is a bare array', () => {
		expect(
			Outputs.categoriesList.safeParse([{ category: 'Business' }]).success,
		).toBe(false);
	});

	it('rejects a ticket whose `price` is an object', () => {
		const result = Outputs.ticketsList.safeParse({
			tickets: [{ id: 1, price: { amount: 99 } }],
		});
		expect(result.success).toBe(false);
	});

	it('requires `events` rather than treating a missing array as empty', () => {
		// `?? []` here would turn a wrong body into a convincing empty result.
		expect(Outputs.eventsGet.safeParse({}).success).toBe(false);
	});

	it('requires `categories` rather than treating a missing array as empty', () => {
		expect(Outputs.categoriesList.safeParse({}).success).toBe(false);
	});

	it('rejects an attendee whose derived flag is missing', () => {
		const result = Outputs.eventsAttendees.safeParse({
			attendees: [{ first_name: 'Amelia', is_attended: 'No' }],
		});
		expect(result.success).toBe(false);
	});
});

describe('accepts both forms the API sends for one field', () => {
	it('takes a price as a number or a currency string', () => {
		expect(
			Outputs.ticketsList.safeParse({ tickets: [{ id: 1, price: 99 }] })
				.success,
		).toBe(true);
		expect(
			Outputs.ticketsList.safeParse({
				tickets: [{ id: 1, price: 'USD 99.00' }],
			}).success,
		).toBe(true);
	});

	it('takes transaction comments as "" (a list) or as an object', () => {
		expect(
			Outputs.eventsTransactions.safeParse(
				withNextOffset(transactionsFixture, 'transactions'),
			).success,
		).toBe(true);
		expect(
			Outputs.eventsTransactions.safeParse(
				withNextOffset(
					{
						pagination: [{ offset: 0, limit: 20, total: 1 }],
						transactions: [{ checkout_id: 1, comments: { note: 'x' } }],
					},
					'transactions',
				),
			).success,
		).toBe(true);
	});

	it('takes is_visible as a boolean or as any string the provider sends', () => {
		// 'TRUE' and '' are outside the reference's eight spellings: an output
		// field must not fail the read over a spelling the provider adds.
		for (const value of [true, 'true', 'Yes', 'no', 'TRUE', '']) {
			expect(
				Outputs.ticketsList.safeParse({
					tickets: [{ id: 1, is_visible: value }],
				}).success,
			).toBe(true);
		}
		// Still a boolean or a string: another type is a malformed payload.
		expect(
			Outputs.ticketsList.safeParse({
				tickets: [{ id: 1, is_visible: { nested: true } }],
			}).success,
		).toBe(false);
	});

	it('takes a null field the provider sent as JSON null', () => {
		expect(
			Outputs.eventsList.safeParse(
				withNextOffset(
					{
						pagination: [{ offset: 0, limit: 20, total: 1 }],
						events: [
							{ id: 1, title: null, tickets_sold: null, show_remaining: null },
						],
					},
					'events',
				),
			).success,
		).toBe(true);
	});
});

describe('isAttendedFlag', () => {
	it('reads Yes and No', () => {
		expect(isAttendedFlag('Yes')).toBe(true);
		expect(isAttendedFlag('No')).toBe(false);
	});

	it('is case- and whitespace-insensitive', () => {
		expect(isAttendedFlag(' yes ')).toBe(true);
		expect(isAttendedFlag('NO')).toBe(false);
	});

	it('answers null rather than guessing', () => {
		expect(isAttendedFlag('Maybe')).toBeNull();
		expect(isAttendedFlag('')).toBeNull();
		expect(isAttendedFlag(null)).toBeNull();
		expect(isAttendedFlag(undefined)).toBeNull();
	});
});

describe('input schemas reject what the API would refuse', () => {
	it('rejects a non-positive event id', () => {
		expect(Inputs.eventsGet.safeParse({ eventid: 0 }).success).toBe(false);
		expect(Inputs.eventsGet.safeParse({ eventid: -1 }).success).toBe(false);
		expect(Inputs.eventsGet.safeParse({ eventid: 1.5 }).success).toBe(false);
	});

	it('accepts only the lowercase live status and rejects the capitalised form', () => {
		// Verified live: `status=Live` is rejected by the API even though the
		// event payload returns "status": "Live".
		expect(Inputs.eventsList.safeParse({ status: 'Live' }).success).toBe(false);
		expect(Inputs.eventsList.safeParse({ status: 'live' }).success).toBe(true);
		expect(Inputs.eventsList.safeParse({ status: 'draft' }).success).toBe(
			false,
		);
		expect(Inputs.eventsList.safeParse({ status: 'Cancelled' }).success).toBe(
			false,
		);
	});

	it('rejects a limit below 1 and a negative offset', () => {
		expect(Inputs.eventsList.safeParse({ limit: 0 }).success).toBe(false);
		expect(Inputs.eventsList.safeParse({ offset: -1 }).success).toBe(false);
	});

	it('rejects a ticket type whose maximum is below its minimum', () => {
		const base = {
			eventid: 1,
			ticket_type_name: 'Early bird',
			quantity_total: 100,
			ticket_type_description: 'Desc',
			sales_start_date: '2026-02-05',
			sales_start_time: '09:00',
			sales_end_date: '2026-04-20',
			sales_end_time: '23:00',
			limit_minimum: 5,
			limit_maximum: 2,
			is_visible: true,
			boxoffice_only: false,
		};
		const result = Inputs.ticketsCreate.safeParse(base);
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues[0]?.path).toEqual(['limit_maximum']);
	});

	it('rejects a quantity_total below the minimum order size', () => {
		const result = Inputs.ticketsCreate.safeParse({
			eventid: 1,
			ticket_type_name: 'Early bird',
			quantity_total: 2,
			ticket_type_description: 'Desc',
			sales_start_date: '2026-02-05',
			sales_start_time: '09:00',
			sales_end_date: '2026-04-20',
			sales_end_time: '23:00',
			limit_minimum: 5,
			limit_maximum: 10,
			is_visible: true,
			boxoffice_only: false,
		});
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.error.issues[0]?.path).toEqual(['quantity_total']);
	});

	it('requires the fields the reference marks required on a ticket type', () => {
		expect(Inputs.ticketsCreate.safeParse({ eventid: 1 }).success).toBe(false);
	});

	it('rejects two fill-order tickets sharing a ticket_price_id', () => {
		const result = Inputs.checkoutFillOrder.safeParse({
			eventid: 1,
			eventdateid: 2,
			checkout_id: 3,
			buyerdetails: [
				{
					buyer_firstname: 'A',
					buyer_lastname: 'B',
					buyer_email: 'a@example.com',
				},
			],
			tickets: [
				{
					ticket_price_id: 10,
					first_name: 'A',
					last_name: 'B',
					email: 'a@example.com',
				},
				{
					ticket_price_id: 10,
					first_name: 'C',
					last_name: 'D',
					email: 'c@example.com',
				},
			],
			payment_id: 4,
		});
		expect(result.success).toBe(false);
	});

	it('accepts distinct ticket_price_ids on a fill order', () => {
		expect(
			Inputs.checkoutFillOrder.safeParse({
				eventid: 1,
				eventdateid: 2,
				checkout_id: 3,
				buyerdetails: [
					{
						buyer_firstname: 'A',
						buyer_lastname: 'B',
						buyer_email: 'a@example.com',
					},
				],
				tickets: [
					{
						ticket_price_id: 10,
						first_name: 'A',
						last_name: 'B',
						email: 'a@example.com',
					},
					{
						ticket_price_id: 11,
						first_name: 'C',
						last_name: 'D',
						email: 'c@example.com',
					},
				],
				payment_id: 4,
			}).success,
		).toBe(true);
	});

	it('requires an empty checkout cart to be non-empty', () => {
		expect(
			Inputs.checkoutCreate.safeParse({
				eventid: 1,
				eventdateid: 2,
				ticket_types: [],
			}).success,
		).toBe(false);
	});

	it('requires a checkout quantity of at least 1', () => {
		expect(
			Inputs.checkoutCreate.safeParse({
				eventid: 1,
				eventdateid: 2,
				ticket_types: [{ ticket_type_id: 3, quantity: 0 }],
			}).success,
		).toBe(false);
	});

	it('requires comments on an order cancellation', () => {
		expect(
			Inputs.ordersCancel.safeParse({ checkout_id: 1, eventid: 2 }).success,
		).toBe(false);
		expect(
			Inputs.ordersCancel.safeParse({
				checkout_id: 1,
				eventid: 2,
				comments: '',
			}).success,
		).toBe(true);
	});

	it('rejects a string for the check-in flag', () => {
		// `"false"` is truthy to a naive backend, so only the boolean is offered.
		expect(
			Inputs.attendeesCheckin.safeParse({
				barcode: 'EZ1',
				eventcheckin: 'false',
			}).success,
		).toBe(false);
		expect(
			Inputs.attendeesCheckin.safeParse({
				barcode: 'EZ1',
				eventcheckin: false,
			}).success,
		).toBe(true);
	});

	it('rejects an empty barcode or identifier', () => {
		expect(
			Inputs.attendeesCheckin.safeParse({ barcode: '', eventcheckin: true })
				.success,
		).toBe(false);
		expect(Inputs.transactionsGet.safeParse({ identifier: '' }).success).toBe(
			false,
		);
	});
});

describe('nextOffset', () => {
	it('stops when the total is reached', () => {
		expect(nextOffset([{ offset: 0, limit: 20, total: 1 }], 1)).toBeNull();
	});

	it('advances while the total is not reached', () => {
		expect(nextOffset([{ offset: 0, limit: 20, total: 45 }], 20)).toBe(20);
	});

	it('treats a short page as the last when there is no total', () => {
		expect(nextOffset([{ offset: 0, limit: 20 }], 3)).toBeNull();
	});

	it('asks for another page when a page is full and no total is given', () => {
		expect(nextOffset([{ offset: 0, limit: 20 }], 20)).toBe(20);
	});

	it('stops on an empty page even when a total claims more', () => {
		expect(nextOffset([{ offset: 40, limit: 20, total: 45 }], 0)).toBeNull();
	});

	it('handles a missing pagination block', () => {
		expect(nextOffset(undefined, 5)).toBeNull();
		expect(nextOffset(undefined, 20)).toBe(20);
	});
});

/**
 * Shapes verified against the live API, each of which the reference documents
 * differently. These are the regressions worth catching.
 */
describe('live-verified response shapes', () => {
	it('users.get answers `user`, singular, not `users`', () => {
		expect(Outputs.usersGet.safeParse(singleUserFixture).success).toBe(true);
		// The documented (wrong) envelope must not be what the schema reads.
		expect(
			Outputs.usersGet.safeParse({ users: usersFixture.users }).success,
		).toBe(false);
	});

	it('check-in is nested under checkinstatus with null-able lowercased fields', () => {
		expect(
			Outputs.attendeesCheckin.safeParse({ ...checkinFixture, checkedIn: true })
				.success,
		).toBe(true);
		expect(
			Outputs.attendeesCheckin.safeParse({
				...checkinUnknownBarcodeFixture,
				checkedIn: null,
			}).success,
		).toBe(true);
		expect(
			Outputs.attendeesCheckin.safeParse({
				...checkinRevertedFixture,
				checkedIn: false,
			}).success,
		).toBe(true);
		// The documented flat shape is not what the API sends.
		expect(
			Outputs.attendeesCheckin.safeParse({
				first_name: 'A',
				status: 'Checkin',
				checkedIn: true,
			}).success,
		).toBe(false);
	});

	it('requires the derived checkedIn flag', () => {
		// Dropping it would silently reintroduce the P1: a caller reading only the
		// 200 would have no way to tell a failed check-in from a good one.
		expect(Outputs.attendeesCheckin.safeParse(checkinFixture).success).toBe(
			false,
		);
	});

	it('turns the empty-events message into an empty page', () => {
		const shaped = withNextOffset(noEventsFixture, 'events');
		const result = Outputs.eventsList.safeParse(shaped);
		expect(result.success).toBe(true);
		if (!result.success) return;
		expect(result.data.events).toEqual([]);
		expect(result.data.next_offset).toBeNull();
		expect(result.data.message).toBe('No events found');
	});
});

describe('checkinSucceeded', () => {
	it('reports a real check-in as having taken effect', () => {
		expect(checkinSucceeded('Checkin', true)).toBe(true);
	});

	it('reports a revert message as not checked in', () => {
		expect(checkinSucceeded('Already Reverted checked in', true)).toBe(false);
	});

	it('answers null when the provider said nothing', () => {
		expect(checkinSucceeded(null, true)).toBeNull();
		expect(checkinSucceeded('', true)).toBeNull();
		expect(checkinSucceeded(undefined, true)).toBeNull();
	});

	it('answers null for a status it does not recognise', () => {
		expect(checkinSucceeded('Pending', true)).toBeNull();
	});

	// Pinned because the output schema documents it: a revert is never reported
	// as `checkedIn: true`, whatever the status text says.
	it('never answers true for a revert', () => {
		for (const status of [
			'Checkin',
			'Reverted checked in',
			'Already Reverted checked in',
			'Checkout',
			null,
		]) {
			expect(checkinSucceeded(status, false)).not.toBe(true);
		}
	});

	it('documents the revert behaviour on the output field', () => {
		const description =
			Outputs.attendeesCheckin.shape.checkedIn.description ?? '';
		expect(description).toMatch(/revert/i);
		expect(description).not.toMatch(
			/this call is believed to have taken effect/,
		);
	});
});

describe('shapeAttendees', () => {
	it('adds the derived flag and keeps the provider row as sent', () => {
		const shaped = shapeAttendees({
			attendees: [{ bar_code: 'EZ1', is_attended: 'Yes' }],
		});
		const row = (shaped.attendees as Record<string, unknown>[])[0] ?? {};
		expect(row.bar_code).toBe('EZ1');
		expect(row.is_attended).toBe('Yes');
		expect(row.attended).toBe(true);
	});

	/**
	 * The P2: a malformed successful response must fail the schema, not read as
	 * "no attendees". Only a real array is reshaped.
	 */
	it('leaves a missing or non-array attendees value for the schema to reject', () => {
		expect(shapeAttendees({ message: 'nope' })).toEqual({ message: 'nope' });
		expect(shapeAttendees({ attendees: 'not an array' })).toEqual({
			attendees: 'not an array',
		});
		expect(Outputs.eventsAttendees.safeParse(shapeAttendees({})).success).toBe(
			false,
		);
	});

	it('leaves a non-object row in place so the schema rejects it', () => {
		const shaped = shapeAttendees({ attendees: ['bare text'] });
		expect((shaped.attendees as unknown[])[0]).toBe('bare text');
		expect(Outputs.eventsAttendees.safeParse(shaped).success).toBe(false);
	});
});
