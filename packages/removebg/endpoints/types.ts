import { z } from 'zod';

// Shapes follow https://www.remove.bg/api

export const REMOVEBG_SIZE = [
	'preview',
	'small',
	'regular',
	'medium',
	'hd',
	'full',
	'4k',
	'50MP',
	'auto',
] as const;
export type RemovebgSize = (typeof REMOVEBG_SIZE)[number];

export const REMOVEBG_TYPE = [
	'auto',
	'person',
	'product',
	'car',
	'animal',
	'graphic',
	'transportation',
] as const;
export type RemovebgType = (typeof REMOVEBG_TYPE)[number];

export const REMOVEBG_TYPE_LEVEL = ['none', '1', '2', 'latest'] as const;
export type RemovebgTypeLevel = (typeof REMOVEBG_TYPE_LEVEL)[number];

export const REMOVEBG_FORMAT = ['auto', 'png', 'jpg', 'webp', 'zip'] as const;
export type RemovebgFormat = (typeof REMOVEBG_FORMAT)[number];

export const REMOVEBG_CHANNELS = ['rgba', 'alpha'] as const;
export type RemovebgChannels = (typeof REMOVEBG_CHANNELS)[number];

export const REMOVEBG_SHADOW_TYPE = [
	'auto',
	'car',
	'3D',
	'drop',
	'none',
] as const;
export type RemovebgShadowType = (typeof REMOVEBG_SHADOW_TYPE)[number];

export const REMOVEBG_IMPROVEMENT_ERROR_TYPE = [
	'other',
	'kind',
	'result-type',
	'foreground-edges',
	'foreground-parts-missing',
	'background-not-fully-removed',
	'foreground-inside-cutout',
	'foreground-cut-off',
] as const;
export type RemovebgImprovementErrorType =
	(typeof REMOVEBG_IMPROVEMENT_ERROR_TYPE)[number];

// ─────────────────────────────────────────────────────────────────────────────
// account.get
// ─────────────────────────────────────────────────────────────────────────────

export const AccountGetInputSchema = z.object({});
export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

export const AccountGetOutputSchema = z.object({
	data: z.object({
		attributes: z.object({
			credits: z
				.object({
					total: z.number(),
					subscription: z.number(),
					payg: z.number(),
					enterprise: z.number(),
				})
				.loose(),
			api: z
				.object({
					free_calls: z.number(),
					sizes: z.string(),
				})
				.loose(),
		}),
	}),
});
export type AccountGetOutput = z.infer<typeof AccountGetOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// removeBackground.remove
// ─────────────────────────────────────────────────────────────────────────────

const RemoveBackgroundBaseInputSchema = z.object({
	/** HTTPS URL of the source image. Mutually exclusive with imageFileB64. */
	imageUrl: z.string().url().optional(),
	/** Base64-encoded source image. Mutually exclusive with imageUrl. */
	imageFileB64: z.string().min(1).optional(),
	size: z.enum(REMOVEBG_SIZE).optional(),
	type: z.enum(REMOVEBG_TYPE).optional(),
	typeLevel: z.enum(REMOVEBG_TYPE_LEVEL).optional(),
	format: z.enum(REMOVEBG_FORMAT).optional(),
	roi: z.string().optional(),
	crop: z.boolean().optional(),
	cropMargin: z.string().optional(),
	scale: z.string().optional(),
	position: z.string().optional(),
	channels: z.enum(REMOVEBG_CHANNELS).optional(),
	shadowType: z.enum(REMOVEBG_SHADOW_TYPE).optional(),
	shadowOpacity: z.number().min(0).max(100).optional(),
	semitransparency: z.boolean().optional(),
	bgColor: z.string().optional(),
	bgImageUrl: z.string().url().optional(),
});

export const RemoveBackgroundInputSchema =
	RemoveBackgroundBaseInputSchema.refine(
		(value) => Boolean(value.imageUrl) !== Boolean(value.imageFileB64),
		{ message: 'Provide exactly one of imageUrl or imageFileB64' },
	)
		.refine((value) => !(value.bgColor && value.bgImageUrl), {
			message: 'Provide at most one of bgColor or bgImageUrl',
			path: ['bgImageUrl'],
		})
		.refine(
			(value) => !(value.shadowOpacity !== undefined && !value.shadowType),
			{
				message: 'shadowOpacity requires shadowType to be set',
				path: ['shadowOpacity'],
			},
		);
export type RemoveBackgroundInput = z.input<typeof RemoveBackgroundInputSchema>;

export const RemoveBackgroundOutputSchema = z.object({
	data: z.object({
		/** Base64-encoded PNG/JPG result image. */
		result_b64: z.string(),
		foreground_top: z.number().optional(),
		foreground_left: z.number().optional(),
		foreground_width: z.number().optional(),
		foreground_height: z.number().optional(),
	}),
});
export type RemoveBackgroundOutput = z.infer<
	typeof RemoveBackgroundOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// improvement.submit
// ─────────────────────────────────────────────────────────────────────────────

const SubmitImprovementBaseInputSchema = z.object({
	/** HTTPS URL of the original image. Mutually exclusive with imageFileB64. */
	imageUrl: z.string().url().optional(),
	/** Base64-encoded original image. Mutually exclusive with imageUrl. */
	imageFileB64: z.string().min(1).optional(),
	errorType: z.enum(REMOVEBG_IMPROVEMENT_ERROR_TYPE),
	errorDescription: z.string().optional(),
});

export const SubmitImprovementInputSchema =
	SubmitImprovementBaseInputSchema.refine(
		(value) => Boolean(value.imageUrl) !== Boolean(value.imageFileB64),
		{ message: 'Provide exactly one of imageUrl or imageFileB64' },
	);
export type SubmitImprovementInput = z.input<
	typeof SubmitImprovementInputSchema
>;

export const SubmitImprovementResponseSchema = z.union([
	z.undefined(),
	z.null(),
	z.record(z.string(), z.unknown()).refine((value) => !('errors' in value), {
		message: 'Improvement response must not include errors',
	}),
]);

export const SubmitImprovementOutputSchema = z.object({
	success: z.boolean(),
});
export type SubmitImprovementOutput = z.infer<
	typeof SubmitImprovementOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────

export type RemovebgEndpointInputs = {
	account: AccountGetInput;
	removeBackground: RemoveBackgroundInput;
	improvement: SubmitImprovementInput;
};

export type RemovebgEndpointOutputs = {
	account: AccountGetOutput;
	removeBackground: RemoveBackgroundOutput;
	improvement: SubmitImprovementOutput;
};

export const RemovebgEndpointInputSchemas = {
	account: AccountGetInputSchema,
	removeBackground: RemoveBackgroundInputSchema,
	improvement: SubmitImprovementInputSchema,
} as const;

export const RemovebgEndpointOutputSchemas = {
	account: AccountGetOutputSchema,
	removeBackground: RemoveBackgroundOutputSchema,
	improvement: SubmitImprovementOutputSchema,
} as const;
