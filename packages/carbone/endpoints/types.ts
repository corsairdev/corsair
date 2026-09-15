import { z } from 'zod';
import {
	CarboneCategory,
	CarboneTag,
	CarboneTemplate,
} from '../schema/database';

// ─── JSON Types ──────────────────────────────────────────────────────────────

export const JsonPrimitiveSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);
export type JsonPrimitive = z.infer<typeof JsonPrimitiveSchema>;

export type JsonValue =
	| JsonPrimitive
	| { [key: string]: JsonValue }
	| JsonValue[];

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		JsonPrimitiveSchema,
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

export const JsonObjectSchema = z.record(z.string(), JsonValueSchema);
export type JsonObject = z.infer<typeof JsonObjectSchema>;

// ─── Status ──────────────────────────────────────────────────────────────────

export const GetStatusInputSchema = z.object({});
export type GetStatusInput = z.infer<typeof GetStatusInputSchema>;

export const GetStatusOutputSchema = z.object({
	success: z.boolean(),
	code: z.number().optional(),
	message: z.string(),
	version: z.string().optional(),
});
export type GetStatusOutput = z.infer<typeof GetStatusOutputSchema>;

// ─── Templates ───────────────────────────────────────────────────────────────

export const UploadTemplateInputSchema = z.object({
	template: z.string().min(1, 'Template payload (base64 string) is required'),
});
export type UploadTemplateInput = z.infer<typeof UploadTemplateInputSchema>;

export const UploadTemplateOutputSchema = z.object({
	success: z.boolean(),
	data: z.object({
		templateId: z.string().optional(),
		id: z.string().optional(),
		versionId: z.string().optional(),
		templateExtension: z.string().optional(),
		type: z.string().optional(),
		size: z.number().optional(),
		createdAt: z.number().optional(),
	}),
});
export type UploadTemplateOutput = z.infer<typeof UploadTemplateOutputSchema>;

export const ListTemplatesInputSchema = z.object({
	templateId: z.string().optional(),
	versionId: z.string().optional(),
	category: z.string().optional(),
	search: z.string().optional(),
	cursor: z.union([z.string(), z.number()]).optional(),
});
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = z.object({
	success: z.boolean(),
	data: z.array(CarboneTemplate),
	hasMore: z.boolean().optional(),
	cursor: z.union([z.string(), z.number()]).optional(),
});
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const DownloadTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
});
export type DownloadTemplateInput = z.infer<typeof DownloadTemplateInputSchema>;

export const DownloadTemplateOutputSchema = z.object({
	templateId: z.string(),
	content: z.string(),
	success: z.boolean(),
});
export type DownloadTemplateOutput = z.infer<
	typeof DownloadTemplateOutputSchema
>;

export const UpdateTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
	name: z.string().optional(),
	category: z.string().optional(),
	comment: z.string().optional(),
	tags: z.array(z.string()).optional(),
	deployedAt: z.number().optional(),
	expireAt: z.number().optional(),
});
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;

export const UpdateTemplateOutputSchema = z.object({
	success: z.boolean(),
	data: z
		.object({
			name: z.string().optional(),
			category: z.string().optional(),
			comment: z.string().optional(),
			tags: z.array(z.string()).optional(),
			deployedAt: z.number().nullable().optional(),
			versionId: z.string().optional(),
			id: z.string().nullable().optional(),
		})
		.optional(),
});
export type UpdateTemplateOutput = z.infer<typeof UpdateTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
});
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

export const DeleteTemplateOutputSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
});
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

export const ListTemplateCategoriesInputSchema = z.object({});
export type ListTemplateCategoriesInput = z.infer<
	typeof ListTemplateCategoriesInputSchema
>;

export const ListTemplateCategoriesOutputSchema = z.object({
	success: z.boolean(),
	data: z.array(CarboneCategory),
});
export type ListTemplateCategoriesOutput = z.infer<
	typeof ListTemplateCategoriesOutputSchema
>;

export const ListTemplateTagsInputSchema = z.object({});
export type ListTemplateTagsInput = z.infer<typeof ListTemplateTagsInputSchema>;

export const ListTemplateTagsOutputSchema = z.object({
	success: z.boolean(),
	data: z.array(CarboneTag),
});
export type ListTemplateTagsOutput = z.infer<
	typeof ListTemplateTagsOutputSchema
>;

// ─── Render ──────────────────────────────────────────────────────────────────

export const GenerateReportInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
	data: JsonObjectSchema,
	convertTo: z.string().optional(),
	formatName: z.string().optional(),
	lang: z.string().optional(),
	timezone: z.string().optional(),
	currency: z.string().optional(),
	translations: z
		.record(z.string(), z.record(z.string(), z.string()))
		.optional(),
	enum: z.record(z.string(), z.record(z.string(), z.string())).optional(),
	variable: JsonObjectSchema.optional(),
	complement: JsonObjectSchema.optional(),
	hardRefresh: z.boolean().optional(),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export const GenerateReportOutputSchema = z.object({
	success: z.boolean(),
	data: z.object({
		renderId: z.string(),
	}),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export const RenderTemplateDirectInputSchema = z.object({
	template: z.string().min(1, 'Template payload (base64 string) is required'),
	data: JsonObjectSchema,
	convertTo: z.string().optional(),
	formatName: z.string().optional(),
	lang: z.string().optional(),
	timezone: z.string().optional(),
	currency: z.string().optional(),
	translations: z
		.record(z.string(), z.record(z.string(), z.string()))
		.optional(),
	enum: z.record(z.string(), z.record(z.string(), z.string())).optional(),
	variable: JsonObjectSchema.optional(),
	complement: JsonObjectSchema.optional(),
	hardRefresh: z.boolean().optional(),
});
export type RenderTemplateDirectInput = z.infer<
	typeof RenderTemplateDirectInputSchema
>;

export const RenderTemplateDirectOutputSchema = z.object({
	success: z.boolean(),
	data: z.object({
		renderId: z.string(),
	}),
});
export type RenderTemplateDirectOutput = z.infer<
	typeof RenderTemplateDirectOutputSchema
>;

// ─── Version ─────────────────────────────────────────────────────────────────

export const SetApiVersionInputSchema = z.object({
	version: z.string().min(1, 'API version string is required (e.g. "5")'),
});
export type SetApiVersionInput = z.infer<typeof SetApiVersionInputSchema>;

export const SetApiVersionOutputSchema = z.object({
	success: z.boolean(),
	version: z.string(),
	message: z.string(),
});
export type SetApiVersionOutput = z.infer<typeof SetApiVersionOutputSchema>;

// ─── Endpoint Schemas & Mapping ──────────────────────────────────────────────

export const CarboneEndpointInputSchemas = {
	getStatus: GetStatusInputSchema,
	uploadTemplate: UploadTemplateInputSchema,
	listTemplates: ListTemplatesInputSchema,
	downloadTemplate: DownloadTemplateInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	listCategories: ListTemplateCategoriesInputSchema,
	listTags: ListTemplateTagsInputSchema,
	generateReport: GenerateReportInputSchema,
	renderDirect: RenderTemplateDirectInputSchema,
	setApiVersion: SetApiVersionInputSchema,
} as const;

export const CarboneEndpointOutputSchemas = {
	getStatus: GetStatusOutputSchema,
	uploadTemplate: UploadTemplateOutputSchema,
	listTemplates: ListTemplatesOutputSchema,
	downloadTemplate: DownloadTemplateOutputSchema,
	updateTemplate: UpdateTemplateOutputSchema,
	deleteTemplate: DeleteTemplateOutputSchema,
	listCategories: ListTemplateCategoriesOutputSchema,
	listTags: ListTemplateTagsOutputSchema,
	generateReport: GenerateReportOutputSchema,
	renderDirect: RenderTemplateDirectOutputSchema,
	setApiVersion: SetApiVersionOutputSchema,
} as const;

export type CarboneEndpointInputs = {
	getStatus: GetStatusInput;
	uploadTemplate: UploadTemplateInput;
	listTemplates: ListTemplatesInput;
	downloadTemplate: DownloadTemplateInput;
	updateTemplate: UpdateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	listCategories: ListTemplateCategoriesInput;
	listTags: ListTemplateTagsInput;
	generateReport: GenerateReportInput;
	renderDirect: RenderTemplateDirectInput;
	setApiVersion: SetApiVersionInput;
};

export type CarboneEndpointOutputs = {
	getStatus: GetStatusOutput;
	uploadTemplate: UploadTemplateOutput;
	listTemplates: ListTemplatesOutput;
	downloadTemplate: DownloadTemplateOutput;
	updateTemplate: UpdateTemplateOutput;
	deleteTemplate: DeleteTemplateOutput;
	listCategories: ListTemplateCategoriesOutput;
	listTags: ListTemplateTagsOutput;
	generateReport: GenerateReportOutput;
	renderDirect: RenderTemplateDirectOutput;
	setApiVersion: SetApiVersionOutput;
};
