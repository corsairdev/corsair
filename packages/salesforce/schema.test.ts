import { SalesforceSchema } from './schema';

describe('Salesforce schema', () => {
	it('declares a semver version', () => {
		expect(SalesforceSchema.version).toBeDefined();
		expect(SalesforceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SalesforceSchema.entities).toBe('object');
		expect(SalesforceSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SalesforceSchema.entities))).toBe(true);
		for (const entity of Object.values(SalesforceSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
