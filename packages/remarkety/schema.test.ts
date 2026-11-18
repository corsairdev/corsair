import { RemarketySchema } from './schema';

describe('Remarkety schema', () => {
	it('declares a semver version', () => {
		expect(RemarketySchema.version).toBeDefined();
		expect(RemarketySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RemarketySchema.entities).toBe('object');
		expect(RemarketySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RemarketySchema.entities))).toBe(true);
		for (const entity of Object.values(RemarketySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since campaign stats move with every send', () => {
		// A campaign's sent count and revenue change with every send, and the store
		// sync advances on its own, so a cached copy would misreport both.
		expect(Object.keys(RemarketySchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
