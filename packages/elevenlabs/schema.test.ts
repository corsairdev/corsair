import { ElevenLabsSchema } from './schema';

describe('ElevenLabs schema', () => {
	it('declares a semver version', () => {
		expect(ElevenLabsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors no entities: everything lives on ElevenLabs', () => {
		expect(ElevenLabsSchema.entities).toEqual({});
	});
});
