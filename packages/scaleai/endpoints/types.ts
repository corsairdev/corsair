import { z } from 'zod';
import {
	ScaleAiBatch,
	ScaleAiBatchStatus,
	ScaleAiFile,
	ScaleAiProject,
	ScaleAiTask,
	ScaleAiTeammate,
} from '../schema/database';

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

const JsonObject = z.record(z.string(), z.unknown());

/** ISO 8601 date-time or date string, e.g. '2021-04-25' or '2021-04-25T03:14:15-07:00'. */
const IsoTime = z.string();

const MAX_UPLOAD_BYTES = 80 * 1024 * 1024;

export const SCALE_TASK_TYPES = [
	'imageannotation',
	'segmentannotation',
	'videoannotation',
	'videoplaybackannotation',
	'lidarannotation',
	'lidarsegmentation',
	'lidartopdown',
	'namedentityrecognition',
	'textcollection',
	'documenttranscription',
	'categorization',
	'transcription',
	'comparison',
] as const;

export const SCALE_TASK_STATUSES = [
	'pending',
	'completed',
	'canceled',
	'error',
] as const;

export const SCALE_REVIEW_STATUSES = [
	'accepted',
	'fixed',
	'commented',
	'rejected',
	'pending',
] as const;

export const SCALE_TEAM_ROLES = ['labeler', 'member', 'manager'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Core response objects (kept permissive — Scale task/params payloads are large
// and vary widely by task type)
// ─────────────────────────────────────────────────────────────────────────────

export const ScaleTaskSchema = ScaleAiTask;
export type ScaleTask = ScaleAiTask;

export const ScaleBatchSchema = ScaleAiBatch;
export type ScaleBatch = ScaleAiBatch;

export const ScaleProjectSchema = ScaleAiProject;
export type ScaleProject = ScaleAiProject;

export const ScaleFileSchema = ScaleAiFile;
export type ScaleFile = ScaleAiFile;

export const ScaleTeammateSchema = ScaleAiTeammate;

// ─────────────────────────────────────────────────────────────────────────────
// Task creation — one endpoint per task type, all POST /task/{type}
// ─────────────────────────────────────────────────────────────────────────────

const TaskCreateBaseShape = {
	/** Project to file the task under. */
	project: z.string().optional(),
	/** Batch to file the task under (batch must be non-finalized). */
	batch: z.string().optional(),
	/** URL or email to notify when the task completes. */
	callback_url: z.string().optional(),
	/** Markdown / Google-Doc backed labeling instructions. */
	instruction: z.string().optional(),
	/** Your own identifier; globally unique across projects and task types. */
	unique_id: z.string().optional(),
	/** Automatically clear `unique_id` if the task errors. */
	clear_unique_id_on_error: z.boolean().optional(),
	/** Arbitrary key-value data stored on the task (not used by Scale). */
	metadata: JsonObject.optional(),
	/** Task priority (higher is worked first). */
	priority: z.number().int().optional(),
	/** Official: at most 5 tags per task. */
	tags: z.array(z.string()).max(5).optional(),
} as const;

const ImageAnnotationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachment: z.string(),
		attachment_type: z.string().optional(),
		geometries: JsonObject,
		annotation_attributes: JsonObject.optional(),
	})
	.catchall(z.unknown());
export type ImageAnnotationCreateInput = z.infer<
	typeof ImageAnnotationCreateInputSchema
>;

const SegmentationAnnotationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachment: z.string(),
		labels: z.array(z.union([z.string(), JsonObject])).max(50),
		allow_unlabeled: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type SegmentationAnnotationCreateInput = z.infer<
	typeof SegmentationAnnotationCreateInputSchema
>;

const VideoAnnotationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachment: z.string().optional(),
		attachments: z.array(z.string()).optional(),
		attachment_type: z.string().optional(),
		geometries: JsonObject,
		annotation_attributes: JsonObject.optional(),
		events_to_annotate: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());
export type VideoAnnotationCreateInput = z.infer<
	typeof VideoAnnotationCreateInputSchema
>;

const VideoPlaybackAnnotationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachment: z.string(),
		attachments: z.array(z.string()).optional(),
		geometries: JsonObject,
		annotation_attributes: JsonObject.optional(),
	})
	.catchall(z.unknown());
export type VideoPlaybackAnnotationCreateInput = z.infer<
	typeof VideoPlaybackAnnotationCreateInputSchema
>;

const LidarAnnotationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachments: z.array(z.string()).optional(),
		attachment: z.string().optional(),
		labels: z.array(z.union([z.string(), JsonObject])).optional(),
		annotation_attributes: JsonObject.optional(),
	})
	.catchall(z.unknown());
export type LidarAnnotationCreateInput = z.infer<
	typeof LidarAnnotationCreateInputSchema
>;

const LidarSegmentationCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachments: z.array(z.string()).optional(),
		attachment: z.string().optional(),
		labels: z.array(z.union([z.string(), JsonObject])).optional(),
	})
	.catchall(z.unknown())
	.refine((v) => Boolean(v.project) || Boolean(v.batch), {
		message: 'Either project or batch must be provided',
	});
export type LidarSegmentationCreateInput = z.infer<
	typeof LidarSegmentationCreateInputSchema
>;

const NamedEntityRecognitionCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		text: z.string().optional(),
		attachments: z.array(z.union([z.string(), JsonObject])).optional(),
		labels: z.array(z.union([z.string(), JsonObject])),
	})
	.catchall(z.unknown());
export type NamedEntityRecognitionCreateInput = z.infer<
	typeof NamedEntityRecognitionCreateInputSchema
>;

const TextCollectionCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachments: z.array(JsonObject).optional(),
		fields: z.union([z.array(JsonObject), JsonObject]),
	})
	.catchall(z.unknown());
export type TextCollectionCreateInput = z.infer<
	typeof TextCollectionCreateInputSchema
>;

const DocumentTranscriptionCreateInputSchema = z
	.object({
		...TaskCreateBaseShape,
		attachment: z.string().optional(),
		attachments: z.array(z.string()).optional(),
		attachment_type: z.string().optional(),
		fields: z.union([z.array(JsonObject), JsonObject]).optional(),
	})
	.catchall(z.unknown());
export type DocumentTranscriptionCreateInput = z.infer<
	typeof DocumentTranscriptionCreateInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Task management
// ─────────────────────────────────────────────────────────────────────────────

const GetTaskInputSchema = z.object({
	/** Scale task id. */
	taskId: z.string(),
});
export type GetTaskInput = z.infer<typeof GetTaskInputSchema>;

const ListTasksInputSchema = z.object({
	project: z.string().optional(),
	batch: z.string().optional(),
	type: z.enum(SCALE_TASK_TYPES).optional(),
	status: z.enum(SCALE_TASK_STATUSES).optional(),
	customer_review_status: z
		.union([
			z.enum(SCALE_REVIEW_STATUSES),
			z.array(z.enum(SCALE_REVIEW_STATUSES)),
		])
		.optional(),
	unique_id: z.union([z.string(), z.array(z.string())]).optional(),
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	start_time: IsoTime.optional(),
	end_time: IsoTime.optional(),
	completed_after: IsoTime.optional(),
	completed_before: IsoTime.optional(),
	updated_after: IsoTime.optional(),
	updated_before: IsoTime.optional(),
	include_attachment_url: z.boolean().optional(),
	limited_response: z.boolean().optional(),
	/** Page size, 1-100 (default 100). */
	limit: z.number().int().min(1).max(100).optional(),
	/** Pagination cursor from a previous response. */
	next_token: z.string().optional(),
});
export type ListTasksInput = z.infer<typeof ListTasksInputSchema>;

const ListTasksResponseSchema = z
	.object({
		docs: z.array(ScaleTaskSchema),
		total: z.number().optional(),
		count: z.number().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		has_more: z.boolean().optional(),
		next_token: z.string().nullable().optional(),
	})
	.catchall(z.unknown());
export type ListTasksResponse = z.infer<typeof ListTasksResponseSchema>;

const AddTaskTagsInputSchema = z.object({
	taskId: z.string(),
	/** Non-empty tag strings to add. Already-present tags are ignored. */
	tags: z.array(z.string().min(1)).min(1),
});
export type AddTaskTagsInput = z.infer<typeof AddTaskTagsInputSchema>;

const DeleteTaskTagsInputSchema = z.object({
	taskId: z.string(),
	/** Tag strings to remove. Tags not present are ignored. */
	tags: z.array(z.string().min(1)).min(1),
});
export type DeleteTaskTagsInput = z.infer<typeof DeleteTaskTagsInputSchema>;

const UpdateTaskUniqueIdInputSchema = z.object({
	taskId: z.string(),
	unique_id: z.string().min(1),
});
export type UpdateTaskUniqueIdInput = z.infer<
	typeof UpdateTaskUniqueIdInputSchema
>;

const DeleteTaskUniqueIdInputSchema = z.object({
	taskId: z.string(),
});
export type DeleteTaskUniqueIdInput = z.infer<
	typeof DeleteTaskUniqueIdInputSchema
>;

const SetTaskMetadataInputSchema = z.object({
	taskId: z.string(),
	/** Full metadata object to set on the task (replaces existing metadata). */
	metadata: JsonObject,
});
export type SetTaskMetadataInput = z.infer<typeof SetTaskMetadataInputSchema>;

const GetTaskResponseUrlInputSchema = z.object({
	taskId: z.string(),
	/** UUID from the secure `response_url` in the task JSON. */
	uuid: z.string(),
});
export type GetTaskResponseUrlInput = z.infer<
	typeof GetTaskResponseUrlInputSchema
>;

const SendTaskCallbackInputSchema = z.object({
	taskId: z.string(),
});
export type SendTaskCallbackInput = z.infer<typeof SendTaskCallbackInputSchema>;

const SendTaskCallbackResponseSchema = z
	.object({ success: z.boolean().optional() })
	.catchall(z.unknown());
export type SendTaskCallbackResponse = z.infer<
	typeof SendTaskCallbackResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Batches
// ─────────────────────────────────────────────────────────────────────────────

const CreateBatchInputSchema = z.object({
	project: z.string(),
	/** Unique batch name within the project. */
	name: z.string(),
	/** URL to POST to or email to notify when the batch completes. */
	callback: z.string().optional(),
	calibration_batch: z.boolean().optional(),
	self_label_batch: z.boolean().optional(),
	metadata: JsonObject.optional(),
});
export type CreateBatchInput = z.infer<typeof CreateBatchInputSchema>;

const BatchNameInputSchema = z.object({
	/** Batch name. */
	batchName: z.string(),
});
export type BatchNameInput = z.infer<typeof BatchNameInputSchema>;

const BatchStatusResponseSchema = ScaleAiBatchStatus;
export type BatchStatusResponse = ScaleAiBatchStatus;

const ListBatchesInputSchema = z.object({
	project: z.string().optional(),
	status: z.string().optional(),
	start_time: IsoTime.optional(),
	end_time: IsoTime.optional(),
	exclude_archived: z.boolean().optional(),
	detailed: z.boolean().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListBatchesInput = z.infer<typeof ListBatchesInputSchema>;

const ListBatchesResponseSchema = z
	.object({
		docs: z.array(ScaleBatchSchema),
		totalDocs: z.number().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		has_more: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type ListBatchesResponse = z.infer<typeof ListBatchesResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

const GetProjectInputSchema = z.object({
	/** Project name. */
	name: z.string(),
});
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;

const ListProjectsInputSchema = z.object({
	/** Only return (un)archived projects. */
	archived: z.boolean().optional(),
});
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

const SetProjectParamsInputSchema = z
	.object({
		/** Project name. */
		project: z.string(),
		/** Merge with the most recent project params instead of replacing. */
		patch: z.boolean().optional(),
		instruction: z.string().optional(),
	})
	.catchall(z.unknown());
export type SetProjectParamsInput = z.infer<typeof SetProjectParamsInputSchema>;

const SetProjectOntologyInputSchema = z
	.object({
		/** Project name. */
		project: z.string(),
		/** Ontology definition (labels / classes and their attributes). */
		ontology: z.union([z.array(z.unknown()), JsonObject]).optional(),
	})
	.catchall(z.unknown());
export type SetProjectOntologyInput = z.infer<
	typeof SetProjectOntologyInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Files / Assets
// ─────────────────────────────────────────────────────────────────────────────

const GetAssetsInputSchema = z.object({
	project: z.string().optional(),
	/** Filter by file metadata key-value pairs. */
	metadata: JsonObject.optional(),
	limit: z.number().int().min(1).optional(),
	/** Pagination cursor from a previous response. */
	next_token: z.string().optional(),
});
export type GetAssetsInput = z.infer<typeof GetAssetsInputSchema>;

const GetAssetsResponseSchema = z
	.object({
		docs: z.array(ScaleFileSchema),
		has_more: z.boolean().optional(),
		next_token: z.string().nullable().optional(),
		total: z.number().optional(),
	})
	.catchall(z.unknown());
export type GetAssetsResponse = z.infer<typeof GetAssetsResponseSchema>;

const ImportFileInputSchema = z
	.object({
		/** Remote URL of the file to import. */
		file_url: z.string(),
		project_name: z.string().optional(),
		reference_id: z.string().optional(),
		attachment_type: z.string().optional(),
		metadata: JsonObject.optional(),
	})
	.catchall(z.unknown());
export type ImportFileInput = z.infer<typeof ImportFileInputSchema>;

const UploadFileInputSchema = z.object({
	/** Official: max 80 MB decoded per file. */
	file_base64: z
		.base64()
		.refine(
			(value) => Buffer.from(value, 'base64').byteLength <= MAX_UPLOAD_BYTES,
			{ message: 'file_base64 exceeds 80 MB decoded' },
		),
	/** File name including extension. */
	file_name: z.string(),
	/** MIME type of the file. */
	mime_type: z.string().optional(),
	project_name: z.string().optional(),
	reference_id: z.string().optional(),
	metadata: JsonObject.optional(),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Teams
// ─────────────────────────────────────────────────────────────────────────────

const EmptyInputSchema = z.object({}).optional();

const GetTeamsResponseSchema = z.array(ScaleTeammateSchema);
export type GetTeamsResponse = z.infer<typeof GetTeamsResponseSchema>;

const InviteTeamMemberInputSchema = z.object({
	/** Email addresses to invite. */
	emails: z.array(z.string()).min(1),
	/** Role to grant the invited members. */
	role: z.enum(SCALE_TEAM_ROLES),
});
export type InviteTeamMemberInput = z.infer<typeof InviteTeamMemberInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Studio
// ─────────────────────────────────────────────────────────────────────────────

const StudioAssignmentsMutationInputSchema = z.object({
	/** Team member emails. */
	emails: z.array(z.string()).min(1),
	/** Project names to assign / unassign. */
	projects: z.array(z.string()).min(1),
});
export type StudioAssignmentsMutationInput = z.infer<
	typeof StudioAssignmentsMutationInputSchema
>;

const StudioAssignmentsResponseSchema = z.record(z.string(), z.unknown());
export type StudioAssignmentsResponse = z.infer<
	typeof StudioAssignmentsResponseSchema
>;

const StudioBatchesResponseSchema = z.array(JsonObject);
export type StudioBatchesResponse = z.infer<typeof StudioBatchesResponseSchema>;

const SetBatchPrioritiesInputSchema = z.object({
	/** All pending Studio batch names, ordered by desired priority. */
	batch_names: z.array(z.string()).min(1),
});
export type SetBatchPrioritiesInput = z.infer<
	typeof SetBatchPrioritiesInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Audits / Quality
// ─────────────────────────────────────────────────────────────────────────────

const GetFixlessAuditsInputSchema = z
	.object({
		task_id: z.string().optional(),
		id: z.string().optional(),
	})
	.refine((v) => Boolean(v.task_id) || Boolean(v.id), {
		message: 'At least one of task_id or id must be provided',
	});
export type GetFixlessAuditsInput = z.infer<typeof GetFixlessAuditsInputSchema>;

const GetQualityLabelersInputSchema = z
	.object({
		quality_task_ids: z.array(z.string()).optional(),
		labeler_emails: z.array(z.string()).optional(),
	})
	.refine(
		(v) =>
			(v.quality_task_ids?.length ?? 0) > 0 ||
			(v.labeler_emails?.length ?? 0) > 0,
		{
			message:
				'At least one of quality_task_ids or labeler_emails must be provided',
		},
	);
export type GetQualityLabelersInput = z.infer<
	typeof GetQualityLabelersInputSchema
>;

const UnknownJsonSchema = z.unknown();

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schema maps
// ─────────────────────────────────────────────────────────────────────────────

export const ScaleAiEndpointInputSchemas = {
	createImageAnnotationTask: ImageAnnotationCreateInputSchema,
	createSegmentationAnnotationTask: SegmentationAnnotationCreateInputSchema,
	createVideoAnnotationTask: VideoAnnotationCreateInputSchema,
	createVideoPlaybackAnnotationTask: VideoPlaybackAnnotationCreateInputSchema,
	createLidarAnnotationTask: LidarAnnotationCreateInputSchema,
	createLidarSegmentationTask: LidarSegmentationCreateInputSchema,
	createNamedEntityRecognitionTask: NamedEntityRecognitionCreateInputSchema,
	createTextCollectionTask: TextCollectionCreateInputSchema,
	createDocumentTranscriptionTask: DocumentTranscriptionCreateInputSchema,
	getTask: GetTaskInputSchema,
	listTasks: ListTasksInputSchema,
	addTaskTags: AddTaskTagsInputSchema,
	deleteTaskTags: DeleteTaskTagsInputSchema,
	updateTaskUniqueId: UpdateTaskUniqueIdInputSchema,
	deleteTaskUniqueId: DeleteTaskUniqueIdInputSchema,
	setTaskMetadata: SetTaskMetadataInputSchema,
	getTaskResponseUrl: GetTaskResponseUrlInputSchema,
	sendTaskCallback: SendTaskCallbackInputSchema,
	createBatch: CreateBatchInputSchema,
	finalizeBatch: BatchNameInputSchema,
	getBatch: BatchNameInputSchema,
	getBatchStatus: BatchNameInputSchema,
	listBatches: ListBatchesInputSchema,
	getProject: GetProjectInputSchema,
	listProjects: ListProjectsInputSchema,
	setProjectParams: SetProjectParamsInputSchema,
	setProjectOntology: SetProjectOntologyInputSchema,
	getAssets: GetAssetsInputSchema,
	importFile: ImportFileInputSchema,
	uploadFile: UploadFileInputSchema,
	getTeams: EmptyInputSchema,
	inviteTeamMember: InviteTeamMemberInputSchema,
	getStudioAssignments: EmptyInputSchema,
	addStudioAssignments: StudioAssignmentsMutationInputSchema,
	removeStudioAssignments: StudioAssignmentsMutationInputSchema,
	getStudioBatches: EmptyInputSchema,
	setBatchPriorities: SetBatchPrioritiesInputSchema,
	resetBatchPriorities: EmptyInputSchema,
	getFixlessAudits: GetFixlessAuditsInputSchema,
	getQualityLabelers: GetQualityLabelersInputSchema,
} as const;

export const ScaleAiEndpointOutputSchemas = {
	createImageAnnotationTask: ScaleTaskSchema,
	createSegmentationAnnotationTask: ScaleTaskSchema,
	createVideoAnnotationTask: ScaleTaskSchema,
	createVideoPlaybackAnnotationTask: ScaleTaskSchema,
	createLidarAnnotationTask: ScaleTaskSchema,
	createLidarSegmentationTask: ScaleTaskSchema,
	createNamedEntityRecognitionTask: ScaleTaskSchema,
	createTextCollectionTask: ScaleTaskSchema,
	createDocumentTranscriptionTask: ScaleTaskSchema,
	getTask: ScaleTaskSchema,
	listTasks: ListTasksResponseSchema,
	addTaskTags: ScaleTaskSchema,
	deleteTaskTags: ScaleTaskSchema,
	updateTaskUniqueId: ScaleTaskSchema,
	deleteTaskUniqueId: ScaleTaskSchema,
	setTaskMetadata: ScaleTaskSchema,
	getTaskResponseUrl: UnknownJsonSchema,
	sendTaskCallback: SendTaskCallbackResponseSchema,
	createBatch: ScaleBatchSchema,
	finalizeBatch: ScaleBatchSchema,
	getBatch: ScaleBatchSchema,
	getBatchStatus: BatchStatusResponseSchema,
	listBatches: ListBatchesResponseSchema,
	getProject: ScaleProjectSchema,
	listProjects: z.array(ScaleProjectSchema),
	setProjectParams: ScaleProjectSchema,
	setProjectOntology: ScaleProjectSchema,
	getAssets: GetAssetsResponseSchema,
	importFile: ScaleFileSchema,
	uploadFile: ScaleFileSchema,
	getTeams: GetTeamsResponseSchema,
	inviteTeamMember: z.array(ScaleTeammateSchema),
	getStudioAssignments: StudioAssignmentsResponseSchema,
	addStudioAssignments: StudioAssignmentsResponseSchema,
	removeStudioAssignments: StudioAssignmentsResponseSchema,
	getStudioBatches: StudioBatchesResponseSchema,
	setBatchPriorities: StudioBatchesResponseSchema,
	resetBatchPriorities: StudioBatchesResponseSchema,
	getFixlessAudits: UnknownJsonSchema,
	getQualityLabelers: UnknownJsonSchema,
} as const;

export type ScaleAiEndpointInputs = {
	[K in keyof typeof ScaleAiEndpointInputSchemas]: z.infer<
		(typeof ScaleAiEndpointInputSchemas)[K]
	>;
};

export type ScaleAiEndpointOutputs = {
	[K in keyof typeof ScaleAiEndpointOutputSchemas]: z.infer<
		(typeof ScaleAiEndpointOutputSchemas)[K]
	>;
};
