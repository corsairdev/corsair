import {
	TwitterApiIOCommunity,
	TwitterApiIOList,
	TwitterApiIOReply,
	TwitterApiIOTrend,
	TwitterApiIOTweet,
	TwitterApiIOUser,
} from './database';

export const TwitterApiIOSchema = {
	version: '1.0.0',
	entities: {
		users: TwitterApiIOUser,
		tweets: TwitterApiIOTweet,
		replies: TwitterApiIOReply,
		lists: TwitterApiIOList,
		communities: TwitterApiIOCommunity,
		trends: TwitterApiIOTrend,
	},
} as const;

export type TwitterApiIOCredentials = {
	apiKey?: string;
};

export type {
	RawApiReply,
	RawApiTweet,
	TwitterApiIOCommunity,
	TwitterApiIOList,
	TwitterApiIOReply,
	TwitterApiIOTrend,
	TwitterApiIOTweet,
	TwitterApiIOTweetMedia,
	TwitterApiIOUser,
} from './database';
