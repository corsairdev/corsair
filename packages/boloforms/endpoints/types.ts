import { z } from 'zod';

const GetDocumentsListInputSchema = z.object({
	workspaceId: z.string(),
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

const DocumentSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
});

const GetDocumentsListResponseSchema = z.object({
	documents: z.array(DocumentSchema),
	documentsCount: z.number(),
	message: z.string(),
	formCount: z.number(),
});

export type GetDocumentsListResponse = z.infer<typeof GetDocumentsListResponseSchema>;

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