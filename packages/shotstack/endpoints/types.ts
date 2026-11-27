import { z } from 'zod';

// Inputs use Shotstack's own field names. The timeline DSL (clips, tracks,
// transitions, asset types) is provider-validated and rides through as
// records; the fields pinned here are the ones the spec gives an enum or a
// documented cross-field rule. Outputs are `.loose()` and their optional
// fields nullish: success bodies are spec-verified only (no live key during
// the build), so a field Shotstack adds or omits must not fail a call that
// has already happened.

export const RENDER_STATUSES = [
	'queued',
	'fetching',
	'preprocessing',
	'rendering',
	'generating',
	'saving',
	'done',
	'failed',
] as const;

export const GENERATION_STATUSES = [
	'queued',
	'processing',
	'done',
	'failed',
] as const;

// `deleted` and `overwritten` end an ingest without the file the fetch asked
// for: the id is gone, or it now points at a newer upload of the same URL.
export const SOURCE_STATUSES = [
	'queued',
	'importing',
	'ready',
	'failed',
	'deleted',
	'overwritten',
] as const;

export const ASSET_STATUSES = [
	'importing',
	'ready',
	'failed',
	'deleted',
] as const;

const OUTPUT_FORMATS = ['mp4', 'gif', 'mp3', 'jpg', 'png', 'bmp'] as const;
const RESOLUTIONS = ['preview', 'mobile', 'sd', 'hd', '1080', '4k'] as const;
const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:5', '4:3'] as const;
const INSTANCES = ['s1', 's2', 'a1'] as const;
const GENERATION_TYPES = ['image', 'video', 'audio'] as const;
const TRANSCRIPTION_FORMATS = ['srt', 'vtt'] as const;

// ── shared pieces ──────────────────────────────────────────────────────────

const MergeFieldInputSchema = z
	.object({
		find: z
			.string()
			.min(1)
			.describe(
				'The placeholder to find, without the double brace delimiters.',
			),
		replace: z
			.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.record(z.string(), z.unknown()),
			])
			.describe('The replacement value; any JSON type.'),
	})
	.superRefine((field, ctx) => {
		if (!('replace' in field)) {
			ctx.addIssue({
				code: 'custom',
				path: ['replace'],
				message:
					'replace is required; send null to remove a placeholder value.',
			});
		}
	});

export type MergeFieldInput = z.input<typeof MergeFieldInputSchema>;

const OutputInputSchema = z
	.object({
		format: z
			.enum(OUTPUT_FORMATS)
			.describe(
				'The output format and media type: mp4, gif, mp3, jpg, png or bmp.',
			),
		resolution: z
			.enum(RESOLUTIONS)
			.optional()
			.describe(
				'Preset output resolution: preview, mobile, sd, hd, 1080 or 4k. 4k needs a plan that includes it.',
			),
		aspectRatio: z
			.enum(ASPECT_RATIOS)
			.optional()
			.describe('The shape of the output: 16:9, 9:16, 1:1, 4:5 or 4:3.'),
		size: z
			.object({
				width: z.number().int().positive(),
				height: z.number().int().positive(),
			})
			.loose()
			.optional()
			.describe('Custom size in pixels, up to 3840 per side (1920 for gif).'),
	})
	.loose()
	.superRefine((output, ctx) => {
		if (output.format === 'mp3') return;
		if (output.resolution) return;
		if (output.size) return;
		ctx.addIssue({
			code: 'custom',
			path: ['resolution'],
			message:
				"resolution or size is required for every format except mp3; set output.resolution: 'hd' or output.size: { width, height }.",
		});
	});

export type OutputInput = z.input<typeof OutputInputSchema>;

const TimelineInputSchema = z
	.object({
		tracks: z
			.array(
				z
					.object({
						clips: z
							.array(z.record(z.string(), z.unknown()))
							.min(1)
							.describe(
								'The clips on this track; each needs asset, start and length.',
							),
					})
					.loose(),
			)
			.min(1)
			.describe('The tracks of the timeline, bottom first.'),
	})
	.loose()
	.describe(
		'The timeline: tracks, clips and optional soundtrack, background and fonts. See shotstack.io/docs/guide for the clip DSL.',
	);

export type TimelineInput = z.input<typeof TimelineInputSchema>;

const EditInputSchema = z
	.object({
		timeline: TimelineInputSchema,
		output: OutputInputSchema,
		merge: z
			.array(MergeFieldInputSchema)
			.optional()
			.describe(
				'Placeholder replacements applied to the edit before rendering.',
			),
		callback: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Webhook URL that receives a notification when the render completes or fails.',
			),
		instance: z
			.enum(INSTANCES)
			.optional()
			.describe(
				'Render instance: s1 (default), s2 (more resources) or a1 (accelerated).',
			),
	})
	.loose();
// `disk` is documented deprecated and ignored by the API, so it is not sent.

export type EditInput = z.input<typeof EditInputSchema>;

const IdSchema = z
	.string()
	.min(1)
	.describe('The id the create call returned (a UUID).');

// ── renders ────────────────────────────────────────────────────────────────

const RendersCreateInputSchema = EditInputSchema;

export type RendersCreateInput = z.input<typeof RendersCreateInputSchema>;

const QueuedResponseDataSchema = z
	.object({
		message: z.string(),
		id: z.string(),
	})
	.loose();

const RendersCreateResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: QueuedResponseDataSchema,
});

export type RendersCreateResponse = z.output<
	typeof RendersCreateResponseSchema
>;

const RendersGetInputSchema = z
	.object({
		id: IdSchema,
		data: z
			.boolean()
			.optional()
			.describe(
				'True to include the full timeline echo in response.data. Defaults to false, which the plugin always sends: the echo can be huge.',
			),
		merged: z
			.boolean()
			.optional()
			.describe('True to include the merged edit; needs data: true.'),
	})
	.superRefine((input, ctx) => {
		if (input.merged && input.data !== true) {
			ctx.addIssue({
				code: 'custom',
				path: ['merged'],
				message: 'merged needs data: true.',
			});
		}
	});

export type RendersGetInput = z.input<typeof RendersGetInputSchema>;

const RenderResponseDataSchema = z
	.object({
		id: z.string(),
		owner: z.string(),
		status: z.enum(RENDER_STATUSES),
		plan: z.string().nullish(),
		error: z.string().nullish(),
		duration: z.number().nullish(),
		renderTime: z.number().nullish(),
		url: z
			.string()
			.nullish()
			.describe(
				'Temporary download link, set when done; expires 24 hours after the render.',
			),
		poster: z.string().nullish(),
		thumbnail: z.string().nullish(),
		data: z.record(z.string(), z.unknown()).nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

const RendersGetResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: RenderResponseDataSchema,
});

export type RendersGetResponse = z.output<typeof RendersGetResponseSchema>;

// ── templates ──────────────────────────────────────────────────────────────

const TemplatesListInputSchema = z.object({}).loose();

export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

const TemplateItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

const TemplatesListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: z
		.object({
			owner: z.string(),
			templates: z.array(TemplateItemSchema),
		})
		.loose(),
});

export type TemplatesListResponse = z.output<
	typeof TemplatesListResponseSchema
>;

const TemplatesGetInputSchema = z.object({ id: IdSchema });

export type TemplatesGetInput = z.input<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: z
		.object({
			id: z.string(),
			name: z.string(),
			owner: z.string(),
			template: z.record(z.string(), z.unknown()),
		})
		.loose(),
});

export type TemplatesGetResponse = z.output<typeof TemplatesGetResponseSchema>;

const TemplatesCreateInputSchema = z.object({
	name: z.string().min(1).describe('The template name.'),
	template: EditInputSchema.optional().describe(
		'The saved edit: timeline and output.',
	),
});

export type TemplatesCreateInput = z.input<typeof TemplatesCreateInputSchema>;

const TemplatesUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().min(1).describe('The new template name.'),
	template: EditInputSchema.optional().describe('The replacement edit.'),
});

export type TemplatesUpdateInput = z.input<typeof TemplatesUpdateInputSchema>;

const TemplateResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: z
		.object({
			message: z.string(),
			id: z.string(),
		})
		.loose(),
});

export type TemplateResponse = z.output<typeof TemplateResponseSchema>;

const TemplatesDeleteInputSchema = z.object({ id: IdSchema });

export type TemplatesDeleteInput = z.input<typeof TemplatesDeleteInputSchema>;

// The API answers 204 with no body; the output is that empty confirmation.
const TemplatesDeleteResponseSchema = z.object({}).loose();

export type TemplatesDeleteResponse = z.output<
	typeof TemplatesDeleteResponseSchema
>;

const TemplatesRenderInputSchema = z.object({
	id: IdSchema,
	merge: z
		.array(MergeFieldInputSchema)
		.optional()
		.describe('Values for the placeholders saved in the template.'),
});

export type TemplatesRenderInput = z.input<typeof TemplatesRenderInputSchema>;

const TemplatesRenderResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: QueuedResponseDataSchema,
});

export type TemplatesRenderResponse = z.output<
	typeof TemplatesRenderResponseSchema
>;

// ── generations ────────────────────────────────────────────────────────────

const GenerationAssetInputSchema = z.object({
	type: z
		.enum(GENERATION_TYPES)
		.describe('The kind of asset to generate: image, video or audio.'),
	prompt: z
		.string()
		.min(1)
		.max(4000)
		.regex(/\S/)
		.optional()
		.describe(
			'What to generate; up to 4000 characters. Prompt-driven models require it.',
		),
	src: z
		.string()
		.url()
		.optional()
		.describe('Source file URL for models that take one instead of a prompt.'),
	model: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The model id; defaults per type. generations.listModels lists them and each one's options.",
		),
	options: z
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			'Settings for the chosen model; unknown options are rejected. generations.getModel prints the schema.',
		),
});

export type GenerationAssetInput = z.input<typeof GenerationAssetInputSchema>;

const GenerationsCreateInputSchema = z.object({
	asset: GenerationAssetInputSchema,
	length: z
		.number()
		.positive()
		.optional()
		.describe(
			'Seconds of clip the asset fills; duration-generating models take their length from this.',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Makes this create replay-safe: a retry with the same key returns the job it first created instead of generating and billing again.',
		),
});

export type GenerationsCreateInput = z.input<
	typeof GenerationsCreateInputSchema
>;

const GenerationResponseSchema = z
	.object({
		id: z.string(),
		status: z.enum(GENERATION_STATUSES),
		url: z.string().nullish(),
		error: z.string().nullish(),
	})
	.loose();

export type GenerationResponse = z.output<typeof GenerationResponseSchema>;

const GenerationsGetInputSchema = z.object({ id: IdSchema });

export type GenerationsGetInput = z.input<typeof GenerationsGetInputSchema>;

const GenerationsQuoteInputSchema = GenerationsCreateInputSchema.omit({
	idempotencyKey: true,
});

export type GenerationsQuoteInput = z.input<typeof GenerationsQuoteInputSchema>;

const GenerationsQuoteResponseSchema = z
	.object({
		credits: z.number().nonnegative(),
		ceiling: z.boolean(),
	})
	.loose();

export type GenerationsQuoteResponse = z.output<
	typeof GenerationsQuoteResponseSchema
>;

const GenerationModelSchema = z
	.object({
		model: z.string(),
		type: z.enum(GENERATION_TYPES),
		name: z.string().nullish(),
		description: z.string().nullish(),
		options: z.record(z.string(), z.unknown()).nullish(),
		available: z.boolean().nullish(),
		unavailableReason: z
			.enum(['AiCapabilityNotIncluded', 'AiDisabled', 'AiAccessUnavailable'])
			.nullish(),
	})
	.loose();

export type GenerationModel = z.output<typeof GenerationModelSchema>;

const GenerationsListModelsInputSchema = z.object({}).loose();

export type GenerationsListModelsInput = z.input<
	typeof GenerationsListModelsInputSchema
>;

const GenerationsListModelsResponseSchema = z.object({
	models: z.array(GenerationModelSchema),
});

export type GenerationsListModelsResponse = z.output<
	typeof GenerationsListModelsResponseSchema
>;

const GenerationsGetModelResponseSchema = GenerationModelSchema;

export type GenerationsGetModelResponse = z.output<
	typeof GenerationsGetModelResponseSchema
>;

// ── media ──────────────────────────────────────────────────────────────────

const MediaProbeInputSchema = z.object({
	url: z.string().min(1).describe('The media URL to inspect.'),
});

export type MediaProbeInput = z.input<typeof MediaProbeInputSchema>;

const MediaProbeResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	response: z.record(z.string(), z.unknown()),
});

export type MediaProbeResponse = z.output<typeof MediaProbeResponseSchema>;

// ── sources ────────────────────────────────────────────────────────────────

const SourcesFetchInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe('Public URL of the file to fetch and ingest.'),
	outputs: z
		.object({
			renditions: z
				.array(z.record(z.string(), z.unknown()))
				.optional()
				.describe(
					'Versions of the source to generate, e.g. { format: "mp4", resolution: "sd" }.',
				),
			transcription: z
				.object({ format: z.enum(TRANSCRIPTION_FORMATS) })
				.loose()
				.optional()
				.describe('Generate a transcription in srt or vtt format.'),
		})
		.loose()
		.optional(),
	destinations: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe(
			'Storage locations to send the source to, e.g. [{ provider: "shotstack" }].',
		),
	callback: z
		.string()
		.min(1)
		.optional()
		.describe('Webhook URL notified when the source is ready.'),
});

export type SourcesFetchInput = z.input<typeof SourcesFetchInputSchema>;

const SourcesFetchResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
	})
	.loose();

export type SourcesFetchResponse = z.output<typeof SourcesFetchResponseSchema>;

const SourcesListInputSchema = z.object({}).loose();

export type SourcesListInput = z.input<typeof SourcesListInputSchema>;

const SourceAttributesSchema = z
	.object({
		id: z.string(),
		owner: z.string(),
		input: z.string().nullish(),
		source: z.string().nullish(),
		status: z.enum(SOURCE_STATUSES).nullish(),
		outputs: z.record(z.string(), z.unknown()).nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		duration: z.number().nullish(),
		fps: z.number().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type SourceAttributes = z.output<typeof SourceAttributesSchema>;

const SourcesGetInputSchema = z.object({ id: IdSchema });

export type SourcesGetInput = z.input<typeof SourcesGetInputSchema>;

const SourcesGetResponseSchema = SourceAttributesSchema;

export type SourcesGetResponse = z.output<typeof SourcesGetResponseSchema>;

const SourcesListResponseSchema = z.object({
	sources: z.array(SourceAttributesSchema),
});

export type SourcesListResponse = z.output<typeof SourcesListResponseSchema>;

const SourcesDeleteInputSchema = z.object({ id: IdSchema });

export type SourcesDeleteInput = z.input<typeof SourcesDeleteInputSchema>;

const SourcesDeleteResponseSchema = z.object({}).loose();

export type SourcesDeleteResponse = z.output<
	typeof SourcesDeleteResponseSchema
>;

// ── uploads ────────────────────────────────────────────────────────────────

const UploadsCreateInputSchema = z.object({}).loose();

export type UploadsCreateInput = z.input<typeof UploadsCreateInputSchema>;

const UploadsCreateResponseSchema = z.object({
	id: z.string(),
	url: z
		.string()
		.describe(
			'Signed S3 PUT URL; upload the bytes to it within the hour it stays valid.',
		),
	expires: z.string(),
});

export type UploadsCreateResponse = z.output<
	typeof UploadsCreateResponseSchema
>;

// ── assets ─────────────────────────────────────────────────────────────────

const AssetsGetInputSchema = z.object({ id: IdSchema });

export type AssetsGetInput = z.input<typeof AssetsGetInputSchema>;

const AssetAttributesSchema = z
	.object({
		id: z.string(),
		owner: z.string(),
		status: z.enum(ASSET_STATUSES),
		region: z.string().nullish(),
		renderId: z.string().nullish(),
		providerId: z.string().nullish(),
		filename: z.string().nullish(),
		url: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type AssetAttributes = z.output<typeof AssetAttributesSchema>;

const AssetsGetResponseSchema = AssetAttributesSchema;

export type AssetsGetResponse = z.output<typeof AssetsGetResponseSchema>;

const AssetsGetByRenderIdInputSchema = z.object({
	id: IdSchema.describe('The render id whose assets to list.'),
});

export type AssetsGetByRenderIdInput = z.input<
	typeof AssetsGetByRenderIdInputSchema
>;

const AssetsGetByRenderIdResponseSchema = z.object({
	assets: z.array(AssetAttributesSchema),
});

export type AssetsGetByRenderIdResponse = z.output<
	typeof AssetsGetByRenderIdResponseSchema
>;

const AssetsTransferInputSchema = z.object({
	url: z.string().min(1).describe('The file URL to fetch and transfer.'),
	id: z
		.string()
		.min(1)
		.describe('Your identifier for the asset; it does not need to be unique.'),
	destinations: z
		.array(z.object({ provider: z.string().min(1) }).loose())
		.min(1)
		.describe(
			'Where to send the file, e.g. [{ provider: "shotstack" }] or an s3 / mux / vimeo destination.',
		),
});

export type AssetsTransferInput = z.input<typeof AssetsTransferInputSchema>;

const AssetsTransferResponseSchema = z
	.object({
		id: z.string().nullish(),
		owner: z.string().nullish(),
		status: z.enum(['queued', 'failed']).nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type AssetsTransferResponse = z.output<
	typeof AssetsTransferResponseSchema
>;

const AssetsDeleteInputSchema = z.object({ id: IdSchema });

export type AssetsDeleteInput = z.input<typeof AssetsDeleteInputSchema>;

const AssetsDeleteResponseSchema = z.object({}).loose();

export type AssetsDeleteResponse = z.output<typeof AssetsDeleteResponseSchema>;

// ── registry ───────────────────────────────────────────────────────────────

export const ShotstackEndpointInputSchemas = {
	rendersCreate: RendersCreateInputSchema,
	rendersGet: RendersGetInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	templatesRender: TemplatesRenderInputSchema,
	generationsCreate: GenerationsCreateInputSchema,
	generationsGet: GenerationsGetInputSchema,
	generationsQuote: GenerationsQuoteInputSchema,
	generationsListModels: GenerationsListModelsInputSchema,
	generationsGetModel: GenerationsGetInputSchema,
	mediaProbe: MediaProbeInputSchema,
	sourcesFetch: SourcesFetchInputSchema,
	sourcesList: SourcesListInputSchema,
	sourcesGet: SourcesGetInputSchema,
	sourcesDelete: SourcesDeleteInputSchema,
	uploadsCreate: UploadsCreateInputSchema,
	assetsGet: AssetsGetInputSchema,
	assetsGetByRenderId: AssetsGetByRenderIdInputSchema,
	assetsTransfer: AssetsTransferInputSchema,
	assetsDelete: AssetsDeleteInputSchema,
} as const;

export const ShotstackEndpointOutputSchemas = {
	rendersCreate: RendersCreateResponseSchema,
	rendersGet: RendersGetResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesCreate: TemplateResponseSchema,
	templatesUpdate: TemplateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	templatesRender: TemplatesRenderResponseSchema,
	generationsCreate: GenerationResponseSchema,
	generationsGet: GenerationResponseSchema,
	generationsQuote: GenerationsQuoteResponseSchema,
	generationsListModels: GenerationsListModelsResponseSchema,
	generationsGetModel: GenerationsGetModelResponseSchema,
	mediaProbe: MediaProbeResponseSchema,
	sourcesFetch: SourcesFetchResponseSchema,
	sourcesList: SourcesListResponseSchema,
	sourcesGet: SourcesGetResponseSchema,
	sourcesDelete: SourcesDeleteResponseSchema,
	uploadsCreate: UploadsCreateResponseSchema,
	assetsGet: AssetsGetResponseSchema,
	assetsGetByRenderId: AssetsGetByRenderIdResponseSchema,
	assetsTransfer: AssetsTransferResponseSchema,
	assetsDelete: AssetsDeleteResponseSchema,
} as const;

export type ShotstackEndpointInputs = {
	[K in keyof typeof ShotstackEndpointInputSchemas]: z.input<
		(typeof ShotstackEndpointInputSchemas)[K]
	>;
};

export type ShotstackEndpointOutputs = {
	[K in keyof typeof ShotstackEndpointOutputSchemas]: z.output<
		(typeof ShotstackEndpointOutputSchemas)[K]
	>;
};
