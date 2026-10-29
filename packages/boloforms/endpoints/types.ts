import { z } from 'zod';
import {
	BoloformsDocument,
	BoloformsDocumentsPagination,
} from '../schema/database';

/**
 * GET /signature/get-documents query + required workspace header.
 * Docs: https://bolosign-developer-docs.readme.io/reference/get_get-documents-1
 *
 * `workspaceid` is a required header in OpenAPI; we take it as `workspaceId`
 * and the client sends it as `workspaceid`.
 */
const GetDocumentsListInputSchema = z.object({
	workspaceId: z.string().min(1),
	query: z.string().optional(),
	sortOrder: z.string().optional(),
	limit: z.string().optional(),
	documentId: z.string().optional(),
	dateTo: z.string().optional(),
	dateFrom: z.string().optional(),
	page: z.string().optional(),
	sortBy: z.string().optional(),
	filter: z.string().optional(),
});

export type GetDocumentsListInput = z.infer<typeof GetDocumentsListInputSchema>;

/**
 * Live envelope fields (message / formCount / documentsCount) plus optional
 * OpenAPI pagination. Validated against live empty-list responses and the
 * official DocumentsResponse schema.
 */
const GetDocumentsListResponseSchema = z.object({
	documents: z.array(BoloformsDocument),
	message: z.string().optional(),
	formCount: z.number().optional(),
	documentsCount: z.number().optional(),
	pagination: BoloformsDocumentsPagination.optional(),
});

export type GetDocumentsListResponse = z.infer<
	typeof GetDocumentsListResponseSchema
>;

export type BoloformsEndpointInputs = {
	getDocumentsList: GetDocumentsListInput;
};

export type BoloformsEndpointOutputs = {
	getDocumentsList: GetDocumentsListResponse;
};

export const BoloformsEndpointInputSchemas = {
	getDocumentsList: GetDocumentsListInputSchema,
} as const;

export const BoloformsEndpointOutputSchemas = {
	getDocumentsList: GetDocumentsListResponseSchema,
} as const;
