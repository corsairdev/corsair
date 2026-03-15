import {
	TwitterApiIOCommunity,
	TwitterApiIOList,
	TwitterApiIOTrend,
	TwitterApiIOTweet,
	TwitterApiIOUser,
} from './database';

export const TwitterApiIOSchema = {
	version: '1.0.0',
	entities: {
		users: TwitterApiIOUser,
		tweets: TwitterApiIOTweet,
		lists: TwitterApiIOList,
		communities: TwitterApiIOCommunity,
		trends: TwitterApiIOTrend,
	},
} as const;

export type TwitterApiIOCredentials = {
	apiKey?: string;
};

export type {
	TwitterApiIOCommunity,
	TwitterApiIOList,
	TwitterApiIOTrend,
	TwitterApiIOTweet,
	TwitterApiIOTweetMedia,
	TwitterApiIOUser,
	RawApiTweet,
} from './database';
