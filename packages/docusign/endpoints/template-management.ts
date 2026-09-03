import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateCustomFieldsInTemplateDocumentInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateCustomFieldsInTemplateDocumentOutputSchema = z
	.object({})
	.passthrough();

export type CreateCustomFieldsInTemplateDocumentParams = z.infer<
	typeof CreateCustomFieldsInTemplateDocumentInputSchema
>;

export const createCustomFieldsInTemplateDocument = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateCustomFieldsInTemplateDocumentParams,
) => {
	const input = CreateCustomFieldsInTemplateDocumentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateCustomFieldsInTemplateDocumentOutputSchema.parse(data);
};

export const CreatePreviewOfResponsiveHtmlInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreatePreviewOfResponsiveHtmlOutputSchema = z
	.object({})
	.passthrough();

export type CreatePreviewOfResponsiveHtmlParams = z.infer<
	typeof CreatePreviewOfResponsiveHtmlInputSchema
>;

export const createPreviewOfResponsiveHtml = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreatePreviewOfResponsiveHtmlParams,
) => {
	const input = CreatePreviewOfResponsiveHtmlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/responsive_html_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreatePreviewOfResponsiveHtmlOutputSchema.parse(data);
};

export const CreateTemplateDocumentCustomFieldsInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateTemplateDocumentCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type CreateTemplateDocumentCustomFieldsParams = z.infer<
	typeof CreateTemplateDocumentCustomFieldsInputSchema
>;

export const createTemplateDocumentCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateTemplateDocumentCustomFieldsParams,
) => {
	const input = CreateTemplateDocumentCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateTemplateDocumentCustomFieldsOutputSchema.parse(data);
};

export const CreateTemplateRecipientPreviewUrlInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateTemplateRecipientPreviewUrlOutputSchema = z
	.object({})
	.passthrough();

export type CreateTemplateRecipientPreviewUrlParams = z.infer<
	typeof CreateTemplateRecipientPreviewUrlInputSchema
>;

export const createTemplateRecipientPreviewUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateTemplateRecipientPreviewUrlParams,
) => {
	const input = CreateTemplateRecipientPreviewUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/views/recipient_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateTemplateRecipientPreviewUrlOutputSchema.parse(data);
};

export const CreateTemplateResponsiveHtmlPreviewInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateTemplateResponsiveHtmlPreviewOutputSchema = z
	.object({})
	.passthrough();

export type CreateTemplateResponsiveHtmlPreviewParams = z.infer<
	typeof CreateTemplateResponsiveHtmlPreviewInputSchema
>;

export const createTemplateResponsiveHtmlPreview = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateTemplateResponsiveHtmlPreviewParams,
) => {
	const input = CreateTemplateResponsiveHtmlPreviewInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/responsive_html_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateTemplateResponsiveHtmlPreviewOutputSchema.parse(data);
};

export const CreateUrlforTemplateEditViewInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateUrlforTemplateEditViewOutputSchema = z
	.object({})
	.passthrough();

export type CreateUrlforTemplateEditViewParams = z.infer<
	typeof CreateUrlforTemplateEditViewInputSchema
>;

export const createUrlforTemplateEditView = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateUrlforTemplateEditViewParams,
) => {
	const input = CreateUrlforTemplateEditViewInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/views/edit`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateUrlforTemplateEditViewOutputSchema.parse(data);
};

export const DeleteCustomDocumentFieldsFromTemplateInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
});

export const DeleteCustomDocumentFieldsFromTemplateOutputSchema = z
	.object({})
	.passthrough();

export type DeleteCustomDocumentFieldsFromTemplateParams = z.infer<
	typeof DeleteCustomDocumentFieldsFromTemplateInputSchema
>;

export const deleteCustomDocumentFieldsFromTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteCustomDocumentFieldsFromTemplateParams,
) => {
	const input = DeleteCustomDocumentFieldsFromTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/fields`,
		{
			method: 'DELETE',
		},
	);
	return DeleteCustomDocumentFieldsFromTemplateOutputSchema.parse(data);
};

export const DeleteCustomFieldsInTemplateInputSchema = z.object({
	templateId: z.string(),
});

export const DeleteCustomFieldsInTemplateOutputSchema = z
	.object({})
	.passthrough();

export type DeleteCustomFieldsInTemplateParams = z.infer<
	typeof DeleteCustomFieldsInTemplateInputSchema
>;

export const deleteCustomFieldsInTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteCustomFieldsInTemplateParams,
) => {
	const input = DeleteCustomFieldsInTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'DELETE',
		},
	);
	return DeleteCustomFieldsInTemplateOutputSchema.parse(data);
};

export const DeletePageFromTemplateDocumentInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
});

export const DeletePageFromTemplateDocumentOutputSchema = z
	.object({})
	.passthrough();

export type DeletePageFromTemplateDocumentParams = z.infer<
	typeof DeletePageFromTemplateDocumentInputSchema
>;

export const deletePageFromTemplateDocument = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeletePageFromTemplateDocumentParams,
) => {
	const input = DeletePageFromTemplateDocumentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/pages/${input.pageNumber}`,
		{
			method: 'DELETE',
		},
	);
	return DeletePageFromTemplateDocumentOutputSchema.parse(data);
};

export const DeleteTemplateLockInputSchema = z.object({
	templateId: z.string(),
});

export const DeleteTemplateLockOutputSchema = z.object({}).passthrough();

export type DeleteTemplateLockParams = z.infer<
	typeof DeleteTemplateLockInputSchema
>;

export const deleteTemplateLock = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteTemplateLockParams,
) => {
	const input = DeleteTemplateLockInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/templates/${input.templateId}/lock`, {
		method: 'DELETE',
	});
	return DeleteTemplateLockOutputSchema.parse(data);
};

export const GetOriginalHtmlDefinitionForTemplateInputSchema = z.object({
	templateId: z.string(),
});

export const GetOriginalHtmlDefinitionForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type GetOriginalHtmlDefinitionForTemplateParams = z.infer<
	typeof GetOriginalHtmlDefinitionForTemplateInputSchema
>;

export const getOriginalHtmlDefinitionForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetOriginalHtmlDefinitionForTemplateParams,
) => {
	const input = GetOriginalHtmlDefinitionForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/html_definitions`,
		{
			method: 'GET',
		},
	);
	return GetOriginalHtmlDefinitionForTemplateOutputSchema.parse(data);
};

export const GetTemplateDocumentHtmlDefinitionInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
});

export const GetTemplateDocumentHtmlDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateDocumentHtmlDefinitionParams = z.infer<
	typeof GetTemplateDocumentHtmlDefinitionInputSchema
>;

export const getTemplateDocumentHtmlDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateDocumentHtmlDefinitionParams,
) => {
	const input = GetTemplateDocumentHtmlDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/html_definitions`,
		{
			method: 'GET',
		},
	);
	return GetTemplateDocumentHtmlDefinitionOutputSchema.parse(data);
};

export const GetTemplateLockInformationInputSchema = z.object({
	templateId: z.string(),
});

export const GetTemplateLockInformationOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateLockInformationParams = z.infer<
	typeof GetTemplateLockInformationInputSchema
>;

export const getTemplateLockInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateLockInformationParams,
) => {
	const input = GetTemplateLockInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/templates/${input.templateId}/lock`, {
		method: 'GET',
	});
	return GetTemplateLockInformationOutputSchema.parse(data);
};

export const GetTemplateNotificationInformationInputSchema = z.object({
	templateId: z.string(),
});

export const GetTemplateNotificationInformationOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateNotificationInformationParams = z.infer<
	typeof GetTemplateNotificationInformationInputSchema
>;

export const getTemplateNotificationInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateNotificationInformationParams,
) => {
	const input = GetTemplateNotificationInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/notification`,
		{
			method: 'GET',
		},
	);
	return GetTemplateNotificationInformationOutputSchema.parse(data);
};

export const GetTemplateRecipientDocumentVisibilityInputSchema = z.object({
	templateId: z.string(),
	recipientId: z.string(),
});

export const GetTemplateRecipientDocumentVisibilityOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateRecipientDocumentVisibilityParams = z.infer<
	typeof GetTemplateRecipientDocumentVisibilityInputSchema
>;

export const getTemplateRecipientDocumentVisibility = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateRecipientDocumentVisibilityParams,
) => {
	const input = GetTemplateRecipientDocumentVisibilityInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/recipients/${input.recipientId}/document_visibility`,
		{
			method: 'GET',
		},
	);
	return GetTemplateRecipientDocumentVisibilityOutputSchema.parse(data);
};

export const LockTemplateForEditingInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const LockTemplateForEditingOutputSchema = z.object({}).passthrough();

export type LockTemplateForEditingParams = z.infer<
	typeof LockTemplateForEditingInputSchema
>;

export const lockTemplateForEditing = async (
	ctxOrClient: DocusignExecutionContext,
	params: LockTemplateForEditingParams,
) => {
	const input = LockTemplateForEditingInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/templates/${input.templateId}/lock`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return LockTemplateForEditingOutputSchema.parse(data);
};

export const RemoveGroupSharingPermissionsForTemplateInputSchema = z.object({
	templateId: z.string(),
	templatePart: z.string(),
});

export const RemoveGroupSharingPermissionsForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type RemoveGroupSharingPermissionsForTemplateParams = z.infer<
	typeof RemoveGroupSharingPermissionsForTemplateInputSchema
>;

export const removeGroupSharingPermissionsForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: RemoveGroupSharingPermissionsForTemplateParams,
) => {
	const input =
		RemoveGroupSharingPermissionsForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/${input.templatePart}`,
		{
			method: 'DELETE',
		},
	);
	return RemoveGroupSharingPermissionsForTemplateOutputSchema.parse(data);
};

export const RemoveTemplatesFromFavoritesInputSchema = z.object({});

export const RemoveTemplatesFromFavoritesOutputSchema = z
	.object({})
	.passthrough();

export type RemoveTemplatesFromFavoritesParams = z.infer<
	typeof RemoveTemplatesFromFavoritesInputSchema
>;

export const removeTemplatesFromFavorites = async (
	ctxOrClient: DocusignExecutionContext,
	params: RemoveTemplatesFromFavoritesParams,
) => {
	const input = RemoveTemplatesFromFavoritesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/favorite_templates`, {
		method: 'DELETE',
	});
	return RemoveTemplatesFromFavoritesOutputSchema.parse(data);
};

export const RetrieveAccountFavoriteTemplatesInputSchema = z.object({});

export const RetrieveAccountFavoriteTemplatesOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountFavoriteTemplatesParams = z.infer<
	typeof RetrieveAccountFavoriteTemplatesInputSchema
>;

export const retrieveAccountFavoriteTemplates = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountFavoriteTemplatesParams,
) => {
	const input = RetrieveAccountFavoriteTemplatesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/favorite_templates`, {
		method: 'GET',
	});
	return RetrieveAccountFavoriteTemplatesOutputSchema.parse(data);
};

export const RetrieveCustomFieldsForTemplateInputSchema = z.object({
	templateId: z.string(),
});

export const RetrieveCustomFieldsForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveCustomFieldsForTemplateParams = z.infer<
	typeof RetrieveCustomFieldsForTemplateInputSchema
>;

export const retrieveCustomFieldsForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCustomFieldsForTemplateParams,
) => {
	const input = RetrieveCustomFieldsForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'GET',
		},
	);
	return RetrieveCustomFieldsForTemplateOutputSchema.parse(data);
};

export const RetrievePdfFromSpecifiedTemplateInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	encrypt: z.string().optional(),
	file_type: z.string().optional(),
	show_changes: z.string().optional(),
});

export const RetrievePdfFromSpecifiedTemplateOutputSchema = z.unknown();

export type RetrievePdfFromSpecifiedTemplateParams = z.infer<
	typeof RetrievePdfFromSpecifiedTemplateInputSchema
>;

export const retrievePdfFromSpecifiedTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrievePdfFromSpecifiedTemplateParams,
) => {
	const input = RetrievePdfFromSpecifiedTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.encrypt !== undefined)
		query.append('encrypt', String(input.encrypt));
	if (input.file_type !== undefined)
		query.append('file_type', String(input.file_type));
	if (input.show_changes !== undefined)
		query.append('show_changes', String(input.show_changes));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}` + qs,
		{
			method: 'GET',
		},
	);
	return RetrievePdfFromSpecifiedTemplateOutputSchema.parse(data);
};

export const RetrieveTemplateCustomFieldsInputSchema = z.object({
	templateId: z.string(),
});

export const RetrieveTemplateCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveTemplateCustomFieldsParams = z.infer<
	typeof RetrieveTemplateCustomFieldsInputSchema
>;

export const retrieveTemplateCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveTemplateCustomFieldsParams,
) => {
	const input = RetrieveTemplateCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'GET',
		},
	);
	return RetrieveTemplateCustomFieldsOutputSchema.parse(data);
};

export const RetrieveTemplateDocumentPageImagesInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
	dpi: z.string().optional(),
	max_height: z.string().optional(),
	max_width: z.string().optional(),
	show_changes: z.string().optional(),
});

export const RetrieveTemplateDocumentPageImagesOutputSchema = z.unknown();

export type RetrieveTemplateDocumentPageImagesParams = z.infer<
	typeof RetrieveTemplateDocumentPageImagesInputSchema
>;

export const retrieveTemplateDocumentPageImages = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveTemplateDocumentPageImagesParams,
) => {
	const input = RetrieveTemplateDocumentPageImagesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.dpi !== undefined) query.append('dpi', String(input.dpi));
	if (input.max_height !== undefined)
		query.append('max_height', String(input.max_height));
	if (input.max_width !== undefined)
		query.append('max_width', String(input.max_width));
	if (input.show_changes !== undefined)
		query.append('show_changes', String(input.show_changes));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/pages/${input.pageNumber}/page_image` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveTemplateDocumentPageImagesOutputSchema.parse(data);
};

export const RetrieveTemplatePageImageInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	count: z.string().optional(),
	dpi: z.string().optional(),
	max_height: z.string().optional(),
	max_width: z.string().optional(),
	nocache: z.string().optional(),
	show_changes: z.string().optional(),
	start_position: z.string().optional(),
});

export const RetrieveTemplatePageImageOutputSchema = z.object({}).passthrough();

export type RetrieveTemplatePageImageParams = z.infer<
	typeof RetrieveTemplatePageImageInputSchema
>;

export const retrieveTemplatePageImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveTemplatePageImageParams,
) => {
	const input = RetrieveTemplatePageImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.dpi !== undefined) query.append('dpi', String(input.dpi));
	if (input.max_height !== undefined)
		query.append('max_height', String(input.max_height));
	if (input.max_width !== undefined)
		query.append('max_width', String(input.max_width));
	if (input.nocache !== undefined)
		query.append('nocache', String(input.nocache));
	if (input.show_changes !== undefined)
		query.append('show_changes', String(input.show_changes));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/pages` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveTemplatePageImageOutputSchema.parse(data);
};

export const RotateTemplatePageImageInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const RotateTemplatePageImageOutputSchema = z.object({}).passthrough();

export type RotateTemplatePageImageParams = z.infer<
	typeof RotateTemplatePageImageInputSchema
>;

export const rotateTemplatePageImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: RotateTemplatePageImageParams,
) => {
	const input = RotateTemplatePageImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/pages/${input.pageNumber}/page_image`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return RotateTemplatePageImageOutputSchema.parse(data);
};

export const SetTemplatesAsAccountFavoritesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SetTemplatesAsAccountFavoritesOutputSchema = z
	.object({})
	.passthrough();

export type SetTemplatesAsAccountFavoritesParams = z.infer<
	typeof SetTemplatesAsAccountFavoritesInputSchema
>;

export const setTemplatesAsAccountFavorites = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetTemplatesAsAccountFavoritesParams,
) => {
	const input = SetTemplatesAsAccountFavoritesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/favorite_templates`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return SetTemplatesAsAccountFavoritesOutputSchema.parse(data);
};

export const ShareTemplateWithGroupInputSchema = z.object({
	templateId: z.string(),
	templatePart: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ShareTemplateWithGroupOutputSchema = z.object({}).passthrough();

export type ShareTemplateWithGroupParams = z.infer<
	typeof ShareTemplateWithGroupInputSchema
>;

export const shareTemplateWithGroup = async (
	ctxOrClient: DocusignExecutionContext,
	params: ShareTemplateWithGroupParams,
) => {
	const input = ShareTemplateWithGroupInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/${input.templatePart}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return ShareTemplateWithGroupOutputSchema.parse(data);
};

export const UpdateTemplateCustomFieldsInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateCustomFieldsParams = z.infer<
	typeof UpdateTemplateCustomFieldsInputSchema
>;

export const updateTemplateCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateCustomFieldsParams,
) => {
	const input = UpdateTemplateCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/custom_fields`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateCustomFieldsOutputSchema.parse(data);
};

export const UpdateTemplateDocumentCustomFieldsInputSchema = z.object({
	templateId: z.string(),
	documentId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateDocumentCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateDocumentCustomFieldsParams = z.infer<
	typeof UpdateTemplateDocumentCustomFieldsInputSchema
>;

export const updateTemplateDocumentCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateDocumentCustomFieldsParams,
) => {
	const input = UpdateTemplateDocumentCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/documents/${input.documentId}/fields`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateDocumentCustomFieldsOutputSchema.parse(data);
};

export const UpdateTemplateDocVisibilityInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateDocVisibilityOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateDocVisibilityParams = z.infer<
	typeof UpdateTemplateDocVisibilityInputSchema
>;

export const updateTemplateDocVisibility = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateDocVisibilityParams,
) => {
	const input = UpdateTemplateDocVisibilityInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/recipients/document_visibility`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateDocVisibilityOutputSchema.parse(data);
};

export const UpdateTemplateLockInformationInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateLockInformationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateLockInformationParams = z.infer<
	typeof UpdateTemplateLockInformationInputSchema
>;

export const updateTemplateLockInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateLockInformationParams,
) => {
	const input = UpdateTemplateLockInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/templates/${input.templateId}/lock`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateTemplateLockInformationOutputSchema.parse(data);
};

export const UpdateTemplateNotificationSettingsInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateNotificationSettingsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateNotificationSettingsParams = z.infer<
	typeof UpdateTemplateNotificationSettingsInputSchema
>;

export const updateTemplateNotificationSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateNotificationSettingsParams,
) => {
	const input = UpdateTemplateNotificationSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/notification`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateNotificationSettingsOutputSchema.parse(data);
};

export const UpdateTemplateRecipientDocumentVisibilityInputSchema = z.object({
	templateId: z.string(),
	recipientId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateRecipientDocumentVisibilityOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateRecipientDocumentVisibilityParams = z.infer<
	typeof UpdateTemplateRecipientDocumentVisibilityInputSchema
>;

export const updateTemplateRecipientDocumentVisibility = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateRecipientDocumentVisibilityParams,
) => {
	const input =
		UpdateTemplateRecipientDocumentVisibilityInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${input.templateId}/recipients/${input.recipientId}/document_visibility`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateRecipientDocumentVisibilityOutputSchema.parse(data);
};

export const TemplateManagementInputSchemas = {
	createCustomFieldsInTemplateDocument:
		CreateCustomFieldsInTemplateDocumentInputSchema,
	createPreviewOfResponsiveHtml: CreatePreviewOfResponsiveHtmlInputSchema,
	createTemplateDocumentCustomFields:
		CreateTemplateDocumentCustomFieldsInputSchema,
	createTemplateRecipientPreviewUrl:
		CreateTemplateRecipientPreviewUrlInputSchema,
	createTemplateResponsiveHtmlPreview:
		CreateTemplateResponsiveHtmlPreviewInputSchema,
	createUrlforTemplateEditView: CreateUrlforTemplateEditViewInputSchema,
	deleteCustomDocumentFieldsFromTemplate:
		DeleteCustomDocumentFieldsFromTemplateInputSchema,
	deleteCustomFieldsInTemplate: DeleteCustomFieldsInTemplateInputSchema,
	deletePageFromTemplateDocument: DeletePageFromTemplateDocumentInputSchema,
	deleteTemplateLock: DeleteTemplateLockInputSchema,
	getOriginalHtmlDefinitionForTemplate:
		GetOriginalHtmlDefinitionForTemplateInputSchema,
	getTemplateDocumentHtmlDefinition:
		GetTemplateDocumentHtmlDefinitionInputSchema,
	getTemplateLockInformation: GetTemplateLockInformationInputSchema,
	getTemplateNotificationInformation:
		GetTemplateNotificationInformationInputSchema,
	getTemplateRecipientDocumentVisibility:
		GetTemplateRecipientDocumentVisibilityInputSchema,
	lockTemplateForEditing: LockTemplateForEditingInputSchema,
	removeGroupSharingPermissionsForTemplate:
		RemoveGroupSharingPermissionsForTemplateInputSchema,
	removeTemplatesFromFavorites: RemoveTemplatesFromFavoritesInputSchema,
	retrieveAccountFavoriteTemplates: RetrieveAccountFavoriteTemplatesInputSchema,
	retrieveCustomFieldsForTemplate: RetrieveCustomFieldsForTemplateInputSchema,
	retrievePdfFromSpecifiedTemplate: RetrievePdfFromSpecifiedTemplateInputSchema,
	retrieveTemplateCustomFields: RetrieveTemplateCustomFieldsInputSchema,
	retrieveTemplateDocumentPageImages:
		RetrieveTemplateDocumentPageImagesInputSchema,
	retrieveTemplatePageImage: RetrieveTemplatePageImageInputSchema,
	rotateTemplatePageImage: RotateTemplatePageImageInputSchema,
	setTemplatesAsAccountFavorites: SetTemplatesAsAccountFavoritesInputSchema,
	shareTemplateWithGroup: ShareTemplateWithGroupInputSchema,
	updateTemplateCustomFields: UpdateTemplateCustomFieldsInputSchema,
	updateTemplateDocumentCustomFields:
		UpdateTemplateDocumentCustomFieldsInputSchema,
	updateTemplateDocVisibility: UpdateTemplateDocVisibilityInputSchema,
	updateTemplateLockInformation: UpdateTemplateLockInformationInputSchema,
	updateTemplateNotificationSettings:
		UpdateTemplateNotificationSettingsInputSchema,
	updateTemplateRecipientDocumentVisibility:
		UpdateTemplateRecipientDocumentVisibilityInputSchema,
};

export const TemplateManagementOutputSchemas = {
	createCustomFieldsInTemplateDocument:
		CreateCustomFieldsInTemplateDocumentOutputSchema,
	createPreviewOfResponsiveHtml: CreatePreviewOfResponsiveHtmlOutputSchema,
	createTemplateDocumentCustomFields:
		CreateTemplateDocumentCustomFieldsOutputSchema,
	createTemplateRecipientPreviewUrl:
		CreateTemplateRecipientPreviewUrlOutputSchema,
	createTemplateResponsiveHtmlPreview:
		CreateTemplateResponsiveHtmlPreviewOutputSchema,
	createUrlforTemplateEditView: CreateUrlforTemplateEditViewOutputSchema,
	deleteCustomDocumentFieldsFromTemplate:
		DeleteCustomDocumentFieldsFromTemplateOutputSchema,
	deleteCustomFieldsInTemplate: DeleteCustomFieldsInTemplateOutputSchema,
	deletePageFromTemplateDocument: DeletePageFromTemplateDocumentOutputSchema,
	deleteTemplateLock: DeleteTemplateLockOutputSchema,
	getOriginalHtmlDefinitionForTemplate:
		GetOriginalHtmlDefinitionForTemplateOutputSchema,
	getTemplateDocumentHtmlDefinition:
		GetTemplateDocumentHtmlDefinitionOutputSchema,
	getTemplateLockInformation: GetTemplateLockInformationOutputSchema,
	getTemplateNotificationInformation:
		GetTemplateNotificationInformationOutputSchema,
	getTemplateRecipientDocumentVisibility:
		GetTemplateRecipientDocumentVisibilityOutputSchema,
	lockTemplateForEditing: LockTemplateForEditingOutputSchema,
	removeGroupSharingPermissionsForTemplate:
		RemoveGroupSharingPermissionsForTemplateOutputSchema,
	removeTemplatesFromFavorites: RemoveTemplatesFromFavoritesOutputSchema,
	retrieveAccountFavoriteTemplates:
		RetrieveAccountFavoriteTemplatesOutputSchema,
	retrieveCustomFieldsForTemplate: RetrieveCustomFieldsForTemplateOutputSchema,
	retrievePdfFromSpecifiedTemplate:
		RetrievePdfFromSpecifiedTemplateOutputSchema,
	retrieveTemplateCustomFields: RetrieveTemplateCustomFieldsOutputSchema,
	retrieveTemplateDocumentPageImages:
		RetrieveTemplateDocumentPageImagesOutputSchema,
	retrieveTemplatePageImage: RetrieveTemplatePageImageOutputSchema,
	rotateTemplatePageImage: RotateTemplatePageImageOutputSchema,
	setTemplatesAsAccountFavorites: SetTemplatesAsAccountFavoritesOutputSchema,
	shareTemplateWithGroup: ShareTemplateWithGroupOutputSchema,
	updateTemplateCustomFields: UpdateTemplateCustomFieldsOutputSchema,
	updateTemplateDocumentCustomFields:
		UpdateTemplateDocumentCustomFieldsOutputSchema,
	updateTemplateDocVisibility: UpdateTemplateDocVisibilityOutputSchema,
	updateTemplateLockInformation: UpdateTemplateLockInformationOutputSchema,
	updateTemplateNotificationSettings:
		UpdateTemplateNotificationSettingsOutputSchema,
	updateTemplateRecipientDocumentVisibility:
		UpdateTemplateRecipientDocumentVisibilityOutputSchema,
};
