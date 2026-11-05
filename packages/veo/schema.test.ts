import { VeoEndpointInputSchemas, VeoImageSchema } from './endpoints/types';
import { VeoSchema } from './schema';
import { veoEntities } from './schema/database';

describe('Veo schema', () => {
	it('declares a semver version', () => {
		expect(VeoSchema.version).toBe('1.0.0');
		expect(VeoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entity map', () => {
		expect(VeoSchema.entities).toBe(veoEntities);
		expect(Object.keys(VeoSchema.entities)).toEqual([]);
	});
});

describe('Veo input schemas', () => {
	it('accepts a text-to-video request and rejects an unknown model', () => {
		const parsed = VeoEndpointInputSchemas.textToVideoCreate.parse({
			model: 'veo-3.1-generate-001',
			prompt: 'a cat reading',
			durationSeconds: 6,
			sampleCount: 2,
		});
		expect(parsed.durationSeconds).toBe(6);

		expect(
			VeoEndpointInputSchemas.textToVideoCreate.safeParse({
				model: 'veo-3.1-generate-preview',
				prompt: 'a cat reading',
			}).success,
		).toBe(false);
	});

	it('requires exactly one image source and a documented mime type', () => {
		expect(
			VeoImageSchema.safeParse({
				mimeType: 'image/png',
				bytesBase64Encoded: 'abc',
			}).success,
		).toBe(true);
		expect(
			VeoImageSchema.safeParse({
				mimeType: 'image/png',
				gcsUri: 'gs://bucket/frame.png',
			}).success,
		).toBe(true);
		expect(
			VeoImageSchema.safeParse({
				mimeType: 'image/png',
				bytesBase64Encoded: 'abc',
				gcsUri: 'gs://bucket/frame.png',
			}).success,
		).toBe(false);
		expect(
			VeoImageSchema.safeParse({ mimeType: 'image/gif', gcsUri: 'gs://b/a' })
				.success,
		).toBe(false);
	});

	it('limits reference images to three asset images on GA models', () => {
		const image = {
			mimeType: 'image/jpeg' as const,
			bytesBase64Encoded: 'abc',
		};
		const reference = { image, referenceType: 'asset' as const };
		expect(
			VeoEndpointInputSchemas.referencesCreate.safeParse({
				model: 'veo-3.1-fast-generate-001',
				prompt: 'place the vase on the table',
				referenceImages: [reference, reference, reference],
				durationSeconds: 8,
			}).success,
		).toBe(true);
		expect(
			VeoEndpointInputSchemas.referencesCreate.safeParse({
				model: 'veo-3.1-lite-generate-001',
				prompt: 'place the vase on the table',
				referenceImages: [reference],
			}).success,
		).toBe(false);
		expect(
			VeoEndpointInputSchemas.referencesCreate.safeParse({
				model: 'veo-3.1-generate-001',
				prompt: 'place the vase on the table',
				referenceImages: [reference, reference, reference, reference],
			}).success,
		).toBe(false);
		expect(
			VeoEndpointInputSchemas.referencesCreate.safeParse({
				model: 'veo-3.1-generate-001',
				prompt: 'place the vase on the table',
				referenceImages: [reference],
				durationSeconds: 4,
			}).success,
		).toBe(false);
	});

	it('rejects sample counts outside 1-4 and personGeneration allow_all', () => {
		expect(
			VeoEndpointInputSchemas.textToVideoCreate.safeParse({
				model: 'veo-3.1-generate-001',
				prompt: 'a cat',
				sampleCount: 5,
			}).success,
		).toBe(false);
		expect(
			VeoEndpointInputSchemas.textToVideoCreate.safeParse({
				model: 'veo-3.1-generate-001',
				prompt: 'a cat',
				personGeneration: 'allow_all',
			}).success,
		).toBe(false);
	});
});
