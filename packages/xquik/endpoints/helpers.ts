import type { XquikQuery } from '../client';
import type { TweetFilter } from './types';

export function baseUrlFromOptions(options: {
	baseUrl?: string;
}): string | undefined {
	return options.baseUrl;
}

export function idsQuery(ids: readonly string[]): string {
	return ids.join(',');
}

export function tweetFilterQuery(input: TweetFilter): XquikQuery {
	return {
		anyWords: input.anyWords,
		cashtags: input.cashtags,
		conversationId: input.conversationId,
		exactPhrase: input.exactPhrase,
		excludeWords: input.excludeWords,
		fromUser: input.fromUser,
		hashtags: input.hashtags,
		inReplyToTweetId: input.inReplyToTweetId,
		language: input.language,
		mediaType: input.mediaType,
		mentioning: input.mentioning,
		minFaves: input.minFaves,
		minQuotes: input.minQuotes,
		minReplies: input.minReplies,
		minRetweets: input.minRetweets,
		quotes: input.quotes,
		quotesOfTweetId: input.quotesOfTweetId,
		replies: input.replies,
		retweets: input.retweets,
		retweetsOfTweetId: input.retweetsOfTweetId,
		sinceDate: input.sinceDate,
		toUser: input.toUser,
		untilDate: input.untilDate,
		url: input.url,
		verifiedOnly: input.verifiedOnly,
	};
}
