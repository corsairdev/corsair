import type { CorsairEndpoint, CorsairPluginContext } from 'corsair/core';
import { z } from 'zod';
import type { WriterSchema } from '../schema';

const PaginationInputSchema = z.object({
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	order: z.enum(['asc', 'desc']).optional(),
});

const ModelSchema = z
	.object({ id: z.string(), name: z.string() })
	.passthrough();
const ModelsResponseSchema = z
	.object({ models: z.array(ModelSchema) })
	.passthrough();
const CompletionChoiceSchema = z.object({
	text: z.string(),
	log_probs: z.unknown().nullable().optional(),
});
const CompletionInputSchema = z.object({
	model: z.string(),
	prompt: z.string(),
	max_tokens: z.number().int().positive().optional(),
	temperature: z.number().min(0).optional(),
	top_p: z.number().min(0).max(1).optional(),
	stop: z.union([z.string(), z.array(z.string())]).optional(),
	best_of: z.number().int().positive().optional(),
	random_seed: z.number().int().optional(),
	stream: z.literal(false).optional(),
});
const CompletionResponseSchema = z.object({
	choices: z.array(CompletionChoiceSchema),
	model: z.string(),
});
const ChatMessageSchema = z.object({
	role: z.enum(['user', 'assistant', 'system']),
	content: z.string(),
});
const ChatInputSchema = z.object({
	model: z.string(),
	messages: z.array(ChatMessageSchema).min(1),
	temperature: z.number().min(0).optional(),
	stream: z.literal(false).optional(),
});
const ChatChoiceSchema = z.object({
	index: z.number().int(),
	finish_reason: z.string().nullable().optional(),
	message: z.object({ role: z.string(), content: z.string().nullable() }),
});
const ChatUsageSchema = z.object({
	prompt_tokens: z.number().int(),
	total_tokens: z.number().int(),
	completion_tokens: z.number().int(),
});
const ChatResponseSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion'),
	choices: z.array(ChatChoiceSchema).min(1),
	created: z.number().int(),
	model: z.string(),
	usage: ChatUsageSchema.optional(),
});

const IdOnlyResponseSchema = z
	.object({ id: z.string(), deleted: z.boolean().optional() })
	.passthrough();

const FileInfoSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const FileListResponseSchema = z
	.object({
		data: z.array(FileInfoSchema),
		has_more: z.boolean().optional(),
		first_id: z.string().optional(),
		last_id: z.string().optional(),
	})
	.passthrough();

const GraphSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

const GraphListResponseSchema = z
	.object({
		data: z.array(GraphSchema),
		has_more: z.boolean().optional(),
		first_id: z.string().optional(),
		last_id: z.string().optional(),
	})
	.passthrough();

const ApplicationSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
	})
	.passthrough();

const ApplicationListResponseSchema = z
	.object({
		data: z.array(ApplicationSchema),
		has_more: z.boolean().optional(),
		first_id: z.string().optional(),
		last_id: z.string().optional(),
	})
	.passthrough();

const QuestionResponseSchema = z
	.object({
		question: z.string(),
		answer: z.string(),
		sources: z.array(z.unknown()).optional(),
	})
	.passthrough();

const ParsePdfResponseSchema = z
	.object({
		content: z.string().optional(),
		markdown: z.string().optional(),
	})
	.passthrough();

const WebSearchResponseSchema = z
	.object({
		results: z.array(z.unknown()).optional(),
	})
	.passthrough();

const VisionResponseSchema = z
	.object({
		id: z.string().optional(),
		choices: z.array(z.unknown()).optional(),
	})
	.passthrough();

const TranslateResponseSchema = z
	.object({
		translation: z.string().optional(),
		translated_text: z.string().optional(),
	})
	.passthrough();

const DetectAiContentResponseSchema = z
	.array(
		z
			.object({
				label: z.string().optional(),
				confidence: z.number().optional(),
			})
			.passthrough(),
	)
	.or(z.unknown());

const MedicalComprehendResponseSchema = z.unknown();

const ListFilesInputSchema = PaginationInputSchema.extend({
	graph_id: z.string().optional(),
	status: z.enum(['in_progress', 'completed', 'failed']).optional(),
	file_types: z.string().optional(),
});

const UploadFileInputSchema = z.object({
	content: z.string(),
	contentType: z.string(),
	filename: z.string(),
	graphId: z.string().optional(),
});

const ListGraphsInputSchema = PaginationInputSchema.extend({
	team_ids: z.array(z.number().int()).optional(),
});

const CreateGraphInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	team_ids: z.array(z.number().int()).optional(),
	urls: z.array(z.unknown()).optional(),
});

const UpdateGraphInputSchema = z.object({
	graph_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	team_ids: z.array(z.number().int()).optional(),
	urls: z.array(z.unknown()).optional(),
});

const GraphIdInputSchema = z.object({ graph_id: z.string() });
const GraphFileInputSchema = z.object({
	graph_id: z.string(),
	file_id: z.string(),
});

const AskGraphQuestionInputSchema = z.object({
	graph_ids: z.array(z.string()).min(1),
	question: z.string(),
	stream: z.literal(false).optional(),
});

const FileIdInputSchema = z.object({ file_id: z.string() });

const ListApplicationsInputSchema = PaginationInputSchema.extend({
	search: z.string().optional(),
	status: z.string().optional(),
});

const ParsePdfInputSchema = z.object({
	file_id: z.string(),
	format: z.string().optional(),
});

const WebSearchInputSchema = z.object({
	query: z.string(),
	count: z.number().int().min(1).max(50).optional(),
	country: z.string().optional(),
});

const AddFileToGraphInputSchema = z.object({
	graph_id: z.string(),
	file_id: z.string(),
});

const AnalyzeImagesInputSchema = z.object({
	model: z.string(),
	input: z.array(z.unknown()).min(1),
	stream: z.literal(false).optional(),
});

const TranslateTextInputSchema = z.object({
	text: z.string(),
	target_language: z.string(),
	source_language: z.string().optional(),
	formality: z.string().optional(),
	mask_profanity: z.boolean().optional(),
});

const DetectAiContentInputSchema = z.object({
	organizationId: z.number().int(),
	text: z.string(),
});

const MedicalComprehendInputSchema = z.object({
	text: z.string(),
	model: z.string().optional(),
});

const DeleteGraphInputSchema = GraphIdInputSchema;
const RetrieveGraphInputSchema = GraphIdInputSchema;
const DeleteFileInputSchema = FileIdInputSchema;
const GetFileInputSchema = FileIdInputSchema;
const DownloadFileInputSchema = FileIdInputSchema;
export type CompletionInput = z.infer<typeof CompletionInputSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type WriterEndpointInputs = {
	listModels: Record<string, never>;
	createCompletion: CompletionInput;
	createChat: ChatInput;
	listFiles: z.infer<typeof ListFilesInputSchema>;
	uploadFile: z.infer<typeof UploadFileInputSchema>;
	getFile: z.infer<typeof GetFileInputSchema>;
	downloadFile: z.infer<typeof DownloadFileInputSchema>;
	deleteFile: z.infer<typeof DeleteFileInputSchema>;
	listKnowledgeGraphs: z.infer<typeof ListGraphsInputSchema>;
	createKnowledgeGraph: z.infer<typeof CreateGraphInputSchema>;
	retrieveKnowledgeGraph: z.infer<typeof RetrieveGraphInputSchema>;
	updateKnowledgeGraph: z.infer<typeof UpdateGraphInputSchema>;
	deleteKnowledgeGraph: z.infer<typeof DeleteGraphInputSchema>;
	addFileToGraph: z.infer<typeof AddFileToGraphInputSchema>;
	removeFileFromGraph: z.infer<typeof GraphFileInputSchema>;
	askQuestionToKnowledgeGraph: z.infer<typeof AskGraphQuestionInputSchema>;
	listApplications: z.infer<typeof ListApplicationsInputSchema>;
	parsePdf: z.infer<typeof ParsePdfInputSchema>;
	webSearch: z.infer<typeof WebSearchInputSchema>;
	analyzeImages: z.infer<typeof AnalyzeImagesInputSchema>;
	translateText: z.infer<typeof TranslateTextInputSchema>;
	detectAiContent: z.infer<typeof DetectAiContentInputSchema>;
	medicalComprehend: z.infer<typeof MedicalComprehendInputSchema>;
};
export type WriterEndpointOutputs = {
	listModels: z.infer<typeof ModelsResponseSchema>;
	createCompletion: z.infer<typeof CompletionResponseSchema>;
	createChat: z.infer<typeof ChatResponseSchema>;
	listFiles: z.infer<typeof FileListResponseSchema>;
	uploadFile: z.infer<typeof FileInfoSchema>;
	getFile: z.infer<typeof FileInfoSchema>;
	downloadFile: unknown;
	deleteFile: z.infer<typeof IdOnlyResponseSchema>;
	listKnowledgeGraphs: z.infer<typeof GraphListResponseSchema>;
	createKnowledgeGraph: z.infer<typeof GraphSchema>;
	retrieveKnowledgeGraph: z.infer<typeof GraphSchema>;
	updateKnowledgeGraph: z.infer<typeof GraphSchema>;
	deleteKnowledgeGraph: z.infer<typeof IdOnlyResponseSchema>;
	addFileToGraph: z.infer<typeof FileInfoSchema>;
	removeFileFromGraph: z.infer<typeof IdOnlyResponseSchema>;
	askQuestionToKnowledgeGraph: z.infer<typeof QuestionResponseSchema>;
	listApplications: z.infer<typeof ApplicationListResponseSchema>;
	parsePdf: z.infer<typeof ParsePdfResponseSchema>;
	webSearch: z.infer<typeof WebSearchResponseSchema>;
	analyzeImages: z.infer<typeof VisionResponseSchema>;
	translateText: z.infer<typeof TranslateResponseSchema>;
	detectAiContent: z.infer<typeof DetectAiContentResponseSchema>;
	medicalComprehend: z.infer<typeof MedicalComprehendResponseSchema>;
};
export const WriterEndpointInputSchemas = {
	listModels: z.object({}),
	createCompletion: CompletionInputSchema,
	createChat: ChatInputSchema,
	listFiles: ListFilesInputSchema,
	uploadFile: UploadFileInputSchema,
	getFile: GetFileInputSchema,
	downloadFile: DownloadFileInputSchema,
	deleteFile: DeleteFileInputSchema,
	listKnowledgeGraphs: ListGraphsInputSchema,
	createKnowledgeGraph: CreateGraphInputSchema,
	retrieveKnowledgeGraph: RetrieveGraphInputSchema,
	updateKnowledgeGraph: UpdateGraphInputSchema,
	deleteKnowledgeGraph: DeleteGraphInputSchema,
	addFileToGraph: AddFileToGraphInputSchema,
	removeFileFromGraph: GraphFileInputSchema,
	askQuestionToKnowledgeGraph: AskGraphQuestionInputSchema,
	listApplications: ListApplicationsInputSchema,
	parsePdf: ParsePdfInputSchema,
	webSearch: WebSearchInputSchema,
	analyzeImages: AnalyzeImagesInputSchema,
	translateText: TranslateTextInputSchema,
	detectAiContent: DetectAiContentInputSchema,
	medicalComprehend: MedicalComprehendInputSchema,
} as const;
export const WriterEndpointOutputSchemas = {
	listModels: ModelsResponseSchema,
	createCompletion: CompletionResponseSchema,
	createChat: ChatResponseSchema,
	listFiles: FileListResponseSchema,
	uploadFile: FileInfoSchema,
	getFile: FileInfoSchema,
	downloadFile: z.unknown(),
	deleteFile: IdOnlyResponseSchema,
	listKnowledgeGraphs: GraphListResponseSchema,
	createKnowledgeGraph: GraphSchema,
	retrieveKnowledgeGraph: GraphSchema,
	updateKnowledgeGraph: GraphSchema,
	deleteKnowledgeGraph: IdOnlyResponseSchema,
	addFileToGraph: FileInfoSchema,
	removeFileFromGraph: IdOnlyResponseSchema,
	askQuestionToKnowledgeGraph: QuestionResponseSchema,
	listApplications: ApplicationListResponseSchema,
	parsePdf: ParsePdfResponseSchema,
	webSearch: WebSearchResponseSchema,
	analyzeImages: VisionResponseSchema,
	translateText: TranslateResponseSchema,
	detectAiContent: DetectAiContentResponseSchema,
	medicalComprehend: MedicalComprehendResponseSchema,
} as const;
type WriterEndpoint<K extends keyof WriterEndpointInputs> = CorsairEndpoint<
	CorsairPluginContext<typeof WriterSchema, Record<string, unknown>>,
	WriterEndpointInputs[K],
	WriterEndpointOutputs[K]
>;
export type WriterEndpoints = {
	listModels: WriterEndpoint<'listModels'>;
	createCompletion: WriterEndpoint<'createCompletion'>;
	createChat: WriterEndpoint<'createChat'>;
	listFiles: WriterEndpoint<'listFiles'>;
	uploadFile: WriterEndpoint<'uploadFile'>;
	getFile: WriterEndpoint<'getFile'>;
	downloadFile: WriterEndpoint<'downloadFile'>;
	deleteFile: WriterEndpoint<'deleteFile'>;
	listKnowledgeGraphs: WriterEndpoint<'listKnowledgeGraphs'>;
	createKnowledgeGraph: WriterEndpoint<'createKnowledgeGraph'>;
	retrieveKnowledgeGraph: WriterEndpoint<'retrieveKnowledgeGraph'>;
	updateKnowledgeGraph: WriterEndpoint<'updateKnowledgeGraph'>;
	deleteKnowledgeGraph: WriterEndpoint<'deleteKnowledgeGraph'>;
	addFileToGraph: WriterEndpoint<'addFileToGraph'>;
	removeFileFromGraph: WriterEndpoint<'removeFileFromGraph'>;
	askQuestionToKnowledgeGraph: WriterEndpoint<'askQuestionToKnowledgeGraph'>;
	listApplications: WriterEndpoint<'listApplications'>;
	parsePdf: WriterEndpoint<'parsePdf'>;
	webSearch: WriterEndpoint<'webSearch'>;
	analyzeImages: WriterEndpoint<'analyzeImages'>;
	translateText: WriterEndpoint<'translateText'>;
	detectAiContent: WriterEndpoint<'detectAiContent'>;
	medicalComprehend: WriterEndpoint<'medicalComprehend'>;
};
