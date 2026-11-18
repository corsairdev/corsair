import { TldvSchema } from './schema';

describe('tl;dv schema', () => {
	it('declares a semver version', () => {
		expect(TldvSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because meetings stay in tl;dv', () => {
		// A sync would copy transcripts and notes, which is meeting content the
		// provider already serves; nothing here writes back, so entities stay empty.
		expect(Array.isArray(TldvSchema.entities)).toBe(false);
		expect(Object.keys(TldvSchema.entities)).toHaveLength(0);
	});
});
