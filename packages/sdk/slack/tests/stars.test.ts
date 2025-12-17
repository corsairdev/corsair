import { Slack } from '../api';
import { StarsService } from '../services';
import {
	generateTestId,
	getTestChannel,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('Slack.Stars - Stars API', () => {
	const testChannel = getTestChannel();
	let testMessageTs: string | undefined;

	beforeAll(async () => {
		if (!requireToken()) {
			try {
				const response = await Slack.Messages.send({
					channel: testChannel,
					text: `Star test message - ${generateTestId()}`,
				});
				testMessageTs = response.ts;
				console.log('Created test message for stars:', testMessageTs);
			} catch (e) {
				console.warn('Could not create test message for stars');
			}
		}
	});

	afterAll(async () => {
		if (testMessageTs && testChannel) {
			try {
				await Slack.Messages.delete({
					channel: testChannel,
					ts: testMessageTs,
				});
				console.log(`Cleanup: Deleted test message ${testMessageTs}`);
			} catch (e) {
				console.warn(`Cleanup failed for message ${testMessageTs}`);
			}
		}
	});

	describe('Service class methods', () => {
		it('should have all star methods defined', () => {
			expect(typeof StarsService.starsAdd).toBe('function');
			expect(typeof StarsService.starsRemove).toBe('function');
			expect(typeof StarsService.starsList).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all star methods through facade', () => {
			expect(typeof Slack.Stars.add).toBe('function');
			expect(typeof Slack.Stars.remove).toBe('function');
			expect(typeof Slack.Stars.list).toBe('function');
		});
	});

	describe('add', () => {
		it('should add a star to a message (integration test)', async () => {
			if (requireToken()) return;
			if (!testMessageTs) {
				console.warn('No test message available');
				return;
			}

			try {
				const response = await Slack.Stars.add({
					channel: testChannel,
					timestamp: testMessageTs,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				console.log('Added star to message:', testMessageTs);
			} catch (error: any) {
				if (error?.body?.error === 'already_starred') {
					console.log('Already starred - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});

	describe('list', () => {
		it('should list starred items (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Stars.list({
					count: 10,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(Array.isArray(response.items)).toBe(true);

				console.log('Starred items count:', response.items?.length);
				response.items?.slice(0, 5).forEach((item) => {
					console.log(`  Type: ${item.type}`);
					if (item.message) {
						console.log(
							`    Message: ${item.message.text?.substring(0, 30)}...`,
						);
					}
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('remove', () => {
		it('should remove a star from a message (integration test)', async () => {
			if (requireToken()) return;
			if (!testMessageTs) {
				console.warn('No test message available');
				return;
			}

			try {
				await sleep(1000);
				const response = await Slack.Stars.remove({
					channel: testChannel,
					timestamp: testMessageTs,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				console.log('Removed star from message:', testMessageTs);
			} catch (error: any) {
				if (
					error?.body?.error === 'no_item_specified' ||
					error?.body?.error === 'not_starred'
				) {
					console.log('No star to remove - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});
});
