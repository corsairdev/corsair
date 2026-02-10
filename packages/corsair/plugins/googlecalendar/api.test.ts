import dotenv from 'dotenv';
import { makeCalendarRequest } from './client';
import { GoogleCalendarEndpointOutputSchemas } from './endpoints/types';
import type {
	Event,
	EventListResponse,
	FreeBusyResponse,
} from './types';

dotenv.config();

const TEST_TOKEN = process.env.GOOGLE_CALENDAR_ACCESS_TOKEN!;
const TEST_CALENDAR_ID = 'primary';

function createTestEvent(summary: string): Partial<Event> {
	const now = new Date();
	const start = new Date(now.getTime() + 60 * 60 * 1000);
	const end = new Date(start.getTime() + 60 * 60 * 1000);

	return {
		summary,
		description: `Test event created by API test suite at ${now.toISOString()}`,
		start: {
			dateTime: start.toISOString(),
			timeZone: 'UTC',
		},
		end: {
			dateTime: end.toISOString(),
			timeZone: 'UTC',
		},
	};
}

describe('Google Calendar API Type Tests', () => {
	describe('events', () => {
		it('eventsCreate returns correct type', async () => {
			const testEvent = createTestEvent(`Test Event ${Date.now()}`);

			const response = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: testEvent,
				},
			);
			const result = response;

			GoogleCalendarEndpointOutputSchemas.eventsCreate.parse(result);

			if (result.id) {
				await makeCalendarRequest(
					`/calendars/${TEST_CALENDAR_ID}/events/${result.id}`,
					TEST_TOKEN,
					{
						method: 'DELETE',
					},
				);
			}
		});

		it('eventsGet returns correct type', async () => {
			const testEvent = createTestEvent(`Test Event for Get ${Date.now()}`);

			const createResponse = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: testEvent,
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test event');
			}

			const response = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
            );
			const result = response;

			GoogleCalendarEndpointOutputSchemas.eventsGet.parse(result);

			await makeCalendarRequest(
				`/calendars/${TEST_CALENDAR_ID}/events/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'DELETE',
				},
			);
		});

		it('eventsGetMany returns correct type', async () => {
			const now = new Date();
			const timeMin = now.toISOString();
			const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

			const response = await makeCalendarRequest<EventListResponse>(
				`/calendars/${TEST_CALENDAR_ID}/events`,
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						timeMin,
						timeMax,
						maxResults: 10,
						singleEvents: true,
						orderBy: 'startTime',
					},
				},
			);
			const result = response;

			GoogleCalendarEndpointOutputSchemas.eventsGetMany.parse(result);
		});

		it('eventsUpdate returns correct type', async () => {
			const testEvent = createTestEvent(`Test Event for Update ${Date.now()}`);

			const createResponse = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: testEvent,
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test event');
			}

			const updatedEvent: Partial<Event> = {
				...testEvent,
				summary: `Updated Test Event ${Date.now()}`,
				description: 'This event has been updated by the API test suite',
			};

			const response = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: updatedEvent,
				},
			);
			const result = response;

			GoogleCalendarEndpointOutputSchemas.eventsUpdate.parse(result);

			await makeCalendarRequest(
				`/calendars/${TEST_CALENDAR_ID}/events/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'DELETE',
				},
			);
		});

		it('eventsDelete returns correct type', async () => {
			const testEvent = createTestEvent(`Test Event for Delete ${Date.now()}`);

			const createResponse = await makeCalendarRequest<Event>(
				`/calendars/${TEST_CALENDAR_ID}/events`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: testEvent,
				},
			);

			if (!createResponse.id) {
				throw new Error('Failed to create test event');
			}

			await makeCalendarRequest(
				`/calendars/${TEST_CALENDAR_ID}/events/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'DELETE',
				},
			);
		});
	});

	describe('calendar', () => {
		it('calendarGetAvailability returns correct type', async () => {
			const now = new Date();
			const timeMin = now.toISOString();
			const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

			const response = await makeCalendarRequest<FreeBusyResponse>(
				'/freeBusy',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						timeMin,
						timeMax,
						items: [
							{
								id: TEST_CALENDAR_ID,
							},
						],
					},
				},
			);
			const result = response;

			GoogleCalendarEndpointOutputSchemas.calendarGetAvailability.parse(result);
		});
	});
});
