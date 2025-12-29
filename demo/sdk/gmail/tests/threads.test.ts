import { Gmail } from '../api';
import { getTestUserId, handleRateLimit, requireToken } from './setup';

describe('Gmail.Threads - Threads API', () => {
	const userId = getTestUserId();

	describe('list', () => {
		it('should list threads', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Threads.list(userId, undefined, 10);

				expect(response).toBeDefined();
				expect(response.threads).toBeDefined();

				if (response.threads && response.threads.length > 0) {
					console.log(`Found ${response.threads.length} threads`);
					console.log('First thread ID:', response.threads[0].id);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should list threads with query', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Threads.list(userId, 'is:inbox', 5);

				expect(response).toBeDefined();

				if (response.threads) {
					console.log(`Found ${response.threads.length} inbox threads`);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get a thread by ID', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Threads.list(userId, undefined, 1);

				if (listResponse.threads && listResponse.threads.length > 0) {
					const threadId = listResponse.threads[0].id!;
					const thread = await Gmail.Threads.get(userId, threadId, 'full');

					expect(thread).toBeDefined();
					expect(thread.id).toBe(threadId);
					expect(thread.messages).toBeDefined();

					console.log('Thread ID:', thread.id);
					console.log('Messages in thread:', thread.messages?.length);
					console.log('Snippet:', thread.snippet);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('modify', () => {
		it('should modify thread labels', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Threads.list(userId, 'is:inbox', 1);

				if (listResponse.threads && listResponse.threads.length > 0) {
					const threadId = listResponse.threads[0].id!;

					const modifiedThread = await Gmail.Threads.modify(userId, threadId, {
						addLabelIds: ['STARRED'],
					});

					expect(modifiedThread).toBeDefined();
					expect(modifiedThread.id).toBe(threadId);

					console.log('Modified thread:', threadId);

					await Gmail.Threads.modify(userId, threadId, {
						removeLabelIds: ['STARRED'],
					});
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('trash and untrash', () => {
		it('should trash and untrash a thread', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Gmail.Threads.list(userId, 'is:inbox', 1);

				if (listResponse.threads && listResponse.threads.length > 0) {
					const threadId = listResponse.threads[0].id!;

					const trashedThread = await Gmail.Threads.trash(userId, threadId);
					expect(trashedThread).toBeDefined();
					console.log('Trashed thread:', threadId);

					const untrashedThread = await Gmail.Threads.untrash(userId, threadId);
					expect(untrashedThread).toBeDefined();
					console.log('Untrashed thread:', threadId);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
