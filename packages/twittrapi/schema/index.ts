import {
	TwittrApiCommunity,
	TwittrApiFriendship,
	TwittrApiList,
	TwittrApiMonitorAccount,
	TwittrApiMonitorEvent,
	TwittrApiMonitorWebhook,
	TwittrApiTrend,
	TwittrApiTrendLocation,
	TwittrApiTweet,
	TwittrApiUser,
} from './database';

export const TwittrApiSchema = {
	version: '1.0.0',
	entities: {
		users: TwittrApiUser,
		tweets: TwittrApiTweet,
		lists: TwittrApiList,
		communities: TwittrApiCommunity,
		trends: TwittrApiTrend,
		trendLocations: TwittrApiTrendLocation,
		friendships: TwittrApiFriendship,
		monitoredAccounts: TwittrApiMonitorAccount,
		monitorWebhooks: TwittrApiMonitorWebhook,
		monitorEvents: TwittrApiMonitorEvent,
	},
} as const;

export type TwittrApiCredentials = {
	apiKey?: string;
};

export type {
	TwittrApiCommunity,
	TwittrApiFriendship,
	TwittrApiList,
	TwittrApiMedia,
	TwittrApiMonitorAccount,
	TwittrApiMonitorEvent,
	TwittrApiMonitorWebhook,
	TwittrApiTrend,
	TwittrApiTrendLocation,
	TwittrApiTweet,
	TwittrApiUser,
} from './database';
