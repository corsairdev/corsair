import { StreamtimeSchema } from './schema';

describe('Streamtime schema', () => {
	it('declares a semver version', () => {
		expect(StreamtimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no persisted entities', () => {
		expect(StreamtimeSchema.entities).toEqual({});
	});
});
