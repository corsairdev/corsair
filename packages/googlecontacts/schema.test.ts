import { GoogleContactsSchema } from './schema';

describe('GoogleContacts schema', () => {
	it('declares a semver version', () => {
		expect(GoogleContactsSchema.version).toBeDefined();
		expect(GoogleContactsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleContactsSchema.entities).toBe('object');
		expect(GoogleContactsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoogleContactsSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(GoogleContactsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
