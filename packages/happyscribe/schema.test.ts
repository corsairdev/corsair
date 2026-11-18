import { HappyScribeSchema } from './schema';

describe('HappyScribe schema', () => {
	it('declares a semver version', () => {
		expect(HappyScribeSchema.version).toBeDefined();
		expect(HappyScribeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: transcripts live in Happy Scribe and poll through the API', () => {
		expect(HappyScribeSchema.entities).toEqual({});
	});
});
