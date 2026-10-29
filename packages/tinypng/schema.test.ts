import { TinypngSchema } from './schema';

describe('Tinypng schema', () => {
	it('declares a semver version', () => {
		expect(TinypngSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the image, stored output and usage entities', () => {
		expect(Object.keys(TinypngSchema.entities)).toEqual([
			'images',
			'storedOutputs',
			'usage',
		]);
	});

	it('parses a shrink response as an image entity', () => {
		expect(
			TinypngSchema.entities.images.parse({
				id: 'cciutldm823k9e9r',
				input: { size: 207565, type: 'image/png' },
				output: { size: 30734, type: 'image/png', width: 530, ratio: 0.148 },
			}),
		).toEqual({
			id: 'cciutldm823k9e9r',
			input: { size: 207565, type: 'image/png' },
			output: { size: 30734, type: 'image/png', width: 530, ratio: 0.148 },
		});
	});
});
