import { ImageKitSchema } from './schema';

describe('ImageKit schema', () => {
	it('declares a semver version', () => {
		expect(ImageKitSchema.version).toBeDefined();
		expect(ImageKitSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: this plugin calls a control-plane media API with no useful local sync', () => {
		expect(ImageKitSchema.entities).toEqual({});
	});
});
