import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Availability,
	Messages,
	Properties,
	Quotes,
	Reservations,
} from './endpoints';
import type { LodgifyContext } from './index';
import {
	lodgify,
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
			includeCount: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/properties', ctx.key, {
			method: 'GET',
			query: { page: 1, size: 10, includeCount: true },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.properties.list',
			{ count: 1 },
			'completed',
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

		const result = await Properties.get(ctx, { id: 101 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/properties/101', ctx.key, {
			method: 'GET',
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
				property_id: 101,
				max_people: 2,
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Properties.getRooms(ctx, { id: 101 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/properties/101/rooms',
			ctx.key,
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.properties.getRooms',
			{ propertyId: 101, count: 1 },
			'completed',
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
					status: 'Confirmed',
					arrival: '2026-07-01',
					departure: '2026-07-07',
					total_amount: 1500,
					currency: 'USD',
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

	it('reservations.get retrieves booking by ID', async () => {
		const mockResponse = {
			id: 501,
			property_id: 101,
			status: 'Confirmed',
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
		const mockResponse = {
			id: 502,
			property_id: 101,
			status: 'Booked',
			arrival: '2026-08-01',
			departure: '2026-08-05',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const input = {
			property_id: 101,
			arrival: '2026-08-01',
			departure: '2026-08-05',
			guest: {
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@example.com',
				phone: '+15555555555',
			},
		};

		const result = await Reservations.create(ctx, input);

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/reservations/bookings',
			ctx.key,
			{
				method: 'POST',
				body: input,
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
});

describe('availability endpoints', () => {
	it('availability.get retrieves availability calendar periods', async () => {
		const mockResponse = [
			{
				start: '2026-06-01',
				end: '2026-06-10',
				is_available: true,
				period_type: 'Available',
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Availability.get(ctx, {
			propertyId: 101,
			from: '2026-06-01',
			to: '2026-06-10',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/availability/101',
			ctx.key,
			{
				method: 'GET',
				query: { from: '2026-06-01', to: '2026-06-10' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.availability.get',
			{ propertyId: 101, count: 1 },
			'completed',
		);
	});
});

describe('quotes endpoints', () => {
	it('quotes.calculate calculates stay quote', async () => {
		const mockResponse = {
			property_id: 101,
			arrival: '2026-06-01',
			departure: '2026-06-05',
			currency: 'USD',
			subtotal: 800,
			grand_total: 950,
			is_available: true,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const input = {
			property_id: 101,
			arrival: '2026-06-01',
			departure: '2026-06-05',
			guests: 2,
		};

		const result = await Quotes.calculate(ctx, input);

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/quote', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.quotes.calculate',
			{ propertyId: 101 },
			'completed',
		);
	});
});

describe('messages endpoints', () => {
	it('messages.list retrieves guest messages', async () => {
		const mockResponse = {
			count: 1,
			items: [
				{
					id: 'msg-1',
					thread_id: 'thread-1',
					subject: 'Welcome',
					message: 'Looking forward to hosting you!',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Messages.list(ctx, {
			page: 1,
			size: 20,
			thread_id: 'thread-1',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/messages', ctx.key, {
			method: 'GET',
			query: { page: 1, size: 20, thread_id: 'thread-1' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.messages.list',
			{ count: 1 },
			'completed',
		);
	});

	it('messages.send sends message and avoids logging message content', async () => {
		const mockResponse = {
			id: 'msg-2',
			thread_id: 'thread-1',
			status: 'Sent',
			sent: true,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const input = {
			message: 'Check-in instructions: Key is in lockbox 1234.',
			thread_id: 'thread-1',
			subject: 'Check-in details',
		};

		const result = await Messages.send(ctx, input);

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/messages', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lodgify.messages.send',
			{ success: true },
			'completed',
		);
	});
});

describe('input validation failure prevents network requests', () => {
	it('rejects invalid property ID before calling network', async () => {
		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await Properties.get(
			ctx,
			// @ts-expect-error test invalid string input
			{ id: 'not-a-valid-number' },
		).catch((e: unknown) => e);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid reservation create input before calling network', async () => {
		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await Reservations.create(
			ctx,
			// @ts-expect-error test missing departure
			{ property_id: 101, arrival: '2026-06-01' },
		).catch((e: unknown) => e);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
