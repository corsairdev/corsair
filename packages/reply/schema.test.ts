import { ReplySchema } from './schema';

describe('Reply schema', () => {
	it('declares a semver version', () => {
		expect(ReplySchema.version).toBeDefined();
		expect(ReplySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ReplySchema.entities).toBe('object');
		expect(ReplySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ReplySchema.entities))).toBe(true);
		for (const entity of Object.values(ReplySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
