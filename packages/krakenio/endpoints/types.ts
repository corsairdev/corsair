import { z } from 'zod';

// Inputs use Kraken's own parameter names. Outputs are `.loose()` with their
// documented fields nullish, so a field Kraken adds or omits cannot fail a call
// that has already happened.
// Reference: https://kraken.io/docs/getting-started

/** Kraken's lossy/lossless switch. */
export const KRAKEN_MODES = ['lossy', 'lossless'] as const;

/** The resizing strategies Kraken documents. */
export const KRAKEN_RESIZE_STRATEGIES = [
	'exact',
	'portrait',
	'landscape',
	'auto',
	'fit',
	'crop',
	'square',
	'fill',
] as const;

const ResizeSchema = z
	.object({
		width: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Target width in pixels.'),
		height: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Target height in pixels.'),
		size: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Edge length in pixels. Only the `square` strategy reads it.'),
		strategy: z
			.enum(KRAKEN_RESIZE_STRATEGIES)
			.describe(
				'Required by Kraken. `exact` forces both dimensions, `portrait` and `landscape` fix one side, `auto` picks by orientation, `fit` crops and resizes to fill the box, `crop` cuts to the exact size, `square` crops to a square of `size`, `fill` keeps the aspect ratio and pads with `background`.',
			),
		background: z
			.string()
			.optional()
			.describe(
				'Padding colour for the `fill` strategy, as `#ff6600`, `rgb(...)` or `rgba(...)`. Kraken defaults to white.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.strategy === 'square') {
			if (value.size === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['size'],
					message: 'The `square` strategy needs a `size`.',
				});
			}
		} else if (value.width === undefined && value.height === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['width'],
				message: 'A resize needs a `width` or a `height`.',
			});
		}
	});

// A `wait` call answers in the same request; without it, a `callback_url` is
// required, and Kraken refuses a request with neither.
//
// unknown: the option set is passed through to Kraken as its own JSON keys, and
// it adds options between releases.
const BaseOptionsSchema = z.object({
	wait: z
		.boolean()
		.optional()
		.describe(
			'Hold the connection open and answer with the result. Without it a `callback_url` is required.',
		),
	callback_url: z
		.string()
		.url()
		.optional()
		.describe('Kraken posts the result here instead of answering in-line.'),
	lossy: z
		.boolean()
		.optional()
		.describe(
			'`true` for lossy, `false` for lossless. Kraken’s default, when this is left out, is lossless.',
		),
	resize: ResizeSchema.optional(),
	quality: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('JPEG quality for a lossy run. Ignored on a lossless one.'),
	auto_orient: z
		.boolean()
		.optional()
		.describe('Rotate the image according to its EXIF orientation.'),
	preserve_meta: z
		.array(z.enum(['profile', 'date', 'copyright', 'geotag', 'orientation']))
		.min(1)
		.optional()
		.describe('Metadata categories to keep. Anything left out is stripped.'),
	convert: z
		.object({
			format: z
				.enum(['jpeg', 'png', 'gif', 'webp', 'avif'])
				.describe('The format to convert to.'),
			background: z
				.string()
				.optional()
				.describe('A hex fill for transparency when converting to JPEG.'),
		})
		.optional(),
});

const waitOrCallback = (
	value: { wait?: boolean; callback_url?: string },
	ctx: z.RefinementCtx,
) => {
	if (value.wait !== true && value.callback_url === undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['wait'],
			message:
				'Kraken needs either `wait: true` or a `callback_url`; it refuses a request with neither.',
		});
	}
};

// ── url.optimize ──────────────────────────────────────────────────────────

const UrlOptimizeInputSchema = BaseOptionsSchema.extend({
	url: z
		.url()
		.describe('The publicly reachable image or PDF to fetch and optimize.'),
}).superRefine(waitOrCallback);

export type UrlOptimizeInput = z.input<typeof UrlOptimizeInputSchema>;

// ── upload.optimize ───────────────────────────────────────────────────────

// Kraken takes the file as a multipart part beside a JSON options field. The
// caller passes base64 (a tool call cannot carry a stream), and the endpoint
// decodes it into the file part.
const UploadOptimizeInputSchema = BaseOptionsSchema.extend({
	data: z
		.string()
		.min(1)
		.describe(
			'The file as a base64 string. The plugin decodes it and sends it to Kraken as the multipart file part.',
		),
	filename: z
		.string()
		.min(1)
		.optional()
		.describe('A name for the upload, such as `header.jpg`.'),
}).superRefine(waitOrCallback);

export type UploadOptimizeInput = z.input<typeof UploadOptimizeInputSchema>;

// ── the result of an optimization ─────────────────────────────────────────

// One optimized file. `kraked_url` may be absent on a per-image failure, which
// Kraken reports in `message` while the request itself succeeds.
export const KrakenResultSchema = z
	.object({
		success: z.boolean(),
		file_name: z.string().nullish(),
		original_size: z.number().nullish().describe('Bytes.'),
		kraked_size: z.number().nullish().describe('Bytes.'),
		saved_bytes: z.number().nullish().describe('Bytes saved.'),
		original_width: z.number().nullish(),
		original_height: z.number().nullish(),
		kraked_width: z.number().nullish(),
		kraked_height: z.number().nullish(),
		kraked_url: z
			.string()
			.nullish()
			.describe('Where the optimized file is served while Kraken keeps it.'),
		message: z
			.string()
			.nullish()
			.describe('Why one file failed, when `success` is false.'),
	})
	.loose();

export type KrakenResult = z.infer<typeof KrakenResultSchema>;

// The whole answer. A `wait` call on one file answers flat: `file_name`,
// `kraked_url` and the sizes sit at the top level. A `callback_url` call answers
// only `{ id }` at once, so `success` is optional. A multi-size resize puts one
// entry per size in `results`.
const OptimizeResponseSchema = z
	.object({
		success: z
			.boolean()
			.optional()
			.describe('Absent on a callback request, which answers only `id`.'),
		id: z
			.string()
			.nullish()
			.describe('The job ID that the callback delivery repeats.'),
		message: z.string().nullish(),
		file_name: z.string().nullish(),
		original_size: z.number().nullish().describe('Bytes.'),
		kraked_size: z.number().nullish().describe('Bytes.'),
		saved_bytes: z.number().nullish().describe('Bytes saved.'),
		original_width: z.number().nullish(),
		original_height: z.number().nullish(),
		kraked_width: z.number().nullish(),
		kraked_height: z.number().nullish(),
		kraked_url: z
			.string()
			.nullish()
			.describe(
				'Where the optimized file is served from `dl.kraken.io` for a limited time.',
			),
		results: z
			.record(z.string(), KrakenResultSchema)
			.nullish()
			.describe(
				'One entry per size, keyed by its `id`, on a multi-size resize.',
			),
	})
	.loose();

export type OptimizeResponse = z.infer<typeof OptimizeResponseSchema>;

// ── account.status ────────────────────────────────────────────────────────

const AccountStatusInputSchema = z.object({});

export type AccountStatusInput = z.input<typeof AccountStatusInputSchema>;

const AccountStatusResponseSchema = z
	.object({
		success: z.boolean(),
		active: z.boolean().nullish().describe('Whether the account may optimize.'),
		plan_name: z.string().nullish(),
		// Quota figures are in bytes, not counts.
		quota_total: z.number().nullish().describe('Bytes.'),
		quota_used: z.number().nullish().describe('Bytes.'),
		quota_remaining: z.number().nullish().describe('Bytes.'),
	})
	.loose();

export type AccountStatusResponse = z.infer<typeof AccountStatusResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KrakenEndpointInputs = {
	urlOptimize: UrlOptimizeInput;
	uploadOptimize: UploadOptimizeInput;
	accountStatus: AccountStatusInput;
};

export type KrakenEndpointOutputs = {
	urlOptimize: OptimizeResponse;
	uploadOptimize: OptimizeResponse;
	accountStatus: AccountStatusResponse;
};

export const KrakenEndpointInputSchemas = {
	urlOptimize: UrlOptimizeInputSchema,
	uploadOptimize: UploadOptimizeInputSchema,
	accountStatus: AccountStatusInputSchema,
} as const;

export const KrakenEndpointOutputSchemas = {
	urlOptimize: OptimizeResponseSchema,
	uploadOptimize: OptimizeResponseSchema,
	accountStatus: AccountStatusResponseSchema,
} as const;
