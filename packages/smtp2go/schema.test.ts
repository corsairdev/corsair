import { Smtp2goSchema } from './schema';

describe('smtp2go schema', () => {
	it('declares a semver version', () => {
		expect(Smtp2goSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// SMTP2GO is a pure API client here: nothing is stored locally, so there
	// are no sync entities to declare.
	it('declares no entities', () => {
		expect(Array.isArray(Smtp2goSchema.entities)).toBe(false);
		expect(Smtp2goSchema.entities).toEqual({});
	});
});
