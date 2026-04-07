import { TwitterTweet } from './database';

export const TwitterSchema = {
	version: '1.0.0',
	entities: {
		tweets: TwitterTweet,
	},
} as const;

export type TwitterCredentials = {
	accessToken?: string;
};

export type { TwitterTweet } from './database';
