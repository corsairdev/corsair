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

const PingInputSchema = z.object({});

const PingResponseSchema = z.object({
	success: z.boolean(),
	ping: z.string().optional(),
	runtime: z.number().optional(),
	accemail: z.string().optional(),
	accid: z.string().optional(),
	accid_num: z.union([z.number(), z.string()]).optional(),
	permissions: z.string().optional(),
	useremail: z.string().optional(),
	userid: z.string().optional(),
	userid_num: z.union([z.number(), z.string()]).optional(),
});

const UploadFromUrlInputSchema = z.object({
	input: z.string().url(),
	fid: z.string().optional(),
	rid: z.string().optional(),
	type: z.string().optional(),
});

const UploadFromUrlResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number().optional(),
	status_id: z.string(),
});

const UploadStatusInputSchema = z.object({
	statusId: z.string().min(1),
});

const UploadStatusResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number().optional(),
	status: z.string().optional(),
	progress: z.union([z.string(), z.number()]).optional(),
	progress_bytes: z.union([z.string(), z.number()]).optional(),
	file_size_bytes: z.union([z.string(), z.number()]).optional(),
	resid: z.string().optional(),
	more: z.string().optional(),
	debug: z.string().optional(),
});

const UploadAbortInputSchema = z.object({
	statusId: z.string().min(1),
});

const UploadAbortResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number().optional(),
	status_id: z.string().optional(),
});

const UploadIframeInputSchema = z.object({
	fid: z.string().optional(),
	rrid: z.string().optional(),
});

const UploadIframeResponseSchema = z.object({
	url: z.string().url(),
	html: z.string(),
});

export type CincopaEndpointInputs = {
	galleryList: GalleryListInput;
	ping: z.infer<typeof PingInputSchema>;
	uploadFromUrl: z.infer<typeof UploadFromUrlInputSchema>;
	getUploadFromUrlStatus: z.infer<typeof UploadStatusInputSchema>;
	abortUploadFromUrl: z.infer<typeof UploadAbortInputSchema>;
	getUploadIframe: z.infer<typeof UploadIframeInputSchema>;
};

export type CincopaEndpointOutputs = {
	galleryList: GalleryListResponse;
	ping: z.infer<typeof PingResponseSchema>;
	uploadFromUrl: z.infer<typeof UploadFromUrlResponseSchema>;
	getUploadFromUrlStatus: z.infer<typeof UploadStatusResponseSchema>;
	abortUploadFromUrl: z.infer<typeof UploadAbortResponseSchema>;
	getUploadIframe: z.infer<typeof UploadIframeResponseSchema>;
};

export const CincopaEndpointInputSchemas = {
	galleryList: GalleryListInputSchema,
	ping: PingInputSchema,
	uploadFromUrl: UploadFromUrlInputSchema,
	getUploadFromUrlStatus: UploadStatusInputSchema,
	abortUploadFromUrl: UploadAbortInputSchema,
	getUploadIframe: UploadIframeInputSchema,
} as const;

export const CincopaEndpointOutputSchemas = {
	galleryList: GalleryListResponseSchema,
	ping: PingResponseSchema,
	uploadFromUrl: UploadFromUrlResponseSchema,
	getUploadFromUrlStatus: UploadStatusResponseSchema,
	abortUploadFromUrl: UploadAbortResponseSchema,
	getUploadIframe: UploadIframeResponseSchema,
} as const;
