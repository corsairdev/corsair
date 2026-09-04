import { z } from 'zod';

const DateTimeSchema = z.string().datetime({ offset: true }).or(z.string());
const JsonObjectSchema = z.record(z.string(), z.unknown());

const UrlsSchema = z
	.object({
		get: z.string().optional(),
		cancel: z.string().optional(),
		web: z.string().optional(),
		stream: z.string().optional(),
	})
	.loose();

const PredictionSchema = z
	.object({
		id: z.string(),
		status: z.enum([
			'starting',
			'processing',
			'succeeded',
			'failed',
			'canceled',
			'aborted',
		]),
		model: z.string().optional(),
		version: z.string().optional(),
		deployment: z.string().optional(),
		input: JsonObjectSchema.optional(),
		output: z.unknown().optional(),
		error: z.string().nullable().optional(),
		logs: z.string().optional(),
		source: z.enum(['api', 'web']).optional(),
		data_removed: z.boolean().optional(),
		created_at: DateTimeSchema.optional(),
		started_at: DateTimeSchema.nullable().optional(),
		completed_at: DateTimeSchema.nullable().optional(),
		deadline: DateTimeSchema.optional(),
		metrics: JsonObjectSchema.optional(),
		urls: UrlsSchema.optional(),
	})
	.loose();

const PaginatedPredictionsSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(PredictionSchema),
	})
	.loose();

const ModelSchema = z
	.object({
		owner: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		visibility: z.enum(['public', 'private']).optional(),
		url: z.string().optional(),
		github_url: z.string().nullable().optional(),
		paper_url: z.string().nullable().optional(),
		license_url: z.string().nullable().optional(),
		cover_image_url: z.string().nullable().optional(),
		run_count: z.number().optional(),
		is_official: z.boolean().optional(),
		default_example: z.unknown().nullable().optional(),
		latest_version: z.unknown().nullable().optional(),
	})
	.loose();

const VersionSchema = z
	.object({
		id: z.string(),
		created_at: DateTimeSchema,
		cog_version: z.string().nullable().optional(),
		openapi_schema: z.unknown().nullable().optional(),
	})
	.loose();

const TrainingSchema = z
	.object({
		id: z.string(),
		status: z.enum([
			'starting',
			'processing',
			'succeeded',
			'failed',
			'canceled',
			'aborted',
		]),
		model: z.string().optional(),
		version: z.string().optional(),
		input: JsonObjectSchema.optional(),
		output: z
			.object({
				version: z.string().optional(),
				weights: z.string().optional(),
			})
			.loose()
			.optional(),
		error: z.string().nullable().optional(),
		logs: z.string().optional(),
		source: z.enum(['api', 'web']).optional(),
		created_at: DateTimeSchema.optional(),
		started_at: DateTimeSchema.nullable().optional(),
		completed_at: DateTimeSchema.nullable().optional(),
		urls: UrlsSchema.optional(),
		metrics: JsonObjectSchema.optional(),
	})
	.loose();

const PaginatedTrainingsSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(TrainingSchema),
	})
	.loose();

const DeploymentSchema = z
	.object({
		owner: z.string(),
		name: z.string(),
		current_release: z
			.object({
				number: z.number().optional(),
				model: z.string().optional(),
				version: z.string().optional(),
				created_at: DateTimeSchema.optional(),
				configuration: z
					.object({
						hardware: z.string().optional(),
						min_instances: z.number().optional(),
						max_instances: z.number().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const CollectionSchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string(),
		full_description: z.string().nullable().optional(),
		models: z.array(ModelSchema).optional(),
	})
	.loose();

const CollectionListItemSchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string(),
	})
	.loose();

const PaginatedCollectionsSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(CollectionListItemSchema),
	})
	.loose();

const PaginatedModelsSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(ModelSchema),
	})
	.loose();

const PaginatedVersionsSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(VersionSchema),
	})
	.loose();

const FileSchema = z
	.object({
		id: z.string(),
		content_type: z.string(),
		size: z.number(),
		checksums: z.object({ sha256: z.string().optional() }).loose(),
		metadata: JsonObjectSchema,
		created_at: DateTimeSchema,
		expires_at: DateTimeSchema,
		urls: z.object({ get: z.string() }).loose(),
	})
	.loose();

const PaginatedFilesSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(FileSchema),
	})
	.loose();

const HardwareSchema = z
	.object({
		sku: z.string(),
		name: z.string(),
	})
	.loose();

const SearchSchema = z
	.object({
		query: z.string(),
		models: z.array(
			z.object({ model: ModelSchema, metadata: JsonObjectSchema }),
		),
		collections: z.array(
			z.object({ slug: z.string(), name: z.string() }).loose(),
		),
		pages: z.array(z.object({ title: z.string().optional() }).loose()),
	})
	.loose();

const WebhookSecretSchema = z.object({ key: z.string() });

const EmptyInputSchema = z.object({}).strict();

const PredictionCreateBaseSchema = z.object({
	input: JsonObjectSchema,
	stream: z.boolean().optional(),
	webhook: z.string().url().optional(),
	webhook_events_filter: z
		.array(z.enum(['start', 'output', 'logs', 'completed']))
		.optional(),
	prefer: z.string().optional(),
	cancelAfter: z.string().optional(),
});

export const ReplicateEndpointInputSchemas = {
	accountGet: EmptyInputSchema,
	collectionsList: z.object({
		cursor: z.string().min(1).optional(),
	}),
	collectionsGet: z.object({ collectionSlug: z.string().min(1) }),
	deploymentsList: EmptyInputSchema,
	deploymentsCreate: z.object({
		name: z.string().min(1),
		model: z.string().min(1),
		version: z.string().min(1),
		hardware: z.string().min(1),
		min_instances: z.number().int().min(0).max(5),
		max_instances: z.number().int().min(0).max(20),
	}),
	deploymentsDelete: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
	}),
	deploymentsGet: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
	}),
	deploymentsPredictionsCreate: z
		.object({ owner: z.string().min(1), name: z.string().min(1) })
		.merge(PredictionCreateBaseSchema),
	filesList: z.object({
		cursor: z.string().min(1).optional(),
	}),
	filesCreate: z.object({
		content: z.unknown(),
		filename: z.string().max(255).optional(),
		type: z.string().optional(),
		metadata: JsonObjectSchema.optional(),
	}),
	filesDelete: z.object({ fileId: z.string().min(1) }),
	filesGet: z.object({ fileId: z.string().min(1) }),
	hardwareList: EmptyInputSchema,
	modelsList: z.object({
		cursor: z.string().min(1).optional(),
		sort_by: z
			.enum(['model_created_at', 'latest_version_created_at'])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
	}),
	modelsGet: z.object({ owner: z.string().min(1), name: z.string().min(1) }),
	modelsUpdate: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
		description: z.string().optional(),
		readme: z.string().optional(),
		github_url: z.string().url().optional(),
		paper_url: z.string().url().optional(),
		weights_url: z.string().url().optional(),
		license_url: z.string().url().optional(),
	}),
	modelsExamplesList: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
	}),
	modelsPredictionsCreate: z
		.object({ owner: z.string().min(1), name: z.string().min(1) })
		.merge(PredictionCreateBaseSchema),
	modelsReadmeGet: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
	}),
	modelsVersionsGet: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
		versionId: z.string().min(1),
	}),
	modelsVersionsList: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
		cursor: z.string().min(1).optional(),
	}),
	predictionsCreate: PredictionCreateBaseSchema.extend({
		version: z.string().min(1),
	}),
	predictionsGet: z.object({ predictionId: z.string().min(1) }),
	predictionsList: z.object({
		cursor: z.string().min(1).optional(),
		created_after: z.string().optional(),
		created_before: z.string().optional(),
		source: z.enum(['web']).optional(),
	}),
	predictionsCancel: z.object({ predictionId: z.string().min(1) }),
	search: z.object({
		query: z.string().min(1),
		limit: z.number().int().min(1).max(50).optional(),
	}),
	trainingsCreate: z.object({
		owner: z.string().min(1),
		name: z.string().min(1),
		versionId: z.string().min(1),
		destination: z.string().min(1),
		input: JsonObjectSchema,
		webhook: z.string().url().optional(),
		webhook_events_filter: z
			.array(z.enum(['start', 'output', 'logs', 'completed']))
			.optional(),
	}),
	trainingsGet: z.object({ trainingId: z.string().min(1) }),
	trainingsList: z.object({
		cursor: z.string().min(1).optional(),
	}),
	trainingsCancel: z.object({ trainingId: z.string().min(1) }),
	webhooksDefaultSecretGet: EmptyInputSchema,
} as const;

export const ReplicateEndpointOutputSchemas = {
	accountGet: z
		.object({
			username: z.string(),
			name: z.string().optional(),
			type: z.enum(['user', 'organization']),
			avatar_url: z.string().optional(),
			github_url: z.string().optional(),
		})
		.loose(),
	collectionsList: PaginatedCollectionsSchema,
	collectionsGet: CollectionSchema,
	deploymentsList: z.array(DeploymentSchema),
	deploymentsCreate: DeploymentSchema,
	deploymentsDelete: z.object({ success: z.literal(true) }),
	deploymentsGet: DeploymentSchema,
	deploymentsPredictionsCreate: PredictionSchema,
	filesList: PaginatedFilesSchema,
	filesCreate: FileSchema,
	filesDelete: z.object({ success: z.literal(true) }),
	filesGet: FileSchema,
	hardwareList: z.array(HardwareSchema),
	modelsList: PaginatedModelsSchema,
	modelsGet: ModelSchema,
	modelsUpdate: ModelSchema,
	modelsExamplesList: PaginatedPredictionsSchema,
	modelsPredictionsCreate: PredictionSchema,
	modelsReadmeGet: z.string(),
	modelsVersionsGet: VersionSchema,
	modelsVersionsList: PaginatedVersionsSchema,
	predictionsCreate: PredictionSchema,
	predictionsGet: PredictionSchema,
	predictionsList: PaginatedPredictionsSchema,
	predictionsCancel: PredictionSchema,
	search: SearchSchema,
	trainingsCreate: TrainingSchema,
	trainingsGet: TrainingSchema,
	trainingsList: PaginatedTrainingsSchema,
	trainingsCancel: TrainingSchema,
	webhooksDefaultSecretGet: WebhookSecretSchema,
} as const;

export type ReplicateEndpointInputs = {
	[K in keyof typeof ReplicateEndpointInputSchemas]: z.infer<
		(typeof ReplicateEndpointInputSchemas)[K]
	>;
};

export type ReplicateEndpointOutputs = {
	[K in keyof typeof ReplicateEndpointOutputSchemas]: z.infer<
		(typeof ReplicateEndpointOutputSchemas)[K]
	>;
};
