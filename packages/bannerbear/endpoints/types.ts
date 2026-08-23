import { z } from 'zod';
import {
	BannerbearAccount,
	BannerbearAnimatedGif,
	BannerbearCollection,
	BannerbearEffect,
	BannerbearFont,
	BannerbearImage,
	BannerbearPdfJoin,
	BannerbearProject,
	BannerbearScreenshot,
	BannerbearSignedBase,
	BannerbearTemplate,
	BannerbearTemplateSet,
	BannerbearVideo,
	BannerbearVideoTemplate,
	BannerbearWebhookObj,
	BannerbearWorkflow,
	BannerbearWorkflowRun,
} from '../schema/database';

// ─── Pagination helper ───────────────────────────────────────
const PaginationInput = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	project_id: z.string().optional(),
});

// ─── Account ─────────────────────────────────────────────────
const GetAccountInfoInputSchema = z.object({
	project_id: z.string().optional(),
});
export type GetAccountInfoInput = z.infer<typeof GetAccountInfoInputSchema>;
const GetAccountInfoResponseSchema = BannerbearAccount;
export type GetAccountInfoResponse = z.infer<
	typeof GetAccountInfoResponseSchema
>;

const GetAuthInputSchema = z.object({
	project_id: z.string().optional(),
});
export type GetAuthInput = z.infer<typeof GetAuthInputSchema>;
const GetAuthResponseSchema = BannerbearAccount;
export type GetAuthResponse = z.infer<typeof GetAuthResponseSchema>;

// ─── Projects ────────────────────────────────────────────────
const ListProjectsInputSchema = PaginationInput.pick({ page: true });
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;
const ListProjectsResponseSchema = z.array(BannerbearProject);
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

const GetProjectInputSchema = z.object({ uid: z.string() });
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;
const GetProjectResponseSchema = BannerbearProject;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;

const CreateProjectInputSchema = z.object({
	name: z.string(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
const CreateProjectResponseSchema = BannerbearProject;
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

const HydrateProjectInputSchema = z.object({
	uid: z.string(),
	source_project: z.string(),
});
export type HydrateProjectInput = z.infer<typeof HydrateProjectInputSchema>;
const HydrateProjectResponseSchema = BannerbearProject;
export type HydrateProjectResponse = z.infer<
	typeof HydrateProjectResponseSchema
>;

// ─── Templates ───────────────────────────────────────────────
const ListTemplatesInputSchema = PaginationInput;
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
const ListTemplatesResponseSchema = z.array(BannerbearTemplate);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

const GetTemplateInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;
const GetTemplateResponseSchema = BannerbearTemplate;
export type GetTemplateResponse = z.infer<typeof GetTemplateResponseSchema>;

const CreateTemplateInputSchema = z.object({
	name: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	project_id: z.string().optional(),
});
export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;
const CreateTemplateResponseSchema = BannerbearTemplate;
export type CreateTemplateResponse = z.infer<
	typeof CreateTemplateResponseSchema
>;

const DeleteTemplateInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;
const DeleteTemplateResponseSchema = z.object({ success: z.boolean() });
export type DeleteTemplateResponse = z.infer<
	typeof DeleteTemplateResponseSchema
>;

const ImportTemplateInputSchema = z.object({
	publication_id: z.string(),
	project_id: z.string().optional(),
});
export type ImportTemplateInput = z.infer<typeof ImportTemplateInputSchema>;
const ImportTemplateResponseSchema = BannerbearTemplate;
export type ImportTemplateResponse = z.infer<
	typeof ImportTemplateResponseSchema
>;

// ─── Template Sets ───────────────────────────────────────────
const ListTemplateSetsInputSchema = PaginationInput;
export type ListTemplateSetsInput = z.infer<typeof ListTemplateSetsInputSchema>;
const ListTemplateSetsResponseSchema = z.array(BannerbearTemplateSet);
export type ListTemplateSetsResponse = z.infer<
	typeof ListTemplateSetsResponseSchema
>;

const GetTemplateSetInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetTemplateSetInput = z.infer<typeof GetTemplateSetInputSchema>;
const GetTemplateSetResponseSchema = BannerbearTemplateSet;
export type GetTemplateSetResponse = z.infer<
	typeof GetTemplateSetResponseSchema
>;

const CreateTemplateSetInputSchema = z.object({
	name: z.string(),
	templates: z.array(z.string()),
	project_id: z.string().optional(),
});
export type CreateTemplateSetInput = z.infer<
	typeof CreateTemplateSetInputSchema
>;
const CreateTemplateSetResponseSchema = BannerbearTemplateSet;
export type CreateTemplateSetResponse = z.infer<
	typeof CreateTemplateSetResponseSchema
>;

const UpdateTemplateSetInputSchema = z.object({
	uid: z.string(),
	templates: z.array(z.string()),
	project_id: z.string().optional(),
});
export type UpdateTemplateSetInput = z.infer<
	typeof UpdateTemplateSetInputSchema
>;
const UpdateTemplateSetResponseSchema = BannerbearTemplateSet;
export type UpdateTemplateSetResponse = z.infer<
	typeof UpdateTemplateSetResponseSchema
>;

// ─── Images ──────────────────────────────────────────────────
const ListImagesInputSchema = PaginationInput;
export type ListImagesInput = z.infer<typeof ListImagesInputSchema>;
const ListImagesResponseSchema = z.array(BannerbearImage);
export type ListImagesResponse = z.infer<typeof ListImagesResponseSchema>;

const GetImageInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetImageInput = z.infer<typeof GetImageInputSchema>;
const GetImageResponseSchema = BannerbearImage;
export type GetImageResponse = z.infer<typeof GetImageResponseSchema>;

// ─── Videos ──────────────────────────────────────────────────
const ListVideosInputSchema = PaginationInput;
export type ListVideosInput = z.infer<typeof ListVideosInputSchema>;
const ListVideosResponseSchema = z.array(BannerbearVideo);
export type ListVideosResponse = z.infer<typeof ListVideosResponseSchema>;

const ListVideoTemplatesInputSchema = PaginationInput;
export type ListVideoTemplatesInput = z.infer<
	typeof ListVideoTemplatesInputSchema
>;
const ListVideoTemplatesResponseSchema = z.array(BannerbearVideoTemplate);
export type ListVideoTemplatesResponse = z.infer<
	typeof ListVideoTemplatesResponseSchema
>;

const CreateVideoTemplateInputSchema = z.object({
	name: z.string(),
	template: z.string(),
	project_id: z.string().optional(),
	input_media_url: z.string().optional(),
	frames: z.array(z.record(z.string(), z.unknown())).optional(),
	soundtrack_url: z.string().optional(),
	transition: z.string().optional(),
	transcription: z.record(z.string(), z.unknown()).optional(),
});
export type CreateVideoTemplateInput = z.infer<
	typeof CreateVideoTemplateInputSchema
>;
const CreateVideoTemplateResponseSchema = BannerbearVideoTemplate;
export type CreateVideoTemplateResponse = z.infer<
	typeof CreateVideoTemplateResponseSchema
>;

// ─── Animated GIFs ───────────────────────────────────────────
const ListAnimatedGifsInputSchema = PaginationInput;
export type ListAnimatedGifsInput = z.infer<typeof ListAnimatedGifsInputSchema>;
const ListAnimatedGifsResponseSchema = z.array(BannerbearAnimatedGif);
export type ListAnimatedGifsResponse = z.infer<
	typeof ListAnimatedGifsResponseSchema
>;

const GetAnimatedGifInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetAnimatedGifInput = z.infer<typeof GetAnimatedGifInputSchema>;
const GetAnimatedGifResponseSchema = BannerbearAnimatedGif;
export type GetAnimatedGifResponse = z.infer<
	typeof GetAnimatedGifResponseSchema
>;

// ─── Collections ─────────────────────────────────────────────
const ListCollectionsInputSchema = PaginationInput;
export type ListCollectionsInput = z.infer<typeof ListCollectionsInputSchema>;
const ListCollectionsResponseSchema = z.array(BannerbearCollection);
export type ListCollectionsResponse = z.infer<
	typeof ListCollectionsResponseSchema
>;

// ─── Screenshots ─────────────────────────────────────────────
const ListScreenshotsInputSchema = PaginationInput;
export type ListScreenshotsInput = z.infer<typeof ListScreenshotsInputSchema>;
const ListScreenshotsResponseSchema = z.array(BannerbearScreenshot);
export type ListScreenshotsResponse = z.infer<
	typeof ListScreenshotsResponseSchema
>;

const GetScreenshotInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetScreenshotInput = z.infer<typeof GetScreenshotInputSchema>;
const GetScreenshotResponseSchema = BannerbearScreenshot;
export type GetScreenshotResponse = z.infer<typeof GetScreenshotResponseSchema>;

// ─── Signed URLs ─────────────────────────────────────────────
const GetSignedBasesInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetSignedBasesInput = z.infer<typeof GetSignedBasesInputSchema>;
const GetSignedBasesResponseSchema = z.array(BannerbearSignedBase);
export type GetSignedBasesResponse = z.infer<
	typeof GetSignedBasesResponseSchema
>;

const CreateSignedBaseInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type CreateSignedBaseInput = z.infer<typeof CreateSignedBaseInputSchema>;
const CreateSignedBaseResponseSchema = BannerbearSignedBase;
export type CreateSignedBaseResponse = z.infer<
	typeof CreateSignedBaseResponseSchema
>;

// ─── Webhooks API ────────────────────────────────────────────
const GetWebhookInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;
const GetWebhookResponseSchema = BannerbearWebhookObj;
export type GetWebhookResponse = z.infer<typeof GetWebhookResponseSchema>;

const CreateWebhookInputSchema = z.object({
	url: z.string(),
	event: z.string().optional(),
	project_id: z.string().optional(),
});
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
const CreateWebhookResponseSchema = BannerbearWebhookObj;
export type CreateWebhookResponse = z.infer<typeof CreateWebhookResponseSchema>;

const DeleteWebhookInputSchema = z.object({
	uid: z.string(),
	project_id: z.string().optional(),
});
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;
const DeleteWebhookResponseSchema = z.object({ success: z.boolean() });
export type DeleteWebhookResponse = z.infer<typeof DeleteWebhookResponseSchema>;

// ─── Misc ────────────────────────────────────────────────────
const GetFontsInputSchema = z.object({});
export type GetFontsInput = z.infer<typeof GetFontsInputSchema>;
const GetFontsResponseSchema = z.array(BannerbearFont);
export type GetFontsResponse = z.infer<typeof GetFontsResponseSchema>;

const ListEffectsInputSchema = z.object({});
export type ListEffectsInput = z.infer<typeof ListEffectsInputSchema>;
const ListEffectsResponseSchema = z.array(BannerbearEffect);
export type ListEffectsResponse = z.infer<typeof ListEffectsResponseSchema>;

const JoinPdfsInputSchema = z.object({
	pdf_urls: z.array(z.string()),
	project_id: z.string().optional(),
	webhook_url: z.string().optional(),
	metadata: z.string().optional(),
});
export type JoinPdfsInput = z.infer<typeof JoinPdfsInputSchema>;
const JoinPdfsResponseSchema = BannerbearPdfJoin;
export type JoinPdfsResponse = z.infer<typeof JoinPdfsResponseSchema>;

// ─── Workflows ───────────────────────────────────────────────
const ListWorkflowsInputSchema = PaginationInput.pick({ page: true });
export type ListWorkflowsInput = z.infer<typeof ListWorkflowsInputSchema>;
const ListWorkflowsResponseSchema = z.array(BannerbearWorkflow);
export type ListWorkflowsResponse = z.infer<typeof ListWorkflowsResponseSchema>;

const GetWorkflowInputSchema = z.object({ uid: z.string() });
export type GetWorkflowInput = z.infer<typeof GetWorkflowInputSchema>;
const GetWorkflowResponseSchema = BannerbearWorkflow;
export type GetWorkflowResponse = z.infer<typeof GetWorkflowResponseSchema>;

const CreateWorkflowRunInputSchema = z.object({
	workflow: z.string(),
	inputs: z.record(z.string(), z.unknown()).optional(),
	webhook_url: z.string().optional(),
});
export type CreateWorkflowRunInput = z.infer<
	typeof CreateWorkflowRunInputSchema
>;
const CreateWorkflowRunResponseSchema = BannerbearWorkflowRun;
export type CreateWorkflowRunResponse = z.infer<
	typeof CreateWorkflowRunResponseSchema
>;

const GetWorkflowRunInputSchema = z.object({ uid: z.string() });
export type GetWorkflowRunInput = z.infer<typeof GetWorkflowRunInputSchema>;
const GetWorkflowRunResponseSchema = BannerbearWorkflowRun;
export type GetWorkflowRunResponse = z.infer<
	typeof GetWorkflowRunResponseSchema
>;

const ListWorkflowRunsInputSchema = PaginationInput.pick({ page: true });
export type ListWorkflowRunsInput = z.infer<typeof ListWorkflowRunsInputSchema>;
const ListWorkflowRunsResponseSchema = z.array(BannerbearWorkflowRun);
export type ListWorkflowRunsResponse = z.infer<
	typeof ListWorkflowRunsResponseSchema
>;

// ─── Aggregate types ─────────────────────────────────────────
export type BannerbearEndpointInputs = {
	getAccountInfo: GetAccountInfoInput;
	getAuth: GetAuthInput;
	listProjects: ListProjectsInput;
	getProject: GetProjectInput;
	createProject: CreateProjectInput;
	hydrateProject: HydrateProjectInput;
	listTemplates: ListTemplatesInput;
	getTemplate: GetTemplateInput;
	createTemplate: CreateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	importTemplate: ImportTemplateInput;
	listTemplateSets: ListTemplateSetsInput;
	getTemplateSet: GetTemplateSetInput;
	createTemplateSet: CreateTemplateSetInput;
	updateTemplateSet: UpdateTemplateSetInput;
	listImages: ListImagesInput;
	getImage: GetImageInput;
	listVideos: ListVideosInput;
	listVideoTemplates: ListVideoTemplatesInput;
	createVideoTemplate: CreateVideoTemplateInput;
	listAnimatedGifs: ListAnimatedGifsInput;
	getAnimatedGif: GetAnimatedGifInput;
	listCollections: ListCollectionsInput;
	listScreenshots: ListScreenshotsInput;
	getScreenshot: GetScreenshotInput;
	getSignedBases: GetSignedBasesInput;
	createSignedBase: CreateSignedBaseInput;
	getWebhook: GetWebhookInput;
	createWebhook: CreateWebhookInput;
	deleteWebhook: DeleteWebhookInput;
	getFonts: GetFontsInput;
	listEffects: ListEffectsInput;
	joinPdfs: JoinPdfsInput;
	listWorkflows: ListWorkflowsInput;
	getWorkflow: GetWorkflowInput;
	createWorkflowRun: CreateWorkflowRunInput;
	getWorkflowRun: GetWorkflowRunInput;
	listWorkflowRuns: ListWorkflowRunsInput;
};

export type BannerbearEndpointOutputs = {
	getAccountInfo: GetAccountInfoResponse;
	getAuth: GetAuthResponse;
	listProjects: ListProjectsResponse;
	getProject: GetProjectResponse;
	createProject: CreateProjectResponse;
	hydrateProject: HydrateProjectResponse;
	listTemplates: ListTemplatesResponse;
	getTemplate: GetTemplateResponse;
	createTemplate: CreateTemplateResponse;
	deleteTemplate: DeleteTemplateResponse;
	importTemplate: ImportTemplateResponse;
	listTemplateSets: ListTemplateSetsResponse;
	getTemplateSet: GetTemplateSetResponse;
	createTemplateSet: CreateTemplateSetResponse;
	updateTemplateSet: UpdateTemplateSetResponse;
	listImages: ListImagesResponse;
	getImage: GetImageResponse;
	listVideos: ListVideosResponse;
	listVideoTemplates: ListVideoTemplatesResponse;
	createVideoTemplate: CreateVideoTemplateResponse;
	listAnimatedGifs: ListAnimatedGifsResponse;
	getAnimatedGif: GetAnimatedGifResponse;
	listCollections: ListCollectionsResponse;
	listScreenshots: ListScreenshotsResponse;
	getScreenshot: GetScreenshotResponse;
	getSignedBases: GetSignedBasesResponse;
	createSignedBase: CreateSignedBaseResponse;
	getWebhook: GetWebhookResponse;
	createWebhook: CreateWebhookResponse;
	deleteWebhook: DeleteWebhookResponse;
	getFonts: GetFontsResponse;
	listEffects: ListEffectsResponse;
	joinPdfs: JoinPdfsResponse;
	listWorkflows: ListWorkflowsResponse;
	getWorkflow: GetWorkflowResponse;
	createWorkflowRun: CreateWorkflowRunResponse;
	getWorkflowRun: GetWorkflowRunResponse;
	listWorkflowRuns: ListWorkflowRunsResponse;
};

export const BannerbearEndpointInputSchemas = {
	getAccountInfo: GetAccountInfoInputSchema,
	getAuth: GetAuthInputSchema,
	listProjects: ListProjectsInputSchema,
	getProject: GetProjectInputSchema,
	createProject: CreateProjectInputSchema,
	hydrateProject: HydrateProjectInputSchema,
	listTemplates: ListTemplatesInputSchema,
	getTemplate: GetTemplateInputSchema,
	createTemplate: CreateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	importTemplate: ImportTemplateInputSchema,
	listTemplateSets: ListTemplateSetsInputSchema,
	getTemplateSet: GetTemplateSetInputSchema,
	createTemplateSet: CreateTemplateSetInputSchema,
	updateTemplateSet: UpdateTemplateSetInputSchema,
	listImages: ListImagesInputSchema,
	getImage: GetImageInputSchema,
	listVideos: ListVideosInputSchema,
	listVideoTemplates: ListVideoTemplatesInputSchema,
	createVideoTemplate: CreateVideoTemplateInputSchema,
	listAnimatedGifs: ListAnimatedGifsInputSchema,
	getAnimatedGif: GetAnimatedGifInputSchema,
	listCollections: ListCollectionsInputSchema,
	listScreenshots: ListScreenshotsInputSchema,
	getScreenshot: GetScreenshotInputSchema,
	getSignedBases: GetSignedBasesInputSchema,
	createSignedBase: CreateSignedBaseInputSchema,
	getWebhook: GetWebhookInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
	getFonts: GetFontsInputSchema,
	listEffects: ListEffectsInputSchema,
	joinPdfs: JoinPdfsInputSchema,
	listWorkflows: ListWorkflowsInputSchema,
	getWorkflow: GetWorkflowInputSchema,
	createWorkflowRun: CreateWorkflowRunInputSchema,
	getWorkflowRun: GetWorkflowRunInputSchema,
	listWorkflowRuns: ListWorkflowRunsInputSchema,
} as const;

export const BannerbearEndpointOutputSchemas = {
	getAccountInfo: GetAccountInfoResponseSchema,
	getAuth: GetAuthResponseSchema,
	listProjects: ListProjectsResponseSchema,
	getProject: GetProjectResponseSchema,
	createProject: CreateProjectResponseSchema,
	hydrateProject: HydrateProjectResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
	getTemplate: GetTemplateResponseSchema,
	createTemplate: CreateTemplateResponseSchema,
	deleteTemplate: DeleteTemplateResponseSchema,
	importTemplate: ImportTemplateResponseSchema,
	listTemplateSets: ListTemplateSetsResponseSchema,
	getTemplateSet: GetTemplateSetResponseSchema,
	createTemplateSet: CreateTemplateSetResponseSchema,
	updateTemplateSet: UpdateTemplateSetResponseSchema,
	listImages: ListImagesResponseSchema,
	getImage: GetImageResponseSchema,
	listVideos: ListVideosResponseSchema,
	listVideoTemplates: ListVideoTemplatesResponseSchema,
	createVideoTemplate: CreateVideoTemplateResponseSchema,
	listAnimatedGifs: ListAnimatedGifsResponseSchema,
	getAnimatedGif: GetAnimatedGifResponseSchema,
	listCollections: ListCollectionsResponseSchema,
	listScreenshots: ListScreenshotsResponseSchema,
	getScreenshot: GetScreenshotResponseSchema,
	getSignedBases: GetSignedBasesResponseSchema,
	createSignedBase: CreateSignedBaseResponseSchema,
	getWebhook: GetWebhookResponseSchema,
	createWebhook: CreateWebhookResponseSchema,
	deleteWebhook: DeleteWebhookResponseSchema,
	getFonts: GetFontsResponseSchema,
	listEffects: ListEffectsResponseSchema,
	joinPdfs: JoinPdfsResponseSchema,
	listWorkflows: ListWorkflowsResponseSchema,
	getWorkflow: GetWorkflowResponseSchema,
	createWorkflowRun: CreateWorkflowRunResponseSchema,
	getWorkflowRun: GetWorkflowRunResponseSchema,
	listWorkflowRuns: ListWorkflowRunsResponseSchema,
} as const;
