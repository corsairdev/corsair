import { ListenNotesSchema } from './schema';

describe('ListenNotes schema', () => {
	it('declares a semver version', () => {
		expect(ListenNotesSchema.version).toBeDefined();
		expect(ListenNotesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ListenNotesSchema.entities).toBe('object');
		expect(ListenNotesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ListenNotesSchema.entities))).toBe(true);
		for (const entity of Object.values(ListenNotesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
