import { ReamazeSchema } from './schema';

describe('Re:amaze schema', () => {
	it('declares a semver version', () => {
		expect(ReamazeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities: conversations stay in the brand', () => {
		// Conversations, messages and contacts are read through on every call and
		// carry brand-defined `data` attributes, so a sync would copy shapes that
		// vary per account. Entities stay empty.
		expect(Array.isArray(ReamazeSchema.entities)).toBe(false);
		expect(Object.keys(ReamazeSchema.entities)).toHaveLength(0);
	});
});
