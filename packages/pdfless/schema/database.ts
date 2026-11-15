import { z } from 'zod';

/**
 * WorkspaceDto from the official PDFLess client.
 * https://github.com/Pdfless/pdfless-python/blob/master/pdfless_api/models/workspace_dto.py
 * The model has no id. name is the row key when the API sends one.
 */
export const PdfLessWorkspaceEntity = z.object({
	name: z.string().min(1),
	active: z.boolean().optional(),
	created: z.string().optional(),
	modified: z.string().optional(),
	quota: z.number().optional(),
	remainingQuota: z.number().optional(),
});

export type PdfLessWorkspaceEntity = z.infer<typeof PdfLessWorkspaceEntity>;

/**
 * DocumentTemplateDto from the official PDFLess client.
 * JSON names are id, name, imagePreviewUrl, pdfPreviewUrl, created, modified.
 */
export const PdfLessTemplateEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	imagePreviewUrl: z.string().optional(),
	pdfPreviewUrl: z.string().optional(),
	created: z.string().optional(),
	modified: z.string().optional(),
});

export type PdfLessTemplateEntity = z.infer<typeof PdfLessTemplateEntity>;
