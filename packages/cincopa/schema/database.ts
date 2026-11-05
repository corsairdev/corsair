import { z } from 'zod';

/**
 * Official Cincopa REST API v2 Gallery Schema
 * Reference: https://api.cincopa.com/v2/gallery.list.json
 */
export const CincopaGallery = z.object({
	fid: z.string().describe('Unique folder / gallery identifier (FID)'),
	name: z.string().describe('Name of the gallery'),
	description: z.string().optional().describe('Gallery description'),
	upload_url: z
		.string()
		.optional()
		.describe('Direct upload URL for adding media to this gallery'),
	tags: z
		.string()
		.optional()
		.describe('Comma-separated list of tags assigned to the gallery'),
	modified: z
		.string()
		.optional()
		.describe('Last modification timestamp in ISO format'),
	syncstatus: z
		.string()
		.optional()
		.describe('Synchronization status of the gallery'),
});

/**
 * Official Cincopa REST API v2 Media Asset Schema
 * Reference: https://api.cincopa.com/v2/asset.list.json
 */
export const CincopaAsset = z.object({
	id: z
		.string()
		.optional()
		.describe('Numeric identifier of the asset resource'),
	rid: z.string().describe('Unique resource identifier (RID) of the asset'),
	type: z
		.string()
		.optional()
		.describe('Type of media asset (e.g. image, video, audio)'),
	filename: z.string().optional().describe('Original filename of the asset'),
	caption: z.string().optional().describe('Short caption for the asset'),
	description: z.string().optional().describe('Description of the asset'),
	long_description: z
		.string()
		.optional()
		.describe('Extended description of the asset'),
	filesize: z.number().optional().describe('Size of the asset in bytes'),
	tags: z.string().optional().describe('Tags associated with the asset'),
	uploaded_by: z
		.string()
		.optional()
		.describe('User ID or email that uploaded the asset'),
	uploaded: z
		.string()
		.optional()
		.describe('Upload timestamp in ISO 8601 format'),
	modified: z
		.string()
		.optional()
		.describe('Last modification timestamp in ISO 8601 format'),
	syncstatus: z.string().optional().describe('Synchronization status'),
	storage: z.string().optional().describe('Storage location identifier'),
});

/**
 * Official Cincopa REST API v2 Upload Status Schema
 * Reference: https://api.cincopa.com/v2/asset.upload_from_url_get_status.json
 */
export const CincopaUploadStatus = z.object({
	status_id: z
		.string()
		.optional()
		.describe('Unique identifier for tracking the URL upload operation'),
	status: z
		.string()
		.optional()
		.describe('Current state of the upload (e.g. inprogress, ready, failed)'),
	progress: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Progress percentage (0-100)'),
	progress_bytes: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Bytes downloaded/received so far'),
	file_size_bytes: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Total file size in bytes (-1 if undetermined)'),
	resid: z
		.string()
		.optional()
		.describe('Resource ID (RID) created upon successful upload completion'),
	more: z
		.string()
		.optional()
		.describe('Additional status information or outcome message'),
	debug: z.string().optional().describe('Diagnostic logs and transfer details'),
});

/**
 * Official Cincopa REST API v2 Account / User Identity Schema
 * Reference: https://api.cincopa.com/v2/ping.json
 */
export const CincopaAccount = z.object({
	accid: z
		.string()
		.optional()
		.describe('Cincopa alphanumeric account identifier'),
	accid_num: z
		.union([z.number(), z.string()])
		.optional()
		.describe('Numeric account ID'),
	accemail: z.string().optional().describe('Primary account email address'),
	userid: z
		.string()
		.optional()
		.describe('Cincopa alphanumeric user identifier'),
	userid_num: z
		.union([z.number(), z.string()])
		.optional()
		.describe('Numeric user ID'),
	useremail: z.string().optional().describe('User email address'),
	permissions: z
		.string()
		.optional()
		.describe('Pipe-separated permission scopes enabled on the API token'),
});

export type CincopaGallery = z.infer<typeof CincopaGallery>;
export type CincopaAsset = z.infer<typeof CincopaAsset>;
export type CincopaUploadStatus = z.infer<typeof CincopaUploadStatus>;
export type CincopaAccount = z.infer<typeof CincopaAccount>;
