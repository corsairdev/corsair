import { z } from 'zod';

const NearbySearchInputBaseSchema = z.object({
	location_id: z.string().min(1).optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	radius: z.number().positive().optional(),
	unit: z.enum(['MI', 'KM']).optional(),
	sw_lat: z.number().min(-90).max(90).optional(),
	sw_lon: z.number().min(-180).max(180).optional(),
	ne_lat: z.number().min(-90).max(90).optional(),
	ne_lon: z.number().min(-180).max(180).optional(),
	category: z.enum(['RESTAURANT', 'ATTRACTION', 'HOTEL']).optional(),
	min_rating: z.number().min(1).max(5).optional(),
	locale: z.array(z.string().min(1)).min(1).optional(),
	page: z.number().int().min(1).optional(),
	size: z.number().int().min(1).max(20).optional(),
	sort: z.array(z.string().min(1)).min(1).optional(),
});

export const LocationsNearbyInputSchema =
	NearbySearchInputBaseSchema.superRefine((input, ctx) => {
		const hasLocationReference = input.location_id !== undefined;
		const hasCoordinates = input.lat !== undefined && input.lon !== undefined;
		if (!hasLocationReference && !hasCoordinates) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['lat'],
				message: 'Provide location_id or both lat and lon',
			});
		}

		const hasBoundingBox =
			input.sw_lat !== undefined &&
			input.sw_lon !== undefined &&
			input.ne_lat !== undefined &&
			input.ne_lon !== undefined;
		if (input.radius === undefined && !hasBoundingBox) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['radius'],
				message: 'Provide radius or all four bounding-box coordinates',
			});
		}
	});

export type LocationsNearbyInput = z.infer<typeof LocationsNearbyInputSchema>;

const AddressSchema = z
	.object({
		city: z.string().optional(),
		country_code: z.string().optional(),
		country_name: z.string().optional(),
		formatted: z.string().optional(),
		language: z.string().optional(),
		postal_code: z.string().optional(),
		state: z.string().optional(),
		street_address: z.string().optional(),
		street_address2: z.string().optional(),
	})
	.loose();

const CoordinatesSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const TranslationSchema = z.object({
	language: z.string(),
	value: z.string(),
});

const TranslationWithPrimarySchema = TranslationSchema.extend({
	primary: z.boolean().optional(),
});

const OverallSchema = z
	.object({
		count: z.number().int().optional(),
		icon_url: z.string().optional(),
		rating: z.number().optional(),
	})
	.loose();

const TripadvisorUrlsSchema = z
	.object({
		android_intent: z.string().optional(),
		menu: z.string().optional(),
		official: z.string().optional(),
		tripadvisor: z
			.object({
				main: z.string().optional(),
				photos: z.string().optional(),
				questions_answers: z.string().optional(),
				write_review: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const CatalogLocationSchema = z
	.object({
		addresses: z.array(AddressSchema).optional(),
		coordinates: CoordinatesSchema.optional(),
		descriptions: z.array(TranslationSchema).optional(),
		geo: z.string().optional(),
		geo_id: z.number().int().optional(),
		id: z.number().int(),
		names: z.array(TranslationWithPrimarySchema),
		overall_rating: OverallSchema.optional(),
		urls: TripadvisorUrlsSchema.optional(),
	})
	.loose();

const NearbyCatalogLocationSchema = z
	.object({
		bearing: z.number().optional(),
		distance_kilometers: z.number().optional(),
		distance_miles: z.number().optional(),
		location: CatalogLocationSchema,
	})
	.loose();

const PageMetadataSchema = z
	.object({
		page: z.number().int().optional(),
		size: z.number().int().optional(),
		total_elements: z.number().int().optional(),
		total_pages: z.number().int().optional(),
	})
	.loose();

export const LocationsNearbyResponseSchema = z.object({
	data: z.array(NearbyCatalogLocationSchema),
	pagination: PageMetadataSchema,
});

export type LocationsNearbyResponse = z.infer<
	typeof LocationsNearbyResponseSchema
>;

export type TripadvisorEndpointInputs = {
	locationsNearby: LocationsNearbyInput;
};

export type TripadvisorEndpointOutputs = {
	locationsNearby: LocationsNearbyResponse;
};

export const TripadvisorEndpointInputSchemas = {
	locationsNearby: LocationsNearbyInputSchema,
} as const;

export const TripadvisorEndpointOutputSchemas = {
	locationsNearby: LocationsNearbyResponseSchema,
} as const;
