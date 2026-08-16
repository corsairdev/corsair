import { BotpressSchema } from './schema';

describe('Botpress schema', () => {
	it('declares a semver version', () => {
		expect(BotpressSchema.version).toBeDefined();
		expect(BotpressSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BotpressSchema.entities).toBe('object');
		expect(BotpressSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BotpressSchema.entities))).toBe(true);
		for (const entity of Object.values(BotpressSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
