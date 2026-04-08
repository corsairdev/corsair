import 'dotenv/config';
import { makeTwitterApiIORequest } from './client';
import type {
	CommunitiesGetByIdResponse,
	TrendsGetResponse,
	TweetsGetByIdsResponse,
	TweetsSearchResponse,
	UsersBatchGetByIdsResponse,
	UsersGetByUsernameResponse,
} from './endpoints/types';
import { TwitterApiIOEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.TWITTERAPIIO_API_KEY!;
const TEST_USERNAME = process.env.TEST_TWITTER_USERNAME || 'elonmusk';
const TEST_USER_ID = process.env.TEST_TWITTER_USER_ID || '';
const TEST_TWEET_ID = process.env.TEST_TWITTER_TWEET_ID || '';
const TEST_LIST_ID = process.env.TEST_TWITTER_LIST_ID || '';
const TEST_COMMUNITY_ID = process.env.TEST_TWITTER_COMMUNITY_ID || '';

describe('TwitterApiIO API Type Tests', () => {
	describe('users', () => {
		it('usersGetByUsername returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response =
				await makeTwitterApiIORequest<UsersGetByUsernameResponse>(
					'/twitter/user/info',
					TEST_API_KEY,
					{ query: { userName: TEST_USERNAME } },
				);

			TwitterApiIOEndpointOutputSchemas.usersGetByUsername.parse(response);
		});

		it('usersBatchGetByIds returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_USER_ID) return;

			const response =
				await makeTwitterApiIORequest<UsersBatchGetByIdsResponse>(
					'/twitter/user/batch_info_by_ids',
					TEST_API_KEY,
					{ query: { userIds: TEST_USER_ID } },
				);

			TwitterApiIOEndpointOutputSchemas.usersBatchGetByIds.parse(response);
		});

		it('usersSearch returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.usersSearch._type
			>('/twitter/user/search', TEST_API_KEY, {
				query: { keyword: 'openai' },
			});

			TwitterApiIOEndpointOutputSchemas.usersSearch.parse(response);
		});

		it('usersGetFollowers returns correct type', async () => {
			// Always returns 200 followers per page (~3,000 credits). Opt-in only.
			if (!TEST_API_KEY || !process.env.TEST_TWITTER_RUN_EXPENSIVE) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.usersGetFollowers._type
			>('/twitter/user/followers', TEST_API_KEY, {
				query: { userName: TEST_USERNAME },
			});

			TwitterApiIOEndpointOutputSchemas.usersGetFollowers.parse(response);
		});

		it('usersGetFollowings returns correct type', async () => {
			// Always returns 200 followings per page (~3,000 credits). Opt-in only.
			if (!TEST_API_KEY || !process.env.TEST_TWITTER_RUN_EXPENSIVE) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.usersGetFollowings._type
			>('/twitter/user/followings', TEST_API_KEY, {
				query: { userName: TEST_USERNAME },
			});

			TwitterApiIOEndpointOutputSchemas.usersGetFollowings.parse(response);
		});

		it('usersCheckFollowRelationship returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.usersCheckFollowRelationship._type
			>('/twitter/user/follow_relation', TEST_API_KEY, {
				query: {
					sourceUserName: TEST_USERNAME,
					targetUserName: 'sama',
				},
			});

			TwitterApiIOEndpointOutputSchemas.usersCheckFollowRelationship.parse(
				response,
			);
		});
	});

	describe('tweets', () => {
		it('tweetsGetByIds returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_TWEET_ID) return;

			const response = await makeTwitterApiIORequest<TweetsGetByIdsResponse>(
				'/twitter/tweets',
				TEST_API_KEY,
				{ query: { tweet_ids: TEST_TWEET_ID } },
			);

			TwitterApiIOEndpointOutputSchemas.tweetsGetByIds.parse(response);
		});

		it('tweetsSearch returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<TweetsSearchResponse>(
				'/twitter/tweet/advanced_search',
				TEST_API_KEY,
				{ query: { query: 'AI from:openai', queryType: 'Latest' } },
			);

			TwitterApiIOEndpointOutputSchemas.tweetsSearch.parse(response);
		});

		it('tweetsGetUserLastTweets returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetUserLastTweets._type
			>('/twitter/user/last_tweets', TEST_API_KEY, {
				query: { userName: TEST_USERNAME },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetUserLastTweets.parse(response);
		});

		it('tweetsGetUserTimeline returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_USER_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetUserTimeline._type
			>('/twitter/user/timeline', TEST_API_KEY, {
				query: { userId: TEST_USER_ID },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetUserTimeline.parse(response);
		});

		it('tweetsGetUserMentions returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetUserMentions._type
			>('/twitter/user/mentions', TEST_API_KEY, {
				query: { userName: TEST_USERNAME },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetUserMentions.parse(response);
		});

		it('repliesGet returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_TWEET_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.repliesGet._type
			>('/twitter/tweet/replies', TEST_API_KEY, {
				query: { tweetId: TEST_TWEET_ID },
			});

			TwitterApiIOEndpointOutputSchemas.repliesGet.parse(response);
		});

		it('tweetsGetQuotations returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_TWEET_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetQuotations._type
			>('/twitter/tweet/quotes', TEST_API_KEY, {
				query: { tweetId: TEST_TWEET_ID },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetQuotations.parse(response);
		});

		it('tweetsGetRetweeters returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_TWEET_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetRetweeters._type
			>('/twitter/tweet/retweeters', TEST_API_KEY, {
				query: { tweetId: TEST_TWEET_ID },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetRetweeters.parse(response);
		});

		it('tweetsGetThreadContext returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_TWEET_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.tweetsGetThreadContext._type
			>('/twitter/tweet/thread_context', TEST_API_KEY, {
				query: { tweetId: TEST_TWEET_ID },
			});

			TwitterApiIOEndpointOutputSchemas.tweetsGetThreadContext.parse(response);
		});
	});

	describe('lists', () => {
		it('listsGetMembers returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_LIST_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.listsGetMembers._type
			>('/twitter/list/members', TEST_API_KEY, {
				query: { listId: TEST_LIST_ID },
			});

			TwitterApiIOEndpointOutputSchemas.listsGetMembers.parse(response);
		});

		it('listsGetFollowers returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_LIST_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.listsGetFollowers._type
			>('/twitter/list/followers', TEST_API_KEY, {
				query: { listId: TEST_LIST_ID },
			});

			TwitterApiIOEndpointOutputSchemas.listsGetFollowers.parse(response);
		});

		it('listsGetTweets returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_LIST_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.listsGetTweets._type
			>('/twitter/list/tweets', TEST_API_KEY, {
				query: { listId: TEST_LIST_ID },
			});

			TwitterApiIOEndpointOutputSchemas.listsGetTweets.parse(response);
		});
	});

	describe('communities', () => {
		it('communitiesGetById returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_COMMUNITY_ID) return;

			const response =
				await makeTwitterApiIORequest<CommunitiesGetByIdResponse>(
					'/twitter/community/info',
					TEST_API_KEY,
					{ query: { communityId: TEST_COMMUNITY_ID } },
				);

			TwitterApiIOEndpointOutputSchemas.communitiesGetById.parse(response);
		});

		it('communitiesGetMembers returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_COMMUNITY_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.communitiesGetMembers._type
			>('/twitter/community/members', TEST_API_KEY, {
				query: { communityId: TEST_COMMUNITY_ID },
			});

			TwitterApiIOEndpointOutputSchemas.communitiesGetMembers.parse(response);
		});

		it('communitiesGetTweets returns correct type', async () => {
			if (!TEST_API_KEY || !TEST_COMMUNITY_ID) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.communitiesGetTweets._type
			>('/twitter/community/tweets', TEST_API_KEY, {
				query: { communityId: TEST_COMMUNITY_ID },
			});

			TwitterApiIOEndpointOutputSchemas.communitiesGetTweets.parse(response);
		});

		it('communitiesSearchTweets returns correct type', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<
				typeof TwitterApiIOEndpointOutputSchemas.communitiesSearchTweets._type
			>('/twitter/tweet/advanced_search', TEST_API_KEY, {
				query: { query: 'AI', queryType: 'community' },
			});

			TwitterApiIOEndpointOutputSchemas.communitiesSearchTweets.parse(response);
		});
	});

	describe('trends', () => {
		it('trendsGet returns correct type for worldwide trends', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<TrendsGetResponse>(
				'/twitter/trends',
				TEST_API_KEY,
				{ query: { woeid: 1 } },
			);

			TwitterApiIOEndpointOutputSchemas.trendsGet.parse(response);
		});

		it('trendsGet returns correct type for US trends', async () => {
			if (!TEST_API_KEY) return;

			const response = await makeTwitterApiIORequest<TrendsGetResponse>(
				'/twitter/trends',
				TEST_API_KEY,
				{ query: { woeid: 23424977 } },
			);

			TwitterApiIOEndpointOutputSchemas.trendsGet.parse(response);
		});
	});
});
