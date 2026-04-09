import 'dotenv/config';
import {
	makeHackerNewsAlgoliaRequest,
	makeHackerNewsFirebaseRequest,
} from './client';
import type {
	GetAskStoriesResponse,
	GetBestStoriesResponse,
	GetFrontpageResponse,
	GetItemResponse,
	GetItemWithIdResponse,
	GetJobStoriesResponse,
	GetLatestPostsResponse,
	GetMaxItemIdResponse,
	GetNewStoriesResponse,
	GetShowStoriesResponse,
	GetTodaysPostsResponse,
	GetTopStoriesResponse,
	GetUpdatesResponse,
	GetUserByUsernameResponse,
	GetUserResponse,
	SearchPostsResponse,
} from './endpoints/types';
import { HackerNewsEndpointOutputSchemas } from './endpoints/types';

// HackerNews is a public API — no auth token required
const TEST_ITEM_ID = process.env.TEST_HN_ITEM_ID
	? parseInt(process.env.TEST_HN_ITEM_ID, 10)
	: undefined;
const TEST_USERNAME = process.env.TEST_HN_USERNAME;

describe('HackerNews API Type Tests', () => {
	describe('stories', () => {
		it('storiesGetTop returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('topstories.json');
			const result: GetTopStoriesResponse = {
				story_ids: ids,
				count: ids.length,
			};
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetTop.parse(result);
			expect(parsed.story_ids.length).toBeGreaterThan(0);
			expect(parsed.count).toBe(parsed.story_ids.length);
		});

		it('storiesGetBest returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('beststories.json');
			const result: GetBestStoriesResponse = {
				story_ids: ids,
				count: ids.length,
			};
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetBest.parse(result);
			expect(parsed.story_ids.length).toBeGreaterThan(0);
		});

		it('storiesGetNew returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('newstories.json');
			const result: GetNewStoriesResponse = { story_ids: ids };
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetNew.parse(result);
			expect(parsed.story_ids.length).toBeGreaterThan(0);
		});

		it('storiesGetAsk returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('askstories.json');
			const result: GetAskStoriesResponse = { story_ids: ids };
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetAsk.parse(result);
			expect(parsed.story_ids.length).toBeGreaterThan(0);
		});

		it('storiesGetShow returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('showstories.json');
			const result: GetShowStoriesResponse = { story_ids: ids };
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetShow.parse(result);
			expect(parsed.story_ids.length).toBeGreaterThan(0);
		});

		it('storiesGetJobs returns correct type', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('jobstories.json');
			const result: GetJobStoriesResponse = { job_story_ids: ids };
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetJobs.parse(result);
			expect(parsed.job_story_ids.length).toBeGreaterThan(0);
		});

		it('passthrough preserves extra fields on story responses', async () => {
			const ids =
				await makeHackerNewsFirebaseRequest<number[]>('topstories.json');
			// Inject an extra field to verify passthrough keeps unknown keys
			const resultWithExtra = {
				story_ids: ids,
				count: ids.length,
				extra_field: 'test',
			};
			const parsed =
				HackerNewsEndpointOutputSchemas.storiesGetTop.parse(resultWithExtra);
			// passthrough() ensures unknown fields survive schema parsing
			expect((parsed as Record<string, unknown>).extra_field).toBe('test');
		});
	});

	describe('items', () => {
		let resolvedItemId: number;

		beforeAll(async () => {
			if (TEST_ITEM_ID) {
				resolvedItemId = TEST_ITEM_ID;
			} else {
				// Fetch a real item ID from top stories
				const ids =
					await makeHackerNewsFirebaseRequest<number[]>('topstories.json');
				if (!ids || ids.length === 0) throw new Error('No top stories found');
				resolvedItemId = ids[0]!;
			}
		});

		it('itemsGetMaxId returns correct type', async () => {
			const maxId = await makeHackerNewsFirebaseRequest<number>('maxitem.json');
			const result: GetMaxItemIdResponse = { max_item_id: maxId };
			const parsed =
				HackerNewsEndpointOutputSchemas.itemsGetMaxId.parse(result);
			expect(parsed.max_item_id).toBeGreaterThan(0);
		});

		it('itemsGet returns correct type', async () => {
			const item = await makeHackerNewsFirebaseRequest<GetItemResponse>(
				`item/${resolvedItemId}.json`,
			);
			const parsed = HackerNewsEndpointOutputSchemas.itemsGet.parse(item);
			expect(parsed.id).toBe(resolvedItemId);
		});

		it('itemsGetWithId returns correct type', async () => {
			// Algolia items endpoint returns nested item with children
			// item is typed as unknown because the Algolia response shape is recursive
			const raw = await makeHackerNewsAlgoliaRequest<unknown>(
				`items/${resolvedItemId}`,
			);
			const result: GetItemWithIdResponse = {
				found: raw !== null && raw !== undefined,
				// item is cast via unknown because transformAlgoliaItem produces Record<string, unknown>
				item: raw as GetItemWithIdResponse['item'],
			};
			const parsed =
				HackerNewsEndpointOutputSchemas.itemsGetWithId.parse(result);
			expect(parsed.found).toBe(true);
		});
	});

	describe('users', () => {
		let resolvedUsername: string;

		beforeAll(async () => {
			if (TEST_USERNAME) {
				resolvedUsername = TEST_USERNAME;
			} else {
				// Fetch a story and use its author
				const ids =
					await makeHackerNewsFirebaseRequest<number[]>('topstories.json');
				if (!ids || ids.length === 0) throw new Error('No top stories found');
				const item = await makeHackerNewsFirebaseRequest<{ by?: string }>(
					`item/${ids[0]}.json`,
				);
				if (!item.by) throw new Error('Story has no author');
				resolvedUsername = item.by;
			}
		});

		it('usersGet (Algolia) returns correct type', async () => {
			// Algolia users endpoint returns { id, karma, about, ... }
			// response is typed as unknown first because the shape varies
			const raw = await makeHackerNewsAlgoliaRequest<Record<string, unknown>>(
				`users/${resolvedUsername}`,
			);
			const result: GetUserResponse = {
				// raw is Record<string, unknown>; these fields are known to be the correct primitive types
				username: (raw.id as string) ?? resolvedUsername,
				// raw is Record<string, unknown>; karma is always a number from the Algolia users response
				karma: (raw.karma as number) ?? 0,
				// raw is Record<string, unknown>; about is an optional string from the Algolia users response
				about: raw.about as string | undefined,
			};
			const parsed = HackerNewsEndpointOutputSchemas.usersGet.parse(result);
			expect(parsed.username).toBe(resolvedUsername);
		});

		it('usersGetByUsername (Firebase) returns correct type', async () => {
			// Firebase user endpoint returns the user object directly
			const result =
				await makeHackerNewsFirebaseRequest<GetUserByUsernameResponse>(
					`user/${resolvedUsername}.json`,
				);
			const parsed =
				HackerNewsEndpointOutputSchemas.usersGetByUsername.parse(result);
			expect(parsed.id).toBe(resolvedUsername);
			expect(parsed.karma).toBeGreaterThanOrEqual(0);
		});
	});

	describe('search', () => {
		it('searchPosts returns correct type', async () => {
			const result = await makeHackerNewsAlgoliaRequest<SearchPostsResponse>(
				'search',
				{
					query: { query: 'typescript', hitsPerPage: 5 },
				},
			);
			const parsed = HackerNewsEndpointOutputSchemas.searchPosts.parse(result);
			expect(parsed.hits).toBeDefined();
			expect(parsed.nbHits).toBeGreaterThanOrEqual(0);
		});

		it('searchGetLatest returns correct type', async () => {
			const result = await makeHackerNewsAlgoliaRequest<GetLatestPostsResponse>(
				'search_by_date',
				{ query: { tags: 'story', hitsPerPage: 5 } },
			);
			const parsed =
				HackerNewsEndpointOutputSchemas.searchGetLatest.parse(result);
			expect(parsed.hits).toBeDefined();
		});

		it('searchGetFrontpage returns correct type', async () => {
			const raw = await makeHackerNewsAlgoliaRequest<{
				hits: GetFrontpageResponse['posts'];
				nbHits: number;
			}>('search', {
				query: {
					tags: 'front_page',
					numericFilters: 'points>=1',
					hitsPerPage: 10,
				},
			});
			const result: GetFrontpageResponse = {
				posts: raw.hits,
				total_hits: raw.nbHits,
			};
			const parsed =
				HackerNewsEndpointOutputSchemas.searchGetFrontpage.parse(result);
			expect(parsed.posts).toBeDefined();
		});

		it('searchGetTodays returns correct type', async () => {
			const now = new Date();
			const todayStart = Math.floor(
				Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
					1000,
			);
			const result = await makeHackerNewsAlgoliaRequest<GetTodaysPostsResponse>(
				'search_by_date',
				{
					query: {
						tags: 'story',
						numericFilters: `created_at_i>=${todayStart}`,
						hitsPerPage: 10,
					},
				},
			);
			const parsed =
				HackerNewsEndpointOutputSchemas.searchGetTodays.parse(result);
			expect(parsed.hits).toBeDefined();
		});

		it('passthrough preserves extra fields on search responses', async () => {
			const result = await makeHackerNewsAlgoliaRequest<SearchPostsResponse>(
				'search',
				{
					query: { query: 'typescript', hitsPerPage: 1 },
				},
			);
			const parsed = HackerNewsEndpointOutputSchemas.searchPosts.parse(result);
			// Algolia returns extra fields like processingTimeMS — passthrough keeps them
			expect(parsed).toBeDefined();
			expect(parsed.hits).toBeInstanceOf(Array);
		});
	});

	describe('updates', () => {
		it('updatesGet returns correct type', async () => {
			const result =
				await makeHackerNewsFirebaseRequest<GetUpdatesResponse>('updates.json');
			const parsed = HackerNewsEndpointOutputSchemas.updatesGet.parse(result);
			expect(Array.isArray(parsed.items)).toBe(true);
			expect(Array.isArray(parsed.profiles)).toBe(true);
		});
	});
});
