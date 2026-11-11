import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './endpoints/types';
import { GoogleSlidesSchema } from './schema';

describe('schema', () => {
	it('declares a semver version', () => {
		expect(GoogleSlidesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares the presentations entity as an object, not an array', () => {
		// Assert on entities itself: Object.keys is always an array, so asserting
		// Array.isArray on it could never fail.
		expect(Array.isArray(GoogleSlidesSchema.entities)).toBe(false);
		expect(GoogleSlidesSchema.entities).toHaveProperty('presentations');
		expect(GoogleSlidesSchema.entities.presentations).toBeDefined();
	});
});

describe('input schemas', () => {
	it('rejects an object id shorter than the documented five characters', () => {
		expect(() =>
			GoogleSlidesEndpointInputSchemas.slidesCreate.parse({
				presentationId: 'deck-1',
				slideObjectId: 'abcd',
			}),
		).toThrow(/5/);
	});

	it('rejects an object id with a character Google refuses', () => {
		expect(() =>
			GoogleSlidesEndpointInputSchemas.slidesCreate.parse({
				presentationId: 'deck-1',
				slideObjectId: 'bad id!',
			}),
		).toThrow();
	});

	it('accepts hyphen and colon after the first character', () => {
		const parsed = GoogleSlidesEndpointInputSchemas.slidesCreate.parse({
			presentationId: 'deck-1',
			slideObjectId: 'g1a2b-c:d',
		});
		expect(parsed.slideObjectId).toBe('g1a2b-c:d');
	});

	it('rejects an empty presentation id', () => {
		expect(() =>
			GoogleSlidesEndpointInputSchemas.presentationsGet.parse({
				presentationId: '',
			}),
		).toThrow();
	});

	it('does not inject a unit the caller left out', () => {
		const parsed = GoogleSlidesEndpointInputSchemas.elementsCreateShape.parse({
			presentationId: 'deck-1',
			shapeType: 'TEXT_BOX',
			elementProperties: {
				pageObjectId: 'slide-1',
				size: { width: { magnitude: 100 }, height: { magnitude: 50 } },
			},
		});
		// A default would report a unit the caller never chose, and the docs
		// generator reads this side of the schema.
		expect(parsed.elementProperties.size?.width?.unit).toBeUndefined();
	});
});

describe('output schemas', () => {
	it('rejects a presentation summary without an id', () => {
		expect(() =>
			GoogleSlidesEndpointOutputSchemas.presentationsGet.parse({
				title: 'no id',
				url: 'https://docs.google.com/presentation/d/x/edit',
				slideCount: 0,
				layoutCount: 0,
				masterCount: 0,
			}),
		).toThrow();
	});

	it('rejects a delete reply that does not say it deleted', () => {
		expect(() =>
			GoogleSlidesEndpointOutputSchemas.presentationsDelete.parse({
				presentationId: 'deck-1',
				deleted: false,
			}),
		).toThrow();
	});

	it('accepts a page with no elements, which a blank slide returns', () => {
		const parsed = GoogleSlidesEndpointOutputSchemas.slidesGet.parse({
			objectId: 'slide-1',
			pageType: 'SLIDE',
		});
		expect(parsed.objectId).toBe('slide-1');
	});

	it('keeps extra provider fields rather than stripping them', () => {
		const parsed = GoogleSlidesEndpointOutputSchemas.slidesGet.parse({
			objectId: 'slide-1',
			slides: [],
			somethingNew: { nested: true },
		}) as Record<string, unknown>; // unknown: asserts a passthrough field survives.
		expect(parsed.somethingNew).toEqual({ nested: true });
	});

	it('rejects a thumbnail reply with no url', () => {
		expect(() =>
			GoogleSlidesEndpointOutputSchemas.slidesThumbnail.parse({
				presentationId: 'deck-1',
				slideObjectId: 'slide-1',
				width: 200,
				height: 100,
				expiresInMinutes: 30,
			}),
		).toThrow();
	});
});
