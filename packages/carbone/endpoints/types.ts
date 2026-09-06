import { z } from 'zod';

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
		id: z.string().optional(),
		templateId: z.string().optional(),
		versionId: z.string().optional(),
		type: z.string().optional(),
		size: z.number().optional(),
		createdAt: z.number().optional(),
	}),
});
export type UploadTemplateOutput = z.infer<typeof UploadTemplateOutputSchema>;

export const GetTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
});
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = z.object({
	templateId: z.string(),
	downloadUrl: z.string(),
	success: z.boolean().optional(),
});
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
});
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

export const DeleteTemplateOutputSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
});
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

// ─── Render ──────────────────────────────────────────────────────────────────

export const RenderTemplateInputSchema = z.object({
	templateId: z.string().min(1, 'Template ID is required'),
	data: z.record(z.string(), z.unknown()),
	convertTo: z.string().optional(),
	formatName: z.string().optional(),
	lang: z.string().optional(),
	timezone: z.string().optional(),
	currency: z.string().optional(),
	translations: z
		.record(z.string(), z.record(z.string(), z.string()))
		.optional(),
	enum: z.record(z.string(), z.record(z.string(), z.string())).optional(),
	variable: z.record(z.string(), z.unknown()).optional(),
	complement: z.record(z.string(), z.unknown()).optional(),
	hardRefresh: z.boolean().optional(),
});
export type RenderTemplateInput = z.infer<typeof RenderTemplateInputSchema>;

export const RenderTemplateOutputSchema = z.object({
	success: z.boolean(),
	data: z.object({
		renderId: z.string(),
	}),
});
export type RenderTemplateOutput = z.infer<typeof RenderTemplateOutputSchema>;

export const RenderInlineInputSchema = z.object({
	template: z.string().min(1, 'Template payload (base64 string) is required'),
	data: z.record(z.string(), z.unknown()),
	convertTo: z.string().optional(),
	formatName: z.string().optional(),
	lang: z.string().optional(),
	timezone: z.string().optional(),
	currency: z.string().optional(),
	translations: z
		.record(z.string(), z.record(z.string(), z.string()))
		.optional(),
	enum: z.record(z.string(), z.record(z.string(), z.string())).optional(),
	variable: z.record(z.string(), z.unknown()).optional(),
	complement: z.record(z.string(), z.unknown()).optional(),
	hardRefresh: z.boolean().optional(),
});
export type RenderInlineInput = z.infer<typeof RenderInlineInputSchema>;

export const RenderInlineOutputSchema = z.object({
	success: z.boolean(),
	data: z.object({
		renderId: z.string(),
	}),
});
export type RenderInlineOutput = z.infer<typeof RenderInlineOutputSchema>;

export const GetRenderInputSchema = z.object({
	renderId: z.string().min(1, 'Render ID is required'),
});
export type GetRenderInput = z.infer<typeof GetRenderInputSchema>;

export const GetRenderOutputSchema = z.object({
	renderId: z.string(),
	downloadUrl: z.string(),
});
export type GetRenderOutput = z.infer<typeof GetRenderOutputSchema>;

// ─── Endpoint Schemas & Mapping ──────────────────────────────────────────────

export const CarboneEndpointInputSchemas = {
	getStatus: GetStatusInputSchema,
	uploadTemplate: UploadTemplateInputSchema,
	getTemplate: GetTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	render: RenderTemplateInputSchema,
	renderInline: RenderInlineInputSchema,
	getRender: GetRenderInputSchema,
} as const;

export const CarboneEndpointOutputSchemas = {
	getStatus: GetStatusOutputSchema,
	uploadTemplate: UploadTemplateOutputSchema,
	getTemplate: GetTemplateOutputSchema,
	deleteTemplate: DeleteTemplateOutputSchema,
	render: RenderTemplateOutputSchema,
	renderInline: RenderInlineOutputSchema,
	getRender: GetRenderOutputSchema,
} as const;

export type CarboneEndpointInputs = {
	getStatus: GetStatusInput;
	uploadTemplate: UploadTemplateInput;
	getTemplate: GetTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	render: RenderTemplateInput;
	renderInline: RenderInlineInput;
	getRender: GetRenderInput;
};

export type CarboneEndpointOutputs = {
	getStatus: GetStatusOutput;
	uploadTemplate: UploadTemplateOutput;
	getTemplate: GetTemplateOutput;
	deleteTemplate: DeleteTemplateOutput;
	render: RenderTemplateOutput;
	renderInline: RenderInlineOutput;
	getRender: GetRenderOutput;
};
