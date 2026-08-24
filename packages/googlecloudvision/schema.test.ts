import { GoogleCloudVisionSchema } from './schema';

describe('GoogleCloudVision schema', () => {
	it('declares a semver version', () => {
		expect(GoogleCloudVisionSchema.version).toBeDefined();
		expect(GoogleCloudVisionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(GoogleCloudVisionSchema.entities).toEqual({});
	});
});
