import { z } from 'zod';
import {
	BannerbearAccount,
	BannerbearAnimation,
	BannerbearAnimationTemplate,
	BannerbearImage,
	BannerbearInstantUrl,
	BannerbearPdfJoin,
	BannerbearTemplate,
	BannerbearWebhookObj,
	BannerbearWorkflow,
	BannerbearWorkflowRun,
} from '../schema/database';

const PageInput = z.object({
	page: z.number().optional(),
});

const GetAccountInfoInputSchema = z.object({});
export type GetAccountInfoInput = z.infer<typeof GetAccountInfoInputSchema>;
const GetAccountInfoResponseSchema = BannerbearAccount;
export type GetAccountInfoResponse = z.infer<
	typeof GetAccountInfoResponseSchema
>;

const GetAuthInputSchema = z.object({});
export type GetAuthInput = z.infer<typeof GetAuthInputSchema>;
const GetAuthResponseSchema = BannerbearAccount;
export type GetAuthResponse = z.infer<typeof GetAuthResponseSchema>;

const ListTemplatesInputSchema = PageInput;
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
const ListTemplatesResponseSchema = z.array(BannerbearTemplate);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

const GetTemplateInputSchema = z.object({
	uid: z.string(),
});
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;
const GetTemplateResponseSchema = BannerbearTemplate;
export type GetTemplateResponse = z.infer<typeof GetTemplateResponseSchema>;

const CreateTemplateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	tags: z.array(z.string()).optional(),
	config: z.record(z.string(), z.unknown()).optional(),
});
export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;
const CreateTemplateResponseSchema = BannerbearTemplate;
export type CreateTemplateResponse = z.infer<
	typeof CreateTemplateResponseSchema
>;

const DeleteTemplateInputSchema = z.object({
	uid: z.string(),
});
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;
const DeleteTemplateResponseSchema = z.object({ success: z.boolean() });
export type DeleteTemplateResponse = z.infer<
	typeof DeleteTemplateResponseSchema
>;

const ImportTemplateInputSchema = z.object({
	publication_id: z.string(),
});
export type ImportTemplateInput = z.infer<typeof ImportTemplateInputSchema>;
const ImportTemplateResponseSchema = BannerbearTemplate;
export type ImportTemplateResponse = z.infer<
	typeof ImportTemplateResponseSchema
>;

const ListImagesInputSchema = PageInput;
export type ListImagesInput = z.infer<typeof ListImagesInputSchema>;
const ListImagesResponseSchema = z.array(BannerbearImage);
export type ListImagesResponse = z.infer<typeof ListImagesResponseSchema>;

const GetImageInputSchema = z.object({
	uid: z.string(),
});
export type GetImageInput = z.infer<typeof GetImageInputSchema>;
const GetImageResponseSchema = BannerbearImage;
export type GetImageResponse = z.infer<typeof GetImageResponseSchema>;

const CreateImageInputSchema = z.object({
	template: z.string(),
	modifications: z.record(z.string(), z.unknown()),
	metadata: z.string().optional(),
});
export type CreateImageInput = z.infer<typeof CreateImageInputSchema>;
const CreateImageResponseSchema = BannerbearImage;
export type CreateImageResponse = z.infer<typeof CreateImageResponseSchema>;

const ListAnimationsInputSchema = PageInput;
export type ListAnimationsInput = z.infer<typeof ListAnimationsInputSchema>;
const ListAnimationsResponseSchema = z.array(BannerbearAnimation);
export type ListAnimationsResponse = z.infer<
	typeof ListAnimationsResponseSchema
>;

const GetAnimationInputSchema = z.object({
	uid: z.string(),
});
export type GetAnimationInput = z.infer<typeof GetAnimationInputSchema>;
const GetAnimationResponseSchema = BannerbearAnimation;
export type GetAnimationResponse = z.infer<typeof GetAnimationResponseSchema>;

const CreateAnimationInputSchema = z.object({
	template: z.string(),
	modifications: z.record(z.string(), z.unknown()),
	formats: z.array(z.enum(['mp4', 'mov'])).optional(),
	metadata: z.string().optional(),
});
export type CreateAnimationInput = z.infer<typeof CreateAnimationInputSchema>;
const CreateAnimationResponseSchema = BannerbearAnimation;
export type CreateAnimationResponse = z.infer<
	typeof CreateAnimationResponseSchema
>;

const ListAnimationTemplatesInputSchema = PageInput;
export type ListAnimationTemplatesInput = z.infer<
	typeof ListAnimationTemplatesInputSchema
>;
const ListAnimationTemplatesResponseSchema = z.array(
	BannerbearAnimationTemplate,
);
export type ListAnimationTemplatesResponse = z.infer<
	typeof ListAnimationTemplatesResponseSchema
>;

const GetAnimationTemplateInputSchema = z.object({
	uid: z.string(),
});
export type GetAnimationTemplateInput = z.infer<
	typeof GetAnimationTemplateInputSchema
>;
const GetAnimationTemplateResponseSchema = BannerbearAnimationTemplate;
export type GetAnimationTemplateResponse = z.infer<
	typeof GetAnimationTemplateResponseSchema
>;

const CreateAnimationTemplateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	frame_rate: z.union([z.literal(24), z.literal(30), z.literal(60)]).optional(),
});
export type CreateAnimationTemplateInput = z.infer<
	typeof CreateAnimationTemplateInputSchema
>;
const CreateAnimationTemplateResponseSchema = BannerbearAnimationTemplate;
export type CreateAnimationTemplateResponse = z.infer<
	typeof CreateAnimationTemplateResponseSchema
>;

const ListInstantUrlsInputSchema = PageInput;
export type ListInstantUrlsInput = z.infer<typeof ListInstantUrlsInputSchema>;
const ListInstantUrlsResponseSchema = z.array(BannerbearInstantUrl);
export type ListInstantUrlsResponse = z.infer<
	typeof ListInstantUrlsResponseSchema
>;

const CreateInstantUrlInputSchema = z.object({
	name: z.string(),
	template: z.string(),
	mode: z.enum(['encoded', 'named_params']).optional(),
	security: z.enum(['signed', 'open']).optional(),
	status: z.enum(['active', 'disabled']).optional(),
	scale: z
		.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
		.optional(),
	rate_limit: z.boolean().optional(),
	template_version: z.number().nullable().optional(),
	max_renders: z.number().nullable().optional(),
	expires_at: z.string().nullable().optional(),
});
export type CreateInstantUrlInput = z.infer<typeof CreateInstantUrlInputSchema>;
const CreateInstantUrlResponseSchema = BannerbearInstantUrl;
export type CreateInstantUrlResponse = z.infer<
	typeof CreateInstantUrlResponseSchema
>;

const GetWebhookInputSchema = z.object({
	uid: z.string(),
});
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;
const GetWebhookResponseSchema = BannerbearWebhookObj;
export type GetWebhookResponse = z.infer<typeof GetWebhookResponseSchema>;

const CreateWebhookInputSchema = z.object({
	name: z.string(),
	url: z.string(),
	resource: z
		.enum(['image', 'batch', 'tool_job', 'workflow_run', 'animation'])
		.optional(),
	event: z.enum(['all_events', 'completed', 'failed']).optional(),
	status: z.enum(['active', 'disabled']).optional(),
	scope: z.enum(['all_templates', 'specific_templates']).optional(),
	templates: z.array(z.string()).optional(),
});
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
const CreateWebhookResponseSchema = BannerbearWebhookObj;
export type CreateWebhookResponse = z.infer<typeof CreateWebhookResponseSchema>;

const DeleteWebhookInputSchema = z.object({
	uid: z.string(),
});
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;
const DeleteWebhookResponseSchema = z.object({ success: z.boolean() });
export type DeleteWebhookResponse = z.infer<typeof DeleteWebhookResponseSchema>;

const JoinPdfsInputSchema = z.object({
	urls: z.array(z.string()),
	metadata: z.string().optional(),
});
export type JoinPdfsInput = z.infer<typeof JoinPdfsInputSchema>;
const JoinPdfsResponseSchema = BannerbearPdfJoin;
export type JoinPdfsResponse = z.infer<typeof JoinPdfsResponseSchema>;

const ListWorkflowsInputSchema = PageInput;
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

const ListWorkflowRunsInputSchema = PageInput;
export type ListWorkflowRunsInput = z.infer<typeof ListWorkflowRunsInputSchema>;
const ListWorkflowRunsResponseSchema = z.array(BannerbearWorkflowRun);
export type ListWorkflowRunsResponse = z.infer<
	typeof ListWorkflowRunsResponseSchema
>;

export type BannerbearEndpointInputs = {
	getAccountInfo: GetAccountInfoInput;
	getAuth: GetAuthInput;
	listTemplates: ListTemplatesInput;
	getTemplate: GetTemplateInput;
	createTemplate: CreateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	importTemplate: ImportTemplateInput;
	listImages: ListImagesInput;
	getImage: GetImageInput;
	createImage: CreateImageInput;
	listAnimations: ListAnimationsInput;
	getAnimation: GetAnimationInput;
	createAnimation: CreateAnimationInput;
	listAnimationTemplates: ListAnimationTemplatesInput;
	getAnimationTemplate: GetAnimationTemplateInput;
	createAnimationTemplate: CreateAnimationTemplateInput;
	listInstantUrls: ListInstantUrlsInput;
	createInstantUrl: CreateInstantUrlInput;
	getWebhook: GetWebhookInput;
	createWebhook: CreateWebhookInput;
	deleteWebhook: DeleteWebhookInput;
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
	listTemplates: ListTemplatesResponse;
	getTemplate: GetTemplateResponse;
	createTemplate: CreateTemplateResponse;
	deleteTemplate: DeleteTemplateResponse;
	importTemplate: ImportTemplateResponse;
	listImages: ListImagesResponse;
	getImage: GetImageResponse;
	createImage: CreateImageResponse;
	listAnimations: ListAnimationsResponse;
	getAnimation: GetAnimationResponse;
	createAnimation: CreateAnimationResponse;
	listAnimationTemplates: ListAnimationTemplatesResponse;
	getAnimationTemplate: GetAnimationTemplateResponse;
	createAnimationTemplate: CreateAnimationTemplateResponse;
	listInstantUrls: ListInstantUrlsResponse;
	createInstantUrl: CreateInstantUrlResponse;
	getWebhook: GetWebhookResponse;
	createWebhook: CreateWebhookResponse;
	deleteWebhook: DeleteWebhookResponse;
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
	listTemplates: ListTemplatesInputSchema,
	getTemplate: GetTemplateInputSchema,
	createTemplate: CreateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	importTemplate: ImportTemplateInputSchema,
	listImages: ListImagesInputSchema,
	getImage: GetImageInputSchema,
	createImage: CreateImageInputSchema,
	listAnimations: ListAnimationsInputSchema,
	getAnimation: GetAnimationInputSchema,
	createAnimation: CreateAnimationInputSchema,
	listAnimationTemplates: ListAnimationTemplatesInputSchema,
	getAnimationTemplate: GetAnimationTemplateInputSchema,
	createAnimationTemplate: CreateAnimationTemplateInputSchema,
	listInstantUrls: ListInstantUrlsInputSchema,
	createInstantUrl: CreateInstantUrlInputSchema,
	getWebhook: GetWebhookInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
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
	listTemplates: ListTemplatesResponseSchema,
	getTemplate: GetTemplateResponseSchema,
	createTemplate: CreateTemplateResponseSchema,
	deleteTemplate: DeleteTemplateResponseSchema,
	importTemplate: ImportTemplateResponseSchema,
	listImages: ListImagesResponseSchema,
	getImage: GetImageResponseSchema,
	createImage: CreateImageResponseSchema,
	listAnimations: ListAnimationsResponseSchema,
	getAnimation: GetAnimationResponseSchema,
	createAnimation: CreateAnimationResponseSchema,
	listAnimationTemplates: ListAnimationTemplatesResponseSchema,
	getAnimationTemplate: GetAnimationTemplateResponseSchema,
	createAnimationTemplate: CreateAnimationTemplateResponseSchema,
	listInstantUrls: ListInstantUrlsResponseSchema,
	createInstantUrl: CreateInstantUrlResponseSchema,
	getWebhook: GetWebhookResponseSchema,
	createWebhook: CreateWebhookResponseSchema,
	deleteWebhook: DeleteWebhookResponseSchema,
	joinPdfs: JoinPdfsResponseSchema,
	listWorkflows: ListWorkflowsResponseSchema,
	getWorkflow: GetWorkflowResponseSchema,
	createWorkflowRun: CreateWorkflowRunResponseSchema,
	getWorkflowRun: GetWorkflowRunResponseSchema,
	listWorkflowRuns: ListWorkflowRunsResponseSchema,
} as const;
