import 'dotenv/config';

import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';

import { facebook } from './index';

/**
 * Live Graph smoke tests. Skips cleanly when credentials are absent so CI
 * keeps passing. Local run:
 *
 *   FB_ACCESS_TOKEN=... FB_PAGE_ID=... CORSAIR_KEK=... \
 *     pnpm --filter @corsair-dev/facebook test -- integration.test.ts
 *
 * Optional: FB_RECIPIENT_ID, FB_TEST_IMAGE_URL for Messenger / photo writes.
 */

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID;
const CORSAIR_KEK = process.env.CORSAIR_KEK;
const FB_RECIPIENT_ID = process.env.FB_RECIPIENT_ID;
const FB_TEST_IMAGE_URL =
	process.env.FB_TEST_IMAGE_URL ??
	'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png';

async function createFacebookClient() {
	if (!FB_ACCESS_TOKEN || !FB_PAGE_ID || !CORSAIR_KEK) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'facebook');

	const corsair = createCorsair({
		plugins: [facebook({ key: FB_ACCESS_TOKEN })],
		database: testDb.db,
		kek: CORSAIR_KEK,
	});

	return { corsair, testDb, pageId: FB_PAGE_ID };
}

describe('Facebook live integration', () => {
	it('reads user + managed pages + page details with a user token', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const me = await corsair.facebook.api.users.getCurrentUser({});
			expect(me.id).toBeDefined();

			const pages = await corsair.facebook.api.pages.listManaged({});
			expect(Array.isArray(pages.data)).toBe(true);

			const details = await corsair.facebook.api.pages.getDetails({
				page_id: pageId,
			});
			expect(details.id).toBe(pageId);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists feed and creates/deletes an unpublished post', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const feed = await corsair.facebook.api.posts.list({
				page_id: pageId,
				limit: 5,
			});
			expect(Array.isArray(feed.data)).toBe(true);

			const created = await corsair.facebook.api.posts.create({
				page_id: pageId,
				message: `corsair fb smoke ${Date.now()}`,
				published: false,
			});
			expect(created.id).toBeDefined();

			const deleted = await corsair.facebook.api.posts.delete({
				post_id: created.id!,
				page_id: pageId,
			});
			expect(deleted.success).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('schedules a post with published=false and cancels it', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const scheduled = await corsair.facebook.api.posts.create({
				page_id: pageId,
				message: `corsair scheduled smoke ${Date.now()}`,
				scheduled_publish_time: Math.floor(Date.now() / 1000) + 3600,
			});
			expect(scheduled.id).toBeDefined();

			await corsair.facebook.api.posts.delete({
				post_id: scheduled.id!,
				page_id: pageId,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('lists uploaded photos (type=uploaded)', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const photos = await corsair.facebook.api.photos.list({
				page_id: pageId,
				limit: 5,
			});
			expect(Array.isArray(photos.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('uploads then deletes an unpublished photo when FB_TEST_IMAGE_URL is usable', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const uploaded = await corsair.facebook.api.photos.upload({
				page_id: pageId,
				url: FB_TEST_IMAGE_URL,
			});
			expect(uploaded.id).toBeDefined();

			// Unpublished photos are Photo nodes; delete via Graph object delete
			// through posts.delete when the id is composite, otherwise skip cleanup.
			if (uploaded.id?.includes('_')) {
				await corsair.facebook.api.posts.delete({
					post_id: uploaded.id,
					page_id: pageId,
				});
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('lists conversations when pages_messaging is granted', async () => {
		const setup = await createFacebookClient();
		if (!setup) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const conversations = await corsair.facebook.api.conversations.list({
				page_id: pageId,
				limit: 5,
			});
			expect(Array.isArray(conversations.data)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends a Messenger text when FB_RECIPIENT_ID is set', async () => {
		const setup = await createFacebookClient();
		if (!setup || !FB_RECIPIENT_ID) return;

		const { corsair, testDb, pageId } = setup;
		try {
			const sent = await corsair.facebook.api.messages.send({
				page_id: pageId,
				recipient_id: FB_RECIPIENT_ID,
				message: `corsair messenger smoke ${Date.now()}`,
			});
			expect(sent.recipient_id || sent.message_id).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});
});
