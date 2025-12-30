import * as fs from 'fs';
import * as path from 'path';
import { LinearWebhookHandler } from '../webhook-handler';
import type {
	CommentCreatedEvent,
	IssueCreatedEvent,
	IssueDeletedEvent,
	IssueUpdatedEvent,
	ProjectCreatedEvent,
} from '../webhooks';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
	filename: string;
	eventType: string;
	action: string;
	payload: any;
}

const EVENT_TYPES = ['Issue', 'Comment', 'Project'];

const ACTIONS = ['create', 'update', 'remove'];

function extractEventInfo(filename: string): {
	eventType: string;
	action: string;
} {
	for (const eventType of EVENT_TYPES) {
		for (const action of ACTIONS) {
			if (filename.startsWith(`${eventType}_${action}_`)) {
				return { eventType, action };
			}
		}
	}
	const parts = filename.split('_');
	return { eventType: parts[0] || 'unknown', action: parts[1] || 'unknown' };
}

function loadFixtures(): FixtureFile[] {
	if (!fs.existsSync(FIXTURES_DIR)) {
		return [];
	}

	const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));

	return files.map((filename) => {
		const filepath = path.join(FIXTURES_DIR, filename);
		const content = fs.readFileSync(filepath, 'utf-8');
		const { eventType, action } = extractEventInfo(filename);

		return {
			filename,
			eventType,
			action,
			payload: JSON.parse(content),
		};
	});
}

function getFixturesByEvent(eventType: string, action?: string): FixtureFile[] {
	const fixtures = loadFixtures();
	return fixtures.filter((f) => {
		if (action) {
			return f.eventType === eventType && f.action === action;
		}
		return f.eventType === eventType;
	});
}

describe('Real Linear Webhook Events - Dynamic Tests', () => {
	const allFixtures = loadFixtures();

	beforeAll(() => {
		console.log('\n📁 Loaded fixtures from:', FIXTURES_DIR);
		console.log(`   Total fixtures: ${allFixtures.length}`);

		const byType = allFixtures.reduce(
			(acc, f) => {
				const key = `${f.eventType}.${f.action}`;
				acc[key] = (acc[key] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		Object.entries(byType).forEach(([type, count]) => {
			console.log(`   - ${type}: ${count} fixture(s)`);
		});

		if (allFixtures.length === 0) {
			console.log(
				'\n⚠️  No fixtures found! Run the webhook server and trigger some events:',
			);
			console.log('   1. npm run webhook-server');
			console.log('   2. In another terminal: ngrok http 3000');
			console.log('   3. Configure webhook in Linear settings with ngrok URL');
			console.log(
				'   4. Trigger events in Linear (create/update issues, comments, projects)\n',
			);
		}
	});

	describe('Issue Events', () => {
		describe('Issue Create Events', () => {
			const issueCreateFixtures = getFixturesByEvent('Issue', 'create');

			if (issueCreateFixtures.length === 0) {
				it.skip('no Issue.create fixtures available - create an issue in Linear to capture them', () => {});
			} else {
				issueCreateFixtures.forEach((fixture, index) => {
					it(`should process real Issue.create event #${index + 1} (${fixture.filename})`, async () => {
						const handler = new LinearWebhookHandler();
						const issueCallback = jest.fn();
						const createCallback = jest.fn();

						handler.on('Issue', issueCallback);
						handler.on('IssueCreate', createCallback);

						const result = await handler.handleWebhook({}, fixture.payload);

						expect(result.success).toBe(true);
						expect(result.eventType).toBe('Issue');
						expect(result.action).toBe('create');
						expect(issueCallback).toHaveBeenCalled();
						expect(createCallback).toHaveBeenCalled();

						const event = issueCallback.mock.calls[0][0] as IssueCreatedEvent;
						expect(event.action).toBe('create');
						expect(event.type).toBe('Issue');
						expect(event.data).toBeDefined();
						expect(event.data.title).toBeDefined();

						console.log(`   ✨ Issue Created: ${event.data.title}`);
						if (event.data.identifier) {
							console.log(`      ID: ${event.data.identifier}`);
						}
					});
				});
			}
		});

		describe('Issue Update Events', () => {
			const issueUpdateFixtures = getFixturesByEvent('Issue', 'update');

			if (issueUpdateFixtures.length === 0) {
				it.skip('no Issue.update fixtures available - update an issue in Linear to capture them', () => {});
			} else {
				issueUpdateFixtures.forEach((fixture, index) => {
					it(`should process real Issue.update event #${index + 1} (${fixture.filename})`, async () => {
						const handler = new LinearWebhookHandler();
						const callback = jest.fn();
						handler.on('IssueUpdate', callback);

						const result = await handler.handleWebhook({}, fixture.payload);

						expect(result.success).toBe(true);
						expect(callback).toHaveBeenCalled();

						const event = callback.mock.calls[0][0] as IssueUpdatedEvent;
						expect(event.action).toBe('update');
						expect(event.type).toBe('Issue');

						console.log(`   🔄 Issue Updated: ${event.data.title}`);
					});
				});
			}
		});

		describe('Issue Remove Events', () => {
			const issueDeleteFixtures = getFixturesByEvent('Issue', 'remove');

			if (issueDeleteFixtures.length === 0) {
				it.skip('no Issue.remove fixtures available - delete an issue in Linear to capture them', () => {});
			} else {
				issueDeleteFixtures.forEach((fixture, index) => {
					it(`should process real Issue.remove event #${index + 1} (${fixture.filename})`, async () => {
						const handler = new LinearWebhookHandler();
						const callback = jest.fn();
						handler.on('IssueRemove', callback);

						const result = await handler.handleWebhook({}, fixture.payload);

						expect(result.success).toBe(true);
						expect(callback).toHaveBeenCalled();

						const event = callback.mock.calls[0][0] as IssueDeletedEvent;
						expect(event.action).toBe('remove');

						console.log(`   🗑️  Issue Removed: ${event.data.title}`);
					});
				});
			}
		});
	});

	describe('Comment Events', () => {
		const commentFixtures = getFixturesByEvent('Comment');

		if (commentFixtures.length === 0) {
			it.skip('no Comment fixtures available - create/update comments in Linear to capture them', () => {});
		} else {
			commentFixtures.forEach((fixture, index) => {
				it(`should process real Comment event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new LinearWebhookHandler();
					const callback = jest.fn();
					handler.on('Comment', callback);

					const result = await handler.handleWebhook({}, fixture.payload);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as CommentCreatedEvent;
					expect(event.type).toBe('Comment');
					expect(event.action).toMatch(/^(create|update|remove)$/);

					console.log(
						`   💬 Comment ${event.action}: ${event.data.body?.substring(0, 50)}...`,
					);
				});
			});
		}
	});

	describe('Project Events', () => {
		const projectFixtures = getFixturesByEvent('Project');

		if (projectFixtures.length === 0) {
			it.skip('no Project fixtures available - create/update projects in Linear to capture them', () => {});
		} else {
			projectFixtures.forEach((fixture, index) => {
				it(`should process real Project event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new LinearWebhookHandler();
					const callback = jest.fn();
					handler.on('Project', callback);

					const result = await handler.handleWebhook({}, fixture.payload);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as ProjectCreatedEvent;
					expect(event.type).toBe('Project');
					expect(event.action).toMatch(/^(create|update|remove)$/);

					console.log(`   📊 Project ${event.action}: ${event.data.name}`);
				});
			});
		}
	});

	describe('Webhook Handler Features', () => {
		it('should register and call multiple handlers for the same event', async () => {
			const handler = new LinearWebhookHandler();
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			handler.on('Issue', callback1);
			handler.on('Issue', callback2);

			const mockPayload = {
				action: 'create',
				type: 'Issue',
				data: {
					id: 'test-id',
					title: 'Test Issue',
					identifier: 'TEST-1',
				},
				url: 'https://linear.app/test',
				createdAt: new Date().toISOString(),
				organizationId: 'org-id',
				webhookId: 'webhook-id',
			};

			await handler.handleWebhook({}, mockPayload as any);

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});

		it('should remove handlers with off()', async () => {
			const handler = new LinearWebhookHandler();
			const callback = jest.fn();

			handler.on('Issue', callback);
			handler.off('Issue', callback);

			const mockPayload = {
				action: 'create',
				type: 'Issue',
				data: { id: 'test', title: 'Test' },
			};

			await handler.handleWebhook({}, mockPayload as any);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should verify webhook signature when secret is provided', () => {
			const handler = new LinearWebhookHandler({
				webhookSecret: 'test-secret',
			});

			const payload = '{"test":"data"}';
			const crypto = require('crypto');
			const signature = crypto
				.createHmac('sha256', 'test-secret')
				.update(payload)
				.digest('hex');

			const isValid = handler.verifySignature(payload, signature);
			expect(isValid).toBe(true);

			const invalidSignature = 'invalid-signature';
			const isInvalid = handler.verifySignature(payload, invalidSignature);
			expect(isInvalid).toBe(false);
		});
	});
});

describe('Fixture Statistics', () => {
	it('should report available fixtures', () => {
		const fixtures = loadFixtures();

		console.log('\n📊 Fixture Statistics:');
		console.log('═'.repeat(50));

		if (fixtures.length === 0) {
			console.log('No fixtures captured yet.\n');
			console.log('To capture real webhook payloads:');
			console.log('1. Run: npm run webhook-server');
			console.log('2. Run: ngrok http 3000');
			console.log('3. Configure webhook in Linear settings');
			console.log('4. Trigger events (create issues, comments, projects)\n');
		} else {
			const byEvent = fixtures.reduce(
				(acc, f) => {
					const key = `${f.eventType}.${f.action}`;
					acc[key] = (acc[key] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			const eventTypes = [
				'Issue.create',
				'Issue.update',
				'Issue.remove',
				'Comment.create',
				'Comment.update',
				'Comment.remove',
				'Project.create',
				'Project.update',
				'Project.remove',
			];

			eventTypes.forEach((type) => {
				const count = byEvent[type] || 0;
				const status = count > 0 ? '✅' : '⬜';
				console.log(`${status} ${type}: ${count} fixture(s)`);
			});

			console.log('═'.repeat(50));
			console.log(`Total: ${fixtures.length} fixtures\n`);
		}

		expect(true).toBe(true);
	});
});
