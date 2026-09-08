import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const PositiveLimit = z.number().int().min(1).max(100);
const PaginationQuery = z.object({
	limit: PositiveLimit.optional(),
	paginationToken: NonEmptyString.optional(),
});

const EmptyResponseSchema = z
	.union([z.strictObject({}), z.literal(''), z.undefined()])
	.transform((response) => (response === '' ? undefined : response));

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
		tags: z.record(z.string(), z.string()).nullable().optional(),
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
		record_count: z.number().int().nonnegative().optional(),
		namespace_count: z.number().int().nonnegative().optional(),
		size_bytes: z.number().int().nonnegative().optional(),
		source_index_deleted_at: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

const RestoreJobSchema = z
	.object({
		restore_job_id: NonEmptyString,
		backup_id: z.string().optional(),
		target_index_name: z.string().optional(),
		target_index_id: z.string().optional(),
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
		documents: z.array(z.object({ text: z.string() }).loose()).min(1),
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

const IndexHostSchema = z.object({ host: NonEmptyString });
const MetadataSchema = z.record(z.string(), z.unknown());
const SparseValuesSchema = z
	.object({
		indices: z.array(z.number().int().nonnegative()),
		values: z.array(z.number()),
	})
	.refine((sparse) => sparse.indices.length === sparse.values.length, {
		message: 'sparse indices and values must be the same length',
	});
const VectorSchema = z
	.object({
		id: NonEmptyString,
		values: z.array(z.number()).optional(),
		sparse_values: SparseValuesSchema.optional(),
		metadata: MetadataSchema.optional(),
	})
	.loose();

const UpsertVectorsInputSchema = IndexHostSchema.extend({
	vectors: z.array(VectorSchema).min(1).max(1000),
	namespace: z.string().optional(),
});
const QueryVectorsInputSchema = IndexHostSchema.extend({
	namespace: z.string().optional(),
	topK: z.number().int().positive(),
	vector: z.array(z.number()).min(1).optional(),
	id: NonEmptyString.optional(),
	sparseVector: SparseValuesSchema.optional(),
	filter: MetadataSchema.optional(),
	includeValues: z.boolean().optional(),
	includeMetadata: z.boolean().optional(),
}).refine((input) => Boolean(input.id) !== Boolean(input.vector), {
	message: 'Provide exactly one of id or vector',
});
const FetchVectorsInputSchema = IndexHostSchema.extend({
	ids: z.array(NonEmptyString).min(1),
	namespace: z.string().optional(),
});
const UpdateVectorInputSchema = IndexHostSchema.extend({
	id: NonEmptyString,
	values: z.array(z.number()).optional(),
	sparseValues: SparseValuesSchema.optional(),
	setMetadata: MetadataSchema.optional(),
	namespace: z.string().optional(),
});
const DeleteVectorsInputSchema = IndexHostSchema.extend({
	ids: z.array(NonEmptyString).optional(),
	deleteAll: z.boolean().optional(),
	namespace: z.string().optional(),
	filter: MetadataSchema.optional(),
});
const ListVectorsInputSchema = IndexHostSchema.extend({
	prefix: z.string().optional(),
	limit: z.number().int().positive().optional(),
	paginationToken: z.string().optional(),
	namespace: z.string().optional(),
});
const DescribeIndexStatsInputSchema = IndexHostSchema.extend({
	filter: MetadataSchema.optional(),
});
const NamespaceNameInputSchema = IndexHostSchema.extend({
	namespace: z.string(),
});
const NamespaceMetadataSchema = z.object({
	fields: z.record(z.string(), z.object({ filterable: z.boolean() }).loose()),
});
const CreateNamespaceInputSchema = NamespaceNameInputSchema.extend({
	schema: NamespaceMetadataSchema.optional(),
});
const ListNamespacesInputSchema = IndexHostSchema.extend({
	limit: PositiveLimit.optional(),
	paginationToken: z.string().optional(),
	prefix: z.string().optional(),
});
const ListImportsInputSchema = IndexHostSchema.extend({
	limit: PositiveLimit.optional(),
	paginationToken: z.string().optional(),
});
const ImportIdInputSchema = IndexHostSchema.extend({
	importId: NonEmptyString,
});
const StartImportInputSchema = IndexHostSchema.extend({
	uri: NonEmptyString,
	integrationId: z.string().optional(),
	errorMode: z
		.object({
			onError: z.enum(['abort', 'continue']),
		})
		.optional(),
});
const RecordSchema = z.object({ _id: NonEmptyString }).loose();
const UpsertRecordsInputSchema = NamespaceNameInputSchema.extend({
	records: z.array(RecordSchema).min(1).max(96),
});
const SearchRecordsInputSchema = NamespaceNameInputSchema.extend({
	query: z
		.object({
			top_k: z.number().int().positive(),
			inputs: z.object({ text: z.string() }).loose().optional(),
			vector: z.array(z.number()).optional(),
			id: z.string().optional(),
			filter: MetadataSchema.optional(),
		})
		.loose(),
	fields: z.array(z.string()).optional(),
});

const NamespaceDescriptionSchema = z
	.object({
		name: z.string(),
		record_count: z.number().int().nonnegative().optional(),
	})
	.loose();
const ImportModelSchema = z
	.object({
		id: NonEmptyString,
		uri: z.string().optional(),
		status: z.string().optional(),
		percentComplete: z.number().min(0).max(100).optional(),
		createdAt: z.string().optional(),
		finishedAt: z.string().nullable().optional(),
		recordsImported: z.number().int().nonnegative().optional(),
		error: z.string().optional(),
	})
	.loose();
const QueryResponseSchema = z
	.object({
		matches: z.array(
			z
				.object({
					id: z.string(),
					score: z.number().optional(),
					values: z.array(z.number()).optional(),
					metadata: MetadataSchema.optional(),
				})
				.loose(),
		),
		namespace: z.string().optional(),
		usage: z.object({}).loose().optional(),
	})
	.loose();

const AssistantNameSchema = z
	.string()
	.min(1)
	.max(63)
	.regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
const AssistantHostAndNameSchema = z.object({
	host: NonEmptyString,
	assistantName: AssistantNameSchema,
});
const AssistantSchema = z
	.object({
		name: AssistantNameSchema,
		status: z.enum([
			'Initializing',
			'Failed',
			'Ready',
			'Terminating',
			'InitializationFailed',
		]),
		host: z.string().optional(),
		instructions: z.string().nullable().optional(),
		metadata: MetadataSchema.nullable().optional(),
		region: z.enum(['us', 'eu']).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();
const CreateAssistantInputSchema = z.object({
	name: AssistantNameSchema,
	instructions: z.string().max(16_384).nullable().optional(),
	metadata: MetadataSchema.optional(),
	region: z.enum(['us', 'eu']).optional(),
});
const UpdateAssistantInputSchema = z.object({
	assistantName: AssistantNameSchema,
	instructions: z.string().max(16_384).nullable().optional(),
	metadata: MetadataSchema.nullable().optional(),
});
const MessageSchema = z
	.object({
		role: z.enum(['user', 'assistant']),
		content: z.string(),
	})
	.loose();
const ChatInputSchema = AssistantHostAndNameSchema.extend({
	messages: z.array(MessageSchema).min(1),
	stream: z.literal(false).optional().default(false),
	model: z.string().optional(),
	temperature: z.number().min(0).max(2).optional(),
	filter: MetadataSchema.optional(),
	json_response: z.boolean().optional(),
	include_highlights: z.boolean().optional(),
	context_options: z.object({}).loose().optional(),
});
const ContextInputSchema = AssistantHostAndNameSchema.extend({
	query: z.string().optional(),
	messages: z.array(MessageSchema).optional(),
	filter: MetadataSchema.optional(),
	top_k: z.number().int().min(1).max(64).optional(),
	snippet_size: z.number().int().min(512).max(8192).optional(),
	multimodal: z.boolean().optional(),
	include_binary_content: z.boolean().optional(),
});
const AssistantFileSchema = z
	.object({
		id: NonEmptyString,
		name: NonEmptyString,
		size: z.number().int().nonnegative().optional(),
		metadata: MetadataSchema.nullable().optional(),
		status: z
			.enum(['Processing', 'Available', 'Deleting', 'ProcessingFailed'])
			.optional(),
		created_on: z.string().optional(),
		updated_on: z.string().optional(),
		signed_url: z.string().nullable().optional(),
		multimodal: z.boolean().optional(),
	})
	.loose();
const OperationModelSchema = z
	.object({
		id: NonEmptyString,
		operation_type: z.enum([
			'upload_file',
			'upsert_file',
			'update_file_metadata',
			'delete_file',
		]),
		status: z.enum(['Processing', 'Completed', 'Failed']),
		created_on: z.string(),
		file_id: z.string().nullable().optional(),
		percent_complete: z.number().int().min(0).max(100).optional(),
		error_message: z.string().nullable().optional(),
	})
	.loose();
const FileIdInputSchema = AssistantHostAndNameSchema.extend({
	fileId: NonEmptyString,
});
const UploadFileInputSchema = AssistantHostAndNameSchema.extend({
	fileName: NonEmptyString,
	fileBase64: NonEmptyString,
	contentType: NonEmptyString.optional(),
	metadata: MetadataSchema.optional(),
	multimodal: z.boolean().optional(),
});

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
	upsertVectors: UpsertVectorsInputSchema,
	queryVectors: QueryVectorsInputSchema,
	fetchVectors: FetchVectorsInputSchema,
	updateVector: UpdateVectorInputSchema,
	deleteVectors: DeleteVectorsInputSchema,
	listVectors: ListVectorsInputSchema,
	describeIndexStats: DescribeIndexStatsInputSchema,
	listNamespaces: ListNamespacesInputSchema,
	createNamespace: CreateNamespaceInputSchema,
	describeNamespace: NamespaceNameInputSchema,
	deleteNamespace: NamespaceNameInputSchema,
	listBulkImports: ListImportsInputSchema,
	startBulkImport: StartImportInputSchema,
	describeBulkImport: ImportIdInputSchema,
	cancelBulkImport: ImportIdInputSchema,
	upsertRecords: UpsertRecordsInputSchema,
	searchRecords: SearchRecordsInputSchema,
	listAssistants: PaginationQuery,
	createAssistant: CreateAssistantInputSchema,
	getAssistant: z.object({ assistantName: AssistantNameSchema }),
	updateAssistant: UpdateAssistantInputSchema,
	deleteAssistant: z.object({ assistantName: AssistantNameSchema }),
	listFiles: AssistantHostAndNameSchema.extend({
		filter: z.string().optional(),
		limit: PositiveLimit.optional(),
		paginationToken: z.string().optional(),
	}),
	uploadFile: UploadFileInputSchema,
	describeFile: FileIdInputSchema.extend({
		includeUrl: z.boolean().optional(),
	}),
	deleteFile: FileIdInputSchema,
	chatAssistant: ChatInputSchema,
	chatCompletionAssistant: ChatInputSchema.omit({
		json_response: true,
		include_highlights: true,
		context_options: true,
	}),
	retrieveContext: ContextInputSchema,
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
			data: z.array(BackupModelSchema),
			pagination: z.object({}).loose().nullable().optional(),
		})
		.loose(),
	listCollections: z
		.object({
			collections: z.array(
				z
					.object({
						name: NonEmptyString,
						status: z.string().optional(),
						environment: z.string().optional(),
						size: z.number().int().optional(),
						vector_count: z.number().int().optional(),
						dimension: z.number().int().positive().optional(),
					})
					.loose(),
			),
		})
		.loose(),
	listProjectBackups: z
		.object({
			data: z.array(BackupModelSchema),
			pagination: z.object({}).loose().nullable().optional(),
		})
		.loose(),
	describeBackup: BackupModelSchema,
	deleteBackup: EmptyResponseSchema,
	createIndexFromBackup: z
		.object({ restore_job_id: NonEmptyString, index_id: z.string().optional() })
		.loose(),
	listRestoreJobs: z
		.object({
			data: z.array(RestoreJobSchema),
			pagination: z.object({}).loose().nullable().optional(),
		})
		.loose(),
	describeRestoreJob: RestoreJobSchema,
	embed: EmbeddingsResponseSchema,
	rerank: RerankResponseSchema,
	listModels: z.object({ models: z.array(ModelInfoSchema) }).loose(),
	getModel: ModelInfoSchema,
	upsertVectors: z
		.object({ upsertedCount: z.number().int().nonnegative() })
		.loose(),
	queryVectors: QueryResponseSchema,
	fetchVectors: z
		.object({
			vectors: z.record(z.string(), VectorSchema),
			namespace: z.string().optional(),
		})
		.loose(),
	updateVector: EmptyResponseSchema,
	deleteVectors: EmptyResponseSchema,
	listVectors: z
		.object({
			vectors: z.array(z.object({ id: z.string() }).loose()),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	describeIndexStats: z
		.object({
			dimension: z.number().int().positive().optional(),
			indexFullness: z.number().optional(),
			totalVectorCount: z.number().int().nonnegative().optional(),
			namespaces: z.record(z.string(), z.object({}).loose()).optional(),
		})
		.loose(),
	listNamespaces: z
		.object({
			namespaces: z.array(NamespaceDescriptionSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	createNamespace: NamespaceDescriptionSchema,
	describeNamespace: NamespaceDescriptionSchema,
	deleteNamespace: EmptyResponseSchema,
	listBulkImports: z
		.object({
			data: z.array(ImportModelSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	startBulkImport: z.object({ id: NonEmptyString }).loose(),
	describeBulkImport: ImportModelSchema,
	cancelBulkImport: EmptyResponseSchema,
	upsertRecords: EmptyResponseSchema,
	searchRecords: z
		.object({
			result: z.object({ hits: z.array(z.object({}).loose()) }).loose(),
			usage: z.object({}).loose().optional(),
		})
		.loose(),
	listAssistants: z
		.object({
			assistants: z.array(AssistantSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	createAssistant: AssistantSchema,
	getAssistant: AssistantSchema,
	updateAssistant: AssistantSchema,
	deleteAssistant: EmptyResponseSchema,
	listFiles: z
		.object({
			files: z.array(AssistantFileSchema),
			pagination: z.object({}).loose().optional(),
		})
		.loose(),
	uploadFile: OperationModelSchema,
	describeFile: AssistantFileSchema,
	deleteFile: OperationModelSchema,
	chatAssistant: z
		.object({
			id: z.string().optional(),
			message: MessageSchema.optional(),
			citations: z.array(z.object({}).loose()).optional(),
			usage: z.object({}).loose().optional(),
		})
		.loose(),
	chatCompletionAssistant: z
		.object({
			id: z.string().optional(),
			choices: z.array(z.object({}).loose()).optional(),
			model: z.string().optional(),
			usage: z.object({}).loose().optional(),
		})
		.loose(),
	retrieveContext: z
		.object({
			snippets: z.array(z.object({}).loose()),
			usage: z.object({}).loose(),
		})
		.loose(),
} as const;

export type PineconeEndpointInputs = {
	[K in keyof typeof PineconeEndpointInputSchemas]: z.input<
		(typeof PineconeEndpointInputSchemas)[K]
	>;
};

export type PineconeEndpointParsedInputs = {
	[K in keyof typeof PineconeEndpointInputSchemas]: z.output<
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
