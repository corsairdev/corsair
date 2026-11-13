import {
	ContactSchema,
	EndorsalEndpointInputSchemas,
	EndorsalEndpointOutputSchemas,
	MatchSchema,
	NewContactSchema,
	NewTagSchema,
	NewTestimonialSchema,
	TagSchema,
	TestimonialSchema,
} from './endpoints/types';
import { EndorsalSchema } from './schema';
import { endorsalEntities } from './schema/database';

describe('Endorsal database schema', () => {
	it('declares a semver version and no local entities', () => {
		expect(EndorsalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(EndorsalSchema.entities).toBe(endorsalEntities);
		expect(EndorsalSchema.entities).toEqual({});
	});
});

describe('Endorsal request schemas', () => {
	it('validates required testimonial fields and provider enum bounds', () => {
		expect(
			NewTestimonialSchema.safeParse({
				name: 'Jane Doe',
				propertyID: 'property_123',
				comments: 'Great service',
				rating: 5,
				approved: 2,
				featured: 1,
			}).success,
		).toBe(true);
		expect(
			NewTestimonialSchema.safeParse({
				name: 'Jane Doe',
				propertyID: 'property_123',
				comments: 'Great service',
				rating: 6,
			}).success,
		).toBe(false);
		expect(
			NewTestimonialSchema.safeParse({
				name: 'Jane Doe',
				propertyID: 'property_123',
				comments: 'Great service',
				callback_url: 'https://example.com',
			}).success,
		).toBe(false);
	});

	it('requires either contact email or phone and rejects undocumented properties', () => {
		expect(
			NewContactSchema.safeParse({ email: 'jane@example.com' }).success,
		).toBe(true);
		expect(NewContactSchema.safeParse({ phone: '+14172618261' }).success).toBe(
			true,
		);
		expect(NewContactSchema.safeParse({ name: 'Jane Doe' }).success).toBe(
			false,
		);
		expect(
			NewContactSchema.safeParse({
				email: 'jane@example.com',
				webhook_url: 'https://example.com',
			}).success,
		).toBe(false);
	});

	it('validates tag types and allows provider-nullable response values', () => {
		expect(
			NewTagSchema.safeParse({ name: 'Product', type: 'product' }).success,
		).toBe(true);
		expect(
			TagSchema.safeParse({ _id: 'tag_123', image: null, edited: 123 }).success,
		).toBe(true);
		expect(
			ContactSchema.safeParse({ _id: 'contact_123', activity: { added: 123 } })
				.success,
		).toBe(true);
		expect(TestimonialSchema.safeParse({ rating: 0 }).success).toBe(false);
	});

	it('accepts existing tag objects with provider fields in addition to _id', () => {
		expect(
			EndorsalEndpointInputSchemas.testimonialsAddTags.safeParse({
				id: 'testimonial_123',
				tags: [{ _id: 'tag_123', name: 'Product', type: 'product' }],
			}).success,
		).toBe(true);
		expect(
			EndorsalEndpointInputSchemas.testimonialsAddTags.safeParse({
				id: 'testimonial_123',
				tags: [{ _id: '', name: 'Product', type: 'product' }],
			}).success,
		).toBe(false);
	});

	it('validates campaign and Wall of Love response object shapes with extensions', () => {
		expect(
			EndorsalEndpointOutputSchemas.campaignsList.safeParse({
				success: true,
				data: [{ _id: 'campaign_123', name: 'Welcome', providerField: true }],
				providerMetadata: 'retained',
			}).success,
		).toBe(true);
		expect(
			EndorsalEndpointOutputSchemas.campaignsList.safeParse({
				success: true,
				data: 42,
			}).success,
		).toBe(false);
		expect(
			EndorsalEndpointOutputSchemas.campaignsGet.safeParse({
				success: true,
				data: { _id: 'campaign_123', name: 'Welcome', providerField: true },
			}).success,
		).toBe(true);
		expect(
			EndorsalEndpointOutputSchemas.campaignsGet.safeParse({
				success: true,
				data: [{ _id: 'campaign_123' }],
			}).success,
		).toBe(false);
		expect(
			EndorsalEndpointOutputSchemas.wallOfLoveGet.safeParse({
				success: true,
				data: {
					widgetType: 'wallOfLove',
					settings: { columns: 3 },
					providerField: 'retained',
				},
			}).success,
		).toBe(true);
		expect(
			EndorsalEndpointOutputSchemas.wallOfLoveGet.safeParse({
				success: true,
				data: 42,
			}).success,
		).toBe(false);
		expect(
			EndorsalEndpointOutputSchemas.wallOfLoveGet.safeParse(
				'<section>Reviews</section>',
			).success,
		).toBe(true);
	});

	it('enforces comparison operators and the array-only in operator', () => {
		expect(
			MatchSchema.safeParse({ field: 'rating', operator: '=', value: 5 })
				.success,
		).toBe(true);
		expect(
			MatchSchema.safeParse({ field: 'rating', operator: 'in', value: [4, 5] })
				.success,
		).toBe(true);
		expect(
			MatchSchema.safeParse({ field: 'rating', operator: 'in', value: 5 })
				.success,
		).toBe(false);
		expect(
			MatchSchema.safeParse({ field: 'rating', operator: 'regex', value: '5' })
				.success,
		).toBe(false);
	});

	it('registers input and output schemas for all 25 documented operations', () => {
		expect(Object.keys(EndorsalEndpointInputSchemas)).toHaveLength(25);
		expect(Object.keys(EndorsalEndpointOutputSchemas).sort()).toEqual(
			Object.keys(EndorsalEndpointInputSchemas).sort(),
		);
	});
});
