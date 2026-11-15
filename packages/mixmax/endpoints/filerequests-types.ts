import { z } from 'zod';

// File requests (developer.mixmax.com/reference, File requests section).
// Field names, types, and limits mirror the official FileRequest schema.
// File requests are created in the Mixmax editor; the API can only read them.

// One file received for a request, matching the official upload item.
export const FileRequestUploadSchema = z.object({
	// ISO 8601 date-time string.
	timestamp: z.string().optional(),
	// The uploader's email, or `self` when you uploaded to your own request.
	email: z.string().optional(),
	// The uploader's name, or `self`.
	name: z.string().optional(),
	// The uploader's `X-Forwarded-For` header, which can be a
	// comma-separated list.
	ipAddress: z.string().optional(),
	// Recorded when the upload starts, so it can point to nothing if the
	// upload never finished.
	downloadUrl: z.string().optional(),
});

export type FileRequestUpload = z.infer<typeof FileRequestUploadSchema>;

// A file request you sent from the Mixmax editor. Documented fields stay
// optional (`uploads` is absent until the first upload) and the document
// passthrough because the provider may add upload detail it does not pin
// down.
export const FileRequestSchema = z
	.object({
		// A 17-character id.
		_id: z.string().optional(),
		userId: z.string().optional(),
		// When you created the request, as an ISO 8601 date-time string.
		timestamp: z.string().optional(),
		// The files received.
		uploads: z.array(FileRequestUploadSchema).optional(),
	})
	.passthrough();

export type FileRequest = z.infer<typeof FileRequestSchema>;

export const FileRequestsListInputSchema = z.object({
	// How many items per page. Defaults to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type FileRequestsListInput = z.infer<typeof FileRequestsListInputSchema>;

export const FileRequestsListOutputSchema = z.object({
	results: z.array(FileRequestSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type FileRequestsListOutput = z.infer<
	typeof FileRequestsListOutputSchema
>;

export const FileRequestsGetInputSchema = z.object({
	id: z.string().min(1),
});

export type FileRequestsGetInput = z.infer<typeof FileRequestsGetInputSchema>;

export const FileRequestsGetOutputSchema = FileRequestSchema;

export type FileRequestsGetOutput = z.infer<typeof FileRequestsGetOutputSchema>;
