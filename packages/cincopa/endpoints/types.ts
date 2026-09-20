import { z } from 'zod';

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
	ip: z.string().optional(),
	revertid: z.boolean().optional(),
});

const UploadFromUrlInputSchema = z.object({
	input: z.string().url().describe('External URL of the media asset to upload'),
	fid: z
		.string()
		.optional()
		.describe('Optional gallery folder identifier (FID) target'),
	rid: z
		.string()
		.optional()
		.describe('Optional existing resource identifier (RID) to replace'),
	type: z
		.string()
		.optional()
		.describe('Optional media asset type specification'),
});

const UploadFromUrlResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number().optional(),
	status_id: z.string(),
});

const UploadStatusInputSchema = z.object({
	statusId: z
		.string()
		.min(1)
		.describe('Status tracking identifier from uploadFromUrl'),
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
	statusId: z
		.string()
		.min(1)
		.describe('Status tracking identifier of the upload to abort'),
});

const UploadAbortResponseSchema = z.object({
	success: z.boolean(),
	runtime: z.number().optional(),
	status_id: z.string().optional(),
});

const UploadIframeInputSchema = z.object({
	fid: z
		.string()
		.optional()
		.describe('Optional gallery folder identifier (FID) target'),
	rrid: z
		.string()
		.optional()
		.describe('Optional replace resource identifier (RRID) target'),
});

const UploadIframeResponseSchema = z.object({
	url: z
		.string()
		.url()
		.describe('Public upload iframe URL stripped of credentials'),
	html: z
		.string()
		.describe('Safe iframe HTML markup with credentials redacted'),
});

export type CincopaEndpointInputs = {
	ping: z.infer<typeof PingInputSchema>;
	uploadFromUrl: z.infer<typeof UploadFromUrlInputSchema>;
	getUploadFromUrlStatus: z.infer<typeof UploadStatusInputSchema>;
	abortUploadFromUrl: z.infer<typeof UploadAbortInputSchema>;
	getUploadIframe: z.infer<typeof UploadIframeInputSchema>;
};

export type CincopaEndpointOutputs = {
	ping: z.infer<typeof PingResponseSchema>;
	uploadFromUrl: z.infer<typeof UploadFromUrlResponseSchema>;
	getUploadFromUrlStatus: z.infer<typeof UploadStatusResponseSchema>;
	abortUploadFromUrl: z.infer<typeof UploadAbortResponseSchema>;
	getUploadIframe: z.infer<typeof UploadIframeResponseSchema>;
};

export const CincopaEndpointInputSchemas = {
	ping: PingInputSchema,
	uploadFromUrl: UploadFromUrlInputSchema,
	getUploadFromUrlStatus: UploadStatusInputSchema,
	abortUploadFromUrl: UploadAbortInputSchema,
	getUploadIframe: UploadIframeInputSchema,
} as const;

export const CincopaEndpointOutputSchemas = {
	ping: PingResponseSchema,
	uploadFromUrl: UploadFromUrlResponseSchema,
	getUploadFromUrlStatus: UploadStatusResponseSchema,
	abortUploadFromUrl: UploadAbortResponseSchema,
	getUploadIframe: UploadIframeResponseSchema,
} as const;
