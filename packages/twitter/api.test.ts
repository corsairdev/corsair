import 'dotenv/config';
import { makeTwitterRequest } from './client';
import type {
	TweetsCreateReplyResponse,
	TweetsCreateResponse,
} from './endpoints/types';
import { TwitterEndpointOutputSchemas } from './endpoints/types';

const TEST_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN!;

describe('Twitter API Type Tests', () => {
	describe('tweets', () => {
		it('tweetsCreate returns correct type', async () => {
			if (!TEST_ACCESS_TOKEN) return;

			const response = await makeTwitterRequest<TweetsCreateResponse>(
				'/2/tweets',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { text: 'Test tweet from Corsair integration test' },
				},
			);

			TwitterEndpointOutputSchemas.tweetsCreate.parse(response);
		});

		it('tweetsCreateReply returns correct type', async () => {
			if (!TEST_ACCESS_TOKEN || !process.env.TEST_TWITTER_TWEET_ID) return;

			const response = await makeTwitterRequest<TweetsCreateReplyResponse>(
				'/2/tweets',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						text: 'Test reply from Corsair integration test',
						reply: {
							in_reply_to_tweet_id: process.env.TEST_TWITTER_TWEET_ID,
						},
					},
				},
			);

			TwitterEndpointOutputSchemas.tweetsCreateReply.parse(response);
		});
	});
});
