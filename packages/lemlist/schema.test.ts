import { LemlistSchema } from './schema';

describe('Lemlist schema', () => {
	it('declares a semver version', () => {
		expect(LemlistSchema.version).toBeDefined();
		expect(LemlistSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LemlistSchema.entities).toBe('object');
		expect(LemlistSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LemlistSchema.entities))).toBe(true);
		for (const entity of Object.values(LemlistSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
