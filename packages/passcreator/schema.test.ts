// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PasscreatorSchema } from './schema';

describe('PasscreatorSchema', () => {
	it('declares a semver version', () => {
		expect(PasscreatorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because passes are read live and webhook deliveries carry the pass object', () => {
		expect(Array.isArray(PasscreatorSchema.entities)).toBe(false);
		expect(PasscreatorSchema.entities).toEqual({});
	});
});
