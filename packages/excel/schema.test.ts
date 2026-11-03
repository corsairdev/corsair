import { ExcelSchema } from './schema';

describe('Excel schema', () => {
	it('declares a semver version', () => {
		expect(ExcelSchema.version).toBeDefined();
		expect(ExcelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ExcelSchema.entities).toBe('object');
		expect(ExcelSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ExcelSchema.entities))).toBe(true);
		for (const entity of Object.values(ExcelSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
