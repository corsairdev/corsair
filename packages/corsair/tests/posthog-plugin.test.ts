import { createCorsair } from '../core';
import { posthog } from '../plugins/posthog';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';
import dotenv from 'dotenv';
dotenv.config();

async function createPosthogClient() {
	const apiKey = process.env.POSTHOG_API_KEY;
	const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'posthog');

	const corsair = createCorsair({
		plugins: [
			posthog({
				authType: 'api_key' as any,
				credentials: {
					apiKey,
					host,
				} as any,
			}),
		],
		database: testDb.adapter,
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

		await corsair.posthog.api.events.aliasCreate({
			distinct_id: 'corsair-test-user',
			alias: `alias-${Date.now()}`,
		});

		const aliasEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'posthog.alias.create' }],
		});

		expect(aliasEvents.length).toBeGreaterThan(0);

		await corsair.posthog.api.events.identityCreate({
			distinct_id: 'corsair-test-user',
			properties: {
				role: 'tester',
			},
		});

		const identityEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'posthog.identity.create' }],
		});

		expect(identityEvents.length).toBeGreaterThan(0);

		await corsair.posthog.api.events.eventCreate({
			event: 'corsair_posthog_integration_test',
			distinct_id: 'corsair-test-user',
			properties: {
				source: 'jest',
			},
		});

		const eventEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'posthog.event.create' }],
		});

		expect(eventEvents.length).toBeGreaterThan(0);

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

		await corsair.posthog.api.events.trackPage({
			distinct_id: 'corsair-test-user',
			url: 'https://example.com/page',
			properties: {
				title: 'Test Page',
			},
		});

		const pageEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'posthog.track.page' }],
		});

		expect(pageEvents.length).toBeGreaterThan(0);

		await corsair.posthog.api.events.trackScreen({
			distinct_id: 'corsair-test-user',
			screen_name: 'TestScreen',
			properties: {
				platform: 'jest',
			},
		});

		const screenEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'posthog.track.screen' }],
		});

		expect(screenEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});

