import { Gmail } from '../gmail-api';
import {
	createTestEmail,
	generateTestId,
	getTestEmail,
	getTestUserId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('Gmail.Messages - Messages API', () => {
	const userId = getTestUserId();
	let sentMessageId: string | undefined;

	afterAll(async () => {
		if (sentMessageId) {
			try {
				await Gmail.Messages.delete(userId, sentMessageId);
				console.log(`Cleanup: Deleted message ${sentMessageId}`);
			} catch (e) {
				console.warn(`Cleanup failed for message ${sentMessageId}`);
			}
		}
	});

	describe('list', () => {
		it('should list messages', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Messages.list(userId, undefined, 10);

				expect(response).toBeDefined();
				expect(response.messages).toBeDefined();

				if (response.messages && response.messages.length > 0) {
					console.log(`Found ${response.messages.length} messages`);
					console.log('First message ID:', response.messages[0].id);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should list messages with query', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Messages.list(userId, 'is:inbox', 5);

				expect(response).toBeDefined();

				if (response.messages) {
					console.log(`Found ${response.messages.length} inbox messages`);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('send', () => {
		it('should send a message', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const subject = `Test Email - ${testId}`;
				const body = `This is a test email sent at ${new Date().toISOString()}`;
				const raw = createTestEmail(getTestEmail(), subject, body);

				const response = await Gmail.Messages.send(userId, { raw });

				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				expect(response.threadId).toBeDefined();

				sentMessageId = response.id;

				console.log('Sent message ID:', response.id);
				console.log('Thread ID:', response.threadId);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get a message by ID', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Messages.list(userId, undefined, 1);

				if (listResponse.messages && listResponse.messages.length > 0) {
					const messageId = listResponse.messages[0].id!;
					const message = await Gmail.Messages.get(userId, messageId, 'full');

					expect(message).toBeDefined();
					expect(message.id).toBe(messageId);
					expect(message.payload).toBeDefined();

					console.log('Message ID:', message.id);
					console.log('Snippet:', message.snippet);
					console.log('Labels:', message.labelIds?.join(', '));
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('modify', () => {
		it('should modify message labels', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Messages.list(userId, 'is:inbox', 1);

				if (listResponse.messages && listResponse.messages.length > 0) {
					const messageId = listResponse.messages[0].id!;

					const modifiedMessage = await Gmail.Messages.modify(
						userId,
						messageId,
						{
							addLabelIds: ['STARRED'],
						},
					);

					expect(modifiedMessage).toBeDefined();
					expect(modifiedMessage.labelIds).toContain('STARRED');

					console.log('Modified message:', messageId);
					console.log('Labels:', modifiedMessage.labelIds?.join(', '));

					await Gmail.Messages.modify(userId, messageId, {
						removeLabelIds: ['STARRED'],
					});
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('trash and untrash', () => {
		it('should trash and untrash a message', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Messages.list(userId, 'is:inbox', 1);

				if (listResponse.messages && listResponse.messages.length > 0) {
					const messageId = listResponse.messages[0].id!;

					const trashedMessage = await Gmail.Messages.trash(userId, messageId);
					expect(trashedMessage.labelIds).toContain('TRASH');
					console.log('Trashed message:', messageId);

					const untrashedMessage = await Gmail.Messages.untrash(
						userId,
						messageId,
					);
					expect(untrashedMessage.labelIds).not.toContain('TRASH');
					console.log('Untrashed message:', messageId);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
