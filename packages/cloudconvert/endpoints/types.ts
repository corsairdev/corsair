import { z } from 'zod';

// CloudConvert API v2 references:
// Jobs: https://cloudconvert.com/docs/api-reference/jobs
// Tasks: https://cloudconvert.com/docs/api-reference/tasks
// Operations: https://cloudconvert.com/docs/api-reference/operations
// Exports: https://cloudconvert.com/docs/import-export/export-files
// Users: https://cloudconvert.com/docs/api-reference/users

/** Values in CloudConvert's operation-specific task and metadata maps. */
export type CloudConvertJsonValue =
	| string
	| number
	| boolean
	| null
	| CloudConvertJsonValue[]
	| { [key: string]: CloudConvertJsonValue };

const JsonValueSchema: z.ZodType<CloudConvertJsonValue> = z.lazy(() =>
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
const TimestampSchema = z.string().describe('ISO 8601 timestamp.');
const StatusSchema = z.enum(['waiting', 'processing', 'finished', 'error']);

const TaskNameSchema = z
	.string()
	.min(1)
	.regex(
		/^[A-Za-z0-9_-]+$/,
		'Task names may contain only letters, numbers, - and _.',
	);

const TaskInputNamesSchema = z.union([
	TaskNameSchema,
	z.array(TaskNameSchema).min(1),
]);

const JobTaskInputSchema = z
	.object({
		operation: z.string().min(1),
		input: TaskInputNamesSchema.optional(),
		ignore_error: z.boolean().optional(),
	})
	.catchall(JsonValueSchema);

const JobTasksSchema = z
	.record(TaskNameSchema, JobTaskInputSchema)
	.superRefine((tasks, ctx) => {
		const count = Object.keys(tasks).length;
		if (count < 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one task for the job.',
			});
		}
		if (count > 2000) {
			ctx.addIssue({
				code: 'custom',
				message: 'A job can contain at most 2000 tasks.',
			});
		}
	});

const JsonSafeRedirectSchema = z
	.literal(false)
	.optional()
	.describe(
		'Only false or omitted is supported. true redirects to raw file content, which this JSON endpoint cannot represent.',
	);

const SourceTasksSchema = z
	.record(TaskNameSchema, JobTaskInputSchema)
	.superRefine((tasks, ctx) => {
		const count = Object.keys(tasks).length;
		if (count < 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one source task for the export task.',
			});
		}
		if (count > 1999) {
			ctx.addIssue({
				code: 'custom',
				message:
					'A job can contain at most 2000 tasks including the export task.',
			});
		}
	});

const ExportTaskGraphFields = {
	exportTaskName: TaskNameSchema.describe('Name to assign to the export task.'),
	sourceTasks: SourceTasksSchema.describe(
		'Other tasks to include in the same job, such as import and conversion tasks.',
	),
	input: TaskInputNamesSchema.describe(
		'The name or names of source tasks whose files this export task will export.',
	),
};

const ExportTaskGraphSchema = z.object(ExportTaskGraphFields);

function validateExportTaskGraph(
	value: z.output<typeof ExportTaskGraphSchema>,
	ctx: z.RefinementCtx,
): void {
	if (Object.hasOwn(value.sourceTasks, value.exportTaskName)) {
		ctx.addIssue({
			code: 'custom',
			path: ['exportTaskName'],
			message: 'The export task name must differ from every source task name.',
		});
	}

	for (const [taskName, task] of Object.entries(value.sourceTasks)) {
		if (task.input === undefined) continue;
		const sourceNames = Array.isArray(task.input) ? task.input : [task.input];
		for (const sourceName of sourceNames) {
			if (!Object.hasOwn(value.sourceTasks, sourceName)) {
				ctx.addIssue({
					code: 'custom',
					path: ['sourceTasks', taskName, 'input'],
					message: `The input task "${sourceName}" must be included in sourceTasks.`,
				});
			}
		}
	}

	const inputNames = Array.isArray(value.input) ? value.input : [value.input];
	for (const name of inputNames) {
		if (!Object.hasOwn(value.sourceTasks, name)) {
			ctx.addIssue({
				code: 'custom',
				path: ['input'],
				message: `The input task "${name}" must be included in sourceTasks.`,
			});
		}
	}
}

const TasksCreateExportGoogleCloudStorageInputSchema = z
	.object({
		...ExportTaskGraphFields,
		projectId: z.string().min(1).describe('Google Cloud Project ID.'),
		bucket: z.string().min(1).describe('Google Cloud Storage bucket name.'),
		clientEmail: z
			.string()
			.min(1)
			.describe('Google service-account client email.'),
		privateKey: z
			.string()
			.min(1)
			.describe('Google service-account private key.'),
		file: z
			.string()
			.min(1)
			.optional()
			.describe('Destination filename in the bucket.'),
		filePrefix: z
			.string()
			.min(1)
			.optional()
			.describe('Destination filename prefix; use instead of file.'),
	})
	.strict()
	.superRefine((value, ctx) => {
		validateExportTaskGraph(value, ctx);
		if (value.file !== undefined && value.filePrefix !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['filePrefix'],
				message: 'Use file or filePrefix, not both.',
			});
		}
	});

export type TasksCreateExportGoogleCloudStorageInput = z.input<
	typeof TasksCreateExportGoogleCloudStorageInputSchema
>;

const TasksCreateExportS3InputSchema = z
	.object({
		...ExportTaskGraphFields,
		bucket: z.string().min(1).describe('Amazon S3 bucket name.'),
		region: z
			.string()
			.min(1)
			.describe('Amazon S3 region or compatible endpoint region.'),
		accessKeyId: z.string().min(1).describe('S3 access key ID.'),
		secretAccessKey: z.string().min(1).describe('S3 secret access key.'),
		endpoint: z
			.string()
			.min(1)
			.optional()
			.describe('Custom S3-compatible API endpoint.'),
		key: z.string().min(1).optional().describe('Destination object key.'),
		keyPrefix: z
			.string()
			.min(1)
			.optional()
			.describe('Destination object-key prefix; use instead of key.'),
		sessionToken: z
			.string()
			.min(1)
			.optional()
			.describe('Temporary AWS session token.'),
		acl: z
			.enum([
				'private',
				'public-read',
				'public-read-write',
				'authenticated-read',
				'bucket-owner-read',
				'bucket-owner-full-control',
			])
			.optional(),
		cacheControl: z.string().min(1).optional(),
		contentDisposition: z.string().min(1).optional(),
		contentType: z.string().min(1).optional(),
		metadata: JsonObjectSchema.optional(),
		serverSideEncryption: z.enum(['AES256', 'aws:kms']).optional(),
		tagging: JsonObjectSchema.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		validateExportTaskGraph(value, ctx);
		if (value.key !== undefined && value.keyPrefix !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['keyPrefix'],
				message: 'Use key or keyPrefix, not both.',
			});
		}
	});

export type TasksCreateExportS3Input = z.input<
	typeof TasksCreateExportS3InputSchema
>;

const JobsCreateInputSchema = z
	.object({
		tasks: JobTasksSchema,
		tag: z.string().optional(),
	})
	.strict();

export type JobsCreateInput = z.input<typeof JobsCreateInputSchema>;

const JobsCreateAndWaitInputSchema = z
	.object({
		tasks: JobTasksSchema,
		tag: z.string().optional(),
		redirect: JsonSafeRedirectSchema,
	})
	.strict();

export type JobsCreateAndWaitInput = z.input<
	typeof JobsCreateAndWaitInputSchema
>;

const JobsGetInputSchema = z
	.object({
		jobId: z.string().min(1),
		redirect: JsonSafeRedirectSchema,
	})
	.strict();

export type JobsGetInput = z.input<typeof JobsGetInputSchema>;

const JobsWaitInputSchema = JobsGetInputSchema;
export type JobsWaitInput = z.input<typeof JobsWaitInputSchema>;

const JobsListInputSchema = z
	.object({
		status: z.enum(['processing', 'finished', 'error']).optional(),
		tag: z.string().optional(),
		accessToken: z.string().optional(),
		include: z.array(z.literal('tasks')).optional(),
		perPage: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(1).optional(),
	})
	.strict();

export type JobsListInput = z.input<typeof JobsListInputSchema>;

const JobsRemoveInputSchema = z.object({ jobId: z.string().min(1) }).strict();

export type JobsRemoveInput = z.input<typeof JobsRemoveInputSchema>;

const TasksGetInputSchema = z
	.object({
		taskId: z.string().min(1),
		include: z
			.array(z.enum(['retries', 'depends_on_tasks', 'payload', 'job']))
			.optional(),
	})
	.strict();

export type TasksGetInput = z.input<typeof TasksGetInputSchema>;

const TasksWaitInputSchema = z.object({ taskId: z.string().min(1) }).strict();

export type TasksWaitInput = z.input<typeof TasksWaitInputSchema>;

const TasksCancelInputSchema = TasksWaitInputSchema;
export type TasksCancelInput = z.input<typeof TasksCancelInputSchema>;

const TasksRetryInputSchema = TasksWaitInputSchema;
export type TasksRetryInput = z.input<typeof TasksRetryInputSchema>;

const TasksRemoveInputSchema = TasksWaitInputSchema;
export type TasksRemoveInput = z.input<typeof TasksRemoveInputSchema>;

const OperationsListInputSchema = z
	.object({
		operation: z.string().min(1).optional(),
		inputFormat: z.string().min(1).optional(),
		outputFormat: z.string().min(1).optional(),
		engine: z.string().min(1).optional(),
		engineVersion: z.string().min(1).optional(),
		alternatives: z.boolean().optional(),
		include: z
			.array(z.enum(['options', 'engine_versions', 'options.details']))
			.optional(),
	})
	.strict();

export type OperationsListInput = z.input<typeof OperationsListInputSchema>;

const FormatsListSupportedInputSchema = z.object({}).strict();
export type FormatsListSupportedInput = z.input<
	typeof FormatsListSupportedInputSchema
>;

const TasksListInputSchema = z
	.object({
		jobId: z.string().min(1).optional(),
		status: StatusSchema.optional(),
		operation: z.string().min(1).optional(),
		include: z.array(z.enum(['retries', 'depends_on_tasks'])).optional(),
		perPage: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(1).optional(),
	})
	.strict();

export type TasksListInput = z.input<typeof TasksListInputSchema>;

const UsersShowInputSchema = z.object({}).strict();
export type UsersShowInput = z.input<typeof UsersShowInputSchema>;

const LinksSchema = z.object({ self: z.string().nullish() }).loose();

const TaskFileSchema = z
	.object({
		filename: z.string(),
		url: z.string().nullish(),
	})
	.loose();

const TaskResultSchema = z
	.object({ files: z.array(TaskFileSchema).nullish() })
	.loose()
	.nullish();

const JobReferenceSchema = z
	.object({
		id: z.string(),
		tag: z.string().nullish(),
		status: StatusSchema,
		created_at: TimestampSchema,
		started_at: TimestampSchema.nullish(),
		ended_at: TimestampSchema.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

const RetryTaskSchema = z
	.object({
		id: z.string(),
		job_id: z.string().nullish(),
		name: z.string().nullish(),
		operation: z.string(),
		status: StatusSchema,
		created_at: TimestampSchema,
		started_at: TimestampSchema.nullish(),
		ended_at: TimestampSchema.nullish(),
		retry_of_task_id: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

const TaskSchema = z
	.object({
		id: z.string(),
		job_id: z.string().nullish(),
		name: z.string().nullish(),
		operation: z.string(),
		status: StatusSchema,
		message: z.string().nullish(),
		code: z.string().nullish(),
		waiting_reason: z.string().nullish(),
		credits: z.number().int().nullish(),
		created_at: TimestampSchema,
		started_at: TimestampSchema.nullish(),
		ended_at: TimestampSchema.nullish(),
		engine: z.string().nullish(),
		engine_version: z.string().nullish(),
		retry_of_task_id: z.string().nullish(),
		retries: z.array(RetryTaskSchema).nullish(),
		depends_on_tasks: z.record(z.string(), z.string()).nullish(),
		payload: JsonObjectSchema.nullish(),
		job: JobReferenceSchema.nullish(),
		result: TaskResultSchema.optional(),
		links: LinksSchema.nullish(),
	})
	.loose();

const JobSchema = z
	.object({
		id: z.string(),
		tag: z.string().nullish(),
		status: StatusSchema,
		created_at: TimestampSchema,
		started_at: TimestampSchema.nullish(),
		ended_at: TimestampSchema.nullish(),
		tasks: z.array(TaskSchema).nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

const JobEnvelopeSchema = z.object({ data: JobSchema }).loose();

const JobEndpointOutputSchema = JobEnvelopeSchema;

const TaskEnvelopeSchema = z.object({ data: TaskSchema }).loose();

const PageLinksSchema = z
	.object({
		first: z.string().nullish(),
		last: z.string().nullish(),
		prev: z.string().nullish(),
		next: z.string().nullish(),
	})
	.loose();

const PageMetaSchema = z
	.object({
		current_page: z.number().int(),
		from: z.number().int().nullish(),
		path: z.string(),
		per_page: z.number().int(),
		to: z.number().int().nullish(),
	})
	.loose();

const TasksListOutputSchema = z
	.object({
		data: z.array(TaskSchema),
		links: PageLinksSchema.nullish(),
		meta: PageMetaSchema.nullish(),
	})
	.loose();

const JobsListOutputSchema = z
	.object({
		data: z.array(JobSchema),
		links: PageLinksSchema.nullish(),
		meta: PageMetaSchema.nullish(),
	})
	.loose();

const OperationOptionTypeSchema = z.enum([
	'string',
	'boolean',
	'integer',
	'float',
	'enum',
	'dictionary',
]);

const OperationOptionSchema = z
	.object({
		name: z.string(),
		type: OperationOptionTypeSchema.optional(),
		default: JsonValueSchema.optional(),
		description: z.string().optional(),
		possible_values: z.array(JsonValueSchema).optional(),
		label: z.string().optional(),
		group: z.string().optional(),
		advanced: z.boolean().optional(),
		depends_on: z.array(JsonObjectSchema).optional(),
		min: z.number().optional(),
		max: z.number().optional(),
		step: z.number().optional(),
		unit: z.string().optional(),
		marks: z
			.array(z.object({ value: JsonValueSchema, label: z.string() }).loose())
			.optional(),
		suggestions: z.array(z.string()).optional(),
		values: z
			.array(
				z
					.object({
						value: z.string(),
						label: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const EngineVersionSchema = z
	.object({
		version: z.string(),
		default: z.boolean().optional(),
		latest: z.boolean().optional(),
		deprecated: z.boolean().optional(),
		experimental: z.boolean().optional(),
	})
	.loose();

const OperationSchema = z
	.object({
		operation: z.string(),
		input_format: z.string(),
		output_format: z.string(),
		engine: z.string(),
		credits: z.number().int(),
		options: z.array(OperationOptionSchema).nullish(),
		engine_versions: z.array(EngineVersionSchema).nullish(),
		deprecated: z.boolean().optional(),
		experimental: z.boolean().optional(),
		meta: JsonObjectSchema.nullish(),
	})
	.loose();

const OperationsListOutputSchema = z
	.object({ data: z.array(OperationSchema) })
	.loose();

const FormatsListSupportedOutputSchema = OperationsListOutputSchema;

const UserSchema = z
	.object({
		// The reference calls id a string but its published response sample uses a number.
		id: z.union([z.string(), z.number()]),
		username: z.string(),
		email: z.string(),
		credits: z.number().int(),
		created_at: TimestampSchema,
		links: LinksSchema.nullish(),
	})
	.loose();

const UsersShowOutputSchema = z.object({ data: UserSchema }).loose();
const EmptyOutputSchema = z.void();

export type CloudConvertEndpointInputs = {
	jobsCreate: JobsCreateInput;
	jobsCreateAndWait: JobsCreateAndWaitInput;
	jobsGet: JobsGetInput;
	jobsWait: JobsWaitInput;
	jobsList: JobsListInput;
	jobsRemove: JobsRemoveInput;
	tasksCreateExportGoogleCloudStorage: TasksCreateExportGoogleCloudStorageInput;
	tasksCreateExportS3: TasksCreateExportS3Input;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksWait: TasksWaitInput;
	tasksCancel: TasksCancelInput;
	tasksRetry: TasksRetryInput;
	tasksRemove: TasksRemoveInput;
	operationsList: OperationsListInput;
	formatsListSupported: FormatsListSupportedInput;
	usersShow: UsersShowInput;
};

export type CloudConvertEndpointOutputs = {
	jobsCreate: z.infer<typeof JobEnvelopeSchema>;
	jobsCreateAndWait: z.infer<typeof JobEndpointOutputSchema>;
	jobsGet: z.infer<typeof JobEndpointOutputSchema>;
	jobsWait: z.infer<typeof JobEndpointOutputSchema>;
	jobsList: z.infer<typeof JobsListOutputSchema>;
	jobsRemove: z.infer<typeof EmptyOutputSchema>;
	tasksCreateExportGoogleCloudStorage: z.infer<typeof JobEnvelopeSchema>;
	tasksCreateExportS3: z.infer<typeof JobEnvelopeSchema>;
	tasksList: z.infer<typeof TasksListOutputSchema>;
	tasksGet: z.infer<typeof TaskEnvelopeSchema>;
	tasksWait: z.infer<typeof TaskEnvelopeSchema>;
	tasksCancel: z.infer<typeof TaskEnvelopeSchema>;
	tasksRetry: z.infer<typeof TaskEnvelopeSchema>;
	tasksRemove: z.infer<typeof EmptyOutputSchema>;
	operationsList: z.infer<typeof OperationsListOutputSchema>;
	formatsListSupported: z.infer<typeof FormatsListSupportedOutputSchema>;
	usersShow: z.infer<typeof UsersShowOutputSchema>;
};

export const CloudConvertEndpointInputSchemas = {
	jobsCreate: JobsCreateInputSchema,
	jobsCreateAndWait: JobsCreateAndWaitInputSchema,
	jobsGet: JobsGetInputSchema,
	jobsWait: JobsWaitInputSchema,
	jobsList: JobsListInputSchema,
	jobsRemove: JobsRemoveInputSchema,
	tasksCreateExportGoogleCloudStorage:
		TasksCreateExportGoogleCloudStorageInputSchema,
	tasksCreateExportS3: TasksCreateExportS3InputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksWait: TasksWaitInputSchema,
	tasksCancel: TasksCancelInputSchema,
	tasksRetry: TasksRetryInputSchema,
	tasksRemove: TasksRemoveInputSchema,
	operationsList: OperationsListInputSchema,
	formatsListSupported: FormatsListSupportedInputSchema,
	usersShow: UsersShowInputSchema,
} as const;

export const CloudConvertEndpointOutputSchemas = {
	jobsCreate: JobEnvelopeSchema,
	jobsCreateAndWait: JobEndpointOutputSchema,
	jobsGet: JobEndpointOutputSchema,
	jobsWait: JobEndpointOutputSchema,
	jobsList: JobsListOutputSchema,
	jobsRemove: EmptyOutputSchema,
	tasksCreateExportGoogleCloudStorage: JobEnvelopeSchema,
	tasksCreateExportS3: JobEnvelopeSchema,
	tasksList: TasksListOutputSchema,
	tasksGet: TaskEnvelopeSchema,
	tasksWait: TaskEnvelopeSchema,
	tasksCancel: TaskEnvelopeSchema,
	tasksRetry: TaskEnvelopeSchema,
	tasksRemove: EmptyOutputSchema,
	operationsList: OperationsListOutputSchema,
	formatsListSupported: FormatsListSupportedOutputSchema,
	usersShow: UsersShowOutputSchema,
} as const;
