import { AllimagesaiSchema } from './schema';
import {
	AllimagesaiDownloadedImage,
	AllimagesaiImageGeneration,
	AllimagesaiWebhook,
} from './schema/database';

describe('Allimagesai schema', () => {
	it('declares a semver version', () => {
		expect(AllimagesaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers exactly the entities the endpoints write to', () => {
		expect(Object.keys(AllimagesaiSchema.entities).sort()).toEqual([
			'downloadedImages',
			'imageGenerations',
			'webhooks',
		]);
	});

	it('gives every entity a required string id', () => {
		for (const entity of Object.values(AllimagesaiSchema.entities)) {
			expect(entity.safeParse({}).success).toBe(false);
			expect(entity.shape.id.safeParse('some-id').success).toBe(true);
		}
	});

	describe('AllimagesaiImageGeneration', () => {
		it('accepts a flattened print record', () => {
			const parsed = AllimagesaiImageGeneration.parse({
				id: 'p-1',
				name: 'Campaign hero',
				prompt: 'a red bicycle',
				status: 3,
				process_mode: 'fast',
				nb_images: 4,
				tags: ['campaign'],
				image_urls: ['https://cdn.example/i-1.jpg'],
				params: { format: 'landscape' },
				created_at: '2026-02-01T10:00:00.000Z',
			});

			expect(parsed.created_at).toEqual(new Date('2026-02-01T10:00:00.000Z'));
			expect(parsed.params).toEqual({ format: 'landscape' });
		});

		it('requires name, prompt and status', () => {
			expect(AllimagesaiImageGeneration.safeParse({ id: 'p-1' }).success).toBe(
				false,
			);
		});
	});

	describe('AllimagesaiDownloadedImage', () => {
		it('coerces the download timestamp and tolerates a missing upscale link', () => {
			const parsed = AllimagesaiDownloadedImage.parse({
				id: 'img-1',
				url: 'https://cdn.example/preview.jpg',
				url_full: 'https://cdn.example/full.jpg',
				url_upscale: null,
				url_upscale_uhd: 'https://cdn.example/uhd.jpg',
				downloaded_at: '2026-02-01T09:00:00.000Z',
			});

			expect(parsed.downloaded_at).toEqual(
				new Date('2026-02-01T09:00:00.000Z'),
			);
			expect(parsed.url_upscale).toBeNull();
		});
	});

	describe('AllimagesaiWebhook', () => {
		it('stores the url and locally-recorded events', () => {
			const parsed = AllimagesaiWebhook.parse({
				id: 'wh-1',
				url: 'https://example.com/hook',
				events: ['print.completed'],
			});

			expect(parsed.events).toEqual(['print.completed']);
		});

		// The provider returns the API key itself as `apiKeyId`; the entity has no
		// column for it so a live credential can never be written to the store.
		it('has no field for the provider-echoed apiKeyId', () => {
			expect(Object.keys(AllimagesaiWebhook.shape)).not.toContain('apiKeyId');

			const parsed = AllimagesaiWebhook.parse({
				id: 'wh-1',
				url: 'https://example.com/hook',
				apiKeyId: 'super-secret-key',
			});

			expect(JSON.stringify(parsed)).not.toContain('super-secret-key');
		});
	});
});
