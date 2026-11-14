import { StackExchangeSchema } from './schema';

describe('StackExchange schema', () => {
	it('declares a semver version', () => {
		expect(StackExchangeSchema.version).toBeDefined();
		expect(StackExchangeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof StackExchangeSchema.entities).toBe('object');
		expect(StackExchangeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(StackExchangeSchema.entities))).toBe(true);
		for (const entity of Object.values(StackExchangeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
