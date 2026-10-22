import { z } from 'zod';

// Tinify output ids are the last segment of the shrink Location header.
const ImageIdSchema = z
	.string()
	.regex(/^[A-Za-z0-9]+$/, 'imageId must be the id from a shrink response');

const ImageSourceSchema = z.union([
	z.object({
		url: z.string().url().describe('Public URL of the image to compress'),
	}),
	z.object({
		base64: z
			.base64('base64 must be padded standard base64 with no data: prefix')
			.min(1)
			.describe('Base64-encoded AVIF, JPEG XL, WebP, JPEG or PNG bytes'),
	}),
]);

// Public Azure, US Government and China clouds.
const AZURE_BLOB_HOST =
	/^[a-z0-9]{3,24}\.blob\.core\.(windows\.net|usgovcloudapi\.net|chinacloudapi\.cn)$/;

const ImageTypeSchema = z.enum([
	'image/avif',
	'image/webp',
	'image/jpeg',
	'image/png',
	'image/jxl',
	'*/*',
]);

const ResizeSchema = z
	.object({
		method: z.enum(['scale', 'fit', 'cover', 'thumb']),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
	})
	.refine(
		({ method, width, height }) =>
			method === 'scale'
				? (width === undefined) !== (height === undefined)
				: width !== undefined && height !== undefined,
		'scale takes exactly one of width or height; fit, cover and thumb take both',
	);

const OutputOptionsShape = {
	resize: ResizeSchema.optional(),
	convert: z
		.object({
			type: z.union([ImageTypeSchema, z.array(ImageTypeSchema).min(1)]),
		})
		.optional()
		.describe('Several types return the smallest result'),
	transform: z
		.object({
			background: z
				.string()
				.describe('Hex color like #000000, or "white" / "black"'),
		})
		.optional(),
	preserve: z.array(z.enum(['copyright', 'creation', 'location'])).optional(),
};

const StoreHeadersSchema = z
	.object({ 'Cache-Control': z.string() })
	.optional()
	.describe('Experimental in Tinify; only Cache-Control is supported');

const StoreSchema = z.discriminatedUnion('service', [
	z.object({
		service: z.literal('s3'),
		aws_access_key_id: z.string().min(1),
		aws_secret_access_key: z.string().min(1),
		region: z.string().min(1),
		path: z.string().min(1).describe('<bucket>/<path>/<filename>'),
		headers: StoreHeadersSchema,
		acl: z
			.string()
			.optional()
			.describe('Defaults to public-read; no-acl skips it'),
	}),
	z.object({
		service: z.literal('gcs'),
		gcp_access_token: z.string().min(1),
		path: z.string().min(1).describe('<bucket>/<path>/<filename>'),
		headers: StoreHeadersSchema,
	}),
]);

const ImageSizeSchema = z.object({
	size: z.number(),
	type: z.string(),
});

// --- images.shrink ---

export const ShrinkInputSchema = z.object({ source: ImageSourceSchema });
export type ShrinkInput = z.infer<typeof ShrinkInputSchema>;

export const ShrinkResponseSchema = z.object({
	imageId: z.string(),
	outputUrl: z.string().url(),
	compressionCount: z.number().optional(),
	input: ImageSizeSchema,
	output: ImageSizeSchema.extend({
		width: z.number().optional(),
		height: z.number().optional(),
		ratio: z.number().optional(),
	}).optional(),
});
export type ShrinkResponse = z.infer<typeof ShrinkResponseSchema>;

// --- images.output ---

export const OutputInputSchema = z.object({ imageId: ImageIdSchema });
export type OutputInput = z.infer<typeof OutputInputSchema>;

const ImageFileSchema = z.object({
	imageId: z.string(),
	contentType: z.string(),
	size: z.number(),
	width: z.number().optional(),
	height: z.number().optional(),
	compressionCount: z.number().optional(),
	base64: z.string(),
});

export const OutputResponseSchema = ImageFileSchema;
export type OutputResponse = z.infer<typeof OutputResponseSchema>;

// --- images.transform ---

export const TransformInputSchema = z
	.object({
		imageId: ImageIdSchema,
		...OutputOptionsShape,
		store: StoreSchema.optional().describe(
			'Upload the result to S3 or GCS instead of returning the bytes',
		),
	})
	.refine(
		({ resize, convert, transform, preserve, store }) =>
			[resize, convert, transform, preserve, store].some(
				(option) => option !== undefined,
			),
		'Provide at least one of resize, convert, transform, preserve or store',
	);
export type TransformInput = z.infer<typeof TransformInputSchema>;

export const TransformResponseSchema = z.discriminatedUnion('stored', [
	ImageFileSchema.extend({ stored: z.literal(false) }),
	z.object({
		stored: z.literal(true),
		imageId: z.string(),
		location: z.string().url(),
		width: z.number().optional(),
		height: z.number().optional(),
		compressionCount: z.number().optional(),
	}),
]);
export type TransformResponse = z.infer<typeof TransformResponseSchema>;

// --- images.compressAndStoreInAzure ---

export const CompressAndStoreInAzureInputSchema = z.object({
	source: ImageSourceSchema,
	blobUrl: z
		.string()
		.url()
		.refine((value) => {
			if (!URL.canParse(value)) return false;
			const url = new URL(value);
			return url.protocol === 'https:' && AZURE_BLOB_HOST.test(url.hostname);
		}, 'blobUrl must be an https://<account>.blob.core.windows.net URL')
		.describe(
			'Full blob URL with a SAS token granting create/write, e.g. https://acct.blob.core.windows.net/container/name.png?sv=...',
		),
	cacheControl: z.string().optional(),
	...OutputOptionsShape,
});
export type CompressAndStoreInAzureInput = z.infer<
	typeof CompressAndStoreInAzureInputSchema
>;

export const CompressAndStoreInAzureResponseSchema = z.object({
	imageId: z.string(),
	blobUrl: z.string().url().describe('Blob URL without the SAS query string'),
	contentType: z.string(),
	size: z.number(),
	width: z.number().optional(),
	height: z.number().optional(),
	compressionCount: z.number().optional(),
	etag: z.string().optional(),
});
export type CompressAndStoreInAzureResponse = z.infer<
	typeof CompressAndStoreInAzureResponseSchema
>;

// --- account.getCompressionCount ---

export const GetCompressionCountInputSchema = z.object({});
export type GetCompressionCountInput = z.infer<
	typeof GetCompressionCountInputSchema
>;

export const GetCompressionCountResponseSchema = z.object({
	compressionCount: z.number().int().nonnegative(),
});
export type GetCompressionCountResponse = z.infer<
	typeof GetCompressionCountResponseSchema
>;

export type TinypngEndpointInputs = {
	shrink: ShrinkInput;
	output: OutputInput;
	transform: TransformInput;
	compressAndStoreInAzure: CompressAndStoreInAzureInput;
	getCompressionCount: GetCompressionCountInput;
};

export type TinypngEndpointOutputs = {
	shrink: ShrinkResponse;
	output: OutputResponse;
	transform: TransformResponse;
	compressAndStoreInAzure: CompressAndStoreInAzureResponse;
	getCompressionCount: GetCompressionCountResponse;
};

export const TinypngEndpointInputSchemas = {
	shrink: ShrinkInputSchema,
	output: OutputInputSchema,
	transform: TransformInputSchema,
	compressAndStoreInAzure: CompressAndStoreInAzureInputSchema,
	getCompressionCount: GetCompressionCountInputSchema,
} as const;

export const TinypngEndpointOutputSchemas = {
	shrink: ShrinkResponseSchema,
	output: OutputResponseSchema,
	transform: TransformResponseSchema,
	compressAndStoreInAzure: CompressAndStoreInAzureResponseSchema,
	getCompressionCount: GetCompressionCountResponseSchema,
} as const;
