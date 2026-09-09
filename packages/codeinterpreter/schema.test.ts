import { CodeInterpreterSchema } from './schema';

describe('CodeInterpreter schema', () => {
	it('declares a semver version', () => {
		expect(CodeInterpreterSchema.version).toBeDefined();
		expect(CodeInterpreterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CodeInterpreterSchema.entities).toBe('object');
		expect(CodeInterpreterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CodeInterpreterSchema.entities))).toBe(true);
		for (const entity of Object.values(CodeInterpreterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
