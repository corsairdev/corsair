import { AuthMissingError } from 'corsair/core';
import { timelink } from './index';
import { TimelinkSchema } from './schema';

describe('Timelink schema', () => {
	it('declares a semver version', () => {
		expect(TimelinkSchema.version).toBeDefined();
		expect(TimelinkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TimelinkSchema.entities).toBe('object');
		expect(TimelinkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TimelinkSchema.entities))).toBe(true);
		for (const entity of Object.values(TimelinkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('marks person delete as destructive', () => {
		const plugin = timelink({ key: 'test' });
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(meta['deletePerson.delete']?.riskLevel).toBe('destructive');
	});

	it('throws AuthMissingError when the API key is missing', async () => {
		const plugin = timelink({});
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('expected keyBuilder');
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws AuthMissingError when keyBuilder has no matching source', async () => {
		const plugin = timelink({});
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('expected keyBuilder');
		await expect(keyBuilder({} as never, 'webhook')).rejects.toThrow(
			AuthMissingError,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
