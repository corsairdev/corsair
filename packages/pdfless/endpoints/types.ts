import { z } from 'zod';

export const GetWorkspaceInputSchema = z.object({});

export const WorkspaceSchema = z
	.object({
		name: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		created: z.string().nullable().optional(),
		modified: z.string().nullable().optional(),
		quota: z.number().nullable().optional(),
		remainingQuota: z.number().nullable().optional(),
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
		name: z.string().nullable().optional(),
		imagePreviewUrl: z.string().nullable().optional(),
		pdfPreviewUrl: z.string().nullable().optional(),
		created: z.string().nullable().optional(),
		modified: z.string().nullable().optional(),
	})
	.loose();

export const ListTemplatesResponseSchema = z.object({
	templates: z.array(TemplateSchema),
});

export const GeneratePdfInputSchema = z.object({
	// .NET Guid: any hex GUID, not only RFC 4122 variants.
	template_id: z.guid().describe('Template id from templates.list.'),
	// unknown: the payload's keys are the variables the user's own template uses.
	payload: z
		.record(z.string(), z.unknown())
		.describe(
			'Values for the template variables, e.g. { "customer": { "name": "Ada" } }.',
		),
	reference_id: z
		.string()
		.min(1)
		.optional()
		.describe('Your own reference for the document, returned with it.'),
	workspaceId: z
		.number()
		.int()
		.optional()
		.describe(
			'Workspace id. The API key already selects a workspace, so this is rarely needed.',
		),
	encryption_user_password: z
		.string()
		.min(1)
		.optional()
		.describe('Password needed to open the PDF.'),
	encryption_owner_password: z
		.string()
		.min(1)
		.optional()
		.describe('Owner password that controls the permissions below.'),
	encryption_allow_printing: z.boolean().optional(),
	encryption_allow_modifying: z.boolean().optional(),
	encryption_allow_modify_annotations: z.boolean().optional(),
	encryption_allow_content_copying: z.boolean().optional(),
	encryption_allow_screenreaders: z.boolean().optional(),
	encryption_allow_form_filling: z.boolean().optional(),
	encryption_allow_document_assembly: z.boolean().optional(),
});

export const GeneratePdfResponseSchema = z
	.object({
		status: z.string().nullable().optional(),
		data: z
			.object({
				reference_id: z.string().nullable().optional(),
				template_id: z.string().nullable().optional(),
				download_url: z.string(),
				expires: z.string().nullable().optional(),
				created_at: z.string().nullable().optional(),
			})
			.loose(),
	})
	.loose();

export type GeneratePdfInput = z.infer<typeof GeneratePdfInputSchema>;
export type GeneratePdfResponse = z.infer<typeof GeneratePdfResponseSchema>;
export type GetWorkspaceInput = z.infer<typeof GetWorkspaceInputSchema>;
export type GetWorkspaceResponse = z.infer<typeof GetWorkspaceResponseSchema>;
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export const PdfLessEndpointInputSchemas = {
	'workspace.get': GetWorkspaceInputSchema,
	'templates.list': ListTemplatesInputSchema,
	'pdfs.generate': GeneratePdfInputSchema,
};

export const PdfLessEndpointOutputSchemas = {
	'workspace.get': GetWorkspaceResponseSchema,
	'templates.list': ListTemplatesResponseSchema,
	'pdfs.generate': GeneratePdfResponseSchema,
};
