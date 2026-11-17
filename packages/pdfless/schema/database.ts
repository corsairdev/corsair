import { z } from 'zod';

/**
 * WorkspaceDto from the official PDFLess client.
 * https://github.com/Pdfless/pdfless-python/blob/master/pdfless_api/models/workspace_dto.py
 * The model has no id. name is the row key when the API sends one.
 */
export const PdfLessWorkspaceEntity = z.object({
	name: z.string().min(1),
	active: z.boolean().nullish(),
	created: z.string().nullish(),
	modified: z.string().nullish(),
	quota: z.number().nullish(),
	remainingQuota: z.number().nullish(),
});

export type PdfLessWorkspaceEntity = z.infer<typeof PdfLessWorkspaceEntity>;

/**
 * DocumentTemplateDto from the official PDFLess client.
 * JSON names are id, name, imagePreviewUrl, pdfPreviewUrl, created, modified.
 */
export const PdfLessTemplateEntity = z.object({
	id: z.string().min(1),
	name: z.string().nullish(),
	imagePreviewUrl: z.string().nullish(),
	pdfPreviewUrl: z.string().nullish(),
	created: z.string().nullish(),
	modified: z.string().nullish(),
});

export type PdfLessTemplateEntity = z.infer<typeof PdfLessTemplateEntity>;
