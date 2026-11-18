import { LinguapopSchema } from './schema';

describe('Linguapop schema', () => {
	it('declares a semver version', () => {
		expect(LinguapopSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities: the only read is a five-language catalogue and invitations are write-only', () => {
		expect(LinguapopSchema.entities).toEqual({});
		expect(Array.isArray(LinguapopSchema.entities)).toBe(false);
	});
});
