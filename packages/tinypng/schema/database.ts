import { z } from 'zod';

/**
 * Compressed image. `input` and `output` mirror the body of POST /shrink.
 * @see https://tinify.com/developers/reference#compressing-images
 */
export const TinypngImage = z.object({
	id: z.string(),
	input: z.object({ size: z.number(), type: z.string() }),
	output: z
		.object({
			size: z.number(),
			type: z.string(),
			width: z.number().optional(),
			height: z.number().optional(),
			ratio: z.number().optional(),
			url: z.string().optional(),
		})
		.optional(),
	compression_count: z.number().optional(),
});

/**
 * Result written to S3, GCS or Azure Blob Storage. `id` is the stored object
 * location without credentials.
 * @see https://tinify.com/developers/reference#saving-to-amazon-s3
 */
export const TinypngStoredOutput = z.object({
	id: z.string(),
	image_id: z.string(),
	service: z.enum(['s3', 'gcs', 'azure']),
	width: z.number().optional(),
	height: z.number().optional(),
	content_type: z.string().optional(),
	size: z.number().optional(),
	etag: z.string().optional(),
});

/**
 * Monthly compression count from the `Compression-Count` response header.
 * `id` is the calendar month, `YYYY-MM`.
 * @see https://tinify.com/developers/reference#compression-count
 */
export const TinypngUsage = z.object({
	id: z.string(),
	compression_count: z.number(),
});
