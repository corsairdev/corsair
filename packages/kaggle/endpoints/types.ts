import { z } from 'zod';

// Kaggle's public OpenAPI does not expose stable field-level response schemas for every
// route; list/object payloads vary by resource. Loose records are intentional and commented.

const LooseObjectSchema = z.record(z.string(), z.unknown());
const LooseListSchema = z.union([
	z.array(LooseObjectSchema),
	z
		.object({
			// common paginated/list wrappers seen across Kaggle list endpoints
			// shape varies; kept permissive
			results: z.array(LooseObjectSchema).optional(),
			data: z.array(LooseObjectSchema).optional(),
			list: z.array(LooseObjectSchema).optional(),
			totalResults: z.number().optional(),
			nextPageToken: z.string().optional(),
		})
		.catchall(z.unknown()),
	LooseObjectSchema,
]);

const BinaryDownloadSchema = z.object({
	contentType: z.string(),
	size: z.number(),
	dataBase64: z.string(),
	fileName: z.string().optional(),
});

const KernelOutputDownloadSchema = z.object({
	files: z.array(BinaryDownloadSchema),
	log: z.string().optional(),
	nextPageToken: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Datasets (8)
// ---------------------------------------------------------------------------

const ListDatasetsInputSchema = z.object({
	search: z.string().optional(),
	user: z.string().optional(),
	sortBy: z.string().optional(),
	size: z.string().optional(),
	fileType: z.string().optional(),
	licenseName: z.string().optional(),
	tagIds: z.string().optional(),
	page: z.number().optional(),
	maxSize: z.number().optional(),
	minSize: z.number().optional(),
});
export type ListDatasetsInput = z.infer<typeof ListDatasetsInputSchema>;

const CreateDatasetInputSchema = z.object({
	ownerSlug: z.string(),
	slug: z.string(),
	title: z.string(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	isPrivate: z.boolean().optional(),
	licenseName: z.string().optional(),
	files: z.array(LooseObjectSchema).optional(),
});
export type CreateDatasetInput = z.infer<typeof CreateDatasetInputSchema>;

const CreateDatasetVersionInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
	versionNotes: z.string().optional(),
	files: z.array(LooseObjectSchema).optional(),
});
export type CreateDatasetVersionInput = z.infer<
	typeof CreateDatasetVersionInputSchema
>;

const GetDatasetMetadataInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
});
export type GetDatasetMetadataInput = z.infer<
	typeof GetDatasetMetadataInputSchema
>;

const GetDatasetStatusInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
});
export type GetDatasetStatusInput = z.infer<typeof GetDatasetStatusInputSchema>;

const ListDatasetFilesInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
	datasetVersionNumber: z.number().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListDatasetFilesInput = z.infer<typeof ListDatasetFilesInputSchema>;

const DownloadDatasetInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
	datasetVersionNumber: z.number().optional(),
});
export type DownloadDatasetInput = z.infer<typeof DownloadDatasetInputSchema>;

const DownloadDatasetFileInputSchema = z.object({
	ownerSlug: z.string(),
	datasetSlug: z.string(),
	fileName: z.string(),
	datasetVersionNumber: z.number().optional(),
});
export type DownloadDatasetFileInput = z.infer<
	typeof DownloadDatasetFileInputSchema
>;

// ---------------------------------------------------------------------------
// Competitions (8)
// ---------------------------------------------------------------------------

const ListCompetitionsInputSchema = z.object({
	group: z.string().optional(),
	category: z.string().optional(),
	sortBy: z.string().optional(),
	page: z.number().optional(),
	search: z.string().optional(),
});
export type ListCompetitionsInput = z.infer<typeof ListCompetitionsInputSchema>;

const ListCompetitionFilesInputSchema = z.object({
	id: z.string(),
	pageToken: z.string().optional(),
	pageSize: z.number().optional(),
});
export type ListCompetitionFilesInput = z.infer<
	typeof ListCompetitionFilesInputSchema
>;

const CompetitionDownloadFilesInputSchema = z.object({
	id: z.string(),
});
export type CompetitionDownloadFilesInput = z.infer<
	typeof CompetitionDownloadFilesInputSchema
>;

const DownloadCompetitionFileInputSchema = z.object({
	id: z.string(),
	fileName: z.string(),
});
export type DownloadCompetitionFileInput = z.infer<
	typeof DownloadCompetitionFileInputSchema
>;

const ViewCompetitionLeaderboardInputSchema = z.object({
	id: z.string(),
});
export type ViewCompetitionLeaderboardInput = z.infer<
	typeof ViewCompetitionLeaderboardInputSchema
>;

const DownloadCompetitionLeaderboardInputSchema = z.object({
	id: z.string(),
});
export type DownloadCompetitionLeaderboardInput = z.infer<
	typeof DownloadCompetitionLeaderboardInputSchema
>;

const GenerateCompetitionSubmissionUrlInputSchema = z.object({
	competitionName: z.string(),
	contentLength: z.number(),
	lastModifiedEpochSeconds: z.number(),
	fileName: z.string(),
});
export type GenerateCompetitionSubmissionUrlInput = z.infer<
	typeof GenerateCompetitionSubmissionUrlInputSchema
>;

const CompetitionSubmitInputSchema = z.object({
	id: z.string(),
	blobFileTokens: z.string(),
	submissionDescription: z.string().optional(),
});
export type CompetitionSubmitInput = z.infer<
	typeof CompetitionSubmitInputSchema
>;

// ---------------------------------------------------------------------------
// Kernels (5)
// ---------------------------------------------------------------------------

const ListKernelsInputSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
	search: z.string().optional(),
	group: z.string().optional(),
	user: z.string().optional(),
	language: z.string().optional(),
	kernelType: z.string().optional(),
	outputType: z.string().optional(),
	sortBy: z.string().optional(),
	dataset: z.string().optional(),
	competition: z.string().optional(),
	parentKernel: z.string().optional(),
});
export type ListKernelsInput = z.infer<typeof ListKernelsInputSchema>;

const PullKernelInputSchema = z.object({
	userName: z.string(),
	kernelSlug: z.string(),
	metadata: z.boolean().optional(),
});
export type PullKernelInput = z.infer<typeof PullKernelInputSchema>;

const GetKernelStatusInputSchema = z.object({
	userName: z.string(),
	kernelSlug: z.string(),
});
export type GetKernelStatusInput = z.infer<typeof GetKernelStatusInputSchema>;

const DownloadKernelOutputInputSchema = z.object({
	userName: z.string(),
	kernelSlug: z.string(),
});
export type DownloadKernelOutputInput = z.infer<
	typeof DownloadKernelOutputInputSchema
>;

const ListKernelOutputFilesInputSchema = z.object({
	userName: z.string(),
	kernelSlug: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListKernelOutputFilesInput = z.infer<
	typeof ListKernelOutputFilesInputSchema
>;

// ---------------------------------------------------------------------------
// Models (4)
// ---------------------------------------------------------------------------

const ListModelsInputSchema = z.object({
	search: z.string().optional(),
	owner: z.string().optional(),
	sortBy: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;

const GetModelInputSchema = z.object({
	ownerSlug: z.string(),
	modelSlug: z.string(),
});
export type GetModelInput = z.infer<typeof GetModelInputSchema>;

const GetModelInstanceInputSchema = z.object({
	ownerSlug: z.string(),
	modelSlug: z.string(),
	framework: z.string(),
	instanceSlug: z.string(),
});
export type GetModelInstanceInput = z.infer<typeof GetModelInstanceInputSchema>;

const ListModelInstanceVersionFilesInputSchema = z.object({
	ownerSlug: z.string(),
	modelSlug: z.string(),
	framework: z.string(),
	instanceSlug: z.string(),
	versionNumber: z.number(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export type ListModelInstanceVersionFilesInput = z.infer<
	typeof ListModelInstanceVersionFilesInputSchema
>;

// ---------------------------------------------------------------------------
// Aggregate maps
// ---------------------------------------------------------------------------

export type KaggleEndpointInputs = {
	datasetsList: ListDatasetsInput;
	datasetsCreate: CreateDatasetInput;
	datasetsCreateVersion: CreateDatasetVersionInput;
	datasetsGetMetadata: GetDatasetMetadataInput;
	datasetsGetStatus: GetDatasetStatusInput;
	datasetsListFiles: ListDatasetFilesInput;
	datasetsDownload: DownloadDatasetInput;
	datasetsDownloadFile: DownloadDatasetFileInput;

	competitionsList: ListCompetitionsInput;
	competitionsListFiles: ListCompetitionFilesInput;
	competitionsDownloadFiles: CompetitionDownloadFilesInput;
	competitionsDownloadFile: DownloadCompetitionFileInput;
	competitionsViewLeaderboard: ViewCompetitionLeaderboardInput;
	competitionsDownloadLeaderboard: DownloadCompetitionLeaderboardInput;
	competitionsGenerateSubmissionUrl: GenerateCompetitionSubmissionUrlInput;
	competitionsSubmit: CompetitionSubmitInput;

	kernelsList: ListKernelsInput;
	kernelsPull: PullKernelInput;
	kernelsGetStatus: GetKernelStatusInput;
	kernelsDownloadOutput: DownloadKernelOutputInput;
	kernelsListOutputFiles: ListKernelOutputFilesInput;

	modelsList: ListModelsInput;
	modelsGet: GetModelInput;
	modelsGetInstance: GetModelInstanceInput;
	modelsListInstanceVersionFiles: ListModelInstanceVersionFilesInput;
};

export type KaggleEndpointOutputs = {
	datasetsList: z.infer<typeof LooseListSchema>;
	datasetsCreate: z.infer<typeof LooseObjectSchema>;
	datasetsCreateVersion: z.infer<typeof LooseObjectSchema>;
	datasetsGetMetadata: z.infer<typeof LooseObjectSchema>;
	datasetsGetStatus: z.infer<typeof LooseObjectSchema>;
	datasetsListFiles: z.infer<typeof LooseListSchema>;
	datasetsDownload: z.infer<typeof BinaryDownloadSchema>;
	datasetsDownloadFile: z.infer<typeof BinaryDownloadSchema>;

	competitionsList: z.infer<typeof LooseListSchema>;
	competitionsListFiles: z.infer<typeof LooseListSchema>;
	competitionsDownloadFiles: z.infer<typeof BinaryDownloadSchema>;
	competitionsDownloadFile: z.infer<typeof BinaryDownloadSchema>;
	competitionsViewLeaderboard: z.infer<typeof LooseObjectSchema>;
	competitionsDownloadLeaderboard: z.infer<typeof BinaryDownloadSchema>;
	competitionsGenerateSubmissionUrl: z.infer<typeof LooseObjectSchema>;
	competitionsSubmit: z.infer<typeof LooseObjectSchema>;

	kernelsList: z.infer<typeof LooseListSchema>;
	kernelsPull: z.infer<typeof LooseObjectSchema>;
	kernelsGetStatus: z.infer<typeof LooseObjectSchema>;
	kernelsDownloadOutput: z.infer<typeof KernelOutputDownloadSchema>;
	kernelsListOutputFiles: z.infer<typeof LooseListSchema>;

	modelsList: z.infer<typeof LooseListSchema>;
	modelsGet: z.infer<typeof LooseObjectSchema>;
	modelsGetInstance: z.infer<typeof LooseObjectSchema>;
	modelsListInstanceVersionFiles: z.infer<typeof LooseListSchema>;
};

export const KaggleEndpointInputSchemas = {
	datasetsList: ListDatasetsInputSchema,
	datasetsCreate: CreateDatasetInputSchema,
	datasetsCreateVersion: CreateDatasetVersionInputSchema,
	datasetsGetMetadata: GetDatasetMetadataInputSchema,
	datasetsGetStatus: GetDatasetStatusInputSchema,
	datasetsListFiles: ListDatasetFilesInputSchema,
	datasetsDownload: DownloadDatasetInputSchema,
	datasetsDownloadFile: DownloadDatasetFileInputSchema,

	competitionsList: ListCompetitionsInputSchema,
	competitionsListFiles: ListCompetitionFilesInputSchema,
	competitionsDownloadFiles: CompetitionDownloadFilesInputSchema,
	competitionsDownloadFile: DownloadCompetitionFileInputSchema,
	competitionsViewLeaderboard: ViewCompetitionLeaderboardInputSchema,
	competitionsDownloadLeaderboard: DownloadCompetitionLeaderboardInputSchema,
	competitionsGenerateSubmissionUrl:
		GenerateCompetitionSubmissionUrlInputSchema,
	competitionsSubmit: CompetitionSubmitInputSchema,

	kernelsList: ListKernelsInputSchema,
	kernelsPull: PullKernelInputSchema,
	kernelsGetStatus: GetKernelStatusInputSchema,
	kernelsDownloadOutput: DownloadKernelOutputInputSchema,
	kernelsListOutputFiles: ListKernelOutputFilesInputSchema,

	modelsList: ListModelsInputSchema,
	modelsGet: GetModelInputSchema,
	modelsGetInstance: GetModelInstanceInputSchema,
	modelsListInstanceVersionFiles: ListModelInstanceVersionFilesInputSchema,
} as const;

export const KaggleEndpointOutputSchemas = {
	datasetsList: LooseListSchema,
	datasetsCreate: LooseObjectSchema,
	datasetsCreateVersion: LooseObjectSchema,
	datasetsGetMetadata: LooseObjectSchema,
	datasetsGetStatus: LooseObjectSchema,
	datasetsListFiles: LooseListSchema,
	datasetsDownload: BinaryDownloadSchema,
	datasetsDownloadFile: BinaryDownloadSchema,

	competitionsList: LooseListSchema,
	competitionsListFiles: LooseListSchema,
	competitionsDownloadFiles: BinaryDownloadSchema,
	competitionsDownloadFile: BinaryDownloadSchema,
	competitionsViewLeaderboard: LooseObjectSchema,
	competitionsDownloadLeaderboard: BinaryDownloadSchema,
	competitionsGenerateSubmissionUrl: LooseObjectSchema,
	competitionsSubmit: LooseObjectSchema,

	kernelsList: LooseListSchema,
	kernelsPull: LooseObjectSchema,
	kernelsGetStatus: LooseObjectSchema,
	kernelsDownloadOutput: KernelOutputDownloadSchema,
	kernelsListOutputFiles: LooseListSchema,

	modelsList: LooseListSchema,
	modelsGet: LooseObjectSchema,
	modelsGetInstance: LooseObjectSchema,
	modelsListInstanceVersionFiles: LooseListSchema,
} as const;
