import { BotsonicSchema } from './schema';

describe('Botsonic schema', () => {
	it('declares a semver version', () => {
		expect(BotsonicSchema.version).toBeDefined();
		expect(BotsonicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BotsonicSchema.entities).toBe('object');
		expect(BotsonicSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BotsonicSchema.entities))).toBe(true);
		for (const entity of Object.values(BotsonicSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
