import { MixpanelSchema } from './schema';

describe('Mixpanel schema', () => {
	it('declares a semver version', () => {
		expect(MixpanelSchema.version).toBeDefined();
		expect(MixpanelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: every operation is a stateless API call (an import or a
	// read), and Mixpanel profiles are queried live, not synced into Corsair.
	it('stores no entities', () => {
		expect(MixpanelSchema.entities).toEqual({});
		expect(Array.isArray(MixpanelSchema.entities)).toBe(false);
	});
});
