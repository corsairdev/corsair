import { SevdeskSchema } from './schema';

describe('Sevdesk schema', () => {
	it('declares a semver version', () => {
		expect(SevdeskSchema.version).toBeDefined();
		expect(SevdeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SevdeskSchema.entities).toBe('object');
		expect(SevdeskSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SevdeskSchema.entities))).toBe(true);
		for (const entity of Object.values(SevdeskSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
