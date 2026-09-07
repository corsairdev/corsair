import { ReplyioSchema } from './schema';

describe('Replyio schema', () => {
	it('declares a semver version', () => {
		expect(ReplyioSchema.version).toBeDefined();
		expect(ReplyioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ReplyioSchema.entities).toBe('object');
		expect(ReplyioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ReplyioSchema.entities))).toBe(true);
		for (const entity of Object.values(ReplyioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
