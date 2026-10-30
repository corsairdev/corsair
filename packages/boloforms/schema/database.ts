import { z } from 'zod';

/**
 * BoloForms Signature document row.
 *
 * Official OpenAPI (`DocumentsResponse.documents[]`):
 * https://bolosign-developer-docs.readme.io/reference/get_get-documents-1
 *   documentId, name, createdAt, status
 *
 * Live GET /signature/get-documents also returns `documentName` (seen in
 * contributor workspace runs). `signingType` is the documented send-for-signing
 * discriminator: FORM_TEMPLATE | PDF_TEMPLATE
 * (https://signature-docs.boloforms.com/api-guides/send-form-for-signing/sending-for-signing).
 */
export const BoloformsDocument = z
	.object({
		documentId: z.string(),
		name: z.string().optional(),
		documentName: z.string().optional(),
		status: z.string().optional(),
		signingType: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

/**
 * OpenAPI pagination block on DocumentsResponse.
 * https://bolosign-developer-docs.readme.io/reference/get_get-documents-1
 *
 * Live list responses often omit this and use documentsCount/formCount instead.
 */
export const BoloformsDocumentsPagination = z.object({
	currentPage: z.number().optional(),
	totalPages: z.number().optional(),
	totalDocuments: z.number().optional(),
});

export type BoloformsDocument = z.infer<typeof BoloformsDocument>;
export type BoloformsDocumentsPagination = z.infer<
	typeof BoloformsDocumentsPagination
>;
