import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { bluesky } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Bluesky plugin integration', () => {
	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('creates session and creates post, deleting post, getting profile, and timeline', async () => {
		// Mock responses
		mockRequest.mockImplementation(
			(config: unknown, options: { url: string }) => {
				if (options.url === '/xrpc/com.atproto.server.createSession') {
					return Promise.resolve({
						accessJwt: 'mock-access-jwt',
						refreshJwt: 'mock-refresh-jwt',
						handle: 'test.bsky.social',
						did: 'did:plc:mockdid123',
					});
				}
				if (options.url === '/xrpc/com.atproto.repo.createRecord') {
					return Promise.resolve({
						uri: 'at://did:plc:mockdid123/app.bsky.feed.post/mockpost123',
						cid: 'mockcid123',
					});
				}
				if (options.url === '/xrpc/com.atproto.repo.deleteRecord') {
					return Promise.resolve({});
				}
				if (options.url === '/xrpc/app.bsky.actor.getProfile') {
					return Promise.resolve({
						did: 'did:plc:mockdid123',
						handle: 'test.bsky.social',
						displayName: 'Test User',
						description: 'Test Bio',
						followersCount: 10,
						followsCount: 20,
						postsCount: 5,
					});
				}
				if (options.url === '/xrpc/app.bsky.feed.getTimeline') {
					return Promise.resolve({
						feed: [
							{
								post: {
									uri: 'at://did:plc:mockdid123/app.bsky.feed.post/mockpost123',
									cid: 'mockcid123',
									author: {
										did: 'did:plc:mockdid123',
										handle: 'test.bsky.social',
										displayName: 'Test User',
									},
									record: {
										text: 'Hello World',
										createdAt: '2026-05-24T12:00:00Z',
									},
								},
							},
						],
					});
				}
				return Promise.reject(new Error(`Unexpected request: ${options.url}`));
			},
		);

		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'bluesky');

		const corsair = createCorsair({
			plugins: [
				bluesky({
					authType: 'api_key',
					key: 'mock-password',
					handle: 'test.bsky.social',
				}),
			],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		const orm = createCorsairOrm(testDb.database);

		// 1. Create a post
		const createRes = await corsair.bluesky.api.posts.create({
			text: 'Hello World',
		});
		expect(createRes.uri).toBe(
			'at://did:plc:mockdid123/app.bsky.feed.post/mockpost123',
		);
		expect(createRes.cid).toBe('mockcid123');

		// Check event in DB
		const events = await orm.events.findMany({
			where: { event_type: 'bluesky.posts.create' },
		});
		expect(events.length).toBeGreaterThan(0);

		// Check post in DB
		const postInDb = await corsair.bluesky.db.posts.findByEntityId(
			createRes.uri,
		);
		expect(postInDb).not.toBeNull();
		expect(postInDb?.data.text).toBe('Hello World');

		// 2. Fetch profile
		const profileRes = await corsair.bluesky.api.profiles.get({
			actor: 'test.bsky.social',
		});
		expect(profileRes.displayName).toBe('Test User');
		expect(profileRes.followersCount).toBe(10);

		// 3. Fetch timeline
		const feedRes = await corsair.bluesky.api.feeds.getTimeline({});
		expect(feedRes.feed.length).toBe(1);
		expect(feedRes.feed[0]).toBeDefined();
		expect(feedRes.feed[0]!.post.record.text).toBe('Hello World');

		// 4. Delete post
		const deleteRes = await corsair.bluesky.api.posts.deleteRecord({
			uri: createRes.uri,
		});
		expect(deleteRes.success).toBe(true);

		// Check deleted in DB
		const postInDbAfterDelete = await corsair.bluesky.db.posts.findByEntityId(
			createRes.uri,
		);
		expect(postInDbAfterDelete).toBeNull();

		testDb.cleanup();
	});
});
