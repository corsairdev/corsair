import * as Communities from './communities';
import * as Lists from './lists';
import * as Trends from './trends';
import * as Tweets from './tweets';
import * as Users from './users';

export const TweetsEndpoints = {
	getByIds: Tweets.getByIds,
	search: Tweets.search,
	advancedSearch: Tweets.advancedSearch,
	getUserTimeline: Tweets.getUserTimeline,
	getUserLastTweets: Tweets.getUserLastTweets,
	getUserMentions: Tweets.getUserMentions,
	getReplies: Tweets.getReplies,
	getQuotations: Tweets.getQuotations,
	getRetweeters: Tweets.getRetweeters,
	getThreadContext: Tweets.getThreadContext,
	create: Tweets.create,
	delete: Tweets.deleteTweet,
	like: Tweets.like,
	unlike: Tweets.unlike,
	retweet: Tweets.retweet,
};

export const UsersEndpoints = {
	getByUsername: Users.getByUsername,
	batchGetByIds: Users.batchGetByIds,
	search: Users.search,
	getFollowers: Users.getFollowers,
	getVerifiedFollowers: Users.getVerifiedFollowers,
	getFollowings: Users.getFollowings,
	checkFollowRelationship: Users.checkFollowRelationship,
	follow: Users.follow,
	unfollow: Users.unfollow,
	getMe: Users.getMe,
};

export const ListsEndpoints = {
	getFollowers: Lists.getFollowers,
	getMembers: Lists.getMembers,
	getTweets: Lists.getTweets,
};

export const CommunitiesEndpoints = {
	getById: Communities.getById,
	getMembers: Communities.getMembers,
	getModerators: Communities.getModerators,
	getTweets: Communities.getTweets,
	searchTweets: Communities.searchTweets,
	create: Communities.create,
	delete: Communities.deleteCommunity,
	join: Communities.join,
	leave: Communities.leave,
};

export const TrendsEndpoints = {
	get: Trends.get,
};

export * from './types';
