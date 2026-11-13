import { RagicSchema } from './schema';

describe('Ragic schema', () => {
	it('declares a semver version', () => {
		expect(RagicSchema.version).toBeDefined();
		expect(RagicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RagicSchema.entities).toBe('object');
		expect(RagicSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RagicSchema.entities))).toBe(true);
		for (const entity of Object.values(RagicSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a form’s fields differ per account', () => {
		// A Ragic form's field IDs and names come from the customer's own database,
		// so there is no fixed entity shape to store.
		expect(Object.keys(RagicSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
