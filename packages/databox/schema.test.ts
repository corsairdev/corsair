import { DataboxSchema } from './schema';

describe('Databox schema', () => {
	it('declares a semver version', () => {
		expect(DataboxSchema.version).toBeDefined();
		expect(DataboxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities', () => {
		// Every read is a live query and ingestions are polled on demand, so
		// there is no local state worth syncing.
		expect(DataboxSchema.entities).toEqual({});
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
