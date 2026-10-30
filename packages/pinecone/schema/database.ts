import { z } from 'zod';

/**
 * Pinecone Control Plane IndexModel (2026-04).
 * Official: GET /indexes/{index_name}
 * https://docs.pinecone.io/reference/api/2026-04/control-plane/describe_index
 */
export const PineconeIndex = z
	.object({
		name: z.string(),
		host: z.string().optional(),
		dimension: z.number().int().positive().nullable().optional(),
		metric: z.string().optional(),
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

export type PineconeIndex = z.infer<typeof PineconeIndex>;

/**
 * Pinecone Control Plane BackupModel (2026-04).
 * Official: GET /backups/{backup_id}
 * https://docs.pinecone.io/reference/api/2026-04/control-plane/describe_backup
 */
export const PineconeBackup = z
	.object({
		backup_id: z.string(),
		name: z.string().optional(),
		source_index_name: z.string().optional(),
		source_index_id: z.string().optional(),
		source_index_deleted_at: z.string().optional(),
		status: z.string().optional(),
		cloud: z.string().optional(),
		region: z.string().optional(),
		dimension: z.number().int().positive().optional(),
		metric: z.string().optional(),
		record_count: z.number().int().nonnegative().optional(),
		namespace_count: z.number().int().nonnegative().optional(),
		size_bytes: z.number().int().nonnegative().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type PineconeBackup = z.infer<typeof PineconeBackup>;

/**
 * Pinecone Control Plane RestoreJobModel (2026-04).
 * Official: GET /restore-jobs/{job_id}
 * https://docs.pinecone.io/reference/api/2026-04/control-plane/describe_restore_job
 */
export const PineconeRestoreJob = z
	.object({
		restore_job_id: z.string(),
		backup_id: z.string().optional(),
		target_index_name: z.string().optional(),
		target_index_id: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().nullable().optional(),
		percent_complete: z.number().min(0).max(100).optional(),
	})
	.loose();

export type PineconeRestoreJob = z.infer<typeof PineconeRestoreJob>;

/**
 * Pinecone Control Plane CollectionModel (2026-04).
 * Official: GET /collections
 * https://docs.pinecone.io/reference/api/2026-04/control-plane/list_collections
 */
export const PineconeCollection = z
	.object({
		name: z.string(),
		status: z.string().optional(),
		environment: z.string().optional(),
		size: z.number().int().optional(),
		vector_count: z.number().int().optional(),
		dimension: z.number().int().positive().optional(),
	})
	.loose();

export type PineconeCollection = z.infer<typeof PineconeCollection>;

/**
 * Pinecone Data Plane NamespaceDescription (2026-04).
 * Official: GET /namespaces/{namespace}
 * https://docs.pinecone.io/reference/api/2026-04/data-plane/describenamespace
 */
export const PineconeNamespace = z
	.object({
		name: z.string(),
		record_count: z.number().int().nonnegative().optional(),
	})
	.loose();

export type PineconeNamespace = z.infer<typeof PineconeNamespace>;

/**
 * Pinecone Data Plane Vector (2026-04).
 * Official: POST /vectors/upsert
 * https://docs.pinecone.io/reference/api/2026-04/data-plane/upsert_vectors
 */
export const PineconeVector = z
	.object({
		id: z.string(),
		values: z.array(z.number()).optional(),
		sparse_values: z
			.object({
				indices: z.array(z.number().int().nonnegative()),
				values: z.array(z.number()),
			})
			.optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type PineconeVector = z.infer<typeof PineconeVector>;

/**
 * Pinecone Inference ModelInfo (2026-04).
 * Official: GET /models/{model_name}
 * https://docs.pinecone.io/reference/api/2026-04/inference/describe_model
 */
export const PineconeModel = z
	.object({
		model: z.string(),
		short_description: z.string().optional(),
		type: z.enum(['embed', 'rerank']).optional(),
		vector_type: z.enum(['dense', 'sparse']).optional(),
		dimension: z.number().int().positive().optional(),
		max_sequence_length: z.number().int().positive().optional(),
	})
	.loose();

export type PineconeModel = z.infer<typeof PineconeModel>;

/**
 * Pinecone Assistant (2026-04).
 * Official: GET /assistant/assistants/{assistant_name}
 * https://docs.pinecone.io/reference/api/2026-04/assistant/get_assistant
 */
export const PineconeAssistant = z
	.object({
		name: z.string(),
		status: z.string(),
		host: z.string().optional(),
		instructions: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		region: z.enum(['us', 'eu']).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();

export type PineconeAssistant = z.infer<typeof PineconeAssistant>;

/**
 * Pinecone Assistant file model (2026-04).
 * Official: GET /files/{assistant_name}/{file_id}
 * https://docs.pinecone.io/reference/api/2026-04/assistant-data/describe_file
 */
export const PineconeAssistantFile = z
	.object({
		id: z.string(),
		name: z.string(),
		size: z.number().int().nonnegative().optional(),
		status: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		created_on: z.string().optional(),
		updated_on: z.string().optional(),
		signed_url: z.string().nullable().optional(),
	})
	.loose();

export type PineconeAssistantFile = z.infer<typeof PineconeAssistantFile>;
