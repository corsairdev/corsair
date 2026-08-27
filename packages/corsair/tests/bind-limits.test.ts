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
			errorHandlers: {},
			currentPath: [],
			permissionsConfig: undefined,
			permissionsOptions: {
				timeout: '10m',
				onTimeout: 'deny',
				limits: [{ max: 1, window: '1m', type: 'rate_limit' }],
			},
			database: testDb.database,
		});

		const boundMethod = tree.testMethod as () => Promise<string>;

		const result1 = await boundMethod();
		expect(result1).toBe('success');

		await expect(boundMethod()).rejects.toThrow('rate limited');
	});

	it('rejects usage limits when no database is configured', () => {
		expect(() =>
			bindEndpointsRecursively({
				endpoints: { testMethod: () => 'success' },
				hooks: undefined,
				ctx: {},
				tree: {},
				pluginId: 'test-plugin',
				errorHandlers: {},
				currentPath: [],
				permissionsOptions: {
					timeout: '10m',
					onTimeout: 'deny',
					limits: [{ max: 1, window: '1m', type: 'rate_limit' }],
				},
			}),
		).toThrow(/database/);
	});
});
