import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddEnvelopeAttachmentsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddEnvelopeAttachmentsOutputSchema = z.object({}).passthrough();

export type AddEnvelopeAttachmentsParams = z.infer<
	typeof AddEnvelopeAttachmentsInputSchema
>;

export const addEnvelopeAttachments = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddEnvelopeAttachmentsParams,
) => {
	const input = AddEnvelopeAttachmentsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/attachments`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddEnvelopeAttachmentsOutputSchema.parse(data);
};

export const CreateCustomDocumentFieldsInEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateCustomDocumentFieldsInEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type CreateCustomDocumentFieldsInEnvelopeParams = z.infer<
	typeof CreateCustomDocumentFieldsInEnvelopeInputSchema
>;

export const createCustomDocumentFieldsInEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateCustomDocumentFieldsInEnvelopeParams,
) => {
	const input = CreateCustomDocumentFieldsInEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/fields`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateCustomDocumentFieldsInEnvelopeOutputSchema.parse(data);
};

export const CreateDocumentResponsiveHtmlPreviewInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateDocumentResponsiveHtmlPreviewOutputSchema = z
	.object({})
	.passthrough();

export type CreateDocumentResponsiveHtmlPreviewParams = z.infer<
	typeof CreateDocumentResponsiveHtmlPreviewInputSchema
>;

export const createDocumentResponsiveHtmlPreview = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateDocumentResponsiveHtmlPreviewParams,
) => {
	const input = CreateDocumentResponsiveHtmlPreviewInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/responsive_html_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateDocumentResponsiveHtmlPreviewOutputSchema.parse(data);
};

export const CreatePreviewOfResponsiveHtmlInEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreatePreviewOfResponsiveHtmlInEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type CreatePreviewOfResponsiveHtmlInEnvelopeParams = z.infer<
	typeof CreatePreviewOfResponsiveHtmlInEnvelopeInputSchema
>;

export const createPreviewOfResponsiveHtmlInEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreatePreviewOfResponsiveHtmlInEnvelopeParams,
) => {
	const input =
		CreatePreviewOfResponsiveHtmlInEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/responsive_html_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreatePreviewOfResponsiveHtmlInEnvelopeOutputSchema.parse(data);
};

export const DeleteCustomDocumentFieldsInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
});

export const DeleteCustomDocumentFieldsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteCustomDocumentFieldsParams = z.infer<
	typeof DeleteCustomDocumentFieldsInputSchema
>;

export const deleteCustomDocumentFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteCustomDocumentFieldsParams,
) => {
	const input = DeleteCustomDocumentFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/fields`,
		{
			method: 'DELETE',
		},
	);
	return DeleteCustomDocumentFieldsOutputSchema.parse(data);
};

export const DeleteDraftEnvelopeAttachmentsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.object({
		attachments: z
			.array(z.object({ attachmentId: z.string() }).passthrough())
			.min(1),
	}),
});

export const DeleteDraftEnvelopeAttachmentsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteDraftEnvelopeAttachmentsParams = z.infer<
	typeof DeleteDraftEnvelopeAttachmentsInputSchema
>;

export const deleteDraftEnvelopeAttachments = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteDraftEnvelopeAttachmentsParams,
) => {
	const input = DeleteDraftEnvelopeAttachmentsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/attachments`,
		{
			method: 'DELETE',
			body: JSON.stringify(input.body),
		},
	);
	return DeleteDraftEnvelopeAttachmentsOutputSchema.parse(data);
};

export const DeprecatedEndpointForTabBlobInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeprecatedEndpointForTabBlobOutputSchema = z
	.object({})
	.passthrough();

export type DeprecatedEndpointForTabBlobParams = z.infer<
	typeof DeprecatedEndpointForTabBlobInputSchema
>;

export const deprecatedEndpointForTabBlob = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeprecatedEndpointForTabBlobParams,
) => {
	const input = DeprecatedEndpointForTabBlobInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/tabs_blob`,
		{
			method: 'GET',
		},
	);
	return DeprecatedEndpointForTabBlobOutputSchema.parse(data);
};

export const GetEnvelopeDocGenFormFieldsInputSchema = z.object({
	envelopeId: z.string(),
});

export const GetEnvelopeDocGenFormFieldsOutputSchema = z
	.object({})
	.passthrough();

export type GetEnvelopeDocGenFormFieldsParams = z.infer<
	typeof GetEnvelopeDocGenFormFieldsInputSchema
>;

export const getEnvelopeDocGenFormFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeDocGenFormFieldsParams,
) => {
	const input = GetEnvelopeDocGenFormFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/docGenFormFields`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeDocGenFormFieldsOutputSchema.parse(data);
};

export const GetEnvelopeDocumentFieldsInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
});

export const GetEnvelopeDocumentFieldsOutputSchema = z.object({}).passthrough();

export type GetEnvelopeDocumentFieldsParams = z.infer<
	typeof GetEnvelopeDocumentFieldsInputSchema
>;

export const getEnvelopeDocumentFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeDocumentFieldsParams,
) => {
	const input = GetEnvelopeDocumentFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/fields`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeDocumentFieldsOutputSchema.parse(data);
};

export const GetPdftranscriptOfEnvelopeCommentsInputSchema = z.object({
	envelopeId: z.string(),
	encoding: z.string().optional(),
});

export const GetPdftranscriptOfEnvelopeCommentsOutputSchema = z.unknown();

export type GetPdftranscriptOfEnvelopeCommentsParams = z.infer<
	typeof GetPdftranscriptOfEnvelopeCommentsInputSchema
>;

export const getPdftranscriptOfEnvelopeComments = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetPdftranscriptOfEnvelopeCommentsParams,
) => {
	const input = GetPdftranscriptOfEnvelopeCommentsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.encoding !== undefined)
		query.append('encoding', String(input.encoding));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/comments/transcript` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetPdftranscriptOfEnvelopeCommentsOutputSchema.parse(data);
};

export const GetRecipientDocumentVisibilityInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
});

export const GetRecipientDocumentVisibilityOutputSchema = z
	.object({})
	.passthrough();

export type GetRecipientDocumentVisibilityParams = z.infer<
	typeof GetRecipientDocumentVisibilityInputSchema
>;

export const getRecipientDocumentVisibility = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetRecipientDocumentVisibilityParams,
) => {
	const input = GetRecipientDocumentVisibilityInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/document_visibility`,
		{
			method: 'GET',
		},
	);
	return GetRecipientDocumentVisibilityOutputSchema.parse(data);
};

export const GetTabsBlobForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const GetTabsBlobForEnvelopeOutputSchema = z.object({}).passthrough();

export type GetTabsBlobForEnvelopeParams = z.infer<
	typeof GetTabsBlobForEnvelopeInputSchema
>;

export const getTabsBlobForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTabsBlobForEnvelopeParams,
) => {
	const input = GetTabsBlobForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/tabs_blob`,
		{
			method: 'GET',
		},
	);
	return GetTabsBlobForEnvelopeOutputSchema.parse(data);
};

export const ListEnvelopeAttachmentsByEnvelopeIdInputSchema = z.object({
	envelopeId: z.string(),
});

export const ListEnvelopeAttachmentsByEnvelopeIdOutputSchema = z
	.object({})
	.passthrough();

export type ListEnvelopeAttachmentsByEnvelopeIdParams = z.infer<
	typeof ListEnvelopeAttachmentsByEnvelopeIdInputSchema
>;

export const listEnvelopeAttachmentsByEnvelopeId = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListEnvelopeAttachmentsByEnvelopeIdParams,
) => {
	const input = ListEnvelopeAttachmentsByEnvelopeIdInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/attachments`,
		{
			method: 'GET',
		},
	);
	return ListEnvelopeAttachmentsByEnvelopeIdOutputSchema.parse(data);
};

export const RetrieveEnvelopeAttachmentInputSchema = z.object({
	envelopeId: z.string(),
	attachmentId: z.string(),
});

export const RetrieveEnvelopeAttachmentOutputSchema = z.unknown();

export type RetrieveEnvelopeAttachmentParams = z.infer<
	typeof RetrieveEnvelopeAttachmentInputSchema
>;

export const retrieveEnvelopeAttachment = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeAttachmentParams,
) => {
	const input = RetrieveEnvelopeAttachmentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/attachments/${encodeURIComponent(input.attachmentId)}`,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeAttachmentOutputSchema.parse(data);
};

export const RetrieveEnvelopeDocumentsInputSchema = z.object({
	envelopeId: z.string(),
	documents_by_userid: z.string().optional(),
	include_agreement_type: z.string().optional(),
	include_docgen_formfields: z.string().optional(),
	include_is_edited: z.string().optional(),
	include_metadata: z.string().optional(),
	include_tabs: z.string().optional(),
	recipient_id: z.string().optional(),
	shared_user_id: z.string().optional(),
});

export const RetrieveEnvelopeDocumentsOutputSchema = z.object({}).passthrough();

export type RetrieveEnvelopeDocumentsParams = z.infer<
	typeof RetrieveEnvelopeDocumentsInputSchema
>;

export const retrieveEnvelopeDocuments = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeDocumentsParams,
) => {
	const input = RetrieveEnvelopeDocumentsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.documents_by_userid !== undefined)
		query.append('documents_by_userid', String(input.documents_by_userid));
	if (input.include_agreement_type !== undefined)
		query.append(
			'include_agreement_type',
			String(input.include_agreement_type),
		);
	if (input.include_docgen_formfields !== undefined)
		query.append(
			'include_docgen_formfields',
			String(input.include_docgen_formfields),
		);
	if (input.include_is_edited !== undefined)
		query.append('include_is_edited', String(input.include_is_edited));
	if (input.include_metadata !== undefined)
		query.append('include_metadata', String(input.include_metadata));
	if (input.include_tabs !== undefined)
		query.append('include_tabs', String(input.include_tabs));
	if (input.recipient_id !== undefined)
		query.append('recipient_id', String(input.recipient_id));
	if (input.shared_user_id !== undefined)
		query.append('shared_user_id', String(input.shared_user_id));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeDocumentsOutputSchema.parse(data);
};

export const RetrieveEnvelopeHtmlDefinitionInputSchema = z.object({
	envelopeId: z.string(),
});

export const RetrieveEnvelopeHtmlDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveEnvelopeHtmlDefinitionParams = z.infer<
	typeof RetrieveEnvelopeHtmlDefinitionInputSchema
>;

export const retrieveEnvelopeHtmlDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeHtmlDefinitionParams,
) => {
	const input = RetrieveEnvelopeHtmlDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/html_definitions`,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeHtmlDefinitionOutputSchema.parse(data);
};

export const ReturnEnvelopeTabDataForExistingEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const ReturnEnvelopeTabDataForExistingEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type ReturnEnvelopeTabDataForExistingEnvelopeParams = z.infer<
	typeof ReturnEnvelopeTabDataForExistingEnvelopeInputSchema
>;

export const returnEnvelopeTabDataForExistingEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnEnvelopeTabDataForExistingEnvelopeParams,
) => {
	const input =
		ReturnEnvelopeTabDataForExistingEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/form_data`,
		{
			method: 'GET',
		},
	);
	return ReturnEnvelopeTabDataForExistingEnvelopeOutputSchema.parse(data);
};

export const UpdateCustomFieldsInEnvelopeDocumentInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateCustomFieldsInEnvelopeDocumentOutputSchema = z
	.object({})
	.passthrough();

export type UpdateCustomFieldsInEnvelopeDocumentParams = z.infer<
	typeof UpdateCustomFieldsInEnvelopeDocumentInputSchema
>;

export const updateCustomFieldsInEnvelopeDocument = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateCustomFieldsInEnvelopeDocumentParams,
) => {
	const input = UpdateCustomFieldsInEnvelopeDocumentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/fields`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateCustomFieldsInEnvelopeDocumentOutputSchema.parse(data);
};

export const UpdateDocumentVisibilityRecipientsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateDocumentVisibilityRecipientsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateDocumentVisibilityRecipientsParams = z.infer<
	typeof UpdateDocumentVisibilityRecipientsInputSchema
>;

export const updateDocumentVisibilityRecipients = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateDocumentVisibilityRecipientsParams,
) => {
	const input = UpdateDocumentVisibilityRecipientsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/document_visibility`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateDocumentVisibilityRecipientsOutputSchema.parse(data);
};

export const UpdateEnvelopeAttachmentInputSchema = z.object({
	envelopeId: z.string(),
	attachmentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeAttachmentOutputSchema = z.object({}).passthrough();

export type UpdateEnvelopeAttachmentParams = z.infer<
	typeof UpdateEnvelopeAttachmentInputSchema
>;

export const updateEnvelopeAttachment = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeAttachmentParams,
) => {
	const input = UpdateEnvelopeAttachmentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/attachments/${encodeURIComponent(input.attachmentId)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeAttachmentOutputSchema.parse(data);
};

export const UpdateEnvelopeDocGenFormFieldsInputSchema = z.object({
	envelopeId: z.string(),
	update_docgen_formfields_only: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeDocGenFormFieldsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeDocGenFormFieldsParams = z.infer<
	typeof UpdateEnvelopeDocGenFormFieldsInputSchema
>;

export const updateEnvelopeDocGenFormFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeDocGenFormFieldsParams,
) => {
	const input = UpdateEnvelopeDocGenFormFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.update_docgen_formfields_only !== undefined)
		query.append(
			'update_docgen_formfields_only',
			String(input.update_docgen_formfields_only),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/docGenFormFields` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeDocGenFormFieldsOutputSchema.parse(data);
};

export const UpdateRecipientDocumentVisibilityInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	body: z.object({
		documentVisibility: z
			.array(
				z
					.object({
						recipientId: z.string().optional(),
						documentId: z.string().optional(),
						visible: z.string().optional(),
					})
					.passthrough(),
			)
			.min(1),
	}),
});

export const UpdateRecipientDocumentVisibilityOutputSchema = z
	.object({})
	.passthrough();

export type UpdateRecipientDocumentVisibilityParams = z.infer<
	typeof UpdateRecipientDocumentVisibilityInputSchema
>;

export const updateRecipientDocumentVisibility = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateRecipientDocumentVisibilityParams,
) => {
	const input = UpdateRecipientDocumentVisibilityInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/document_visibility`,
		{
			method: 'PUT',
			body: JSON.stringify(input.body),
		},
	);
	return UpdateRecipientDocumentVisibilityOutputSchema.parse(data);
};

export const EnvelopeDocumentsInputSchemas = {
	addEnvelopeAttachments: AddEnvelopeAttachmentsInputSchema,
	createCustomDocumentFieldsInEnvelope:
		CreateCustomDocumentFieldsInEnvelopeInputSchema,
	createDocumentResponsiveHtmlPreview:
		CreateDocumentResponsiveHtmlPreviewInputSchema,
	createPreviewOfResponsiveHtmlInEnvelope:
		CreatePreviewOfResponsiveHtmlInEnvelopeInputSchema,
	deleteCustomDocumentFields: DeleteCustomDocumentFieldsInputSchema,
	deleteDraftEnvelopeAttachments: DeleteDraftEnvelopeAttachmentsInputSchema,
	deprecatedEndpointForTabBlob: DeprecatedEndpointForTabBlobInputSchema,
	getEnvelopeDocGenFormFields: GetEnvelopeDocGenFormFieldsInputSchema,
	getEnvelopeDocumentFields: GetEnvelopeDocumentFieldsInputSchema,
	getPdftranscriptOfEnvelopeComments:
		GetPdftranscriptOfEnvelopeCommentsInputSchema,
	getRecipientDocumentVisibility: GetRecipientDocumentVisibilityInputSchema,
	getTabsBlobForEnvelope: GetTabsBlobForEnvelopeInputSchema,
	listEnvelopeAttachmentsByEnvelopeId:
		ListEnvelopeAttachmentsByEnvelopeIdInputSchema,
	retrieveEnvelopeAttachment: RetrieveEnvelopeAttachmentInputSchema,
	retrieveEnvelopeDocuments: RetrieveEnvelopeDocumentsInputSchema,
	retrieveEnvelopeHtmlDefinition: RetrieveEnvelopeHtmlDefinitionInputSchema,
	returnEnvelopeTabDataForExistingEnvelope:
		ReturnEnvelopeTabDataForExistingEnvelopeInputSchema,
	updateCustomFieldsInEnvelopeDocument:
		UpdateCustomFieldsInEnvelopeDocumentInputSchema,
	updateDocumentVisibilityRecipients:
		UpdateDocumentVisibilityRecipientsInputSchema,
	updateEnvelopeAttachment: UpdateEnvelopeAttachmentInputSchema,
	updateEnvelopeDocGenFormFields: UpdateEnvelopeDocGenFormFieldsInputSchema,
	updateRecipientDocumentVisibility:
		UpdateRecipientDocumentVisibilityInputSchema,
};

export const EnvelopeDocumentsOutputSchemas = {
	addEnvelopeAttachments: AddEnvelopeAttachmentsOutputSchema,
	createCustomDocumentFieldsInEnvelope:
		CreateCustomDocumentFieldsInEnvelopeOutputSchema,
	createDocumentResponsiveHtmlPreview:
		CreateDocumentResponsiveHtmlPreviewOutputSchema,
	createPreviewOfResponsiveHtmlInEnvelope:
		CreatePreviewOfResponsiveHtmlInEnvelopeOutputSchema,
	deleteCustomDocumentFields: DeleteCustomDocumentFieldsOutputSchema,
	deleteDraftEnvelopeAttachments: DeleteDraftEnvelopeAttachmentsOutputSchema,
	deprecatedEndpointForTabBlob: DeprecatedEndpointForTabBlobOutputSchema,
	getEnvelopeDocGenFormFields: GetEnvelopeDocGenFormFieldsOutputSchema,
	getEnvelopeDocumentFields: GetEnvelopeDocumentFieldsOutputSchema,
	getPdftranscriptOfEnvelopeComments:
		GetPdftranscriptOfEnvelopeCommentsOutputSchema,
	getRecipientDocumentVisibility: GetRecipientDocumentVisibilityOutputSchema,
	getTabsBlobForEnvelope: GetTabsBlobForEnvelopeOutputSchema,
	listEnvelopeAttachmentsByEnvelopeId:
		ListEnvelopeAttachmentsByEnvelopeIdOutputSchema,
	retrieveEnvelopeAttachment: RetrieveEnvelopeAttachmentOutputSchema,
	retrieveEnvelopeDocuments: RetrieveEnvelopeDocumentsOutputSchema,
	retrieveEnvelopeHtmlDefinition: RetrieveEnvelopeHtmlDefinitionOutputSchema,
	returnEnvelopeTabDataForExistingEnvelope:
		ReturnEnvelopeTabDataForExistingEnvelopeOutputSchema,
	updateCustomFieldsInEnvelopeDocument:
		UpdateCustomFieldsInEnvelopeDocumentOutputSchema,
	updateDocumentVisibilityRecipients:
		UpdateDocumentVisibilityRecipientsOutputSchema,
	updateEnvelopeAttachment: UpdateEnvelopeAttachmentOutputSchema,
	updateEnvelopeDocGenFormFields: UpdateEnvelopeDocGenFormFieldsOutputSchema,
	updateRecipientDocumentVisibility:
		UpdateRecipientDocumentVisibilityOutputSchema,
};
