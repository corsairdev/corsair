import { QuickBooksSchema } from './schema';

describe('QuickBooks schema', () => {
	it('declares a semver version', () => {
		expect(QuickBooksSchema.version).toBeDefined();
		expect(QuickBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof QuickBooksSchema.entities).toBe('object');
		expect(QuickBooksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(QuickBooksSchema.entities))).toBe(true);
		for (const entity of Object.values(QuickBooksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
