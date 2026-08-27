import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const PositiveLimit = z.number().int().min(1).max(100);
const PaginationQuery = z.object({
	limit: PositiveLimit.optional(),
	paginationToken: NonEmptyString.optional(),
});

const EmptyResponseSchema = z.union([z.object({}).loose(), z.undefined()]);

const ServerlessSpecSchema = z
	.object({
		serverless: z
			.object({
				cloud: z.enum(['aws', 'gcp', 'azure']),
				region: NonEmptyString,
			})
			.loose(),
	})
	.loose();

const IndexModelSchema = z
	.object({
		name: NonEmptyString,
		metric: z.string().optional(),
		host: z.string().optional(),
		dimension: z.number().int().positive().nullable().optional(),
		vector_type: z.enum(['dense', 'sparse']).optional(),
		deletion_protection: z.enum(['enabled', 'disabled']).optional(),
		status: z
			.object({
				ready: z.boolean().optional(),
				state: z.string().optional(),
			})
			.loose()
			.optional(),
		spec: z.object({}).loose().optional(),
		tags: z.record(z.string(), z.string()).optional(),
	})
	.loose();

const BackupModelSchema = z
	.object({
		backup_id: NonEmptyString,
		name: z.string().optional(),
		source_index_name: z.string().optional(),
		source_index_id: z.string().optional(),
		status: z.string().optional(),
		cloud: z.string().optional(),
		region: z.string().optional(),
		dimension: z.number().int().positive().optional(),
		metric: z.string().optional(),
		vector_count: z.number().int().nonnegative().optional(),
		namespace_count: z.number().int().nonnegative().optional(),
		created_at: z.string().optional(),
	})
	.loose();

const RestoreJobSchema = z
	.object({
		restore_job_id: NonEmptyString,
		backup_id: z.string().optional(),
		target_index_name: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().nullable().optional(),
		percent_complete: z.number().min(0).max(100).optional(),
	})
	.loose();

const ModelInfoSchema = z
	.object({
		model: NonEmptyString,
		short_description: z.string().optional(),
		type: z.enum(['embed', 'rerank']).optional(),
		vector_type: z.enum(['dense', 'sparse']).optional(),
		dimension: z.number().int().positive().optional(),
		max_sequence_length: z.number().int().positive().optional(),
	})
	.loose();

const CreateIndexInputSchema = z
	.object({
		name: NonEmptyString,
		dimension: z.number().int().positive().optional(),
		metric: z.enum(['cosine', 'euclidean', 'dotproduct']).optional(),
		vector_type: z.enum(['dense', 'sparse']).optional(),
		spec: ServerlessSpecSchema,
		deletion_protection: z.enum(['enabled', 'disabled']).optional(),
		tags: z.record(z.string(), z.string()).optional(),
	})
	.loose();

const CreateIndexForModelInputSchema = z
	.object({
		name: NonEmptyString,
		cloud: z.enum(['aws', 'gcp', 'azure']),
		region: NonEmptyString,
		embed: z
			.object({
				model: NonEmptyString,
				field_map: z.record(z.string(), z.string()),
				metric: z.enum(['cosine', 'euclidean', 'dotproduct']).optional(),
				read_parameters: z.object({}).loose().optional(),
				write_parameters: z.object({}).loose().optional(),
			})
			.loose(),
		deletion_protection: z.enum(['enabled', 'disabled']).optional(),
		tags: z.record(z.string(), z.string()).optional(),
	})
	.loose();

const ConfigureIndexInputSchema = z
	.object({
		indexName: NonEmptyString,
		deletion_protection: z.enum(['enabled', 'disabled']).optional(),
		tags: z.record(z.string(), z.string()).nullable().optional(),
		spec: z.object({}).loose().optional(),
		embed: z.object({}).loose().optional(),
	})
	.loose();

const IndexNameInputSchema = z.object({ indexName: NonEmptyString });
const BackupIdInputSchema = z.object({ backupId: NonEmptyString });
const RestoreJobIdInputSchema = z.object({ restoreJobId: NonEmptyString });

const CreateBackupInputSchema = z.object({
	indexName: NonEmptyString,
	name: NonEmptyString,
	description: z.string().optional(),
});

const ListIndexBackupsInputSchema = z.object({
	indexName: NonEmptyString,
	includeDeleted: z.boolean().optional(),
	limit: PositiveLimit.optional(),
	paginationToken: NonEmptyString.optional(),
});

const CreateIndexFromBackupInputSchema = z.object({
	backupId: NonEmptyString,
	name: NonEmptyString,
	deletion_protection: z.enum(['enabled', 'disabled']).optional(),
	tags: z.record(z.string(), z.string()).optional(),
});

const EmbedInputSchema = z
	.object({
		model: NonEmptyString,
		inputs: z
			.array(z.object({ text: z.string() }).loose())
			.min(1)
			.max(96),
		parameters: z.object({}).loose().optional(),
	})
	.loose();

const EmbeddingsResponseSchema = z
	.object({
		model: z.string().optional(),
		vector_type: z.enum(['dense', 'sparse']).optional(),
		data: z.array(z.object({}).loose()),
		usage: z.object({}).loose().optional(),
	})
	.loose();

const RerankInputSchema = z
	.object({
		model: NonEmptyString,
		query: NonEmptyString,
		documents: z.array(z.union([z.string(), z.object({}).loose()])).min(1),
		top_n: z.number().int().positive().optional(),
		return_documents: z.boolean().optional(),
		parameters: z.object({}).loose().optional(),
	})
	.loose();

const RerankResponseSchema = z
	.object({
		model: z.string().optional(),
		data: z.array(
			z
				.object({
					index: z.number().int().nonnegative(),
					score: z.number(),
					document: z.object({}).loose().optional(),
				})
				.loose(),
		),
		usage: z.object({}).loose().optional(),
	})
	.loose();

export const PineconeEndpointInputSchemas = {
	createIndex: CreateIndexInputSchema,
	createIndexForModel: CreateIndexForModelInputSchema,
	listIndexes: z.object({}),
	describeIndex: IndexNameInputSchema,
	configureIndex: ConfigureIndexInputSchema,
	deleteIndex: IndexNameInputSchema,
	createBackup: CreateBackupInputSchema,
	listIndexBackups: ListIndexBackupsInputSchema,
	listCollections: z.object({}),
	listProjectBackups: PaginationQuery,
	describeBackup: BackupIdInputSchema,
	deleteBackup: BackupIdInputSchema,
	createIndexFromBackup: CreateIndexFromBackupInputSchema,
	listRestoreJobs: PaginationQuery,
	describeRestoreJob: RestoreJobIdInputSchema,
	embed: EmbedInputSchema,
	rerank: RerankInputSchema,
	listModels: z.object({
		type: z.enum(['embed', 'rerank']).optional(),
		vectorType: z.enum(['dense', 'sparse']).optional(),
	}),
	getModel: z.object({ modelName: NonEmptyString }),
} as const;

export const PineconeEndpointOutputSchemas = {
	createIndex: IndexModelSchema,
	createIndexForModel: IndexModelSchema,
	listIndexes: z.object({ indexes: z.array(IndexModelSchema) }).loose(),
	describeIndex: IndexModelSchema,
	configureIndex: IndexModelSchema,
	deleteIndex: EmptyResponseSchema,
	createBackup: BackupModelSchema,
	listIndexBackups: z
		.object({
			backups: z.array(BackupModelSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	listCollections: z
		.object({ collections: z.array(z.object({}).loose()) })
		.loose(),
	listProjectBackups: z
		.object({
			backups: z.array(BackupModelSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	describeBackup: BackupModelSchema,
	deleteBackup: EmptyResponseSchema,
	createIndexFromBackup: z
		.object({ restore_job_id: NonEmptyString, index_id: z.string().optional() })
		.loose(),
	listRestoreJobs: z
		.object({
			restore_jobs: z.array(RestoreJobSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	describeRestoreJob: RestoreJobSchema,
	embed: EmbeddingsResponseSchema,
	rerank: RerankResponseSchema,
	listModels: z.object({ models: z.array(ModelInfoSchema) }).loose(),
	getModel: ModelInfoSchema,
} as const;

export type PineconeEndpointInputs = {
	[K in keyof typeof PineconeEndpointInputSchemas]: z.infer<
		(typeof PineconeEndpointInputSchemas)[K]
	>;
};

export type PineconeEndpointOutputs = {
	[K in keyof typeof PineconeEndpointOutputSchemas]: z.infer<
		(typeof PineconeEndpointOutputSchemas)[K]
	>;
};

export type CreateIndexInput = z.infer<typeof CreateIndexInputSchema>;
export type IndexModel = z.infer<typeof IndexModelSchema>;
export type EmbedInput = z.infer<typeof EmbedInputSchema>;
export type EmbeddingsResponse = z.infer<typeof EmbeddingsResponseSchema>;
export type RerankInput = z.infer<typeof RerankInputSchema>;
export type RerankResponse = z.infer<typeof RerankResponseSchema>;
