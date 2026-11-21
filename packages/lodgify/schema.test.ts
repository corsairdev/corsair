import {
	LodgifyAvailabilityGetAllInputSchema,
	LodgifyAvailabilityGetAllOutputSchema,
	LodgifyAvailabilityGetInputSchema,
	LodgifyAvailabilityGetLegacyAllInputSchema,
	LodgifyAvailabilityGetLegacyPropertyInputSchema,
	LodgifyAvailabilityGetLegacyRoomTypeInputSchema,
	LodgifyAvailabilityGetOutputSchema,
	LodgifyAvailabilityGetRoomTypeInputSchema,
	LodgifyAvailabilityGetRoomTypeOutputSchema,
	LodgifyAvailabilityLegacyOutputSchema,
	LodgifyAvailabilitySetInputSchema,
	LodgifyAvailabilitySetOutputSchema,
	LodgifyChannelInventoryInputSchema,
	LodgifyChannelInventoryOutputSchema,
	LodgifyCountriesListInputSchema,
	LodgifyCountriesListOutputSchema,
	LodgifyCountryGetInputSchema,
	LodgifyCountryGetOutputSchema,
	LodgifyCurrenciesListInputSchema,
	LodgifyCurrenciesListOutputSchema,
	LodgifyCurrencyGetInputSchema,
	LodgifyCurrencyGetOutputSchema,
	LodgifyLegacyBookingQuoteSchema,
	LodgifyLegacyQuoteInputSchema,
	LodgifyLegacyQuoteOutputSchema,
	LodgifyMessagesListInputSchema,
	LodgifyMessagesListOutputSchema,
	LodgifyMessagesSendInputSchema,
	LodgifyMessagesSendOutputSchema,
	LodgifyPropertiesGetAddonsInputSchema,
	LodgifyPropertiesGetAddonsOutputSchema,
	LodgifyPropertiesGetDeletedInputSchema,
	LodgifyPropertiesGetDeletedOutputSchema,
	LodgifyPropertiesGetInputSchema,
	LodgifyPropertiesGetOutputSchema,
	LodgifyPropertiesGetPaymentsInputSchema,
	LodgifyPropertiesGetPaymentsOutputSchema,
	LodgifyPropertiesGetRoomsInputSchema,
	LodgifyPropertiesGetRoomsOutputSchema,
	LodgifyPropertiesGetRoomV1InputSchema,
	LodgifyPropertiesGetRoomV1OutputSchema,
	LodgifyPropertiesGetV1InputSchema,
	LodgifyPropertiesGetV1OutputSchema,
	LodgifyPropertiesListInputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyPropertiesListV1InputSchema,
	LodgifyPropertiesListV1OutputSchema,
	LodgifyQuotesCalculateInputSchema,
	LodgifyQuotesCalculateOutputSchema,
	LodgifyRatesCalendarInputSchema,
	LodgifyRatesCalendarOutputSchema,
	LodgifyRatesCalendarSimpleOutputSchema,
	LodgifyRatesSettingsInputSchema,
	LodgifyRatesSettingsOutputSchema,
	LodgifyRateUpdateInputSchema,
	LodgifyRateUpdateOutputSchema,
	LodgifyReservationsBatchInputSchema,
	LodgifyReservationsBatchOutputSchema,
	LodgifyReservationsCheckInOutInputSchema,
	LodgifyReservationsCheckInOutOutputSchema,
	LodgifyReservationsCreateCallMeBackInputSchema,
	LodgifyReservationsCreateCallMeBackOutputSchema,
	LodgifyReservationsCreateEnquiryInputSchema,
	LodgifyReservationsCreateEnquiryOutputSchema,
	LodgifyReservationsCreateInputSchema,
	LodgifyReservationsCreateOutputSchema,
	LodgifyReservationsCreateQuoteInputSchema,
	LodgifyReservationsCreateQuoteOutputSchema,
	LodgifyReservationsGetBookingV1InputSchema,
	LodgifyReservationsGetBookingV1OutputSchema,
	LodgifyReservationsGetEnquiryInputSchema,
	LodgifyReservationsGetEnquiryOutputSchema,
	LodgifyReservationsGetExternalBookingsInputSchema,
	LodgifyReservationsGetExternalBookingsOutputSchema,
	LodgifyReservationsGetInputSchema,
	LodgifyReservationsGetOutputSchema,
	LodgifyReservationsGetPaymentLinkInputSchema,
	LodgifyReservationsGetPaymentLinkOutputSchema,
	LodgifyReservationsGetQuoteInputSchema,
	LodgifyReservationsGetQuoteOutputSchema,
	LodgifyReservationsInboxListInputSchema,
	LodgifyReservationsInboxListOutputSchema,
	LodgifyReservationsListInputSchema,
	LodgifyReservationsListOutputSchema,
	LodgifyReservationsSetBookingStatusInputSchema,
	LodgifyReservationsSetBookingStatusOutputSchema,
	LodgifyReservationsUnreadCountInputSchema,
	LodgifyReservationsUnreadCountOutputSchema,
	LodgifyReservationsUpdateBookingInputSchema,
	LodgifyReservationsUpdateBookingOutputSchema,
	LodgifyReservationsUpdateKeyCodesInputSchema,
	LodgifyReservationsUpdateKeyCodesOutputSchema,
} from './endpoints/types';
import { LodgifySchema } from './schema';
import { lodgifyEntities } from './schema/database';

describe('Lodgify schema', () => {
	it('declares a semver version', () => {
		expect(LodgifySchema.version).toBeDefined();
		expect(LodgifySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(LodgifySchema.entities).toBe(lodgifyEntities);
		expect(LodgifySchema.entities).toEqual({});
	});
});

describe('Lodgify properties schemas', () => {
	it('validates properties.list input and output', () => {
		expect(
			LodgifyPropertiesListInputSchema.safeParse({
				page: 1,
				size: 50,
				wid: 7,
				updatedSince: '2026-01-01T00:00:00Z',
				includeCount: true,
				includeInOut: true,
			}).success,
		).toBe(true);

		expect(
			LodgifyPropertiesListInputSchema.safeParse({
				page: -1,
			}).success,
		).toBe(false);

		const validOutput = {
			count: 1,
			items: [
				{
					id: 101,
					name: 'Villa Sun',
					description: 'Beautiful villa',
					rooms: [{ id: 1, name: 'Room 1' }],
				},
			],
		};
		expect(
			LodgifyPropertiesListOutputSchema.safeParse(validOutput).success,
		).toBe(true);
		expect(
			LodgifyPropertiesListOutputSchema.safeParse({
				count: 1,
				items: [{ name: 'Missing required identifier' }],
			}).success,
		).toBe(false);
	});

	it('validates properties.get input and output', () => {
		expect(
			LodgifyPropertiesGetInputSchema.safeParse({
				id: 101,
				wid: 7,
				includeInOut: true,
			}).success,
		).toBe(true);
		expect(LodgifyPropertiesGetInputSchema.safeParse({ id: 0 }).success).toBe(
			false,
		);

		expect(
			LodgifyPropertiesGetOutputSchema.safeParse({
				id: 101,
				name: 'Mountain Cabin',
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetOutputSchema.safeParse({
				name: 'Mountain Cabin',
			}).success,
		).toBe(false);
	});

	it('validates properties.getRooms input and output', () => {
		expect(
			LodgifyPropertiesGetRoomsInputSchema.safeParse({ id: 101, wid: 7 })
				.success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetRoomsInputSchema.safeParse({ id: 'abc' }).success,
		).toBe(false);

		const validRooms = [
			{
				id: 201,
				name: 'Deluxe King',
				max_people: 2,
				bedrooms: 1,
			},
		];
		expect(
			LodgifyPropertiesGetRoomsOutputSchema.safeParse(validRooms).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetRoomsOutputSchema.safeParse([{ name: 'Missing id' }])
				.success,
		).toBe(false);
	});

	it('validates deleted properties, add-ons and payment settings', () => {
		expect(
			LodgifyPropertiesGetDeletedInputSchema.safeParse({
				deletedSince: '2026-01-01T00:00:00Z',
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetDeletedOutputSchema.safeParse([101, 102]).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetAddonsInputSchema.safeParse({
				id: 101,
				start: '2026-06-01T00:00:00Z',
				end: '2026-06-10T00:00:00Z',
				rid: 201,
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetAddonsOutputSchema.safeParse([
				{ id: 1, name: 'Cleaning' },
			]).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetPaymentsInputSchema.safeParse({ id: 101 }).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetPaymentsOutputSchema.safeParse([
				{ id: 1, payment_type: 'Card' },
			]).success,
		).toBe(true);
	});
});

describe('Lodgify reservations schemas', () => {
	it('validates reservations.list input and output', () => {
		expect(
			LodgifyReservationsListInputSchema.safeParse({
				page: 1,
				size: 20,
				stayFilter: 'Upcoming',
			}).success,
		).toBe(true);

		expect(
			LodgifyReservationsListInputSchema.safeParse({
				stayFilter: 'InvalidFilter',
			}).success,
		).toBe(false);

		const validOutput = {
			count: 1,
			items: [
				{
					id: 501,
					property_id: 101,
					status: 'Booked',
					arrival: '2026-06-01',
					guest: { name: 'Jane Doe', email: 'jane@example.com' },
				},
			],
		};
		expect(
			LodgifyReservationsListOutputSchema.safeParse(validOutput).success,
		).toBe(true);
	});

	it('validates reservations.get input and output', () => {
		expect(
			LodgifyReservationsGetInputSchema.safeParse({ id: 501 }).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetInputSchema.safeParse({ id: -1 }).success,
		).toBe(false);

		expect(
			LodgifyReservationsGetOutputSchema.safeParse({
				id: 501,
				status: 'Booked',
			}).success,
		).toBe(true);
	});

	it('validates reservations.create input and output', () => {
		const validInput = {
			property_id: 101,
			arrival: '2026-06-01T00:00:00Z',
			departure: '2026-06-07T00:00:00Z',
			rooms: [{ room_type_id: 201, guest_breakdown: { adults: 2 } }],
			guest: {
				guest_name: { first_name: 'Jane', last_name: 'Doe' },
				email: 'jane@example.com',
			},
			total: 1200,
			currency_code: 'USD',
		};
		expect(
			LodgifyReservationsCreateInputSchema.safeParse(validInput).success,
		).toBe(true);

		// Missing required departure
		expect(
			LodgifyReservationsCreateInputSchema.safeParse({
				property_id: 101,
				arrival: '2026-06-01T00:00:00Z',
			}).success,
		).toBe(false);

		expect(LodgifyReservationsCreateOutputSchema.safeParse(502).success).toBe(
			true,
		);
	});

	it('validates inbox and enquiry guest operations', () => {
		expect(
			LodgifyReservationsInboxListInputSchema.safeParse({
				limit: 50,
				offset: 0,
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsInboxListInputSchema.safeParse({ limit: 51 }).success,
		).toBe(false);
		expect(
			LodgifyReservationsInboxListOutputSchema.safeParse({
				total: 0,
				items: [],
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetEnquiryInputSchema.safeParse({ id: 501 }).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetEnquiryOutputSchema.safeParse({
				id: 501,
				guest: { email: 'guest@example.com' },
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateEnquiryInputSchema.safeParse({
				guest_breakdown: { adults: 1 },
				guest: { guest_name: { first_name: 'Guest' } },
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateEnquiryOutputSchema.safeParse(502).success,
		).toBe(true);
		expect(
			LodgifyReservationsUnreadCountInputSchema.safeParse({}).success,
		).toBe(true);
		expect(
			LodgifyReservationsUnreadCountOutputSchema.safeParse(3).success,
		).toBe(true);
	});
});

describe('Lodgify availability schemas', () => {
	it('validates availability.get input and output', () => {
		expect(
			LodgifyAvailabilityGetInputSchema.safeParse({
				propertyId: 101,
				from: '2026-06-01T00:00:00Z',
				to: '2026-06-10T00:00:00Z',
			}).success,
		).toBe(true);

		expect(
			LodgifyAvailabilityGetInputSchema.safeParse({
				propertyId: 0,
			}).success,
		).toBe(false);

		const validPeriods = [
			{
				property_id: 101,
				room_type_id: 201,
				periods: [
					{
						start: '2026-06-01T00:00:00Z',
						end: '2026-06-10T00:00:00Z',
						available: 1,
					},
				],
			},
		];
		expect(
			LodgifyAvailabilityGetOutputSchema.safeParse(validPeriods).success,
		).toBe(true);
	});

	it('validates all-property, room-type and update availability contracts', () => {
		const range = {
			from: '2026-06-01T00:00:00Z',
			to: '2026-06-10T00:00:00Z',
		};
		expect(LodgifyAvailabilityGetAllInputSchema.safeParse(range).success).toBe(
			true,
		);
		expect(LodgifyAvailabilityGetAllOutputSchema.safeParse([]).success).toBe(
			true,
		);
		expect(
			LodgifyAvailabilityGetRoomTypeInputSchema.safeParse({
				...range,
				propertyId: 101,
				roomTypeId: 201,
			}).success,
		).toBe(true);
		expect(
			LodgifyAvailabilityGetRoomTypeOutputSchema.safeParse([]).success,
		).toBe(true);
		expect(
			LodgifyAvailabilitySetInputSchema.safeParse({
				propertyId: 101,
				roomTypeId: 201,
				period_start: range.from,
				period_end: range.to,
				available: 2,
			}).success,
		).toBe(true);
		expect(
			LodgifyAvailabilitySetOutputSchema.safeParse(undefined).success,
		).toBe(true);
	});
});

describe('Lodgify quotes schemas', () => {
	it('validates quotes.calculate input and output', () => {
		const validInput = {
			propertyId: 101,
			arrival: '2026-06-01T00:00:00Z',
			departure: '2026-06-05T00:00:00Z',
			roomTypes: [{ id: 201, guest_breakdown: { adults: 2 } }],
		};
		expect(
			LodgifyQuotesCalculateInputSchema.safeParse(validInput).success,
		).toBe(true);

		expect(
			LodgifyQuotesCalculateInputSchema.safeParse({
				property_id: 101,
			}).success,
		).toBe(false);

		const validOutput = {
			total_including_vat: 900,
			total_excluding_vat: 800,
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
			amount_gross: 900,
			is_verification: false,
		};
		expect(
			LodgifyQuotesCalculateOutputSchema.safeParse([validOutput]).success,
		).toBe(true);
	});
});

describe('Lodgify messages schemas', () => {
	it('validates messages.list input and output', () => {
		expect(
			LodgifyMessagesListInputSchema.safeParse({
				threadGuid: '550e8400-e29b-41d4-a716-446655440000',
			}).success,
		).toBe(true);

		const validOutput = [
			{
				thread_uid: '550e8400-e29b-41d4-a716-446655440000',
				guest_name: 'Guest',
				guest_email: 'guest@example.com',
				last_message_date: '2026-06-01T00:00:00Z',
				is_read: true,
				messages: [
					{
						id: 1,
						subject: 'Hello',
						message: 'Hi there',
						date_created: '2026-06-01T00:00:00Z',
					},
				],
				is_closed: false,
			},
		];
		expect(LodgifyMessagesListOutputSchema.safeParse(validOutput).success).toBe(
			true,
		);
	});

	it('validates messages.send input and output', () => {
		const validInput = {
			message: 'Check-in is at 3 PM',
			inboxType: 'booking' as const,
			id: 501,
			type: 'Owner' as const,
			subject: 'Check-in Reminder',
		};
		expect(LodgifyMessagesSendInputSchema.safeParse(validInput).success).toBe(
			true,
		);

		// Missing message
		expect(
			LodgifyMessagesSendInputSchema.safeParse({
				inboxType: 'booking',
				id: 501,
			}).success,
		).toBe(false);

		expect(LodgifyMessagesSendOutputSchema.safeParse(undefined).success).toBe(
			true,
		);
	});
});

describe('Lodgify remaining documented REST schemas', () => {
	it('validates global, channel, and legacy property contracts strictly', () => {
		expect(LodgifyCountriesListInputSchema.safeParse({}).success).toBe(true);
		expect(
			LodgifyCountriesListOutputSchema.safeParse([
				{ code: 'US', name: 'United States' },
			]).success,
		).toBe(true);
		expect(LodgifyCountryGetInputSchema.safeParse({ code: 'US' }).success).toBe(
			true,
		);
		expect(
			LodgifyCountryGetOutputSchema.safeParse({ code: 'US', name: null })
				.success,
		).toBe(true);
		expect(LodgifyCurrenciesListInputSchema.safeParse({}).success).toBe(true);
		expect(
			LodgifyCurrenciesListOutputSchema.safeParse([
				{ id: 1, code: 'USD', decimal_places: 2 },
			]).success,
		).toBe(true);
		expect(
			LodgifyCurrencyGetInputSchema.safeParse({ code: 'USD' }).success,
		).toBe(true);
		expect(
			LodgifyCurrencyGetOutputSchema.safeParse({ id: 1, code: 'USD' }).success,
		).toBe(true);
		expect(LodgifyChannelInventoryInputSchema.safeParse({}).success).toBe(true);
		expect(
			LodgifyChannelInventoryOutputSchema.safeParse({
				name: 'Channel',
				properties: {
					property: [{ id: 101, room_types: { room_type: [{ id: 201 }] } }],
				},
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesListV1InputSchema.safeParse({ wid: 7 }).success,
		).toBe(true);
		expect(
			LodgifyPropertiesListV1OutputSchema.safeParse([
				{ id: 101, rooms: [{ id: 201 }] },
			]).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetV1InputSchema.safeParse({
				id: 101,
				maxDate: '2026-12-01T00:00:00Z',
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetV1OutputSchema.safeParse({
				id: 101,
				rooms: [{ id: 201, currency: { code: 'USD' } }],
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetRoomV1InputSchema.safeParse({
				id: 101,
				rid: 201,
				wid: 7,
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetRoomV1OutputSchema.safeParse({
				id: 201,
				amenities: {},
			}).success,
		).toBe(true);
		expect(
			LodgifyPropertiesGetRoomV1InputSchema.safeParse({
				id: 101,
				rid: 201,
				extra: true,
			}).success,
		).toBe(false);
	});

	it('validates legacy availability date filters and records', () => {
		const range = {
			periodStart: '2026-06-01T00:00:00Z',
			periodEnd: '2026-06-10T00:00:00Z',
			combineRoomTypes: true,
			bookingsOnly: false,
			includeBookingIds: true,
			modifiedSince: '2026-05-01T00:00:00Z',
		};
		expect(
			LodgifyAvailabilityGetLegacyAllInputSchema.safeParse(range).success,
		).toBe(true);
		expect(
			LodgifyAvailabilityGetLegacyPropertyInputSchema.safeParse({
				...range,
				propertyId: 101,
			}).success,
		).toBe(true);
		expect(
			LodgifyAvailabilityGetLegacyRoomTypeInputSchema.safeParse({
				...range,
				propertyId: 101,
				roomTypeId: 201,
			}).success,
		).toBe(true);
		expect(
			LodgifyAvailabilityLegacyOutputSchema.safeParse([
				{
					property_id: 101,
					room_type_id: 201,
					period_start: range.periodStart,
					period_end: range.periodEnd,
					available: 1,
					total_units: 1,
					is_available: true,
				},
			]).success,
		).toBe(true);
		expect(
			LodgifyAvailabilityGetLegacyAllInputSchema.safeParse({
				periodStart: '2026-06-01T00:00:00Z',
			}).success,
		).toBe(false);
	});

	it('validates reservation lifecycle, payment-link read, and check-in/out contracts', () => {
		expect(
			LodgifyReservationsGetBookingV1InputSchema.safeParse({ id: 501 }).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetBookingV1OutputSchema.safeParse({
				id: 501,
				guest: { guest_name: { first_name: 'Guest' }, phone_numbers: [] },
				check_in: { time: '15:00', initiator: 'Owner' },
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsUpdateBookingInputSchema.safeParse({
				id: 501,
				booking: { status: 'Tentative' },
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsUpdateBookingInputSchema.safeParse({
				id: 501,
				booking: { undocumented: true },
			}).success,
		).toBe(false);
		expect(
			LodgifyReservationsUpdateBookingOutputSchema.safeParse(undefined).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateCallMeBackInputSchema.safeParse({
				date: '2026-06-01',
				time: 15,
				guest_breakdown: { adults: 2 },
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateCallMeBackOutputSchema.safeParse(503).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateQuoteInputSchema.safeParse({
				id: 501,
				is_policy_active: true,
				add_ons: [{ add_on_id: 301, units: 1 }],
				room_types: [{ room_type_id: 201 }],
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsCreateQuoteOutputSchema.safeParse(504).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetQuoteInputSchema.safeParse({ id: 501 }).success,
		).toBe(true);
		expect(
			LodgifyLegacyBookingQuoteSchema.safeParse({
				id: 700,
				amount_gross: {},
				amount_net: {},
				room_type_items: [],
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetQuoteOutputSchema.safeParse({
				id: 700,
				amount_gross: {},
				amount_net: {},
				room_type_items: [],
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetPaymentLinkInputSchema.safeParse({ id: 501 })
				.success,
		).toBe(true);
		expect(
			LodgifyReservationsGetPaymentLinkOutputSchema.safeParse({
				url: 'https://pay.example.test/link',
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsSetBookingStatusInputSchema.safeParse({
				id: 501,
				requestPayment: false,
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsSetBookingStatusOutputSchema.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			LodgifyReservationsCheckInOutInputSchema.safeParse({
				id: 501,
				time: '15:00',
			}).success,
		).toBe(true);
		expect(
			LodgifyReservationsCheckInOutOutputSchema.safeParse(undefined).success,
		).toBe(true);
	});

	it('validates batch actions, external bookings, key codes, and legacy quote schemas', () => {
		const batch = [
			{ id: 501, type: 'Booking' },
			{ id: 502, type: 'Enquiry' },
		];
		expect(LodgifyReservationsBatchInputSchema.safeParse(batch).success).toBe(
			true,
		);
		expect(
			LodgifyReservationsBatchInputSchema.safeParse([
				{ id: 0, type: 'Booking' },
			]).success,
		).toBe(false);
		expect(
			LodgifyReservationsBatchOutputSchema.safeParse(undefined).success,
		).toBe(true);
		expect(
			LodgifyReservationsGetExternalBookingsInputSchema.safeParse({ id: 501 })
				.success,
		).toBe(true);
		expect(
			LodgifyReservationsGetExternalBookingsOutputSchema.safeParse({
				external_bookings: [
					{ created_at: '2026-06-01T00:00:00Z', content: null },
				],
			}).success,
		).toBe(true);
		const rooms = [{ room_type_id: 201, key_code: '5892' }];
		expect(
			LodgifyReservationsUpdateKeyCodesInputSchema.safeParse({ id: 501, rooms })
				.success,
		).toBe(true);
		expect(
			LodgifyReservationsUpdateKeyCodesOutputSchema.safeParse({ rooms })
				.success,
		).toBe(true);
		expect(
			LodgifyLegacyQuoteInputSchema.safeParse({
				propertyId: 101,
				arrival: '2026-06-01T00:00:00Z',
				departure: '2026-06-05T00:00:00Z',
				roomTypes: [{ id: 201, guest_breakdown: { adults: 2 } }],
			}).success,
		).toBe(true);
		expect(
			LodgifyLegacyQuoteOutputSchema.safeParse([
				{
					rate_type: { name: 'Standard' },
					currency: 'USD',
					rent: 800,
					fees: [{ type: 'Cleaning', value: 100 }],
					total: 900,
				},
			]).success,
		).toBe(true);
	});
});

describe('Lodgify rate schemas', () => {
	it('validates rate calendar and update inputs/outputs', () => {
		expect(
			LodgifyRatesCalendarInputSchema.safeParse({
				houseId: 101,
				roomTypeId: 201,
				startDate: '2026-06-01',
				endDate: '2026-06-10',
			}).success,
		).toBe(true);
		expect(
			LodgifyRatesCalendarOutputSchema.safeParse({
				calendar_items: [{ date: '2026-06-01', is_default: false, prices: [] }],
				rate_settings: { bookability: 0 },
			}).success,
		).toBe(true);
		expect(
			LodgifyRatesCalendarSimpleOutputSchema.safeParse([
				{
					date: '2026-06-01',
					is_default: false,
					prices: [{ min_stay: 2, max_stay: 10, price_per_day: {} }],
				},
			]).success,
		).toBe(true);
		expect(
			LodgifyRateUpdateInputSchema.safeParse({
				property_id: 101,
				room_type_id: 201,
				rates: [
					{
						is_default: true,
						price_per_day: 150,
						min_stay: 2,
						max_stay: 10,
						price_per_additional_guest: 0,
						additional_guests_starts_from: 2,
					},
				],
			}).success,
		).toBe(true);
		expect(LodgifyRateUpdateOutputSchema.safeParse(true).success).toBe(true);
		expect(
			LodgifyRatesSettingsInputSchema.safeParse({ houseId: 101 }).success,
		).toBe(true);
		expect(
			LodgifyRatesSettingsOutputSchema.safeParse({ bookability: 0 }).success,
		).toBe(true);
	});
});
