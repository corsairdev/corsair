import { slack } from '@corsair-dev/slack';
import { sql } from 'kysely';
import { makeSlackRequest } from '../../slack/client';
import { createCorsair } from '../core';
import { executePermission } from '../permissions';
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
		).rejects.toThrow(/approval/i);

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

	it('should preserve human-modified args in the database error column when executePermission fails', async () => {
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
							'messages.post': 'require_approval',
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

		// Force the slack API request to throw an error
		mockedMakeSlackRequest.mockRejectedValueOnce(new Error('Slack API Error'));

		// Insert an approved permission record with modified args
		const modifiedArgsObj = {
			channel: 'C123456',
			text: modifiedText,
		};
		const permissionId = 'test-permission-id';
		const token = 'test-token';
		const now = new Date();
		const expiresAt = new Date(now.getTime() + 60000).toISOString();

		await testDb.db
			.insertInto('corsair_permissions')
			.values({
				id: permissionId,
				created_at: now,
				updated_at: now,
				token,
				plugin: 'slack',
				endpoint: 'messages.post',
				args: JSON.stringify({ channel: 'C123456', text: originalText }),
				status: 'approved',
				expires_at: expiresAt,
				error: `__corsair_modified_args__:${JSON.stringify(modifiedArgsObj)}`,
				tenant_id: 'default',
			})
			.execute();

		// Execute the permission - this will invoke executePermission which catches the error
		const execResult = await executePermission(corsair, token);

		expect(execResult.error).toBe('Slack API Error');

		// Retrieve the failed permission from the database
		const failedRecord = await testDb.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.where('id', '=', permissionId)
			.executeTakeFirst();

		expect(failedRecord).toBeDefined();
		expect(failedRecord?.status).toBe('failed');
		// The error column should preserve the modified arguments and append the error message
		expect(failedRecord?.error).toContain('__corsair_modified_args__');
		expect(failedRecord?.error).toContain('__corsair_error__');
		expect(failedRecord?.error).toContain('Slack API Error');

		// Verify that we can still parse the modified args from the updated error column
		const rawArgs = failedRecord!.error!.substring(
			'__corsair_modified_args__:'.length,
		);
		expect(rawArgs).toContain('__corsair_error__:');
		const parts = rawArgs.split('__corsair_error__:');
		expect(parts[0]).toBe(JSON.stringify(modifiedArgsObj));
		expect(parts[1]).toBe('Slack API Error');
	});
});
