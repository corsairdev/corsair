import { slack } from '@corsair-dev/slack';
import { sql } from 'kysely';
import { makeSlackRequest } from '../../slack/client';
import { createCorsair } from '../core';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { createTestDatabase } from './setup-db';

jest.mock('../../slack/client', () => ({
	makeSlackRequest: jest.fn(),
}));

const mockedMakeSlackRequest = makeSlackRequest as jest.MockedFunction<
	typeof makeSlackRequest
>;

describe('Modify and Approve Permissions', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let capturedRequestBody: Record<string, unknown> | null = null;

	beforeEach(async () => {
		testDb = createTestDatabase();
		capturedRequestBody = null;
		jest.clearAllMocks();

		// Create corsair_permissions table in the in-memory test database
		await sql`
			CREATE TABLE IF NOT EXISTS corsair_permissions (
				id TEXT PRIMARY KEY,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				token TEXT NOT NULL,
				plugin TEXT NOT NULL,
				endpoint TEXT NOT NULL,
				args TEXT NOT NULL,
				tenant_id TEXT NOT NULL DEFAULT 'default',
				status TEXT NOT NULL DEFAULT 'pending',
				expires_at TEXT NOT NULL,
				error TEXT NULL
			);
		`.execute(testDb.db);

		// Seed integration and account records
		await createIntegrationAndAccount(testDb.db, 'slack');

		mockedMakeSlackRequest.mockImplementation(
			async (
				endpoint: string,
				token: string,
				options?: {
					method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
					body?: Record<string, unknown>;
					query?: Record<string, string | number | boolean | undefined>;
				},
			) => {
				if (options?.body) {
					capturedRequestBody = { ...options.body };
				}
				const response = {
					ok: true,
					channel: 'C123456',
					ts: '1234567890.123456',
					message: {
						text: (options?.body?.text as string) || '',
						user: 'U123456',
						type: 'message',
					},
				};
				// biome-ignore lint/suspicious/noExplicitAny: Mocking generic endpoint return type requires casting to any
				return response as any;
			},
		);
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('should support modifying args before approval in synchronous mode', async () => {
		const originalText = 'Original text';
		const modifiedText = 'Hello modified by human';

		const corsair = createCorsair({
			kek: 'test_kek',
			plugins: [
				slack({
					authType: 'api_key',
					key: 'mock-slack-key', // Bypasses key lookup
					permissions: {
						mode: 'cautious',
						overrides: {
							'messages.post': 'require_approval', // Explicitly require approval
						},
					},
				}),
			],
			database: testDb.db,
			approval: {
				mode: 'synchronous',
				timeout: '5s',
				onTimeout: 'deny',
			},
		});

		// Trigger action (do not await immediately since it polls/blocks)
		const actionPromise = corsair.slack.api.messages.post({
			channel: 'C123456',
			text: originalText,
		});

		// Wait briefly for the pending record to be inserted into the DB
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Retrieve the pending permission from the database
		const record = await testDb.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.where('plugin', '=', 'slack')
			.where('endpoint', '=', 'messages.post')
			.executeTakeFirst();

		expect(record).toBeDefined();
		expect(record?.status).toBe('pending');

		// Modify and approve the permission record
		await testDb.db
			.updateTable('corsair_permissions')
			.set({
				status: 'approved',
				error: `__corsair_modified_args__:${JSON.stringify({
					channel: 'C123456',
					text: modifiedText,
				})}`,
				updated_at: new Date(),
			})
			.where('id', '=', record!.id)
			.execute();

		// Wait for the action to complete
		await actionPromise;

		// Verify it was executed with the modified args
		expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(1);
		expect(capturedRequestBody?.text).toBe(modifiedText);
		expect(capturedRequestBody?.text).not.toBe(originalText);
	});

	it('should support modifying args before approval in asynchronous mode (on retry)', async () => {
		const originalText = 'Original text';
		const modifiedText = 'Hello modified by human';

		const corsair = createCorsair({
			kek: 'test_kek',
			plugins: [
				slack({
					authType: 'api_key',
					key: 'mock-slack-key',
					permissions: {
						mode: 'cautious',
						overrides: {
							'messages.post': 'require_approval', // Explicitly require approval
						},
					},
				}),
			],
			database: testDb.db,
			approval: {
				mode: 'asynchronous',
				timeout: '5s',
				onTimeout: 'deny',
			},
		});

		// First call - blocks immediately in async mode
		await expect(
			corsair.slack.api.messages.post({
				channel: 'C123456',
				text: originalText,
			}),
		).rejects.toThrow(/requires user approval/i);

		// Retrieve the pending permission from the database
		const record = await testDb.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.where('plugin', '=', 'slack')
			.where('endpoint', '=', 'messages.post')
			.executeTakeFirst();

		expect(record).toBeDefined();
		expect(record?.status).toBe('pending');

		// Modify and approve the permission record
		await testDb.db
			.updateTable('corsair_permissions')
			.set({
				status: 'approved',
				error: `__corsair_modified_args__:${JSON.stringify({
					channel: 'C123456',
					text: modifiedText,
				})}`,
				updated_at: new Date(),
			})
			.where('id', '=', record!.id)
			.execute();

		// Second call (agent retrying with original args)
		await corsair.slack.api.messages.post({
			channel: 'C123456',
			text: originalText,
		});

		// Verify it was executed with the modified args
		expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(1);
		expect(capturedRequestBody?.text).toBe(modifiedText);
		expect(capturedRequestBody?.text).not.toBe(originalText);
	});
});
