import {
	PlacidEndpointInputSchemas,
	PlacidEndpointOutputSchemas,
} from './endpoints/types';
import { PlacidSchema } from './schema';

describe('PlacidSchema', () => {
	it('stores no entities, because the plugin keeps no local copy of Placid data', () => {
		expect(PlacidSchema.entities).toEqual({});
		expect(PlacidSchema.version).toBe('1.0.0');
	});
});

describe('endpoint schemas', () => {
	it('registers an input and output schema for exactly the same operations', () => {
		expect(Object.keys(PlacidEndpointInputSchemas).sort()).toEqual(
			Object.keys(PlacidEndpointOutputSchemas).sort(),
		);
	});

	it('covers all 26 documented operations', () => {
		expect(Object.keys(PlacidEndpointInputSchemas)).toHaveLength(26);
	});

	it('rejects an image create with no template uuid', () => {
		const result = PlacidEndpointInputSchemas.imagesCreate.safeParse({
			layers: { title: { text: 'x' } },
		});
		expect(result.success).toBe(false);
	});

	it('accepts a layer override using any layer type property', () => {
		// One flat layer object covers text, picture, shape, barcode and
		// subtitle properties, so a caller never has to say which type it is.
		const result = PlacidEndpointInputSchemas.imagesCreate.safeParse({
			template_uuid: 'abc',
			layers: {
				title: { text: 'Hello', font: 'Inter', text_color: '#FFFFFF' },
				photo: { image: 'https://example.com/a.jpg' },
				box: { background_color: '#000000', border_radius: '4' },
				code: { value: 'https://example.com' },
			},
		});
		expect(result.success).toBe(true);
	});

	it('accepts a passthrough string or array but not a bare object', () => {
		const base = { template_uuid: 'abc' };
		expect(
			PlacidEndpointInputSchemas.imagesCreate.safeParse({
				...base,
				passthrough: 'order-1',
			}).success,
		).toBe(true);
		expect(
			PlacidEndpointInputSchemas.imagesCreate.safeParse({
				...base,
				passthrough: ['order-1'],
			}).success,
		).toBe(true);
		expect(
			PlacidEndpointInputSchemas.imagesCreate.safeParse({
				...base,
				passthrough: { order: 1 },
			}).success,
		).toBe(false);
	});

	it('accepts a render reply with the error fields set', () => {
		const result = PlacidEndpointOutputSchemas.imagesGet.safeParse({
			id: 7,
			status: 'error',
			image_url: null,
			polling_url: null,
			error_code: 'MEDIA_DOWNLOAD_FAILED',
			error_message: 'A media file could not be downloaded.',
			error_details: [{ layer: 'img', message: '404' }],
			errors: [],
		});
		expect(result.success).toBe(true);
	});

	it('accepts a queued reply where the optional fields are absent', () => {
		const result = PlacidEndpointOutputSchemas.pdfsGet.safeParse({
			id: 1,
			status: 'queued',
			pdf_url: null,
			polling_url: null,
		});
		expect(result.success).toBe(true);
	});

	it('keeps fields Placid adds later on an output object', () => {
		const result = PlacidEndpointOutputSchemas.templatesGet.parse({
			uuid: 'abc',
			something_new: true,
		});
		expect(result.uuid).toBe('abc');
		// unknown: the parsed object is `.loose()`, so an added key is not on the
		// inferred type; the cast reads it back to prove it survived.
		expect((result as Record<string, unknown>).something_new).toBe(true);
	});

	it('caps a video at 30 fps', () => {
		const clip = { template_uuid: 'abc' };
		expect(
			PlacidEndpointInputSchemas.videosCreate.safeParse({
				clips: [clip],
				modifications: { fps: 30 },
			}).success,
		).toBe(true);
		expect(
			PlacidEndpointInputSchemas.videosCreate.safeParse({
				clips: [clip],
				modifications: { fps: 31 },
			}).success,
		).toBe(false);
	});

	it('requires terms_accepted to be exactly true for a font upload', () => {
		const base = { file_url: 'https://example.com/f.ttf' };
		expect(
			PlacidEndpointInputSchemas.fontsCreate.safeParse({
				...base,
				terms_accepted: true,
			}).success,
		).toBe(true);
		expect(
			PlacidEndpointInputSchemas.fontsCreate.safeParse({
				...base,
				terms_accepted: false,
			}).success,
		).toBe(false);
	});
});
