import { Gmail } from '../gmail-api';
import {
	createTestEmail,
	generateTestId,
	getTestEmail,
	getTestUserId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('Gmail.Drafts - Drafts API', () => {
	const userId = getTestUserId();
	let createdDraftId: string | undefined;

	afterAll(async () => {
		if (createdDraftId) {
			try {
				await Gmail.Drafts.delete(userId, createdDraftId);
				console.log(`Cleanup: Deleted draft ${createdDraftId}`);
			} catch (e) {
				console.warn(`Cleanup failed for draft ${createdDraftId}`);
			}
		}
	});

	describe('list', () => {
		it('should list drafts', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Drafts.list(userId, 10);

				expect(response).toBeDefined();

				if (response.drafts && response.drafts.length > 0) {
					console.log(`Found ${response.drafts.length} drafts`);
					console.log('First draft ID:', response.drafts[0].id);
				} else {
					console.log('No drafts found');
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('create', () => {
		it('should create a draft', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const subject = `Draft Test - ${testId}`;
				const body = `This is a draft created at ${new Date().toISOString()}`;
				const raw = createTestEmail(getTestEmail(), subject, body);

				const draft = await Gmail.Drafts.create(userId, {
					message: { raw },
				});

				expect(draft).toBeDefined();
				expect(draft.id).toBeDefined();
				expect(draft.message).toBeDefined();

				createdDraftId = draft.id;

				console.log('Created draft ID:', draft.id);
				console.log('Message ID:', draft.message?.id);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get a draft by ID', async () => {
			if (requireToken()) return;

			if (!createdDraftId) {
				console.log('Skipping get test - no draft created');
				return;
			}

			try {
				const draft = await Gmail.Drafts.get(userId, createdDraftId, 'full');

				expect(draft).toBeDefined();
				expect(draft.id).toBe(createdDraftId);
				expect(draft.message).toBeDefined();

				console.log('Draft ID:', draft.id);
				console.log('Message snippet:', draft.message?.snippet);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('update', () => {
		it('should update a draft', async () => {
			if (requireToken()) return;

			if (!createdDraftId) {
				console.log('Skipping update test - no draft created');
				return;
			}

			try {
				const testId = generateTestId();
				const subject = `Updated Draft - ${testId}`;
				const body = `This draft was updated at ${new Date().toISOString()}`;
				const raw = createTestEmail(getTestEmail(), subject, body);

				const updatedDraft = await Gmail.Drafts.update(userId, createdDraftId, {
					id: createdDraftId,
					message: { raw },
				});

				expect(updatedDraft).toBeDefined();
				expect(updatedDraft.id).toBe(createdDraftId);

				console.log('Updated draft ID:', updatedDraft.id);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('delete', () => {
		it('should delete a draft', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const subject = `Temp Draft - ${testId}`;
				const body = 'This draft will be deleted';
				const raw = createTestEmail(getTestEmail(), subject, body);

				const draft = await Gmail.Drafts.create(userId, {
					message: { raw },
				});

				expect(draft.id).toBeDefined();

				await Gmail.Drafts.delete(userId, draft.id!);

				console.log('Deleted draft:', draft.id);

				try {
					await Gmail.Drafts.get(userId, draft.id!);
					fail('Draft should have been deleted');
				} catch (error: any) {
					expect(error.status).toBe(404);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('send', () => {
		it('should send a draft', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const subject = `Draft to Send - ${testId}`;
				const body = `This draft will be sent at ${new Date().toISOString()}`;
				const raw = createTestEmail(getTestEmail(), subject, body);

				const draft = await Gmail.Drafts.create(userId, {
					message: { raw },
				});

				expect(draft.id).toBeDefined();

				const sentMessage = await Gmail.Drafts.send(userId, {
					id: draft.id,
				});

				expect(sentMessage).toBeDefined();
				expect(sentMessage.id).toBeDefined();
				expect(sentMessage.threadId).toBeDefined();

				console.log('Sent draft as message ID:', sentMessage.id);

				if (sentMessage.id) {
					await Gmail.Messages.delete(userId, sentMessage.id);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
