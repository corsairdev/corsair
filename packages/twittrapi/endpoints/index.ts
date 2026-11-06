import * as Balance from './balance';
import * as Communities from './communities';
import * as Lists from './lists';
import * as Monitors from './monitors';
import * as Trends from './trends';
import * as Tweets from './tweets';
import * as Users from './users';

export const TweetsEndpoints = {
	search: Tweets.search,
	getById: Tweets.getById,
	getReplies: Tweets.getReplies,
	getQuotes: Tweets.getQuotes,
	getRetweeters: Tweets.getRetweeters,
	getLikers: Tweets.getLikers,
};

export const UsersEndpoints = {
	getByUsername: Users.getByUsername,
	getById: Users.getById,
	batchGetByIds: Users.batchGetByIds,
	getTweets: Users.getTweets,
	getTweetsAndReplies: Users.getTweetsAndReplies,
	getMedia: Users.getMedia,
	getLikes: Users.getLikes,
	getFollowers: Users.getFollowers,
	getFollowings: Users.getFollowings,
	getVerifiedFollowers: Users.getVerifiedFollowers,
	getFriendship: Users.getFriendship,
	resolveIds: Users.resolveIds,
};

export const ListsEndpoints = {
	getDetails: Lists.getDetails,
	getTweets: Lists.getTweets,
	getMembers: Lists.getMembers,
	getFollowers: Lists.getFollowers,
};

export const CommunitiesEndpoints = {
	search: Communities.search,
	getById: Communities.getById,
	getTweets: Communities.getTweets,
	getMembers: Communities.getMembers,
	getModerators: Communities.getModerators,
};

export const TrendsEndpoints = {
	getByLocation: Trends.getByLocation,
	getLocations: Trends.getLocations,
};

export const MonitorsEndpoints = {
	getPlan: Monitors.getPlan,
	listAccounts: Monitors.listAccounts,
	addAccounts: Monitors.addAccounts,
	updateAccount: Monitors.updateAccount,
	removeAccount: Monitors.removeAccount,
	listWebhooks: Monitors.listWebhooks,
	createWebhook: Monitors.createWebhook,
	getWebhook: Monitors.getWebhook,
	updateWebhook: Monitors.updateWebhook,
	deleteWebhook: Monitors.deleteWebhook,
	testWebhook: Monitors.testWebhook,
	getEvents: Monitors.getEvents,
	getDeliveries: Monitors.getDeliveries,
};

export const BalanceEndpoints = {
	get: Balance.get,
};

export * from './types';
