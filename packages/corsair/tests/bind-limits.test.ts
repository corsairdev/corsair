import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { bindEndpointsRecursively } from '../core/endpoints/bind';
import { createTestDatabase } from './setup-db';

describe('bindEndpointsRecursively - Global Limits Bypass', () => {
	let testDb: ReturnType<typeof createTestDatabase>;

	beforeEach(() => {
		testDb = createTestDatabase();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('enforces global limits on a plugin that does NOT define options.permissions', async () => {
		const endpoints = {
			testMethod: () => 'success',
		};

		const tree: Record<string, unknown> = {};

		bindEndpointsRecursively({
			endpoints,
			hooks: undefined,
			ctx: {},
			tree,
			pluginId: 'test-plugin',
			errorHandlers: {
				handle: (e: any) => {
					throw e;
				},
				wrap: (e: any) => {
					throw e;
				},
			},
			currentPath: [],
			// NOTE: permissionsConfig is intentionally undefined!
			permissionsConfig: undefined,
			permissionsOptions: {
				limits: [{ max: 1, window: '1m', type: 'rate_limit' }],
			},
			database: testDb.database,
		});

		const boundMethod = tree.testMethod as () => Promise<string>;

		// First call should succeed and consume the 1 quota
		const result1 = await boundMethod();
		expect(result1).toBe('success');

		// Second call should fail with rate limit error
		await expect(boundMethod()).rejects.toThrow('rate limited');
	});
});
