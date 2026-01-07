import { Slack } from '../slack-api';
import { ChatService, SearchService } from '../../services/slack';
import {
	generateTestId,
	getTestChannel,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('Slack.Messages - Chat and Search API', () => {
	const testChannel = getTestChannel();
	let sentMessageTs: string | undefined;

	afterAll(async () => {
		if (sentMessageTs && testChannel) {
			try {
				await Slack.Messages.delete({
					channel: testChannel,
					ts: sentMessageTs,
				});
				console.log(`Cleanup: Deleted message ${sentMessageTs}`);
			} catch (e) {
				console.warn(`Cleanup failed for message ${sentMessageTs}`);
			}
		}
	});

	describe('Service class methods', () => {
		it('should have all chat methods defined', () => {
			expect(typeof ChatService.chatDelete).toBe('function');
			expect(typeof ChatService.chatGetPermalink).toBe('function');
			expect(typeof ChatService.chatPostMessage).toBe('function');
			expect(typeof ChatService.chatUpdate).toBe('function');
		});

		it('should have search methods defined', () => {
			expect(typeof SearchService.searchMessages).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all message methods through facade', () => {
			expect(typeof Slack.Messages.delete).toBe('function');
			expect(typeof Slack.Messages.getPermalink).toBe('function');
			expect(typeof Slack.Messages.send).toBe('function');
			expect(typeof Slack.Messages.update).toBe('function');
			expect(typeof Slack.Messages.search).toBe('function');
		});
	});

	describe('send', () => {
		it('should send a simple message (integration test)', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const response = await Slack.Messages.send({
					channel: testChannel,
					text: `Test message - ${testId}`,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.ts).toBeDefined();
				expect(response.channel).toBe(testChannel);

				sentMessageTs = response.ts;
				console.log('Sent message ts:', response.ts);
				console.log('Channel:', response.channel);
			} catch (error: any) {
				if (error?.body?.error === 'channel_not_found') {
					console.log('Test channel not found - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});

		it('should send a message with blocks (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Messages.send({
					channel: testChannel,
					text: 'Message with blocks fallback',
					blocks: [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: '*Test message with blocks*',
							},
						},
						{
							type: 'divider',
						},
						{
							type: 'section',
							text: {
								type: 'plain_text',
								text: 'This is a block kit message from automated tests.',
							},
						},
					],
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				if (response.ts) {
					await sleep(500);
					await Slack.Messages.delete({
						channel: testChannel,
						ts: response.ts,
					});
				}

				console.log('Sent block message ts:', response.ts);
			} catch (error: any) {
				if (error?.body?.error === 'channel_not_found') {
					console.log('Test channel not found - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});

	describe('update', () => {
		it('should update a message (integration test)', async () => {
			if (requireToken()) return;
			if (!sentMessageTs) {
				console.warn('No sent message available for testing');
				return;
			}

			try {
				await sleep(1000);
				const response = await Slack.Messages.update({
					channel: testChannel,
					ts: sentMessageTs,
					text: `Updated test message - ${generateTestId()}`,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.ts).toBe(sentMessageTs);

				console.log('Updated message ts:', response.ts);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getPermalink', () => {
		it('should get message permalink (integration test)', async () => {
			if (requireToken()) return;
			if (!sentMessageTs) {
				console.warn('No sent message available for testing');
				return;
			}

			try {
				const response = await Slack.Messages.getPermalink({
					channel: testChannel,
					message_ts: sentMessageTs,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.permalink).toBeDefined();
				expect(response.permalink).toContain('slack.com');

				console.log('Permalink:', response.permalink);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('search', () => {
		it('should search messages (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Messages.search({
					query: 'test',
					count: 5,
					sort: 'timestamp',
					sort_dir: 'desc',
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.messages).toBeDefined();

				console.log('Search total:', response.messages?.total);
				console.log('Matches:', response.messages?.matches?.length);
				response.messages?.matches?.slice(0, 3).forEach((match) => {
					console.log(`  [${match.ts}] ${match.text?.substring(0, 50)}...`);
				});
			} catch (error: any) {
				if (error?.body?.error === 'not_allowed_token_type') {
					console.log('Search requires user token - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});
});
