import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { posthog } from './index';

dotenv.config();

async function createPosthogClient() {
	const apiKey = process.env.POSTHOG_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'posthog');

	const corsair = createCorsair({
		plugins: [
			posthog({
				key: apiKey,
				authType: 'api_key',
				credentials: {
					apiKey,
				},
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('PostHog plugin integration', () => {
	it('aliasCreate, identityCreate, eventCreate persist events and DB rows', async () => {
		const setup = await createPosthogClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const aliasInput = {
			distinct_id: 'corsair-test-user',
			alias: `alias-${Date.now()}`,
		};

		await corsair.posthog.api.events.aliasCreate(aliasInput);

		const orm = createCorsairOrm(testDb.database);
		const aliasEvents = await orm.events.findMany({
			where: { event_type: 'posthog.alias.create' },
		});

		expect(aliasEvents.length).toBeGreaterThan(0);
		const aliasEvent = aliasEvents[aliasEvents.length - 1]!;
		const aliasEventPayload =
			typeof aliasEvent.payload === 'string'
				? JSON.parse(aliasEvent.payload)
				: aliasEvent.payload;
		expect(aliasEventPayload).toMatchObject(aliasInput);

		const identityInput = {
			distinct_id: 'corsair-test-user',
			properties: {
				role: 'tester',
			},
		};

		await corsair.posthog.api.events.identityCreate(identityInput);

		const identityEvents = await orm.events.findMany({
			where: { event_type: 'posthog.identity.create' },
		});

		expect(identityEvents.length).toBeGreaterThan(0);
		const identityEvent = identityEvents[identityEvents.length - 1]!;
		const identityEventPayload =
			typeof identityEvent.payload === 'string'
				? JSON.parse(identityEvent.payload)
				: identityEvent.payload;
		expect(identityEventPayload).toMatchObject(identityInput);

		const eventInput = {
			event: 'corsair_posthog_integration_test',
			distinct_id: 'corsair-test-user',
			properties: {
				source: 'jest',
			},
		};

		await corsair.posthog.api.events.eventCreate(eventInput);

		const eventEvents = await orm.events.findMany({
			where: { event_type: 'posthog.event.create' },
		});

		expect(eventEvents.length).toBeGreaterThan(0);
		const eventEvent = eventEvents[eventEvents.length - 1]!;
		const eventEventPayload =
			typeof eventEvent.payload === 'string'
				? JSON.parse(eventEvent.payload)
				: eventEvent.payload;
		expect(eventEventPayload).toMatchObject(eventInput);

		const pluginEvents = await corsair.posthog.db.events.count();

		expect(pluginEvents).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('trackPage and trackScreen record tracking events', async () => {
		const setup = await createPosthogClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const pageInput = {
			distinct_id: 'corsair-test-user',
			url: 'https://example.com/page',
			properties: {
				title: 'Test Page',
			},
		};

		await corsair.posthog.api.events.trackPage(pageInput);

		const orm = createCorsairOrm(testDb.database);
		const pageEvents = await orm.events.findMany({
			where: { event_type: 'posthog.track.page' },
		});

		expect(pageEvents.length).toBeGreaterThan(0);
		const pageEvent = pageEvents[pageEvents.length - 1]!;
		const pageEventPayload =
			typeof pageEvent.payload === 'string'
				? JSON.parse(pageEvent.payload)
				: pageEvent.payload;
		expect(pageEventPayload).toMatchObject(pageInput);

		const screenInput = {
			distinct_id: 'corsair-test-user',
			screen_name: 'TestScreen',
			properties: {
				platform: 'jest',
			},
		};

		await corsair.posthog.api.events.trackScreen(screenInput);

		const screenEvents = await orm.events.findMany({
			where: { event_type: 'posthog.track.screen' },
		});

		expect(screenEvents.length).toBeGreaterThan(0);
		const screenEvent = screenEvents[screenEvents.length - 1]!;
		const screenEventPayload =
			typeof screenEvent.payload === 'string'
				? JSON.parse(screenEvent.payload)
				: screenEvent.payload;
		expect(screenEventPayload).toMatchObject(screenInput);

		testDb.cleanup();
	});
});
