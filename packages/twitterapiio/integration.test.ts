import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twitterapiio } from './index';

const TEST_USERNAME = process.env.TEST_TWITTER_USERNAME || 'elonmusk';
const TEST_USER_ID = process.env.TEST_TWITTER_USER_ID || '';
const TEST_TWEET_ID = process.env.TEST_TWITTER_TWEET_ID || '';
const TEST_LIST_ID = process.env.TEST_TWITTER_LIST_ID || '';
const TEST_COMMUNITY_ID = process.env.TEST_TWITTER_COMMUNITY_ID || '';

async function createTwitterApiIOClient() {
	const apiKey = process.env.TWITTERAPIIO_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'twitterapiio');

	const corsair = createCorsair({
		plugins: [
			twitterapiio({
				authType: 'api_key',
				key: apiKey,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('TwitterApiIO plugin integration', () => {
	it('users endpoints interact with API and DB', async () => {
		const setup = await createTwitterApiIOClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		// getByUsername
		const getByUsernameInput = { userName: TEST_USERNAME };
		const userResult =
			await corsair.twitterapiio.api.users.getByUsername(getByUsernameInput);

		expect(userResult).toBeDefined();

		const eventsGet = await orm.events.findMany({
			where: { event_type: 'twitterapiio.users.getByUsername' },
		});
		expect(eventsGet.length).toBeGreaterThan(0);
		const getEvent = eventsGet[eventsGet.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getByUsernameInput);

		if (userResult.data) {
			const userFromDb = await corsair.twitterapiio.db.users.findByEntityId(
				userResult.data.id,
			);
			expect(userFromDb).not.toBeNull();
			expect(userFromDb?.data.id).toBe(userResult.data.id);
			expect(userFromDb?.data.userName).toBe(userResult.data.userName);
		}

		// search
		const searchInput = { keyword: 'openai' };
		const searchResult =
			await corsair.twitterapiio.api.users.search(searchInput);

		expect(searchResult).toBeDefined();

		const eventsSearch = await orm.events.findMany({
			where: { event_type: 'twitterapiio.users.search' },
		});
		expect(eventsSearch.length).toBeGreaterThan(0);
		const searchEvent = eventsSearch[eventsSearch.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		if (searchResult.users && searchResult.users.length > 0) {
			const usersCount = await corsair.twitterapiio.db.users.count();
			expect(usersCount).toBeGreaterThan(0);
		}

		// getFollowers — always returns 200 per page (~3,000 credits). Opt-in only.
		if (process.env.TEST_TWITTER_RUN_EXPENSIVE) {
			const followersInput = { userName: TEST_USERNAME };
			const followersResult =
				await corsair.twitterapiio.api.users.getFollowers(followersInput);

			expect(followersResult).toBeDefined();

			const eventsFollowers = await orm.events.findMany({
				where: { event_type: 'twitterapiio.users.getFollowers' },
			});
			expect(eventsFollowers.length).toBeGreaterThan(0);
			const followersEvent = eventsFollowers[eventsFollowers.length - 1]!;
			const followersEventPayload =
				typeof followersEvent.payload === 'string'
					? JSON.parse(followersEvent.payload)
					: followersEvent.payload;
			expect(followersEventPayload).toMatchObject(followersInput);

			// getFollowings — always returns 200 per page (~3,000 credits). Opt-in only.
			const followingsInput = { userName: TEST_USERNAME };
			const followingsResult =
				await corsair.twitterapiio.api.users.getFollowings(followingsInput);

			expect(followingsResult).toBeDefined();

			const eventsFollowings = await orm.events.findMany({
				where: { event_type: 'twitterapiio.users.getFollowings' },
			});
			expect(eventsFollowings.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('tweets endpoints interact with API and DB', async () => {
		const setup = await createTwitterApiIOClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		// search
		const searchInput = {
			query: 'AI from:openai',
			queryType: 'Latest' as const,
		};
		const searchResult =
			await corsair.twitterapiio.api.tweets.search(searchInput);

		expect(searchResult).toBeDefined();

		const eventsSearch = await orm.events.findMany({
			where: { event_type: 'twitterapiio.tweets.search' },
		});
		expect(eventsSearch.length).toBeGreaterThan(0);
		const searchEvent = eventsSearch[eventsSearch.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		if (searchResult.tweets && searchResult.tweets.length > 0) {
			for (const tweet of searchResult.tweets.slice(0, 3)) {
				const tweetFromDb = await corsair.twitterapiio.db.tweets.findByEntityId(
					tweet.id,
				);
				expect(tweetFromDb).not.toBeNull();
				expect(tweetFromDb?.data.id).toBe(tweet.id);
			}
		}

		// getUserLastTweets
		const lastTweetsInput = { userName: TEST_USERNAME };
		const lastTweetsResult =
			await corsair.twitterapiio.api.tweets.getUserLastTweets(lastTweetsInput);

		expect(lastTweetsResult).toBeDefined();

		const eventsLastTweets = await orm.events.findMany({
			where: { event_type: 'twitterapiio.tweets.getUserLastTweets' },
		});
		expect(eventsLastTweets.length).toBeGreaterThan(0);
		const lastTweetsEvent = eventsLastTweets[eventsLastTweets.length - 1]!;
		const lastTweetsEventPayload =
			typeof lastTweetsEvent.payload === 'string'
				? JSON.parse(lastTweetsEvent.payload)
				: lastTweetsEvent.payload;
		expect(lastTweetsEventPayload).toMatchObject(lastTweetsInput);

		if (lastTweetsResult.tweets && lastTweetsResult.tweets.length > 0) {
			for (const tweet of lastTweetsResult.tweets.slice(0, 3)) {
				const tweetFromDb = await corsair.twitterapiio.db.tweets.findByEntityId(
					tweet.id,
				);
				expect(tweetFromDb).not.toBeNull();
				expect(tweetFromDb?.data.id).toBe(tweet.id);
			}
		}

		// getUserMentions
		const mentionsInput = { userName: TEST_USERNAME };
		const mentionsResult =
			await corsair.twitterapiio.api.tweets.getUserMentions(mentionsInput);

		expect(mentionsResult).toBeDefined();

		const eventsMentions = await orm.events.findMany({
			where: { event_type: 'twitterapiio.tweets.getUserMentions' },
		});
		expect(eventsMentions.length).toBeGreaterThan(0);

		// getUserTimeline (requires userId)
		if (TEST_USER_ID) {
			const timelineInput = { userId: TEST_USER_ID };
			const timelineResult =
				await corsair.twitterapiio.api.tweets.getUserTimeline(timelineInput);

			expect(timelineResult).toBeDefined();

			const eventsTimeline = await orm.events.findMany({
				where: { event_type: 'twitterapiio.tweets.getUserTimeline' },
			});
			expect(eventsTimeline.length).toBeGreaterThan(0);
		}

		// getByIds (requires known tweet ID)
		if (TEST_TWEET_ID) {
			const getByIdsInput = { tweetIds: TEST_TWEET_ID };
			const getByIdsResult =
				await corsair.twitterapiio.api.tweets.getByIds(getByIdsInput);

			expect(getByIdsResult).toBeDefined();

			const eventsGetByIds = await orm.events.findMany({
				where: { event_type: 'twitterapiio.tweets.getByIds' },
			});
			expect(eventsGetByIds.length).toBeGreaterThan(0);
			const getByIdsEvent = eventsGetByIds[eventsGetByIds.length - 1]!;
			const getByIdsEventPayload =
				typeof getByIdsEvent.payload === 'string'
					? JSON.parse(getByIdsEvent.payload)
					: getByIdsEvent.payload;
			expect(getByIdsEventPayload).toMatchObject(getByIdsInput);

			if (getByIdsResult.tweets && getByIdsResult.tweets.length > 0) {
				const tweetFromDb =
					await corsair.twitterapiio.db.tweets.findByEntityId(TEST_TWEET_ID);
				expect(tweetFromDb).not.toBeNull();
			}

			// replies.get
			const repliesInput = { tweetId: TEST_TWEET_ID };
			const repliesResult =
				await corsair.twitterapiio.api.replies.get(repliesInput);

			expect(repliesResult).toBeDefined();

			const eventsReplies = await orm.events.findMany({
				where: { event_type: 'twitterapiio.replies.get' },
			});
			expect(eventsReplies.length).toBeGreaterThan(0);

			// getQuotations
			const quotationsInput = { tweetId: TEST_TWEET_ID };
			const quotationsResult =
				await corsair.twitterapiio.api.tweets.getQuotations(quotationsInput);

			expect(quotationsResult).toBeDefined();

			const eventsQuotations = await orm.events.findMany({
				where: { event_type: 'twitterapiio.tweets.getQuotations' },
			});
			expect(eventsQuotations.length).toBeGreaterThan(0);

			// getRetweeters
			const retweetersInput = { tweetId: TEST_TWEET_ID };
			const retweetersResult =
				await corsair.twitterapiio.api.tweets.getRetweeters(retweetersInput);

			expect(retweetersResult).toBeDefined();

			const eventsRetweeters = await orm.events.findMany({
				where: { event_type: 'twitterapiio.tweets.getRetweeters' },
			});
			expect(eventsRetweeters.length).toBeGreaterThan(0);

			// getThreadContext
			const threadContextInput = { tweetId: TEST_TWEET_ID };
			const threadContextResult =
				await corsair.twitterapiio.api.tweets.getThreadContext(
					threadContextInput,
				);

			expect(threadContextResult).toBeDefined();

			const eventsThreadContext = await orm.events.findMany({
				where: { event_type: 'twitterapiio.tweets.getThreadContext' },
			});
			expect(eventsThreadContext.length).toBeGreaterThan(0);
		}

		const tweetsCount = await corsair.twitterapiio.db.tweets.count();
		expect(tweetsCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('trends endpoints interact with API and DB', async () => {
		const setup = await createTwitterApiIOClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const trendsInput = { woeid: 1 };
		const trendsResult = await corsair.twitterapiio.api.trends.get(trendsInput);

		expect(trendsResult).toBeDefined();

		const eventsTrends = await orm.events.findMany({
			where: { event_type: 'twitterapiio.trends.get' },
		});
		expect(eventsTrends.length).toBeGreaterThan(0);
		const trendsEvent = eventsTrends[eventsTrends.length - 1]!;
		const trendsEventPayload =
			typeof trendsEvent.payload === 'string'
				? JSON.parse(trendsEvent.payload)
				: trendsEvent.payload;
		expect(trendsEventPayload).toMatchObject(trendsInput);

		if (trendsResult.trends && trendsResult.trends.length > 0) {
			for (const trend of trendsResult.trends.slice(0, 5)) {
				const trendFromDb = await corsair.twitterapiio.db.trends.findByEntityId(
					trend.name,
				);
				expect(trendFromDb).not.toBeNull();
				expect(trendFromDb?.data.name).toBe(trend.name);
			}

			const trendsCount = await corsair.twitterapiio.db.trends.count();
			expect(trendsCount).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('lists endpoints interact with API and DB', async () => {
		const setup = await createTwitterApiIOClient();
		if (!setup || !TEST_LIST_ID) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		// getMembers
		const membersInput = { listId: TEST_LIST_ID };
		const membersResult =
			await corsair.twitterapiio.api.lists.getMembers(membersInput);

		expect(membersResult).toBeDefined();

		const eventsMembers = await orm.events.findMany({
			where: { event_type: 'twitterapiio.lists.getMembers' },
		});
		expect(eventsMembers.length).toBeGreaterThan(0);
		const membersEvent = eventsMembers[eventsMembers.length - 1]!;
		const membersEventPayload =
			typeof membersEvent.payload === 'string'
				? JSON.parse(membersEvent.payload)
				: membersEvent.payload;
		expect(membersEventPayload).toMatchObject(membersInput);

		if (membersResult.users && membersResult.users.length > 0) {
			for (const user of membersResult.users.slice(0, 3)) {
				const userFromDb = await corsair.twitterapiio.db.users.findByEntityId(
					user.id,
				);
				expect(userFromDb).not.toBeNull();
			}
		}

		// getFollowers
		const followersInput = { listId: TEST_LIST_ID };
		const followersResult =
			await corsair.twitterapiio.api.lists.getFollowers(followersInput);

		expect(followersResult).toBeDefined();

		const eventsFollowers = await orm.events.findMany({
			where: { event_type: 'twitterapiio.lists.getFollowers' },
		});
		expect(eventsFollowers.length).toBeGreaterThan(0);

		// getTweets
		const tweetsInput = { listId: TEST_LIST_ID };
		const tweetsResult =
			await corsair.twitterapiio.api.lists.getTweets(tweetsInput);

		expect(tweetsResult).toBeDefined();

		const eventsTweets = await orm.events.findMany({
			where: { event_type: 'twitterapiio.lists.getTweets' },
		});
		expect(eventsTweets.length).toBeGreaterThan(0);
		const tweetsEvent = eventsTweets[eventsTweets.length - 1]!;
		const tweetsEventPayload =
			typeof tweetsEvent.payload === 'string'
				? JSON.parse(tweetsEvent.payload)
				: tweetsEvent.payload;
		expect(tweetsEventPayload).toMatchObject(tweetsInput);

		if (tweetsResult.tweets && tweetsResult.tweets.length > 0) {
			for (const tweet of tweetsResult.tweets.slice(0, 3)) {
				const tweetFromDb = await corsair.twitterapiio.db.tweets.findByEntityId(
					tweet.id,
				);
				expect(tweetFromDb).not.toBeNull();
			}
		}

		testDb.cleanup();
	});

	it('communities endpoints interact with API and DB', async () => {
		const setup = await createTwitterApiIOClient();
		if (!setup || !TEST_COMMUNITY_ID) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		// getById
		const getByIdInput = { communityId: TEST_COMMUNITY_ID };
		const communityResult =
			await corsair.twitterapiio.api.communities.getById(getByIdInput);

		expect(communityResult).toBeDefined();

		const eventsGetById = await orm.events.findMany({
			where: { event_type: 'twitterapiio.communities.getById' },
		});
		expect(eventsGetById.length).toBeGreaterThan(0);
		const getByIdEvent = eventsGetById[eventsGetById.length - 1]!;
		const getByIdEventPayload =
			typeof getByIdEvent.payload === 'string'
				? JSON.parse(getByIdEvent.payload)
				: getByIdEvent.payload;
		expect(getByIdEventPayload).toMatchObject(getByIdInput);

		if (communityResult.data) {
			const communityFromDb =
				await corsair.twitterapiio.db.communities.findByEntityId(
					communityResult.data.id,
				);
			expect(communityFromDb).not.toBeNull();
			expect(communityFromDb?.data.id).toBe(communityResult.data.id);
			expect(communityFromDb?.data.name).toBe(communityResult.data.name);
		}

		// getMembers
		const membersInput = { communityId: TEST_COMMUNITY_ID };
		const membersResult =
			await corsair.twitterapiio.api.communities.getMembers(membersInput);

		expect(membersResult).toBeDefined();

		const eventsMembers = await orm.events.findMany({
			where: { event_type: 'twitterapiio.communities.getMembers' },
		});
		expect(eventsMembers.length).toBeGreaterThan(0);

		// getModerators
		const moderatorsInput = { communityId: TEST_COMMUNITY_ID };
		const moderatorsResult =
			await corsair.twitterapiio.api.communities.getModerators(moderatorsInput);

		expect(moderatorsResult).toBeDefined();

		const eventsModerators = await orm.events.findMany({
			where: { event_type: 'twitterapiio.communities.getModerators' },
		});
		expect(eventsModerators.length).toBeGreaterThan(0);

		// getTweets
		const tweetsInput = { communityId: TEST_COMMUNITY_ID };
		const tweetsResult =
			await corsair.twitterapiio.api.communities.getTweets(tweetsInput);

		expect(tweetsResult).toBeDefined();

		const eventsTweets = await orm.events.findMany({
			where: { event_type: 'twitterapiio.communities.getTweets' },
		});
		expect(eventsTweets.length).toBeGreaterThan(0);
		const tweetsEvent = eventsTweets[eventsTweets.length - 1]!;
		const tweetsEventPayload =
			typeof tweetsEvent.payload === 'string'
				? JSON.parse(tweetsEvent.payload)
				: tweetsEvent.payload;
		expect(tweetsEventPayload).toMatchObject(tweetsInput);

		if (tweetsResult.tweets && tweetsResult.tweets.length > 0) {
			for (const tweet of tweetsResult.tweets.slice(0, 3)) {
				const tweetFromDb = await corsair.twitterapiio.db.tweets.findByEntityId(
					tweet.id,
				);
				expect(tweetFromDb).not.toBeNull();
			}
		}

		// searchTweets
		const searchInput = { query: 'AI' };
		const searchResult =
			await corsair.twitterapiio.api.communities.searchTweets(searchInput);

		expect(searchResult).toBeDefined();

		const eventsSearch = await orm.events.findMany({
			where: { event_type: 'twitterapiio.communities.searchTweets' },
		});
		expect(eventsSearch.length).toBeGreaterThan(0);

		const communitiesCount = await corsair.twitterapiio.db.communities.count();
		expect(communitiesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
