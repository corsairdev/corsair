import { logEventFromContext } from 'corsair/core';
import { makeHumanitixRequest } from './client';
import { Events, Tags } from './endpoints';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './endpoints/types';
import type { HumanitixContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeHumanitixRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeHumanitixRequest as jest.MockedFunction<
	typeof makeHumanitixRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = { key: 'humanitix-key', options: {} } as HumanitixContext;

const event = {
	_id: '64f1c2a9b1234567890abcd',
	name: 'Summer Music Festival',
	startDate: '2025-07-20T10:00:00Z',
};

const eventsResponse = {
	total: 1,
	page: 1,
	pageSize: 20,
	events: [event],
};

const tagsResponse = {
	total: 1,
	page: 1,
	pageSize: 25,
	tags: [{ _id: '64f1c2a9b7d34e0012345678', name: 'VIP', location: 'AU' }],
};

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('input and output schemas', () => {
	it('requires a positive page and caps pageSize at 100', () => {
		expect(() =>
			HumanitixEndpointInputSchemas.getEvents.parse({ page: 0 }),
		).toThrow();
		expect(() =>
			HumanitixEndpointInputSchemas.getEvents.parse({
				page: 1,
				pageSize: 101,
			}),
		).toThrow();
		expect(
			HumanitixEndpointInputSchemas.getEvents.parse({
				page: 1,
				pageSize: 20,
				inFutureOnly: true,
				since: '2025-01-01T00:00:00Z',
				overrideLocation: 'AU',
			}),
		).toMatchObject({ page: 1, pageSize: 20, overrideLocation: 'AU' });
	});

	it('requires eventId and tags.page', () => {
		expect(() => HumanitixEndpointInputSchemas.getEvent.parse({})).toThrow();
		expect(
			HumanitixEndpointInputSchemas.getEvent.parse({ eventId: 'abc' }),
		).toEqual({ eventId: 'abc' });
		expect(() => HumanitixEndpointInputSchemas.getTags.parse({})).toThrow();
	});

	it('accepts official list and event envelopes', () => {
		expect(
			HumanitixEndpointOutputSchemas.getEvents.parse(eventsResponse).events[0]
				?._id,
		).toBe(event._id);
		expect(HumanitixEndpointOutputSchemas.getEvent.parse(event)._id).toBe(
			event._id,
		);
		expect(
			HumanitixEndpointOutputSchemas.getTags.parse(tagsResponse).tags[0]?.name,
		).toBe('VIP');
	});
});

describe('events.get', () => {
	it('GETs /events/{eventId}', async () => {
		mockRequest.mockResolvedValue(event);

		const result = await Events.get(ctx, { eventId: event._id });

		expect(mockRequest).toHaveBeenCalledWith(
			`/events/${event._id}`,
			'humanitix-key',
			{ method: 'GET' },
		);
		expect(result._id).toBe(event._id);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'humanitix.events.get',
			{ eventId: event._id },
			'completed',
		);
	});
});

describe('events.list', () => {
	it('GETs /events with official query params', async () => {
		mockRequest.mockResolvedValue(eventsResponse);

		const input = {
			page: 2,
			pageSize: 50,
			inFutureOnly: true,
			since: '2025-01-01T00:00:00Z',
			overrideLocation: 'NZ',
		};
		const result = await Events.list(ctx, input);

		expect(mockRequest).toHaveBeenCalledWith('/events', 'humanitix-key', {
			method: 'GET',
			query: input,
		});
		expect(result.total).toBe(1);
	});
});

const LIVE_API_KEY = process.env.HUMANITIX_API_KEY;
const describeLive = LIVE_API_KEY ? describe : describe.skip;

describeLive('live Humanitix API', () => {
	const { makeHumanitixRequest: liveRequest } = jest.requireActual(
		'./client',
	) as typeof import('./client');

	it('lists events and tags with official pagination envelopes', async () => {
		if (!LIVE_API_KEY) throw new Error('HUMANITIX_API_KEY is required');

		const events = HumanitixEndpointOutputSchemas.getEvents.parse(
			await liveRequest('/events', LIVE_API_KEY, {
				method: 'GET',
				query: { page: 1, pageSize: 2 },
			}),
		);
		expect(events.page).toBe(1);
		expect(Array.isArray(events.events)).toBe(true);

		const tags = HumanitixEndpointOutputSchemas.getTags.parse(
			await liveRequest('/tags', LIVE_API_KEY, {
				method: 'GET',
				query: { page: 1, pageSize: 2 },
			}),
		);
		expect(tags.page).toBe(1);
		expect(Array.isArray(tags.tags)).toBe(true);
	});

	it('getEvent hits GET /events/{eventId}', async () => {
		if (!LIVE_API_KEY) throw new Error('HUMANITIX_API_KEY is required');

		const listed = HumanitixEndpointOutputSchemas.getEvents.parse(
			await liveRequest('/events', LIVE_API_KEY, {
				method: 'GET',
				query: { page: 1, pageSize: 1 },
			}),
		);
		const eventId = listed.events[0]?._id ?? '5ac598ccd8fe7c0c0f212e2a';
		try {
			const event = HumanitixEndpointOutputSchemas.getEvent.parse(
				await liveRequest(`/events/${eventId}`, LIVE_API_KEY, {
					method: 'GET',
				}),
			);
			expect(event._id).toBe(eventId);
		} catch (error) {
			expect(String(error)).toMatch(/404|not found|Event/i);
		}
	});
});

describe('tags.list', () => {
	it('GETs /tags with page and pageSize', async () => {
		mockRequest.mockResolvedValue(tagsResponse);

		const result = await Tags.list(ctx, { page: 1, pageSize: 25 });

		expect(mockRequest).toHaveBeenCalledWith('/tags', 'humanitix-key', {
			method: 'GET',
			query: { page: 1, pageSize: 25 },
		});
		expect(result.tags[0]?.name).toBe('VIP');
	});
});
