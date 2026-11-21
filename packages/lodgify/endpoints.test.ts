import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Availability,
	Channels,
	Global,
	Messages,
	Properties,
	Quotes,
	Rates,
	Reservations,
} from './endpoints';
import type { LodgifyContext } from './index';
import {
	lodgifyEndpointMeta,
	lodgifyEndpointSchemas,
	lodgifyEndpointsNested,
} from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeLodgifyRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeLodgifyRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): LodgifyContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-lodgify-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-lodgify-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Lodgify endpoint registry sync', () => {
	it('keeps schemas, metadata and nested endpoint maps in sync', () => {
		const schemaKeys = Object.keys(lodgifyEndpointSchemas).sort();
		const metaKeys = Object.keys(lodgifyEndpointMeta).sort();

		expect(schemaKeys).toEqual(metaKeys);

		const nestedKeys: string[] = [];
		for (const [groupName, group] of Object.entries(lodgifyEndpointsNested)) {
			for (const actionName of Object.keys(group)) {
				nestedKeys.push(`${groupName}.${actionName}`);
			}
		}
		expect(nestedKeys.sort()).toEqual(schemaKeys);
	});
});

describe('properties endpoints', () => {
	it('global country and currency reference operations use documented v1 routes', async () => {
		mockedRequest.mockResolvedValueOnce([
			{ code: 'US', name: 'United States' },
		]);
		await Global.countriesList(ctx, {});
		expect(mockedRequest).toHaveBeenNthCalledWith(1, '/v1/countries', ctx.key, {
			method: 'GET',
		});

		mockedRequest.mockResolvedValueOnce({ code: 'US', name: 'United States' });
		await Global.countryGet(ctx, { code: 'US' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/countries/US',
			ctx.key,
			{
				method: 'GET',
			},
		);

		mockedRequest.mockResolvedValueOnce([
			{ id: 1, code: 'USD', decimal_places: 2 },
		]);
		await Global.currenciesList(ctx, {});
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/currencies',
			ctx.key,
			{
				method: 'GET',
			},
		);

		mockedRequest.mockResolvedValueOnce({ id: 1, code: 'USD' });
		await Global.currencyGet(ctx, { code: 'USD' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			4,
			'/v1/currencies/USD',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('channels.inventory parses Lodgify channel mapping JSON', async () => {
		mockedRequest.mockResolvedValue({
			name: 'Channel',
			properties: {
				property: [{ id: 101, room_types: { room_type: [{ id: 201 }] } }],
			},
		});
		await Channels.inventory(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/v1/channel/xml', ctx.key, {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.channels.inventory',
			{ propertyCount: 1 },
			'completed',
		);
	});

	it('properties.list sends query parameters and returns property list', async () => {
		const mockResponse = {
			count: 1,
			items: [
				{
					id: 101,
					name: 'Seaside Villa',
					city: 'Miami',
					country_code: 'US',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Properties.list(ctx, {
			page: 1,
			size: 10,
			wid: 7,
			updatedSince: '2026-01-01T00:00:00Z',
			includeCount: true,
			includeInOut: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/properties', ctx.key, {
			method: 'GET',
			query: {
				page: 1,
				size: 10,
				wid: 7,
				updatedSince: '2026-01-01T00:00:00Z',
				includeCount: true,
				includeInOut: true,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.properties.list',
			{ count: 1 },
			'completed',
		);
	});

	it('legacy v1 property endpoints preserve their route-specific query contracts', async () => {
		mockedRequest.mockResolvedValueOnce([{ id: 101, name: 'Rental' }]);
		await Properties.listV1(ctx, { wid: 7 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/properties',
			ctx.key,
			{
				method: 'GET',
				query: { wid: 7 },
			},
		);

		mockedRequest.mockResolvedValueOnce({ id: 101, name: 'Rental' });
		await Properties.getV1(ctx, {
			id: 101,
			maxDate: '2026-12-01T00:00:00Z',
			wid: 7,
		});
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/properties/101',
			ctx.key,
			{
				method: 'GET',
				query: { maxDate: '2026-12-01T00:00:00Z', wid: 7 },
			},
		);

		mockedRequest.mockResolvedValueOnce({ id: 201, name: 'Bedroom' });
		await Properties.getRoomV1(ctx, { id: 101, rid: 201, wid: 7 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/properties/101/rooms/201',
			ctx.key,
			{ method: 'GET', query: { wid: 7 } },
		);
	});

	it('properties.get requests specific property by ID', async () => {
		const mockResponse = {
			id: 101,
			name: 'Seaside Villa',
			city: 'Miami',
			country_code: 'US',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Properties.get(ctx, {
			id: 101,
			wid: 7,
			includeInOut: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/properties/101', ctx.key, {
			method: 'GET',
			query: { wid: 7, includeInOut: true },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.properties.get',
			{ propertyId: 101 },
			'completed',
		);
	});

	it('properties.getRooms requests rooms for a property', async () => {
		const mockResponse = [
			{
				id: 201,
				name: 'Master Suite',
				max_people: 2,
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Properties.getRooms(ctx, { id: 101, wid: 7 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/properties/101/rooms',
			ctx.key,
			{
				method: 'GET',
				query: { wid: 7 },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.properties.getRooms',
			{ propertyId: 101, count: 1 },
			'completed',
		);
	});

	it('properties.getDeleted forwards the documented deletion filter', async () => {
		mockedRequest.mockResolvedValue([101, 102]);
		await Properties.getDeleted(ctx, { deletedSince: '2026-01-01T00:00:00Z' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/deletedproperties',
			ctx.key,
			{
				method: 'GET',
				query: { deletedSince: '2026-01-01T00:00:00Z' },
			},
		);
	});

	it('properties.getAddons filters by property, stay dates and room', async () => {
		mockedRequest.mockResolvedValue([{ id: 1, name: 'Cleaning' }]);
		await Properties.getAddons(ctx, {
			id: 101,
			start: '2026-06-01T00:00:00Z',
			end: '2026-06-10T00:00:00Z',
			rid: 201,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/properties/101/rates/addons',
			ctx.key,
			{
				method: 'GET',
				query: {
					start: '2026-06-01T00:00:00Z',
					end: '2026-06-10T00:00:00Z',
					rid: 201,
				},
			},
		);
	});

	it('properties.getPayments retrieves documented payment settings', async () => {
		mockedRequest.mockResolvedValue([{ id: 1, payment_type: 'Card' }]);
		await Properties.getPayments(ctx, { id: 101 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/properties/101/payments',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});
});

describe('reservations endpoints', () => {
	it('reservations.list lists bookings with filters', async () => {
		const mockResponse = {
			count: 1,
			items: [
				{
					id: 501,
					property_id: 101,
					status: 'Booked',
					arrival: '2026-07-01',
					departure: '2026-07-07',
					total_amount: {},
					currency_code: 'USD',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Reservations.list(ctx, {
			page: 1,
			size: 25,
			stayFilter: 'Upcoming',
			includeCount: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/reservations/bookings',
			ctx.key,
			{
				method: 'GET',
				query: {
					page: 1,
					size: 25,
					stayFilter: 'Upcoming',
					includeCount: true,
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.reservations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('reservations.listInbox forwards v1 pagination and filters', async () => {
		mockedRequest.mockResolvedValue({
			total: 1,
			items: [{ id: 501, guest: { email: 'guest@example.com' } }],
		});
		const result = await Reservations.listInbox(ctx, {
			offset: 10,
			limit: 25,
			propertyId: 101,
			trash: false,
		});
		expect(result.total).toBe(1);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/reservation', ctx.key, {
			method: 'GET',
			query: { offset: 10, limit: 25, propertyId: 101, trash: false },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.reservations.listInbox',
			{ count: 1, total: 1 },
			'completed',
		);
	});

	it('reservations.get retrieves booking by ID', async () => {
		const mockResponse = {
			id: 501,
			property_id: 101,
			status: 'Booked',
			arrival: '2026-07-01',
			departure: '2026-07-07',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Reservations.get(ctx, { id: 501 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/reservations/bookings/501',
			ctx.key,
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.reservations.get',
			{ reservationId: 501 },
			'completed',
		);
	});

	it('reservations.create creates a new reservation and avoids logging PII', async () => {
		mockedRequest.mockResolvedValue(502);

		const input = {
			property_id: 101,
			arrival: '2026-08-01T00:00:00Z',
			departure: '2026-08-05T00:00:00Z',
			rooms: [{ room_type_id: 201, guest_breakdown: { adults: 2 } }],
			guest: {
				guest_name: { first_name: 'John', last_name: 'Doe' },
				email: 'john@example.com',
				phone: '+15555555555',
			},
		};

		const result = await Reservations.create(ctx, input);

		expect(result).toBe(502);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/booking',
			ctx.key,
			{
				method: 'POST',
				body: input,
				query: {},
			},
		);
		// Assert that guest PII is NOT passed into event logger
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.reservations.create',
			{ reservationId: 502, propertyId: 101 },
			'completed',
		);
	});

	it('reservations.createEnquiry supports guest details without logging them', async () => {
		mockedRequest.mockResolvedValue(503);
		const input = {
			guest_breakdown: { adults: 2 },
			property_id: 101,
			guest: { guest_name: { first_name: 'Jane' }, email: 'jane@example.com' },
		};
		await Reservations.createEnquiry(ctx, input);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/enquiry',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.reservations.createEnquiry',
			{ reservationId: 503, propertyId: 101 },
			'completed',
		);
	});

	it('reservations.getEnquiry loads a guest enquiry by ID', async () => {
		mockedRequest.mockResolvedValue({
			id: 504,
			guest: { email: 'guest@example.com' },
		});
		await Reservations.getEnquiry(ctx, { id: 504 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/enquiry/504',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('reservations.unreadCount returns the provider count', async () => {
		mockedRequest.mockResolvedValue(4);
		await Reservations.unreadCount(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/not_read',
			ctx.key,
			{
				method: 'GET',
			},
		);
	});

	it('legacy booking update, delete, call-back and quote creation use documented contracts', async () => {
		mockedRequest.mockResolvedValueOnce({
			id: 501,
			guest: { guest_name: { first_name: 'Guest' } },
		});
		await Reservations.getBookingV1(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/reservation/booking/501',
			ctx.key,
			{
				method: 'GET',
			},
		);

		const booking = { status: 'Tentative', note: 'Arrival details' };
		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.updateBooking(ctx, { id: 501, booking });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/reservation/booking/501',
			ctx.key,
			{
				method: 'PUT',
				body: booking,
			},
		);

		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.deleteBooking(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/reservation/booking/501',
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.deleteEnquiry(ctx, { id: 502 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			4,
			'/v1/reservation/enquiry/502',
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		const callMeBack = {
			date: '2026-06-01',
			time: 15,
			guest_breakdown: { adults: 2 },
			property_id: 101,
		};
		mockedRequest.mockResolvedValueOnce(503);
		await Reservations.createCallMeBack(ctx, callMeBack);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			5,
			'/v1/reservation/callmeback',
			ctx.key,
			{
				method: 'POST',
				body: callMeBack,
			},
		);

		const quote = {
			id: 501,
			is_policy_active: true,
			promotion_code: 'SUMMER',
			add_ons: [{ add_on_id: 301, units: 1 }],
			room_types: [{ room_type_id: 201 }],
		};
		mockedRequest.mockResolvedValueOnce(504);
		await Reservations.createQuote(ctx, quote);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			6,
			'/v1/reservation/booking/501/quote',
			ctx.key,
			{
				method: 'POST',
				body: {
					is_policy_active: true,
					promotion_code: 'SUMMER',
					add_ons: [{ add_on_id: 301, units: 1 }],
					room_types: [{ room_type_id: 201 }],
				},
			},
		);
	});

	it('retrieves v1 and v2 payment links without logging the returned URLs', async () => {
		mockedRequest.mockResolvedValueOnce({ url: 'https://pay.example.test/v1' });
		await Reservations.getPaymentLinkV1(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/reservation/booking/501/quote/paymentLink',
			ctx.key,
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce({ url: 'https://pay.example.test/v2' });
		await Reservations.getPaymentLink(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v2/reservations/bookings/501/quote/paymentLink',
			ctx.key,
			{ method: 'GET' },
		);
		expect(mockedLogEvent).not.toHaveBeenCalledWith(
			ctx,
			expect.any(String),
			expect.objectContaining({ url: expect.any(String) }),
			expect.any(String),
		);
	});

	it('reservations.getQuote retrieves strict v1 quote details', async () => {
		mockedRequest.mockResolvedValue({
			id: 700,
			amount_gross: {},
			amount_net: {},
			room_type_items: [],
		});
		await Reservations.getQuote(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/booking/501/quote',
			ctx.key,
			{ method: 'GET', query: undefined },
		);
	});

	it('routes booking and enquiry lifecycle operations, including requestPayment filters', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await Reservations.recoverBooking(ctx, { id: 501 });
		await Reservations.recoverEnquiry(ctx, { id: 502 });
		await Reservations.reopenBooking(ctx, { id: 501 });
		await Reservations.declineBooking(ctx, { id: 501 });
		await Reservations.tentativeBooking(ctx, { id: 501, requestPayment: true });
		await Reservations.bookBooking(ctx, { id: 501, requestPayment: false });
		await Reservations.declineEnquiry(ctx, { id: 502 });
		await Reservations.reopenEnquiry(ctx, { id: 502 });
		await Reservations.requestPayment(ctx, { id: 501 });
		expect(
			mockedRequest.mock.calls.map(([path, , options]) => [path, options]),
		).toEqual([
			[
				'/v1/reservation/booking/501/recover',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/enquiry/502/recover',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/booking/501/reopen',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/booking/501/decline',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/booking/501/tentative',
				{ method: 'PUT', query: { requestPayment: true } },
			],
			[
				'/v1/reservation/booking/501/book',
				{ method: 'PUT', query: { requestPayment: false } },
			],
			[
				'/v1/reservation/enquiry/502/decline',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/enquiry/502/reopen',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/booking/501/request_payment',
				{ method: 'PUT', query: undefined },
			],
		]);
	});

	it('marks replied state in individual and batch operations', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const batch = [
			{ id: 501, type: 'Booking' as const },
			{ id: 502, type: 'Enquiry' as const },
		];
		await Reservations.deleteMany(ctx, batch);
		await Reservations.markManyReplied(ctx, batch);
		await Reservations.markManyNotReplied(ctx, batch);
		await Reservations.markBookingReplied(ctx, { id: 501 });
		await Reservations.markEnquiryReplied(ctx, { id: 502 });
		await Reservations.markBookingNotReplied(ctx, { id: 501 });
		await Reservations.markEnquiryNotReplied(ctx, { id: 502 });
		expect(
			mockedRequest.mock.calls.map(([path, , options]) => [path, options]),
		).toEqual([
			['/v1/reservation/delete', { method: 'POST', body: batch }],
			['/v1/reservation/replied', { method: 'POST', body: batch }],
			['/v1/reservation/not_replied', { method: 'POST', body: batch }],
			[
				'/v1/reservation/booking/501/replied',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/enquiry/502/replied',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/booking/501/not_replied',
				{ method: 'PUT', query: undefined },
			],
			[
				'/v1/reservation/enquiry/502/not_replied',
				{ method: 'PUT', query: undefined },
			],
		]);
	});

	it('sets check-in/out, reads external bookings and updates key codes', async () => {
		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.checkInV1(ctx, { id: 501, time: '15:00' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/reservation/booking/501/checkin',
			ctx.key,
			{
				method: 'PUT',
				body: { time: '15:00' },
			},
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.checkOutV1(ctx, { id: 501, time: '11:00' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/reservation/booking/501/checkout',
			ctx.key,
			{
				method: 'PUT',
				body: { time: '11:00' },
			},
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.checkIn(ctx, { id: 501, time: '15:00' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/v2/reservations/bookings/501/checkin',
			ctx.key,
			{
				method: 'PUT',
				body: { time: '15:00' },
			},
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await Reservations.checkOut(ctx, { id: 501, time: '11:00' });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			4,
			'/v2/reservations/bookings/501/checkout',
			ctx.key,
			{
				method: 'PUT',
				body: { time: '11:00' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			external_bookings: [{ created_at: '2026-06-01T00:00:00Z' }],
		});
		await Reservations.getExternalBookings(ctx, { id: 501 });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			5,
			'/v2/reservations/bookings/501/externalBookings',
			ctx.key,
			{
				method: 'GET',
			},
		);

		const rooms = [{ room_type_id: 201, key_code: '5892' }];
		mockedRequest.mockResolvedValueOnce({ rooms });
		await Reservations.updateKeyCodes(ctx, { id: 501, rooms });
		expect(mockedRequest).toHaveBeenNthCalledWith(
			6,
			'/v2/reservations/bookings/501/keyCodes',
			ctx.key,
			{
				method: 'PUT',
				body: { rooms },
			},
		);
		expect(
			mockedLogEvent.mock.calls.some(([, , payload]) =>
				JSON.stringify(payload).includes('5892'),
			),
		).toBe(false);
	});
});

describe('availability endpoints', () => {
	it('availability.get retrieves availability calendar periods', async () => {
		const mockResponse = [
			{
				property_id: 101,
				room_type_id: 201,
				periods: [{ start: '2026-06-01', end: '2026-06-10', available: 1 }],
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Availability.get(ctx, {
			propertyId: 101,
			from: '2026-06-01T00:00:00Z',
			to: '2026-06-10T00:00:00Z',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/availability/101',
			ctx.key,
			{
				method: 'GET',
				query: {
					start: '2026-06-01T00:00:00Z',
					end: '2026-06-10T00:00:00Z',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.availability.get',
			{ propertyId: 101, count: 1 },
			'completed',
		);
	});

	it('availability.getAll retrieves calendars for all properties', async () => {
		mockedRequest.mockResolvedValue([
			{ property_id: 101, room_type_id: 201, periods: [] },
		]);
		const result = await Availability.getAll(ctx, {
			from: '2026-06-01T00:00:00Z',
			to: '2026-06-10T00:00:00Z',
			includeDetails: true,
		});
		expect(result).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/availability', ctx.key, {
			method: 'GET',
			query: {
				start: '2026-06-01T00:00:00Z',
				end: '2026-06-10T00:00:00Z',
				includeDetails: true,
			},
		});
	});

	it('availability.getRoomType retrieves a room-type calendar', async () => {
		mockedRequest.mockResolvedValue([
			{ property_id: 101, room_type_id: 201, periods: [] },
		]);
		await Availability.getRoomType(ctx, {
			propertyId: 101,
			roomTypeId: 201,
			from: '2026-06-01T00:00:00Z',
			to: '2026-06-10T00:00:00Z',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/availability/101/201',
			ctx.key,
			{
				method: 'GET',
				query: {
					start: '2026-06-01T00:00:00Z',
					end: '2026-06-10T00:00:00Z',
				},
			},
		);
	});

	it('availability.set updates available units for a date range', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await Availability.set(ctx, {
			propertyId: 101,
			roomTypeId: 201,
			period_start: '2026-06-01T00:00:00Z',
			period_end: '2026-06-10T00:00:00Z',
			available: 2,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/availability/101/201/set',
			ctx.key,
			{
				method: 'POST',
				body: {
					period_start: '2026-06-01T00:00:00Z',
					period_end: '2026-06-10T00:00:00Z',
					available: 2,
				},
			},
		);
	});

	it('legacy v1 availability reads map input options to documented query names', async () => {
		const period = {
			property_id: 101,
			room_type_id: 201,
			period_start: '2026-06-01T00:00:00Z',
			period_end: '2026-06-10T00:00:00Z',
			available: 1,
			total_units: 1,
			is_available: true,
		};
		mockedRequest.mockResolvedValueOnce([period]);
		await Availability.getLegacyAll(ctx, {
			periodStart: '2026-06-01T00:00:00Z',
			periodEnd: '2026-06-10T00:00:00Z',
			combineRoomTypes: true,
			bookingsOnly: false,
			includeBookingIds: true,
			modifiedSince: '2026-05-01T00:00:00Z',
		});
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/availability',
			ctx.key,
			{
				method: 'GET',
				query: {
					periodStart: '2026-06-01T00:00:00Z',
					periodEnd: '2026-06-10T00:00:00Z',
					CombineRoomTypes: true,
					BookingsOnly: false,
					IncludeBookingIds: true,
					ModifiedSince: '2026-05-01T00:00:00Z',
				},
			},
		);

		mockedRequest.mockResolvedValueOnce([period]);
		await Availability.getLegacyProperty(ctx, {
			propertyId: 101,
			periodStart: '2026-06-01T00:00:00Z',
			periodEnd: '2026-06-10T00:00:00Z',
		});
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/availability/101',
			ctx.key,
			{
				method: 'GET',
				query: {
					periodStart: '2026-06-01T00:00:00Z',
					periodEnd: '2026-06-10T00:00:00Z',
					CombineRoomTypes: undefined,
					BookingsOnly: undefined,
					IncludeBookingIds: undefined,
					ModifiedSince: undefined,
				},
			},
		);

		mockedRequest.mockResolvedValueOnce([period]);
		await Availability.getLegacyRoomType(ctx, {
			propertyId: 101,
			roomTypeId: 201,
			periodStart: '2026-06-01T00:00:00Z',
			periodEnd: '2026-06-10T00:00:00Z',
		});
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/availability/101/201',
			ctx.key,
			{
				method: 'GET',
				query: {
					periodStart: '2026-06-01T00:00:00Z',
					periodEnd: '2026-06-10T00:00:00Z',
					CombineRoomTypes: undefined,
					BookingsOnly: undefined,
					IncludeBookingIds: undefined,
					ModifiedSince: undefined,
				},
			},
		);
	});
});

describe('rates endpoints', () => {
	it('rates.calendar requests nightly rate details', async () => {
		mockedRequest.mockResolvedValue({ calendar_items: [], rate_settings: {} });
		await Rates.calendar(ctx, {
			houseId: 101,
			roomTypeId: 201,
			startDate: '2026-06-01',
			endDate: '2026-06-10',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/v2/rates/calendar', ctx.key, {
			method: 'GET',
			query: {
				houseId: 101,
				roomTypeId: 201,
				startDate: '2026-06-01',
				endDate: '2026-06-10',
			},
		});
	});

	it('rates.calendarSimple requests the documented v1 nightly calendar', async () => {
		mockedRequest.mockResolvedValue([
			{
				date: '2026-06-01',
				is_default: false,
				prices: [{ price_per_day: {} }],
			},
		]);
		await Rates.calendarSimple(ctx, {
			houseId: 101,
			roomTypeId: 201,
			startDate: '2026-06-01',
			endDate: '2026-06-10',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/v1/rates/calendar', ctx.key, {
			method: 'GET',
			query: {
				houseId: 101,
				roomTypeId: 201,
				startDate: '2026-06-01',
				endDate: '2026-06-10',
			},
		});
	});

	it('rates.settings requests settings for a house', async () => {
		mockedRequest.mockResolvedValue({ bookability: 0 });
		await Rates.settings(ctx, { houseId: 101 });
		expect(mockedRequest).toHaveBeenCalledWith('/v2/rates/settings', ctx.key, {
			method: 'GET',
			query: { houseId: 101 },
		});
	});

	it('rates.update posts the verified rate update contract', async () => {
		mockedRequest.mockResolvedValue(true);
		const body = {
			property_id: 101,
			room_type_id: 201,
			rates: [
				{
					is_default: true,
					price_per_day: 150,
					min_stay: 2,
					max_stay: 30,
					price_per_additional_guest: 10,
					additional_guests_starts_from: 3,
				},
			],
		};
		await Rates.update(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/rates/savewithoutavailability',
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
	});
});

describe('quotes endpoints', () => {
	it('quotes.calculate calculates stay quote', async () => {
		const mockResponse = [
			{
				total_including_vat: 950,
				total_excluding_vat: 800,
				total_vat: 150,
				property_id: 101,
				date_arrival: '2026-06-01T00:00:00Z',
				date_departure: '2026-06-05T00:00:00Z',
				currency_code: 'USD',
				room_types: [],
				add_ons: [],
				other_items: [],
				add_ons_subtotal: 0,
				security_deposit: 0,
				total_scheduled_payments: 0,
				total_to_collect_manually: 0,
				amount_gross: 950,
				is_verification: false,
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const input = {
			propertyId: 101,
			arrival: '2026-06-01T00:00:00Z',
			departure: '2026-06-05T00:00:00Z',
			roomTypes: [{ id: 201, guest_breakdown: { adults: 2 } }],
		};

		const result = await Quotes.calculate(ctx, input);

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/quote/101', ctx.key, {
			method: 'GET',
			query: {
				arrival: '2026-06-01T00:00:00Z',
				departure: '2026-06-05T00:00:00Z',
				'roomTypes[0].Id': 201,
				'roomTypes[0].guest_breakdown.adults': 2,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.quotes.calculate',
			{ propertyId: 101, count: 1 },
			'completed',
		);
	});

	it('quotes.calculateV1 encodes the documented legacy query format', async () => {
		mockedRequest.mockResolvedValue([
			{ rate_type: { name: 'Standard' }, total: 900 },
		]);
		await Quotes.calculateV1(ctx, {
			propertyId: 101,
			arrival: '2026-06-01T00:00:00Z',
			departure: '2026-06-05T00:00:00Z',
			roomTypes: [{ id: 201, guest_breakdown: { adults: 2 } }],
			addOns: [{ id: 301, units: 1 }],
			promotionCode: 'SUMMER',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/v1/quote/101', ctx.key, {
			method: 'GET',
			query: {
				arrival: '2026-06-01T00:00:00Z',
				departure: '2026-06-05T00:00:00Z',
				'roomTypes[0].Id': 201,
				'roomTypes[0].guest_breakdown.adults': 2,
				'addOns[0].Id': 301,
				'addOns[0].Units': 1,
				promotionCode: 'SUMMER',
			},
		});
	});
});

describe('messages endpoints', () => {
	it('messages.list retrieves guest messages', async () => {
		const mockResponse = [
			{
				thread_uid: '550e8400-e29b-41d4-a716-446655440000',
				guest_name: 'Guest',
				guest_email: 'guest@example.com',
				last_message_date: '2026-06-01T00:00:00Z',
				is_read: true,
				messages: [
					{
						id: 1,
						subject: 'Welcome',
						message: 'Hello',
						date_created: '2026-06-01T00:00:00Z',
					},
				],
				is_closed: false,
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const threadGuid = '550e8400-e29b-41d4-a716-446655440000';
		const result = await Messages.list(ctx, { threadGuid });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/v2/messaging/${threadGuid}`,
			ctx.key,
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.messages.list',
			{ count: 1 },
			'completed',
		);
	});

	it('messages.send sends message and avoids logging message content', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const input = {
			message: 'Check-in instructions: Key is in lockbox 1234.',
			inboxType: 'booking' as const,
			id: 501,
			type: 'Owner' as const,
			subject: 'Check-in details',
			send_notification: true,
		};

		const result = await Messages.send(ctx, input);

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/reservation/booking/501/messages',
			ctx.key,
			{
				method: 'POST',
				body: [
					{
						message: input.message,
						type: input.type,
						subject: input.subject,
						send_notification: true,
					},
				],
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.messages.send',
			{ inboxType: 'booking', reservationId: 501 },
			'completed',
		);
	});
});

describe('input validation failure prevents network requests', () => {
	it('rejects invalid property ID before calling network', async () => {
		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await Reflect.apply(Properties.get, undefined, [
			ctx,
			{ id: 'not-a-valid-number' },
		]).catch((e: unknown) => e);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid reservation create input before calling network', async () => {
		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await Reflect.apply(Reservations.create, undefined, [
			ctx,
			{ property_id: 101, arrival: '2026-06-01T00:00:00Z' },
		]).catch((e: unknown) => e);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
