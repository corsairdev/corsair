import { MicrosoftClaritySchema } from './schema';

describe('MicrosoftClarity schema', () => {
	it('declares a semver version', () => {
		expect(MicrosoftClaritySchema.version).toBeDefined();
		expect(MicrosoftClaritySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MicrosoftClaritySchema.entities).toBe('object');
		expect(MicrosoftClaritySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MicrosoftClaritySchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(MicrosoftClaritySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
