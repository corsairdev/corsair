import { z } from 'zod';

/**
 * Scale Task object.
 * Official: GET /v1/task/{taskId}
 * https://api-reference.scale.com/docs/api-reference/tasks
 */
export const ScaleAiTask = z
	.object({
		task_id: z.string(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		completed_at: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		instruction: z.string().optional(),
		params: z.record(z.string(), z.unknown()).optional(),
		callback_url: z.string().optional(),
		callback_completed: z.boolean().optional(),
		project: z.string().optional(),
		batch: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		response: z.record(z.string(), z.unknown()).optional(),
		audits: z.array(z.record(z.string(), z.unknown())).optional(),
		tags: z.array(z.string()).optional(),
		unique_id: z.string().nullable().optional(),
	})
	.loose();

export type ScaleAiTask = z.infer<typeof ScaleAiTask>;

/**
 * Scale Batch object.
 * Official: GET /v1/batches/{batchName}
 * https://api-reference.scale.com/docs/api-reference/batches
 */
export const ScaleAiBatch = z
	.object({
		name: z.string(),
		project: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		completed_at: z.string().optional(),
		callback: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type ScaleAiBatch = z.infer<typeof ScaleAiBatch>;

/**
 * Scale Batch status (task counts).
 * Official: GET /v1/batches/{batchName}/status
 * https://api-reference.scale.com/docs/api-reference/batches
 */
export const ScaleAiBatchStatus = z
	.object({
		status: z.string().optional(),
		tasks_pending: z.number().optional(),
		tasks_completed: z.number().optional(),
		tasks_error: z.number().optional(),
		tasks_canceled: z.number().optional(),
	})
	.loose();

export type ScaleAiBatchStatus = z.infer<typeof ScaleAiBatchStatus>;

/**
 * Scale Project object.
 * Official: GET /v1/projects/{name}
 * https://api-reference.scale.com/docs/api-reference/projects
 */
export const ScaleAiProject = z
	.object({
		type: z.string().optional(),
		name: z.string(),
		param_history: z.array(z.record(z.string(), z.unknown())).optional(),
		created_at: z.string().optional(),
		archived: z.boolean().optional(),
	})
	.loose();

export type ScaleAiProject = z.infer<typeof ScaleAiProject>;

/**
 * Scale File / asset object.
 * Official: POST /v1/files/upload, POST /v1/files/import, GET /v1/files
 * https://scale.com/docs/api-reference/file-endpoints
 */
export const ScaleAiFile = z
	.object({
		id: z.string().optional(),
		attachment_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type ScaleAiFile = z.infer<typeof ScaleAiFile>;

/**
 * Scale teammate.
 * Official: GET /v1/teams
 * https://scale.com/docs/api-reference/studio
 */
export const ScaleAiTeammate = z
	.object({
		_id: z.string().optional(),
		id: z.string().optional(),
		email: z.string().optional(),
		role: z.string().optional(),
		disableRapidEmails: z.boolean().optional(),
		isStudioLabeler: z.boolean().optional(),
	})
	.loose();

export type ScaleAiTeammate = z.infer<typeof ScaleAiTeammate>;
