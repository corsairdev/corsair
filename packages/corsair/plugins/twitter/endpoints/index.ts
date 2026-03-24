import * as Tweets from './tweets';

export const TweetsEndpoints = {
	create: Tweets.create,
	createReply: Tweets.createReply,
};

export * from './types';
