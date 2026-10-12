import { ClaidAiEndpointInputSchemas as In } from './endpoints/types';

describe('Claid.ai input schemas', () => {
	it('requires credentials for cloud storage connectors', () => {
		expect(
			In.createStorage.safeParse({
				name: 's3-playground',
				type: 's3',
				parameters: { bucket: 'playground' },
			}).success,
		).toBe(false);
	});

	it('accepts a web folder connector with only a base URL', () => {
		expect(
			In.createStorage.parse({
				name: 'site-images',
				type: 'web_folder',
				parameters: { base_url: 'https://example.com/images/' },
			}),
		).toEqual({
			name: 'site-images',
			type: 'web_folder',
			parameters: { base_url: 'https://example.com/images/' },
		});
	});

	it('rejects storage names longer than 50 characters', () => {
		expect(
			In.createStorage.safeParse({
				name: 'x'.repeat(51),
				type: 'web_folder',
				parameters: { base_url: 'https://example.com/' },
			}).success,
		).toBe(false);
	});

	it('rejects non-positive storage ids', () => {
		expect(In.deleteStorage.safeParse({ storage_id: 0 }).success).toBe(false);
		expect(In.storageDetails.parse({ storage_id: 3 })).toEqual({
			storage_id: 3,
		});
	});

	it('enforces the 3 to 1024 character prompt length for image generation', () => {
		expect(In.imageGenerate.safeParse({ input: 'ab' }).success).toBe(false);
		expect(
			In.imageGenerate.safeParse({ input: 'x'.repeat(1025) }).success,
		).toBe(false);
		expect(In.imageGenerate.parse({ input: 'a red bicycle' })).toEqual({
			input: 'a red bicycle',
		});
	});

	it('requires a prompt for AI edits', () => {
		expect(
			In.imageAiEdit.safeParse({
				input: 'https://example.com/a.png',
				options: {},
			}).success,
		).toBe(false);
	});
});
