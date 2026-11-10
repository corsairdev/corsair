import { z } from 'zod';

// Inputs use Roboflow's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Roboflow adds or omits cannot fail a
// call that has already happened. Shapes come from the Platform API OpenAPI
// document at https://docs.roboflow.com/reference/platform/rest-api/platform-api-openapi
// and the Serverless API spec at
// https://docs.roboflow.com/deployment/roboflow-cloud/serverless-api.
//
// Two things worth knowing before reading the models:
//
// - There are two hosts. Everything here but `infer` talks to `api.roboflow.com`;
//   `infer` talks to `serverless.roboflow.com`, whose request and response shapes
//   come from the Inference server rather than the Platform API.
// - The root route answers 200 whether or not a key is valid. Only a valid key
//   makes `workspace` appear, so the plugin treats a missing `workspace` as an auth
//   failure rather than reading the 200 as success.

/**
 * A JSON value. Used where a field's shape belongs to the caller's data or to a
 * model's open prediction payload, so it is described as JSON rather than
 * `unknown`, which would reach the docs as `any`.
 */
export type RoboflowJsonValue =
	| string
	| number
	| boolean
	| null
	| RoboflowJsonValue[]
	| { [key: string]: RoboflowJsonValue };

const JsonValueSchema: z.ZodType<RoboflowJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/** The project types a create accepts. */
export const ROBOFLOW_PROJECT_TYPES = [
	'object-detection',
	'single-label-classification',
	'multi-label-classification',
	'instance-segmentation',
	'semantic-segmentation',
	'keypoint-detection',
	'action-recognition',
	'anomaly-detection',
] as const;

/** The licenses a create accepts. `Private` is the one that keeps a project private. */
export const ROBOFLOW_LICENSES = [
	'Private',
	'Public Domain',
	'MIT',
	'CC BY 4.0',
	'BY-NC-SA 4.0',
	'ODbL v1.0',
] as const;

// ── account.get ───────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

/**
 * The root answer.
 *
 * `welcome`, `instructions` and `docs` come back **even without a key**, so they do
 * not prove anything. `workspace` and `workspaceId` appear only when the key is
 * valid, which is what `authenticated` reports.
 */
const AccountGetResponseSchema = z
	.object({
		welcome: z.string().nullish(),
		instructions: z.string().nullish(),
		docs: z.string().nullish(),
		workspace: z
			.string()
			.nullish()
			.describe(
				'The workspace slug the key belongs to. Absent when the request was not authenticated.',
			),
		workspaceId: z.string().nullish(),
		authenticated: z
			.boolean()
			.describe(
				'True when a workspace came back, which is the only proof the key works.',
			),
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── workspaces ────────────────────────────────────────────────────────────

const WorkspaceGetInputSchema = z.object({
	workspace: z.string().min(1).describe('The workspace URL slug.'),
});

export type WorkspaceGetInput = z.infer<typeof WorkspaceGetInputSchema>;

/** One project as a workspace listing returns it. */
const ProjectSummarySchema = z
	.object({
		id: z
			.string()
			.nullish()
			.describe('workspace/project, which is the project ID.'),
		type: z.string().nullish(),
		name: z.string().nullish(),
		created: z.number().nullish().describe('Seconds since the Unix epoch.'),
		updated: z.number().nullish(),
		images: z.number().nullish(),
		unannotated: z.number().nullish(),
		annotation: z.string().nullish().describe('The annotation group.'),
		versions: z.number().nullish(),
		public: z.boolean().nullish(),
		multilabel: z.boolean().nullish(),
		license: z.string().nullish(),
		splits: z.record(z.string(), z.number()).nullish(),
		classes: z
			.record(z.string(), JsonValueSchema)
			.nullish()
			.describe('Class name to an instance count, or another shape per type.'),
	})
	.loose();

export type RoboflowProjectSummary = z.infer<typeof ProjectSummarySchema>;

const WorkspaceGetResponseSchema = z
	.object({
		workspace: z
			.object({
				name: z.string().nullish(),
				url: z.string().nullish(),
				members: z.number().nullish(),
				enabled_features: JsonObjectSchema.nullish(),
				projects: z.array(ProjectSummarySchema).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type WorkspaceGetResponse = z.infer<typeof WorkspaceGetResponseSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectGetInputSchema = z.object({
	workspace: z.string().min(1),
	project: z.string().min(1),
});

export type ProjectGetInput = z.infer<typeof ProjectGetInputSchema>;

/** A dataset version as a project listing returns it. */
const DatasetVersionSummarySchema = z
	.object({
		id: z.string().nullish().describe('workspace/project/version.'),
		name: z.string().nullish(),
		created: z.number().nullish(),
		images: z.number().nullish(),
		splits: z.record(z.string(), z.number()).nullish(),
		generating: z.boolean().nullish(),
		progress: z.number().nullish(),
	})
	.loose();

const ProjectGetResponseSchema = z
	.object({
		workspace: z
			.object({
				name: z.string().nullish(),
				url: z.string().nullish(),
				members: z.number().nullish(),
			})
			.loose()
			.nullish(),
		project: ProjectSummarySchema.nullish(),
		versions: z
			.array(DatasetVersionSummarySchema)
			.nullish()
			.describe('Newest first.'),
	})
	.loose();

export type ProjectGetResponse = z.infer<typeof ProjectGetResponseSchema>;

const ProjectCreateInputSchema = z.object({
	workspace: z.string().min(1),
	name: z
		.string()
		.min(1)
		.max(256)
		.describe('Letters, numbers, dashes, underscores and spaces only.'),
	type: z
		.enum(ROBOFLOW_PROJECT_TYPES)
		.describe(
			'anomaly-detection needs the feature turned on and its own annotation group.',
		),
	annotation: z
		.string()
		.min(1)
		.max(256)
		.describe(
			'The annotation group: a noun for what you label, such as sharks. Projects in one group share classes.',
		),
	license: z
		.enum(ROBOFLOW_LICENSES)
		.optional()
		.describe(
			'Private keeps the project private; any other value publishes it on Universe. Required on a public plan, which cannot create a private project.',
		),
	group: z.string().optional().describe('A project folder ID to create it in.'),
});

export type ProjectCreateInput = z.infer<typeof ProjectCreateInputSchema>;

const ProjectCreateResponseSchema = z
	.object({
		id: z.string().nullish().describe('The new project ID.'),
		name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

export type ProjectCreateResponse = z.infer<typeof ProjectCreateResponseSchema>;

const ProjectDeleteInputSchema = z.object({
	workspace: z.string().min(1),
	project: z.string().min(1),
});

export type ProjectDeleteInput = z.infer<typeof ProjectDeleteInputSchema>;

const ProjectDeleteResponseSchema = z.object({}).loose();

export type ProjectDeleteResponse = z.infer<typeof ProjectDeleteResponseSchema>;

// ── versions ──────────────────────────────────────────────────────────────

const VersionGetInputSchema = z.object({
	workspace: z.string().min(1),
	project: z.string().min(1),
	version: z.number().int().describe('The dataset version number.'),
});

export type VersionGetInput = z.infer<typeof VersionGetInputSchema>;

/** A version's detail: its size, splits and the preprocessing it applied. */
const VersionGetResponseSchema = z
	.object({
		workspace: z
			.object({ name: z.string().nullish(), url: z.string().nullish() })
			.loose()
			.nullish(),
		project: ProjectSummarySchema.nullish(),
		version: z
			.object({
				id: z.string().nullish().describe('workspace/project/version.'),
				name: z.string().nullish(),
				created: z.number().nullish(),
				images: z.number().nullish().describe('After augmentation.'),
				splits: z.record(z.string(), z.number()).nullish(),
				generating: z.boolean().nullish(),
				progress: z.number().nullish(),
				preprocessing: JsonObjectSchema.nullish(),
				augmentation: JsonObjectSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type VersionGetResponse = z.infer<typeof VersionGetResponseSchema>;

const VersionDeleteInputSchema = z.object({
	workspace: z.string().min(1),
	project: z.string().min(1),
	version: z.number().int(),
});

export type VersionDeleteInput = z.infer<typeof VersionDeleteInputSchema>;

const VersionDeleteResponseSchema = z.object({}).loose();

export type VersionDeleteResponse = z.infer<typeof VersionDeleteResponseSchema>;

// ── models ────────────────────────────────────────────────────────────────

const ModelsListInputSchema = z.object({
	workspace: z.string().min(1),
	project: z.string().min(1),
	group: z
		.string()
		.optional()
		.describe(
			"A Neural Architecture Search run ID. Returns only that run's models, or an empty array.",
		),
});

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

/**
 * One trained model.
 *
 * `url` is the model ID to pass to `infer`, and the metrics are percentages that
 * appear only when the model reports them.
 */
const ProjectModelSchema = z
	.object({
		url: z.string().nullish().describe('The model ID to use for inference.'),
		version: z
			.string()
			.nullish()
			.describe('The dataset version it was trained on, when tied to one.'),
		train: z.object({ status: z.string().nullish() }).loose().nullish(),
		taskType: z.string().nullish(),
		modelType: z
			.string()
			.nullish()
			.describe('Architecture and size, such as rfdetr-base.'),
		name: z.string().nullish(),
		created: z.string().nullish(),
		metrics: z
			.object({
				map50: z.number().nullish(),
				map5095: z.number().nullish(),
				precision: z.number().nullish(),
				recall: z.number().nullish(),
				f1: z.number().nullish(),
				accuracy: z.number().nullish(),
			})
			.loose()
			.nullish()
			.describe('Percentages, each present only when the model reports it.'),
	})
	.loose();

export type RoboflowModel = z.infer<typeof ProjectModelSchema>;

const ModelsListResponseSchema = z.array(ProjectModelSchema);

export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

// ── images ────────────────────────────────────────────────────────────────

const ImageUploadInputSchema = z.object({
	project: z
		.string()
		.min(1)
		.describe('The project ID, which is workspace/project.'),
	image: z
		.string()
		.min(1)
		.describe(
			'A publicly reachable image URL, or a base64 data URI. Up to 20MB.',
		),
	name: z
		.string()
		.optional()
		.describe('The file name to record, when the image is a data URI.'),
	batch: z
		.string()
		.optional()
		.describe('A batch name to group the upload under.'),
	tag: z.array(z.string()).optional().describe('Tags for the new image.'),
});

export type ImageUploadInput = z.infer<typeof ImageUploadInputSchema>;

/**
 * The upload answer.
 *
 * `duplicate: true` means the project already had that exact image: no new image
 * was added and `id` names the existing one, so it is a success rather than a
 * failure.
 */
const ImageUploadResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		duplicate: z.boolean().nullish(),
		id: z.string().nullish().describe('The image ID, for a later annotation.'),
	})
	.loose();

export type ImageUploadResponse = z.infer<typeof ImageUploadResponseSchema>;

// ── inference ─────────────────────────────────────────────────────────────

const InferInputSchema = z.object({
	modelId: z
		.string()
		.min(1)
		.describe(
			'The model ID from models.list `url`, in the form project/version, or workspace/model for a model not tied to a version.',
		),
	image: z
		.string()
		.min(1)
		.describe(
			'A publicly reachable image URL, a base64 string, or a data URI. Base64 is sent as `image_type=base64`.',
		),
	imageType: z
		.enum(['url', 'base64'])
		.optional()
		.describe(
			'url sends `image` as a URL, base64 sends it in the body. Inferred from a data URI prefix when omitted.',
		),
	confidence: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe('The confidence threshold, 0 to 1, to filter predictions.'),
	overlap: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe(
			'The IoU threshold above which two boxes are treated as duplicates.',
		),
	maxDetections: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('The most predictions to return.'),
});

export type InferInput = z.infer<typeof InferInputSchema>;

/** One prediction box. */
const PredictionSchema = z
	.object({
		x: z.number().nullish(),
		y: z.number().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		confidence: z.number().nullish(),
		class: z.string().nullish(),
		class_id: z.number().nullish(),
		detection_id: z.string().nullish(),
	})
	.loose();

/**
 * An inference answer.
 *
 * The prediction payload is the Inference server's, so it is kept open: a
 * detection model returns `predictions` of boxes, a classification model returns
 * `predictions` of class scores, and a segmentation model adds `points` per
 * prediction. The counts are what a caller can rely on across tasks.
 */
const InferResponseSchema = z
	.object({
		image: JsonObjectSchema.nullish().describe(
			'The input image, with its width and height.',
		),
		predictions: z
			.array(PredictionSchema)
			.nullish()
			.describe(
				'Boxes for a detection model, class scores for a classification model. A segmentation model adds `points` to each.',
			),
		count: z.number().nullish().describe('How many predictions came back.'),
		time: z.number().nullish().describe('Inference time in seconds.'),
	})
	.loose();

export type InferResponse = z.infer<typeof InferResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RoboflowEndpointInputs = {
	accountGet: z.infer<typeof AccountGetInputSchema>;
	workspaceGet: WorkspaceGetInput;
	projectGet: ProjectGetInput;
	projectCreate: ProjectCreateInput;
	projectDelete: ProjectDeleteInput;
	versionGet: VersionGetInput;
	versionDelete: VersionDeleteInput;
	modelsList: ModelsListInput;
	imageUpload: ImageUploadInput;
	infer: InferInput;
};

export type RoboflowEndpointOutputs = {
	accountGet: AccountGetResponse;
	workspaceGet: WorkspaceGetResponse;
	projectGet: ProjectGetResponse;
	projectCreate: ProjectCreateResponse;
	projectDelete: ProjectDeleteResponse;
	versionGet: VersionGetResponse;
	versionDelete: VersionDeleteResponse;
	modelsList: ModelsListResponse;
	imageUpload: ImageUploadResponse;
	infer: InferResponse;
};

export const RoboflowEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	workspaceGet: WorkspaceGetInputSchema,
	projectGet: ProjectGetInputSchema,
	projectCreate: ProjectCreateInputSchema,
	projectDelete: ProjectDeleteInputSchema,
	versionGet: VersionGetInputSchema,
	versionDelete: VersionDeleteInputSchema,
	modelsList: ModelsListInputSchema,
	imageUpload: ImageUploadInputSchema,
	infer: InferInputSchema,
} as const;

export const RoboflowEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	workspaceGet: WorkspaceGetResponseSchema,
	projectGet: ProjectGetResponseSchema,
	projectCreate: ProjectCreateResponseSchema,
	projectDelete: ProjectDeleteResponseSchema,
	versionGet: VersionGetResponseSchema,
	versionDelete: VersionDeleteResponseSchema,
	modelsList: ModelsListResponseSchema,
	imageUpload: ImageUploadResponseSchema,
	infer: InferResponseSchema,
} as const;
