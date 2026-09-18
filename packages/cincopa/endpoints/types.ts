import { z } from 'zod';

const GalleryListInputSchema = z.object({
	search: z.string().optional(),
	page: z.number().int().min(1).optional(),
	itemsPerPage: z.number().int().min(1).max(100).optional(),
	filterTags: z.string().optional(),
});

export type GalleryListInput = z.infer<typeof GalleryListInputSchema>;

const GallerySchema = z.object({
	fid: z.string(),
	name: z.string(),
	description: z.string(),
	upload_url: z.string().url(),
	tags: z.string(),
	modified: z.string(),
	syncstatus: z.string(),
});

const GalleryListResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number(),
	workspace: z.string().optional(),
	galleries: z.array(GallerySchema),
	tag_cloud: z.record(z.string(), z.number()),
	items_data: z.object({
		page: z.number(),
		items_per_page: z.number(),
		items_count: z.number(),
		pages_count: z.number(),
	}),
});

export type GalleryListResponse = z.infer<typeof GalleryListResponseSchema>;

export type CincopaEndpointInputs = {
	galleryList: GalleryListInput;
};

export type CincopaEndpointOutputs = {
	galleryList: GalleryListResponse;
};

export const CincopaEndpointInputSchemas = {
	galleryList: GalleryListInputSchema,
} as const;

export const CincopaEndpointOutputSchemas = {
	galleryList: GalleryListResponseSchema,
} as const;
