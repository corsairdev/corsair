import { z } from 'zod';
import { MAX_BINARY_DOWNLOAD_SIZE_LABEL } from '../limits';

// Request and response shapes follow the provider references:
// https://api.conversiontools.io/openapi.yaml
// https://conversiontools.io/llms-full.txt
// https://conversiontools.io/api-documentation

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

export type JsonObject = Record<string, JsonValue>;

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);
const ErrorFieldSchema = z.string().nullable();
const EmptyInputSchema = z.object({}).strict();
const FileIdSchema = z
	.string()
	.length(32, 'Must be a 32-character lowercase hexadecimal ID')
	.regex(/^[a-f0-9]{32}$/, 'Must contain only lowercase hexadecimal characters')
	.describe('32-character lowercase hexadecimal file ID');
const TaskIdSchema = z
	.string()
	.length(32, 'Must be a 32-character lowercase hexadecimal ID')
	.regex(/^[a-f0-9]{32}$/, 'Must contain only lowercase hexadecimal characters')
	.describe('32-character lowercase hexadecimal task ID');
const DownloadIdSchema = z
	.string()
	.length(32, 'Must be a 32-character lowercase hexadecimal ID')
	.regex(/^[a-f0-9]{32}$/, 'Must contain only lowercase hexadecimal characters')
	.describe('32-character lowercase hexadecimal temporary download ID');

// ── Conversion catalog ──────────────────────────────────────────────────────

export const ConversionOptionSchema = z
	.object({
		key: z.string(),
		title: z.string().optional(),
		// The documented four types, or a type the catalog adds later.
		type: z
			.enum(['string', 'boolean', 'enum', 'number'])
			.or(z.string())
			.optional(),
		values: z
			.array(
				z
					.object({
						value: z.string(),
						label: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		default: JsonValueSchema.optional(),
		placeholder: z.string().optional(),
	})
	.passthrough();

export type ConversionOption = z.infer<typeof ConversionOptionSchema>;

export const ConversionSchema = z
	.object({
		type: z.string(),
		title: z.string(),
		input_format: z.string(),
		output_format: z.string(),
		input_aliases: z.array(z.string()).optional(),
		output_aliases: z.array(z.string()).optional(),
		ai: z.boolean().optional(),
		options: z.array(ConversionOptionSchema).optional(),
		file_inputs: z
			.array(
				z
					.object({
						key: z.string(),
						description: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export type Conversion = z.infer<typeof ConversionSchema>;

export const ConversionsListInputSchema = z
	.object({
		input: z.string().min(1).optional(),
		output: z.string().min(1).optional(),
		ai: z.boolean().optional(),
	})
	.strict();

export type ConversionsListInput = z.infer<typeof ConversionsListInputSchema>;

export const ConversionsListResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		count: z.number().int().nonnegative(),
		conversions: z.array(ConversionSchema),
	})
	.passthrough();

export type ConversionsListResponse = z.infer<
	typeof ConversionsListResponseSchema
>;

export const ConversionsGetInputSchema = z
	.object({ type: z.string().min(1, 'A conversion type is required') })
	.strict();

export type ConversionsGetInput = z.infer<typeof ConversionsGetInputSchema>;

export const ConversionsGetResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		conversion: ConversionSchema,
	})
	.passthrough();

export type ConversionsGetResponse = z.infer<
	typeof ConversionsGetResponseSchema
>;

// ── Account ─────────────────────────────────────────────────────────────────

export const AccountVerifyInputSchema = EmptyInputSchema;
export type AccountVerifyInput = z.infer<typeof AccountVerifyInputSchema>;

export const AccountVerifyResponseSchema = z
	.object({ error: ErrorFieldSchema })
	.passthrough();
export type AccountVerifyResponse = z.infer<typeof AccountVerifyResponseSchema>;

export const AccountGetInfoInputSchema = EmptyInputSchema;
export type AccountGetInfoInput = z.infer<typeof AccountGetInfoInputSchema>;

export const AccountGetInfoResponseSchema = z
	.object({
		error: ErrorFieldSchema.optional(),
		email: z.string().email(),
	})
	.passthrough();
export type AccountGetInfoResponse = z.infer<
	typeof AccountGetInfoResponseSchema
>;

const ConfiguredConversionSchema = z
	.object({
		type: z.string(),
		title: z.string().optional(),
		options: z.array(ConversionOptionSchema).optional(),
	})
	.passthrough();

export const AccountGetConfigInputSchema = EmptyInputSchema;
export type AccountGetConfigInput = z.infer<typeof AccountGetConfigInputSchema>;

// The live API nests the converters under `data` (with subscription fields
// beside them); the OpenAPI document shows them at the top level.
export const AccountGetConfigResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		data: z
			.object({
				conversions: z.array(ConfiguredConversionSchema).optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type AccountGetConfigResponse = z.infer<
	typeof AccountGetConfigResponseSchema
>;

// ── Files ───────────────────────────────────────────────────────────────────

export const FilesUploadInputSchema = z
	.object({ file: z.instanceof(Blob) })
	.strict();
export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

export const FilesUploadResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		file_id: FileIdSchema,
	})
	.passthrough();
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

export const FilesGetInfoInputSchema = z
	.object({ file_id: FileIdSchema })
	.strict();
export type FilesGetInfoInput = z.infer<typeof FilesGetInfoInputSchema>;

// The live API returns previewData as one string (the first lines of a text
// file) and omits `preview`; the OpenAPI document shows a boolean and an array.
export const FilesGetInfoResponseSchema = z
	.object({
		preview: z.boolean().optional(),
		size: z.number().nonnegative(),
		name: z.string().optional(),
		previewData: z.union([z.string(), z.array(z.string())]).nullish(),
		detectedFormat: z.string().nullish(),
	})
	.passthrough();
export type FilesGetInfoResponse = z.infer<typeof FilesGetInfoResponseSchema>;

export const FilesCreateDownloadLinkInputSchema = z
	.object({ file_id: FileIdSchema })
	.strict();
export type FilesCreateDownloadLinkInput = z.infer<
	typeof FilesCreateDownloadLinkInputSchema
>;

export const FilesCreateDownloadLinkResponseSchema = z
	.object({
		error: ErrorFieldSchema.optional(),
		file_id: FileIdSchema,
		download_id: DownloadIdSchema,
	})
	.passthrough();
export type FilesCreateDownloadLinkResponse = z.infer<
	typeof FilesCreateDownloadLinkResponseSchema
>;

export const FilesDownloadByIdInputSchema = z
	.object({ file_id: FileIdSchema })
	.strict();
export type FilesDownloadByIdInput = z.infer<
	typeof FilesDownloadByIdInputSchema
>;

export const FilesDownloadFromLinkInputSchema = z
	.object({ download_id: DownloadIdSchema })
	.strict();
export type FilesDownloadFromLinkInput = z.infer<
	typeof FilesDownloadFromLinkInputSchema
>;

export const FilesDownloadOutputSchema = z
	.object({
		contentBase64: z
			.base64()
			.describe(
				`Raw file bytes encoded as base64 for JSON-safe output; downloads are limited to ${MAX_BINARY_DOWNLOAD_SIZE_LABEL}. Use a temporary download link for larger files.`,
			),
		contentType: z.string().min(1).describe('The response Content-Type'),
		contentDisposition: z
			.string()
			.optional()
			.describe('The response Content-Disposition, when provided'),
		size: z.number().int().nonnegative().describe('Downloaded byte length'),
	})
	.strict();
export type FilesDownloadOutput = z.infer<typeof FilesDownloadOutputSchema>;

export const FilesCreateUploadSessionInputSchema = z
	.object({ filename: z.string().min(1, 'A filename is required') })
	.strict();
export type FilesCreateUploadSessionInput = z.infer<
	typeof FilesCreateUploadSessionInputSchema
>;

export const FilesCreateUploadSessionResponseSchema = z
	.object({
		error: ErrorFieldSchema.optional(),
		upload_url: z.string().url(),
		file_id: FileIdSchema,
		expires_in: z.number().int().nonnegative(),
	})
	.passthrough();
export type FilesCreateUploadSessionResponse = z.infer<
	typeof FilesCreateUploadSessionResponseSchema
>;

export const FilesUploadToSessionInputSchema = z
	.object({
		upload_url: z.string().url(),
		file: z.instanceof(Blob),
	})
	.strict();
export type FilesUploadToSessionInput = z.infer<
	typeof FilesUploadToSessionInputSchema
>;

export const FilesUploadToSessionResponseSchema = z
	.object({
		file_id: FileIdSchema,
		filename: z.string(),
		size: z.number().nonnegative(),
	})
	.passthrough();
export type FilesUploadToSessionResponse = z.infer<
	typeof FilesUploadToSessionResponseSchema
>;

// ── Tasks ───────────────────────────────────────────────────────────────────

export const TaskStatusValueSchema = z.enum([
	'PENDING',
	'RUNNING',
	'SUCCESS',
	'ERROR',
]);
export type TaskStatusValue = z.infer<typeof TaskStatusValueSchema>;
// Responses accept a status the API adds later instead of failing the read.
const TaskStatusOutputSchema = TaskStatusValueSchema.or(z.string());
const RetentionModeSchema = z.enum(['standard_24h', 'ttl_15m']);
const RetentionModeOutputSchema = RetentionModeSchema.or(z.string());

function isValidUrl(value: JsonValue | undefined): boolean {
	if (typeof value !== 'string') return false;
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

function isValidFileId(value: JsonValue | undefined): boolean {
	return FileIdSchema.safeParse(value).success;
}

const TaskOptionsSchema = JsonObjectSchema.superRefine((options, context) => {
	if (options.file_id !== undefined && !isValidFileId(options.file_id)) {
		context.addIssue({
			code: 'custom',
			path: ['file_id'],
			message: 'file_id must be a 32-character lowercase hexadecimal ID',
		});
	}
	if (options.url !== undefined && !isValidUrl(options.url)) {
		context.addIssue({
			code: 'custom',
			path: ['url'],
			message: 'url must be a valid URL',
		});
	}
	if (options.sandbox !== undefined && typeof options.sandbox !== 'boolean') {
		context.addIssue({
			code: 'custom',
			path: ['sandbox'],
			message: 'sandbox must be a boolean',
		});
	}
	if (Object.hasOwn(options, 'callbackUrl')) {
		context.addIssue({
			code: 'custom',
			path: ['callbackUrl'],
			message: 'Task callbacks are not supported by this plugin.',
		});
	}
});

export const TasksCreateInputSchema = z
	.object({
		type: z.string().min(1, 'A conversion type is required'),
		options: TaskOptionsSchema,
	})
	.strict()
	.superRefine((value, context) => {
		const hasFileId = typeof value.options.file_id === 'string';
		const hasUrl = typeof value.options.url === 'string';
		if (!hasFileId && !hasUrl) {
			context.addIssue({
				code: 'custom',
				path: ['options'],
				message: 'Provide a file_id or public url inside options',
			});
		} else if (hasFileId && hasUrl) {
			context.addIssue({
				code: 'custom',
				path: ['options'],
				message: 'Provide either file_id or public url, not both',
			});
		}
	});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		task_id: TaskIdSchema,
		sandbox: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

// `page` and `limit` are not in the OpenAPI document; the live API (11-13)
// pages with them, echoes them in `pagination` and caps `limit` at 100.
export const TasksListInputSchema = z
	.object({
		status: TaskStatusValueSchema.optional(),
		page: z.number().int().min(1).optional().describe('Page number, from 1'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Tasks per page, 1 to 100 (default 50)'),
	})
	.strict();
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TaskFileSchema = z
	.object({
		id: FileIdSchema.optional(),
		name: z.string().optional(),
		size: z.number().optional(),
		exists: z.boolean().optional(),
	})
	.passthrough();

const TaskDetailSchema = z
	.object({
		id: TaskIdSchema.optional(),
		type: z.string().optional(),
		status: TaskStatusOutputSchema.optional(),
		error: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		dateCreated: z.string().optional(),
		dateFinished: z.string().nullable().optional(),
		conversionProgress: z.number().optional(),
		fileSource: TaskFileSchema.optional(),
		fileResult: TaskFileSchema.nullable().optional(),
		retentionMode: RetentionModeOutputSchema.optional(),
		cleanupStatus: z
			.enum(['none', 'scheduled', 'running', 'completed', 'failed'])
			.or(z.string())
			.optional(),
		dateDeleted: z.string().nullable().optional(),
		dateExpires: z.string().nullable().optional(),
	})
	.passthrough();

export const TasksListResponseSchema = z
	.object({
		error: ErrorFieldSchema,
		data: z.array(TaskDetailSchema),
		pagination: z
			.object({
				page: z.number().int(),
				limit: z.number().int(),
				total: z.number().int(),
				totalPages: z.number().int(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksGetInputSchema = z.object({ task_id: TaskIdSchema }).strict();
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

export const TasksGetResponseSchema = z
	.object({
		error: z.string().nullable(),
		type: z.string().optional(),
		status: TaskStatusOutputSchema,
		file_id: FileIdSchema.nullable(),
		conversionProgress: z.number().int().min(0).max(100).optional(),
		conversionResult: z
			.object({ message: z.string().optional() })
			.catchall(JsonValueSchema)
			.optional(),
	})
	.passthrough();
export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

export const TasksUpdateRetentionInputSchema = z
	.object({
		task_id: TaskIdSchema,
		retentionMode: RetentionModeSchema,
	})
	.strict();
export type TasksUpdateRetentionInput = z.infer<
	typeof TasksUpdateRetentionInputSchema
>;

export const TasksUpdateRetentionResponseSchema = z
	.object({
		error: ErrorFieldSchema.optional(),
		retentionMode: RetentionModeOutputSchema,
		dateExpires: z.string().min(1),
	})
	.passthrough();
export type TasksUpdateRetentionResponse = z.infer<
	typeof TasksUpdateRetentionResponseSchema
>;

export const TasksRemoveInputSchema = z
	.object({ task_id: TaskIdSchema })
	.strict();
export type TasksRemoveInput = z.infer<typeof TasksRemoveInputSchema>;

export const TasksRemoveResponseSchema = z
	.object({
		error: ErrorFieldSchema.optional(),
		message: z.string(),
		dateDeleted: z.string().min(1),
	})
	.passthrough();
export type TasksRemoveResponse = z.infer<typeof TasksRemoveResponseSchema>;

// ── Plugin endpoint schema maps ──────────────────────────────────────────────

export type ConversiontoolsEndpointInputs = {
	accountVerify: AccountVerifyInput;
	accountGetInfo: AccountGetInfoInput;
	accountGetConfig: AccountGetConfigInput;
	conversionsList: ConversionsListInput;
	conversionsGet: ConversionsGetInput;
	filesUpload: FilesUploadInput;
	filesGetInfo: FilesGetInfoInput;
	filesCreateDownloadLink: FilesCreateDownloadLinkInput;
	filesDownloadById: FilesDownloadByIdInput;
	filesDownloadFromLink: FilesDownloadFromLinkInput;
	filesCreateUploadSession: FilesCreateUploadSessionInput;
	filesUploadToSession: FilesUploadToSessionInput;
	tasksCreate: TasksCreateInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksUpdateRetention: TasksUpdateRetentionInput;
	tasksRemove: TasksRemoveInput;
};

export type ConversiontoolsEndpointOutputs = {
	accountVerify: AccountVerifyResponse;
	accountGetInfo: AccountGetInfoResponse;
	accountGetConfig: AccountGetConfigResponse;
	conversionsList: ConversionsListResponse;
	conversionsGet: ConversionsGetResponse;
	filesUpload: FilesUploadResponse;
	filesGetInfo: FilesGetInfoResponse;
	filesCreateDownloadLink: FilesCreateDownloadLinkResponse;
	filesDownloadById: FilesDownloadOutput;
	filesDownloadFromLink: FilesDownloadOutput;
	filesCreateUploadSession: FilesCreateUploadSessionResponse;
	filesUploadToSession: FilesUploadToSessionResponse;
	tasksCreate: TasksCreateResponse;
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksUpdateRetention: TasksUpdateRetentionResponse;
	tasksRemove: TasksRemoveResponse;
};

export const ConversiontoolsEndpointInputSchemas = {
	accountVerify: AccountVerifyInputSchema,
	accountGetInfo: AccountGetInfoInputSchema,
	accountGetConfig: AccountGetConfigInputSchema,
	conversionsList: ConversionsListInputSchema,
	conversionsGet: ConversionsGetInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesGetInfo: FilesGetInfoInputSchema,
	filesCreateDownloadLink: FilesCreateDownloadLinkInputSchema,
	filesDownloadById: FilesDownloadByIdInputSchema,
	filesDownloadFromLink: FilesDownloadFromLinkInputSchema,
	filesCreateUploadSession: FilesCreateUploadSessionInputSchema,
	filesUploadToSession: FilesUploadToSessionInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksUpdateRetention: TasksUpdateRetentionInputSchema,
	tasksRemove: TasksRemoveInputSchema,
} as const;

export const ConversiontoolsEndpointOutputSchemas = {
	accountVerify: AccountVerifyResponseSchema,
	accountGetInfo: AccountGetInfoResponseSchema,
	accountGetConfig: AccountGetConfigResponseSchema,
	conversionsList: ConversionsListResponseSchema,
	conversionsGet: ConversionsGetResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	filesGetInfo: FilesGetInfoResponseSchema,
	filesCreateDownloadLink: FilesCreateDownloadLinkResponseSchema,
	filesDownloadById: FilesDownloadOutputSchema,
	filesDownloadFromLink: FilesDownloadOutputSchema,
	filesCreateUploadSession: FilesCreateUploadSessionResponseSchema,
	filesUploadToSession: FilesUploadToSessionResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksUpdateRetention: TasksUpdateRetentionResponseSchema,
	tasksRemove: TasksRemoveResponseSchema,
} as const;
