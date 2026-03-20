import * as Communities from './communities';
import * as Lists from './lists';
import * as Replies from './replies';
import * as Stream from './stream';
import * as Trends from './trends';
import * as Tweets from './tweets';
import * as Users from './users';
import * as WebhookRules from './webhook-rules';

export const TweetsEndpoints = {
	getByIds: Tweets.getByIds,
	search: Tweets.search,
	advancedSearch: Tweets.advancedSearch,
	getUserTimeline: Tweets.getUserTimeline,
	getUserLastTweets: Tweets.getUserLastTweets,
	getUserMentions: Tweets.getUserMentions,
	getQuotations: Tweets.getQuotations,
	getRetweeters: Tweets.getRetweeters,
	getThreadContext: Tweets.getThreadContext,
	create: Tweets.create,
	delete: Tweets.deleteTweet,
	like: Tweets.like,
	unlike: Tweets.unlike,
	retweet: Tweets.retweet,
};

export const RepliesEndpoints = {
	get: Replies.get,
	getV2: Replies.getV2,
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
	login: Users.login,
};

export const StreamEndpoints = {
	addUser: Stream.addUser,
	removeUser: Stream.removeUser,
	listUsers: Stream.listUsers,
};

export const WebhookRulesEndpoints = {
	addRule: WebhookRules.addRule,
	getRules: WebhookRules.getRules,
	updateRule: WebhookRules.updateRule,
	deleteRule: WebhookRules.deleteRule,
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
