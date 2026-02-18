import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { googlecalendar } from './index';

dotenv.config();

async function createGoogleCalendarClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
	if (!clientId || !clientSecret || !accessToken || !refreshToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googlecalendar');

	const corsair = createCorsair({
		plugins: [
			googlecalendar({
				authType: 'oauth_2',
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.keys.googlecalendar.issue_new_dek();
	await corsair.keys.googlecalendar.set_client_id(clientId);
	await corsair.keys.googlecalendar.set_client_secret(clientSecret);

	await corsair.googlecalendar.keys.issue_new_dek();
	await corsair.googlecalendar.keys.set_access_token(accessToken);
	await corsair.googlecalendar.keys.set_refresh_token(refreshToken);

	return { corsair, testDb };
}

function createTestEvent(summary: string) {
	const now = new Date();
	const start = new Date(now.getTime() + 60 * 60 * 1000);
	const end = new Date(start.getTime() + 60 * 60 * 1000);

	return {
		summary,
		description: `Test event created by integration test at ${now.toISOString()}`,
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

describe('Google Calendar plugin integration', () => {
	it('events endpoints interact with API and DB', async () => {
		const setup = await createGoogleCalendarClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const testEvent = createTestEvent(`Test Event ${Date.now()}`);

		const createResponse = await corsair.googlecalendar.api.events.create({
			event: testEvent,
		});

		expect(createResponse).toBeDefined();
		expect(createResponse.id).toBeDefined();

		const createEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlecalendar.events.create')
			.execute();

		expect(createEvents.length).toBeGreaterThan(0);

		if (createResponse.id) {
			const eventId = createResponse.id;

			const getResponse = await corsair.googlecalendar.api.events.get({
				id: eventId,
			});

			expect(getResponse).toBeDefined();

			const getEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googlecalendar.events.get')
				.execute();

			expect(getEvents.length).toBeGreaterThan(0);

			const updatedEvent = {
				...testEvent,
				summary: `Updated Test Event ${Date.now()}`,
			};

			const updateResponse = await corsair.googlecalendar.api.events.update({
				id: eventId,
				event: updatedEvent,
			});

			expect(updateResponse).toBeDefined();

			const updateEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googlecalendar.events.update')
				.execute();

			expect(updateEvents.length).toBeGreaterThan(0);

			await corsair.googlecalendar.api.events.delete({
				id: eventId,
			});

			const deleteEvents = await testDb.db
				.selectFrom('corsair_events')
				.where('event_type', '=', 'googlecalendar.events.delete')
				.execute();

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('eventsGetMany endpoint reaches API', async () => {
		const setup = await createGoogleCalendarClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const now = new Date();
		const timeMin = now.toISOString();
		const timeMax = new Date(
			now.getTime() + 7 * 24 * 60 * 60 * 1000,
		).toISOString();

		const getManyResponse = await corsair.googlecalendar.api.events.getMany({
			timeMin,
			timeMax,
			maxResults: 10,
		});

		expect(getManyResponse).toBeDefined();

		const getManyEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlecalendar.events.getMany')
			.execute();

		expect(getManyEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('calendarGetAvailability endpoint reaches API', async () => {
		const setup = await createGoogleCalendarClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const now = new Date();
		const timeMin = now.toISOString();
		const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

		const availabilityResponse =
			await corsair.googlecalendar.api.calendar.getAvailability({
				timeMin,
				timeMax,
				items: [{ id: 'primary' }],
			});

		expect(availabilityResponse).toBeDefined();

		const availabilityEvents = await testDb.db
			.selectFrom('corsair_events')
			.where('event_type', '=', 'googlecalendar.calendar.getAvailability')
			.execute();

		expect(availabilityEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
