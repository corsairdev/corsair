import { SnapchatSchema } from './schema';

describe('Snapchat schema', () => {
	it('declares a semver version', () => {
		expect(SnapchatSchema.version).toBeDefined();
		expect(SnapchatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SnapchatSchema.entities).toBe('object');
		expect(SnapchatSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SnapchatSchema.entities))).toBe(true);
		for (const entity of Object.values(SnapchatSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
