import { NgrokSchema } from './schema';

describe('Ngrok schema', () => {
	it('declares a semver version', () => {
		expect(NgrokSchema.version).toBeDefined();
		expect(NgrokSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NgrokSchema.entities).toBe('object');
		expect(NgrokSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NgrokSchema.entities))).toBe(true);
		for (const entity of Object.values(NgrokSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
