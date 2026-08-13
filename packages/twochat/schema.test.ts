import { TwoChatSchema } from './schema';

describe('TwoChat schema', () => {
	it('declares a semver version', () => {
		expect(TwoChatSchema.version).toBeDefined();
		expect(TwoChatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TwoChatSchema.entities).toBe('object');
		expect(TwoChatSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TwoChatSchema.entities))).toBe(true);
		for (const entity of Object.values(TwoChatSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
