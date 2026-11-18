import {
	LodgifyAvailabilityGetInputSchema,
	LodgifyAvailabilityGetOutputSchema,
	LodgifyMessagesListInputSchema,
	LodgifyMessagesListOutputSchema,
	LodgifyMessagesSendInputSchema,
	LodgifyMessagesSendOutputSchema,
	LodgifyPropertiesGetInputSchema,
	LodgifyPropertiesGetOutputSchema,
	LodgifyPropertiesGetRoomsInputSchema,
	LodgifyPropertiesGetRoomsOutputSchema,
	LodgifyPropertiesListInputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyQuotesCalculateInputSchema,
	LodgifyQuotesCalculateOutputSchema,
	LodgifyReservationsCreateInputSchema,
	LodgifyReservationsCreateOutputSchema,
	LodgifyReservationsGetInputSchema,
	LodgifyReservationsGetOutputSchema,
	LodgifyReservationsListInputSchema,
	LodgifyReservationsListOutputSchema,
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
				includeCount: true,
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
			LodgifyPropertiesListOutputSchema.safeParse({ count: 1 }).success,
		).toBe(false);
	});

	it('validates properties.get input and output', () => {
		expect(LodgifyPropertiesGetInputSchema.safeParse({ id: 101 }).success).toBe(
			true,
		);
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
			LodgifyPropertiesGetRoomsInputSchema.safeParse({ id: 101 }).success,
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
					status: 'Confirmed',
					arrival: '2026-06-01',
					guest: { first_name: 'Jane', email: 'jane@example.com' },
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
			arrival: '2026-06-01',
			departure: '2026-06-07',
			guest: {
				first_name: 'Jane',
				last_name: 'Doe',
				email: 'jane@example.com',
			},
			roomTypes: [{ id: 201, people: 2 }],
			total_amount: 1200,
		};
		expect(
			LodgifyReservationsCreateInputSchema.safeParse(validInput).success,
		).toBe(true);

		// Missing required departure
		expect(
			LodgifyReservationsCreateInputSchema.safeParse({
				property_id: 101,
				arrival: '2026-06-01',
			}).success,
		).toBe(false);

		expect(
			LodgifyReservationsCreateOutputSchema.safeParse({
				id: 502,
				property_id: 101,
			}).success,
		).toBe(true);
	});
});

describe('Lodgify availability schemas', () => {
	it('validates availability.get input and output', () => {
		expect(
			LodgifyAvailabilityGetInputSchema.safeParse({
				propertyId: 101,
				from: '2026-06-01',
				to: '2026-06-10',
			}).success,
		).toBe(true);

		expect(
			LodgifyAvailabilityGetInputSchema.safeParse({
				propertyId: 0,
			}).success,
		).toBe(false);

		const validPeriods = [
			{
				start: '2026-06-01',
				end: '2026-06-10',
				is_available: true,
			},
		];
		expect(
			LodgifyAvailabilityGetOutputSchema.safeParse(validPeriods).success,
		).toBe(true);
	});
});

describe('Lodgify quotes schemas', () => {
	it('validates quotes.calculate input and output', () => {
		const validInput = {
			property_id: 101,
			arrival: '2026-06-01',
			departure: '2026-06-05',
			guests: 2,
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
			property_id: 101,
			arrival: '2026-06-01',
			departure: '2026-06-05',
			currency: 'USD',
			grand_total: 900,
			is_available: true,
			fees: [{ name: 'Cleaning fee', amount: 80, included_in_total: true }],
		};
		expect(
			LodgifyQuotesCalculateOutputSchema.safeParse(validOutput).success,
		).toBe(true);
	});
});

describe('Lodgify messages schemas', () => {
	it('validates messages.list input and output', () => {
		expect(
			LodgifyMessagesListInputSchema.safeParse({
				page: 1,
				size: 10,
				thread_id: 't-123',
			}).success,
		).toBe(true);

		const validOutput = {
			count: 1,
			items: [
				{
					id: 'm-1',
					thread_id: 't-123',
					subject: 'Hello',
					message: 'Hi there',
				},
			],
		};
		expect(LodgifyMessagesListOutputSchema.safeParse(validOutput).success).toBe(
			true,
		);
	});

	it('validates messages.send input and output', () => {
		const validInput = {
			message: 'Check-in is at 3 PM',
			thread_id: 't-123',
			subject: 'Check-in Reminder',
		};
		expect(LodgifyMessagesSendInputSchema.safeParse(validInput).success).toBe(
			true,
		);

		// Missing message
		expect(
			LodgifyMessagesSendInputSchema.safeParse({
				thread_id: 't-123',
			}).success,
		).toBe(false);

		const validOutput = {
			id: 'm-2',
			thread_id: 't-123',
			status: 'Sent',
			sent: true,
		};
		expect(LodgifyMessagesSendOutputSchema.safeParse(validOutput).success).toBe(
			true,
		);
	});
});
