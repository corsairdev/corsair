import { z } from 'zod';

export const GetWorkspaceInputSchema = z.object({});

export const WorkspaceSchema = z
	.object({
		name: z.string().optional(),
		active: z.boolean().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
		quota: z.number().optional(),
		remainingQuota: z.number().optional(),
	})
	.loose();

export const GetWorkspaceResponseSchema = WorkspaceSchema;

export const ListTemplatesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).optional(),
});

export const TemplateSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		imagePreviewUrl: z.string().optional(),
		pdfPreviewUrl: z.string().optional(),
		created: z.string().optional(),
		modified: z.string().optional(),
	})
	.loose();

export const ListTemplatesResponseSchema = z.object({
	templates: z.array(TemplateSchema),
});

export type GetWorkspaceInput = z.infer<typeof GetWorkspaceInputSchema>;
export type GetWorkspaceResponse = z.infer<typeof GetWorkspaceResponseSchema>;
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export const PdfLessEndpointInputSchemas = {
	'workspace.get': GetWorkspaceInputSchema,
	'templates.list': ListTemplatesInputSchema,
};

export const PdfLessEndpointOutputSchemas = {
	'workspace.get': GetWorkspaceResponseSchema,
	'templates.list': ListTemplatesResponseSchema,
};
