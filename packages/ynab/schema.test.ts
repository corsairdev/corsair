import { YnabSchema } from './schema';

describe('YNAB schema', () => {
	it('declares a semver version', () => {
		expect(YnabSchema.version).toBeDefined();
		expect(YnabSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof YnabSchema.entities).toBe('object');
		expect(YnabSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(YnabSchema.entities))).toBe(true);
		for (const entity of Object.values(YnabSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a budget moves with every transaction', () => {
		// A category balance changes with every transaction and a month's
		// to-be-budgeted total moves whenever anything is assigned, so a stored
		// copy would disagree with the app.
		expect(Object.keys(YnabSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
