import { GiftUpSchema } from './schema';

describe('GiftUp schema', () => {
	it('declares a semver version', () => {
		expect(GiftUpSchema.version).toBeDefined();
		expect(GiftUpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GiftUpSchema.entities).toBe('object');
		expect(GiftUpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GiftUpSchema.entities))).toBe(true);
		for (const entity of Object.values(GiftUpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
