import { Gmail } from '../gmail-api';
import {
	generateTestId,
	getTestUserId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('Gmail.Labels - Labels API', () => {
	const userId = getTestUserId();
	let createdLabelId: string | undefined;

	afterAll(async () => {
		if (createdLabelId) {
			try {
				await Gmail.Labels.delete(userId, createdLabelId);
				console.log(`Cleanup: Deleted label ${createdLabelId}`);
			} catch (e) {
				console.warn(`Cleanup failed for label ${createdLabelId}`);
			}
		}
	});

	describe('list', () => {
		it('should list all labels', async () => {
			if (requireToken()) return;

			try {
				const response = await Gmail.Labels.list(userId);

				expect(response).toBeDefined();
				expect(response.labels).toBeDefined();
				expect(Array.isArray(response.labels)).toBe(true);

				if (response.labels) {
					console.log(`Found ${response.labels.length} labels`);
					response.labels.slice(0, 5).forEach((label) => {
						console.log(`  ${label.name} (${label.type})`);
					});
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('create', () => {
		it('should create a new label', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const labelName = `TestLabel_${testId}`;

				const label = await Gmail.Labels.create(userId, {
					name: labelName,
					labelListVisibility: 'labelShow',
					messageListVisibility: 'show',
				});

				expect(label).toBeDefined();
				expect(label.id).toBeDefined();
				expect(label.name).toBe(labelName);
				expect(label.type).toBe('user');

				createdLabelId = label.id;

				console.log('Created label:', label.name);
				console.log('Label ID:', label.id);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get a label by ID', async () => {
			if (requireToken()) return;

			try {
				const label = await Gmail.Labels.get(userId, 'INBOX');

				expect(label).toBeDefined();
				expect(label.id).toBe('INBOX');
				expect(label.name).toBe('INBOX');
				expect(label.type).toBe('system');

				console.log('Label:', label.name);
				console.log('Messages total:', label.messagesTotal);
				console.log('Messages unread:', label.messagesUnread);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('update', () => {
		it('should update a label', async () => {
			if (requireToken()) return;

			if (!createdLabelId) {
				console.log('Skipping update test - no label created');
				return;
			}

			try {
				const updatedLabel = await Gmail.Labels.update(userId, createdLabelId, {
					id: createdLabelId,
					name: `UpdatedLabel_${generateTestId()}`,
					labelListVisibility: 'labelShow',
					messageListVisibility: 'show',
				});

				expect(updatedLabel).toBeDefined();
				expect(updatedLabel.id).toBe(createdLabelId);

				console.log('Updated label:', updatedLabel.name);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('patch', () => {
		it('should patch a label', async () => {
			if (requireToken()) return;

			if (!createdLabelId) {
				console.log('Skipping patch test - no label created');
				return;
			}

			try {
				const patchedLabel = await Gmail.Labels.patch(userId, createdLabelId, {
					messageListVisibility: 'hide',
				});

				expect(patchedLabel).toBeDefined();
				expect(patchedLabel.messageListVisibility).toBe('hide');

				console.log('Patched label visibility');
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('delete', () => {
		it('should delete a label', async () => {
			if (requireToken()) return;

			try {
				const testId = generateTestId();
				const labelName = `TempLabel_${testId}`;

				const label = await Gmail.Labels.create(userId, {
					name: labelName,
				});

				expect(label.id).toBeDefined();

				await Gmail.Labels.delete(userId, label.id!);

				console.log('Deleted label:', labelName);

				try {
					await Gmail.Labels.get(userId, label.id!);
					fail('Label should have been deleted');
				} catch (error: any) {
					expect(error.status).toBe(404);
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
