import { z } from 'zod';
import {
	TripadvisorLocationEntity,
	TripadvisorPhotoEntity,
	TripadvisorReviewEntity,
} from '../schema/database';

export const SearchInputSchema = z.object({
	searchQuery: z.string().min(1),
	language: z.string().min(2).optional(),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const NearbyInputSchema = z.object({
	latLong: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/),
	language: z.string().min(2).optional(),
});
export type NearbyInput = z.infer<typeof NearbyInputSchema>;

export const LocationInputSchema = z.object({
	locationId: z.string().regex(/^[0-9]+$/),
	language: z.string().min(2).optional(),
});
export type LocationInput = z.infer<typeof LocationInputSchema>;

export const LocationListResponseSchema = z.object({
	locations: z.array(TripadvisorLocationEntity),
});
export type LocationListResponse = z.infer<typeof LocationListResponseSchema>;

export const LocationResponseSchema = z.object({
	location: TripadvisorLocationEntity,
});
export type LocationResponse = z.infer<typeof LocationResponseSchema>;

export const PhotoListResponseSchema = z.object({
	photos: z.array(TripadvisorPhotoEntity),
});
export type PhotoListResponse = z.infer<typeof PhotoListResponseSchema>;

export const ReviewListResponseSchema = z.object({
	reviews: z.array(TripadvisorReviewEntity),
});
export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>;

export const EndpointInputSchemas = {
	'locations.search': SearchInputSchema,
	'locations.nearby': NearbyInputSchema,
	'locations.get': LocationInputSchema,
	'photos.list': LocationInputSchema,
	'reviews.list': LocationInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'locations.search': LocationListResponseSchema,
	'locations.nearby': LocationListResponseSchema,
	'locations.get': LocationResponseSchema,
	'photos.list': PhotoListResponseSchema,
	'reviews.list': ReviewListResponseSchema,
} as const;
