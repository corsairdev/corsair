import { OpengraphSchema } from './schema';

describe('Opengraph schema', () => {
	it('declares a semver version', () => {
		expect(OpengraphSchema.version).toBeDefined();
		expect(OpengraphSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because OpenGraph.io answers per URL with nothing to sync', () => {
		expect(OpengraphSchema.entities).toEqual({});
	});
});
