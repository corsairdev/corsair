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
	RawApiTweet,
	TwitterApiIOCommunity,
	TwitterApiIOList,
	TwitterApiIOTrend,
	TwitterApiIOTweet,
	TwitterApiIOTweetMedia,
	TwitterApiIOUser,
} from './database';
