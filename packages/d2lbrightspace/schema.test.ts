import { D2LBrightspaceSchema } from './schema';

describe('D2LBrightspace schema', () => {
	it('declares a semver version', () => {
		expect(D2LBrightspaceSchema.version).toBeDefined();
		expect(D2LBrightspaceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof D2LBrightspaceSchema.entities).toBe('object');
		expect(D2LBrightspaceSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(D2LBrightspaceSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(D2LBrightspaceSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
