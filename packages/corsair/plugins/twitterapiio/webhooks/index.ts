import { tweetCreated, tweetFilterMatch } from './tweets';

export const TweetWebhooks = {
	created: tweetCreated,
	filterMatch: tweetFilterMatch,
};

export * from './types';
