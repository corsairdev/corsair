import { z } from 'zod';

const ChatMessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		content: z.string().nullable().optional(),
		tool_calls: z
			.array(
				z
					.object({
						id: z.string(),
						type: z.string(),
						function: z
							.object({
								name: z.string(),
								arguments: z.string(),
							})
							.loose(),
					})
					.loose(),
			)
			.optional(),
		tool_call_id: z.string().optional(),
	})
	.loose();

const ChatToolSchema = z
	.object({
		type: z.literal('function'),
		function: z
			.object({
				name: z.string(),
				description: z.string().optional(),
				parameters: z.record(z.string(), z.unknown()).optional(),
			})
			.loose(),
	})
	.loose();

const ChatDocumentSchema = z
	.object({
		content: z.string(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ChatCompletionsInputSchema = z
	.object({
		model: z.string(),
		messages: z.array(ChatMessageSchema).min(1),
		tools: z.array(ChatToolSchema).optional(),
		documents: z.array(ChatDocumentSchema).optional(),
		response_format: z
			.object({
				type: z.enum(['text', 'json_object']),
			})
			.optional(),
		max_tokens: z.number().int().min(1).max(4096).optional(),
		temperature: z.number().min(0).max(2).optional(),
		top_p: z.number().min(0).max(1).optional(),
		stop: z.union([z.string(), z.array(z.string())]).optional(),
		n: z.number().int().min(1).max(16).optional(),
	})
	.strict();
export type ChatCompletionsInput = z.infer<typeof ChatCompletionsInputSchema>;

const ChatCompletionsResponseSchema = z
	.object({
		id: z.string().optional(),
		choices: z.array(
			z
				.object({
					index: z.number().optional(),
					message: z
						.object({
							role: z.string().optional(),
							content: z.string().nullable().optional(),
							tool_calls: z.array(z.unknown()).optional(),
						})
						.loose()
						.optional(),
					finish_reason: z.string().optional(),
				})
				.loose(),
		),
		usage: z
			.object({
				prompt_tokens: z.number().optional(),
				completion_tokens: z.number().optional(),
				total_tokens: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
export type ChatCompletionsResponse = z.infer<
	typeof ChatCompletionsResponseSchema
>;

const FileMetadataSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		size: z.number().optional(),
		created_at: z.string().optional(),
		labels: z.array(z.string()).optional(),
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	})
	.loose();
export type FileMetadata = z.infer<typeof FileMetadataSchema>;

const ListLibraryFilesInputSchema = z.object({
	name: z.string().optional(),
	path: z.string().optional(),
	status: z
		.enum([
			'DB_RECORD_CREATED',
			'UPLOADED',
			'UPLOAD_FAILED',
			'PROCESSED',
			'PROCESSING_FAILED',
		])
		.optional(),
	label: z.union([z.string(), z.array(z.string())]).optional(),
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
});
export type ListLibraryFilesInput = z.infer<typeof ListLibraryFilesInputSchema>;

const ListLibraryFilesResponseSchema = z.array(FileMetadataSchema);
export type ListLibraryFilesResponse = z.infer<
	typeof ListLibraryFilesResponseSchema
>;

const UploadWorkspaceFileInputSchema = z
	.object({
		file: z
			.union([z.string(), z.custom<Blob>((value) => value instanceof Blob)])
			.optional(),
		fileName: z.string().optional(),
		path: z.string().optional(),
		labels: z.array(z.string()).optional(),
		publicUrl: z.string().optional(),
	})
	.refine(
		(value) => value.file !== undefined || value.publicUrl !== undefined,
		{
			message: 'Either file or publicUrl is required',
		},
	);
export type UploadWorkspaceFileInput = z.infer<
	typeof UploadWorkspaceFileInputSchema
>;

const UploadWorkspaceFileResponseSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type UploadWorkspaceFileResponse = z.infer<
	typeof UploadWorkspaceFileResponseSchema
>;

const GetWorkspaceFileInputSchema = z.object({
	file_id: z.string(),
});
export type GetWorkspaceFileInput = z.infer<typeof GetWorkspaceFileInputSchema>;

const GetWorkspaceFileResponseSchema = FileMetadataSchema;
export type GetWorkspaceFileResponse = z.infer<
	typeof GetWorkspaceFileResponseSchema
>;

const UpdateFileInputSchema = z.object({
	file_id: z.string(),
	publicUrl: z.string().optional(),
	labels: z.array(z.string()).optional(),
});
export type UpdateFileInput = z.infer<typeof UpdateFileInputSchema>;

const UpdateFileResponseSchema = z.undefined();
export type UpdateFileResponse = z.infer<typeof UpdateFileResponseSchema>;

const DeleteFileInputSchema = z.object({
	file_id: z.string(),
});
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

const DeleteFileResponseSchema = z.undefined();
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

const GetFileDownloadLinkInputSchema = z.object({
	file_id: z.string(),
});
export type GetFileDownloadLinkInput = z.infer<
	typeof GetFileDownloadLinkInputSchema
>;

const GetFileDownloadLinkResponseSchema = z.string();
export type GetFileDownloadLinkResponse = z.infer<
	typeof GetFileDownloadLinkResponseSchema
>;

const MaestroMessageSchema = z
	.object({
		role: z.enum(['user', 'assistant']),
		content: z.string(),
	})
	.loose();

const MaestroRequirementSchema = z
	.object({
		name: z.string(),
		description: z.string(),
		is_mandatory: z.boolean().optional(),
	})
	.loose();

const MaestroToolSchema = z.union([
	z
		.object({
			type: z.literal('mcp'),
			server_label: z.string(),
			server_url: z.string(),
			headers: z.record(z.string(), z.string()).optional(),
			allowed_tools: z.array(z.string()).optional(),
		})
		.loose(),
	z
		.object({
			type: z.literal('http'),
			function: z
				.object({
					name: z.string(),
					description: z.string().optional(),
					parameters: z.record(z.string(), z.unknown()).optional(),
				})
				.loose(),
			endpoint: z
				.object({
					url: z.string(),
					headers: z.record(z.string(), z.string()).optional(),
				})
				.loose(),
		})
		.loose(),
	z
		.object({
			type: z.literal('file_search'),
			labels: z.array(z.string()).optional(),
			file_ids: z.array(z.string()).optional(),
		})
		.loose(),
	z
		.object({
			type: z.literal('web_search'),
			urls: z.array(z.string()).optional(),
		})
		.loose(),
]);

const CreateMaestroRunInputSchema = z.object({
	input: z.union([z.string(), z.array(MaestroMessageSchema)]),
	system_prompt: z.string().optional(),
	requirements: z.array(MaestroRequirementSchema).max(10).optional(),
	tools: z.array(MaestroToolSchema).optional(),
	models: z.array(z.string()).optional(),
	budget: z.enum(['low', 'medium', 'high']).optional(),
	include: z.array(z.enum(['data_sources', 'requirements_result'])).optional(),
	response_language: z
		.enum([
			'arabic',
			'dutch',
			'english',
			'french',
			'german',
			'hebrew',
			'italian',
			'portuguese',
			'spanish',
		])
		.optional(),
});
export type CreateMaestroRunInput = z.infer<typeof CreateMaestroRunInputSchema>;

const MaestroRunSchema = z
	.object({
		id: z.string(),
		status: z.enum(['completed', 'failed', 'in_progress']).optional(),
		result: z.unknown().optional(),
		requirements_result: z
			.object({
				score: z.number().optional(),
				finish_reason: z.string().optional(),
				requirements: z.array(z.unknown()).optional(),
			})
			.loose()
			.optional(),
		data_sources: z
			.object({
				web_search: z.array(z.unknown()).optional(),
				file_search: z.array(z.unknown()).optional(),
				tool_calls: z.array(z.unknown()).optional(),
			})
			.loose()
			.optional(),
		error: z
			.object({
				message: z.string().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();
export type MaestroRun = z.infer<typeof MaestroRunSchema>;

const CreateMaestroRunResponseSchema = MaestroRunSchema;
export type CreateMaestroRunResponse = z.infer<
	typeof CreateMaestroRunResponseSchema
>;

const RetrieveMaestroRunInputSchema = z.object({
	id: z.string(),
});
export type RetrieveMaestroRunInput = z.infer<
	typeof RetrieveMaestroRunInputSchema
>;

const RetrieveMaestroRunResponseSchema = MaestroRunSchema;
export type RetrieveMaestroRunResponse = z.infer<
	typeof RetrieveMaestroRunResponseSchema
>;

export type StudioByAI21LabsEndpointInputs = {
	chatCompletions: ChatCompletionsInput;
	listLibraryFiles: ListLibraryFilesInput;
	uploadWorkspaceFile: UploadWorkspaceFileInput;
	getWorkspaceFile: GetWorkspaceFileInput;
	updateFile: UpdateFileInput;
	deleteFile: DeleteFileInput;
	getFileDownloadLink: GetFileDownloadLinkInput;
	createMaestroRun: CreateMaestroRunInput;
	retrieveMaestroRun: RetrieveMaestroRunInput;
};

export type StudioByAI21LabsEndpointOutputs = {
	chatCompletions: ChatCompletionsResponse;
	listLibraryFiles: ListLibraryFilesResponse;
	uploadWorkspaceFile: UploadWorkspaceFileResponse;
	getWorkspaceFile: GetWorkspaceFileResponse;
	updateFile: UpdateFileResponse;
	deleteFile: DeleteFileResponse;
	getFileDownloadLink: GetFileDownloadLinkResponse;
	createMaestroRun: CreateMaestroRunResponse;
	retrieveMaestroRun: RetrieveMaestroRunResponse;
};

export const StudioByAI21LabsEndpointInputSchemas = {
	chatCompletions: ChatCompletionsInputSchema,
	listLibraryFiles: ListLibraryFilesInputSchema,
	uploadWorkspaceFile: UploadWorkspaceFileInputSchema,
	getWorkspaceFile: GetWorkspaceFileInputSchema,
	updateFile: UpdateFileInputSchema,
	deleteFile: DeleteFileInputSchema,
	getFileDownloadLink: GetFileDownloadLinkInputSchema,
	createMaestroRun: CreateMaestroRunInputSchema,
	retrieveMaestroRun: RetrieveMaestroRunInputSchema,
} as const;

export const StudioByAI21LabsEndpointOutputSchemas = {
	chatCompletions: ChatCompletionsResponseSchema,
	listLibraryFiles: ListLibraryFilesResponseSchema,
	uploadWorkspaceFile: UploadWorkspaceFileResponseSchema,
	getWorkspaceFile: GetWorkspaceFileResponseSchema,
	updateFile: UpdateFileResponseSchema,
	deleteFile: DeleteFileResponseSchema,
	getFileDownloadLink: GetFileDownloadLinkResponseSchema,
	createMaestroRun: CreateMaestroRunResponseSchema,
	retrieveMaestroRun: RetrieveMaestroRunResponseSchema,
} as const;
