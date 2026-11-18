import { GoogleContactsEndpointInputSchemas } from './endpoints/types';
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

	it('rejects an empty personFields mask, which Google answers with a 400', () => {
		const list = GoogleContactsEndpointInputSchemas.contactsList;
		expect(list.safeParse({ personFields: [] }).success).toBe(false);
		expect(list.safeParse({ personFields: ['names'] }).success).toBe(true);
		expect(list.safeParse({}).success).toBe(true);
	});

	it('accepts photos in the otherContacts read mask, as the live API does', () => {
		const other = GoogleContactsEndpointInputSchemas.otherContactsList;
		expect(other.safeParse({ readMask: ['names', 'photos'] }).success).toBe(
			true,
		);
		expect(other.safeParse({ readMask: ['addresses'] }).success).toBe(false);
		expect(other.safeParse({ readMask: [] }).success).toBe(false);
		const search = GoogleContactsEndpointInputSchemas.otherContactsSearch;
		expect(search.safeParse({ query: 'a', readMask: ['photos'] }).success).toBe(
			false,
		);
		expect(search.safeParse({ query: 'a', readMask: ['names'] }).success).toBe(
			true,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
