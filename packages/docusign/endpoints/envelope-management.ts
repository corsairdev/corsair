import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

function base64ToBytes(imageBase64: string): Uint8Array {
	return Buffer.from(imageBase64, 'base64');
}

export const DeletePageFromDocumentInEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
});

export const DeletePageFromDocumentInEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type DeletePageFromDocumentInEnvelopeParams = z.infer<
	typeof DeletePageFromDocumentInEnvelopeInputSchema
>;

export const deletePageFromDocumentInEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeletePageFromDocumentInEnvelopeParams,
) => {
	const input = DeletePageFromDocumentInEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/pages/${encodeURIComponent(input.pageNumber)}`,
		{
			method: 'DELETE',
		},
	);
	return DeletePageFromDocumentInEnvelopeOutputSchema.parse(data);
};

export const GetEnvelopeNotificationDefaultsInputSchema = z.object({
	envelopeId: z.string(),
});

export const GetEnvelopeNotificationDefaultsOutputSchema = z
	.object({})
	.passthrough();

export type GetEnvelopeNotificationDefaultsParams = z.infer<
	typeof GetEnvelopeNotificationDefaultsInputSchema
>;

export const getEnvelopeNotificationDefaults = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeNotificationDefaultsParams,
) => {
	const input = GetEnvelopeNotificationDefaultsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/notification`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeNotificationDefaultsOutputSchema.parse(data);
};

export const GetPageImageFromEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
	dpi: z.string().optional(),
	max_height: z.string().optional(),
	max_width: z.string().optional(),
	show_changes: z.string().optional(),
});

export const GetPageImageFromEnvelopeOutputSchema = z.unknown();

export type GetPageImageFromEnvelopeParams = z.infer<
	typeof GetPageImageFromEnvelopeInputSchema
>;

export const getPageImageFromEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetPageImageFromEnvelopeParams,
) => {
	const input = GetPageImageFromEnvelopeInputSchema.parse(params);
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
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/pages/${encodeURIComponent(input.pageNumber)}/page_image` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetPageImageFromEnvelopeOutputSchema.parse(data);
};

export const GetSignatureInformationForRecipientInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
});

export const GetSignatureInformationForRecipientOutputSchema = z
	.object({})
	.passthrough();

export type GetSignatureInformationForRecipientParams = z.infer<
	typeof GetSignatureInformationForRecipientInputSchema
>;

export const getSignatureInformationForRecipient = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetSignatureInformationForRecipientParams,
) => {
	const input = GetSignatureInformationForRecipientInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/signature`,
		{
			method: 'GET',
		},
	);
	return GetSignatureInformationForRecipientOutputSchema.parse(data);
};

export const RetrieveEnvelopeAuditEventsInputSchema = z.object({
	envelopeId: z.string(),
	locale: z.string().optional(),
});

export const RetrieveEnvelopeAuditEventsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveEnvelopeAuditEventsParams = z.infer<
	typeof RetrieveEnvelopeAuditEventsInputSchema
>;

export const retrieveEnvelopeAuditEvents = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeAuditEventsParams,
) => {
	const input = RetrieveEnvelopeAuditEventsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.locale !== undefined) query.append('locale', String(input.locale));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/audit_events` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeAuditEventsOutputSchema.parse(data);
};

export const RetrieveEnvelopeNotificationDetailsInputSchema = z.object({
	envelopeId: z.string(),
});

export const RetrieveEnvelopeNotificationDetailsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveEnvelopeNotificationDetailsParams = z.infer<
	typeof RetrieveEnvelopeNotificationDetailsInputSchema
>;

export const retrieveEnvelopeNotificationDetails = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeNotificationDetailsParams,
) => {
	const input = RetrieveEnvelopeNotificationDetailsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/notification`,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeNotificationDetailsOutputSchema.parse(data);
};

export const RetrieveSignerSignatureImageInformationInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	include_chrome: z.string().optional(),
});

export const RetrieveSignerSignatureImageInformationOutputSchema = z.unknown();

export type RetrieveSignerSignatureImageInformationParams = z.infer<
	typeof RetrieveSignerSignatureImageInformationInputSchema
>;

export const retrieveSignerSignatureImageInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveSignerSignatureImageInformationParams,
) => {
	const input =
		RetrieveSignerSignatureImageInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_chrome !== undefined)
		query.append('include_chrome', String(input.include_chrome));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/signature_image` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveSignerSignatureImageInformationOutputSchema.parse(data);
};

export const RetrieveUserInitialsImageForEnvelopesInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	include_chrome: z.string().optional(),
});

export const RetrieveUserInitialsImageForEnvelopesOutputSchema = z.unknown();

export type RetrieveUserInitialsImageForEnvelopesParams = z.infer<
	typeof RetrieveUserInitialsImageForEnvelopesInputSchema
>;

export const retrieveUserInitialsImageForEnvelopes = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveUserInitialsImageForEnvelopesParams,
) => {
	const input = RetrieveUserInitialsImageForEnvelopesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_chrome !== undefined)
		query.append('include_chrome', String(input.include_chrome));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/initials_image` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveUserInitialsImageForEnvelopesOutputSchema.parse(data);
};

export const ReturnsDocumentPageImagesBasedOnInputInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	count: z.string().optional(),
	dpi: z.string().optional(),
	max_height: z.string().optional(),
	max_width: z.string().optional(),
	nocache: z.string().optional(),
	show_changes: z.string().optional(),
	start_position: z.string().optional(),
});

export const ReturnsDocumentPageImagesBasedOnInputOutputSchema = z
	.object({})
	.passthrough();

export type ReturnsDocumentPageImagesBasedOnInputParams = z.infer<
	typeof ReturnsDocumentPageImagesBasedOnInputInputSchema
>;

export const returnsDocumentPageImagesBasedOnInput = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnsDocumentPageImagesBasedOnInputParams,
) => {
	const input = ReturnsDocumentPageImagesBasedOnInputInputSchema.parse(params);
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
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/pages` +
			qs,
		{
			method: 'GET',
		},
	);
	return ReturnsDocumentPageImagesBasedOnInputOutputSchema.parse(data);
};

export const RotatePageImageForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	pageNumber: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const RotatePageImageForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type RotatePageImageForEnvelopeParams = z.infer<
	typeof RotatePageImageForEnvelopeInputSchema
>;

export const rotatePageImageForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: RotatePageImageForEnvelopeParams,
) => {
	const input = RotatePageImageForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/pages/${encodeURIComponent(input.pageNumber)}/page_image`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return RotatePageImageForEnvelopeOutputSchema.parse(data);
};

export const SignatureImageContentTypeSchema = z.enum([
	'image/gif',
	'image/png',
	'image/jpeg',
	'image/bmp',
]);

export const SetInitialsImageForAccountlessSignerInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	imageBase64: z.string().min(1),
	contentType: SignatureImageContentTypeSchema.default('image/png'),
});

export const SetInitialsImageForAccountlessSignerOutputSchema = z
	.object({})
	.passthrough();

export type SetInitialsImageForAccountlessSignerParams = z.infer<
	typeof SetInitialsImageForAccountlessSignerInputSchema
>;

export const setInitialsImageForAccountlessSigner = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetInitialsImageForAccountlessSignerParams,
) => {
	const input = SetInitialsImageForAccountlessSignerInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/initials_image`,
		{
			method: 'PUT',
			body: base64ToBytes(input.imageBase64),
			contentType: input.contentType,
		},
	);
	return SetInitialsImageForAccountlessSignerOutputSchema.parse(data);
};

export const SetSignatureImageForNoAccountSignerInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	imageBase64: z.string().min(1),
	contentType: SignatureImageContentTypeSchema.default('image/png'),
});

export const SetSignatureImageForNoAccountSignerOutputSchema = z
	.object({})
	.passthrough();

export type SetSignatureImageForNoAccountSignerParams = z.infer<
	typeof SetSignatureImageForNoAccountSignerInputSchema
>;

export const setSignatureImageForNoAccountSigner = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetSignatureImageForNoAccountSignerParams,
) => {
	const input = SetSignatureImageForNoAccountSignerInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/recipients/${encodeURIComponent(input.recipientId)}/signature_image`,
		{
			method: 'PUT',
			body: base64ToBytes(input.imageBase64),
			contentType: input.contentType,
		},
	);
	return SetSignatureImageForNoAccountSignerOutputSchema.parse(data);
};

export const UpdateEnvelopeNotificationSettingsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeNotificationSettingsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeNotificationSettingsParams = z.infer<
	typeof UpdateEnvelopeNotificationSettingsInputSchema
>;

export const updateEnvelopeNotificationSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeNotificationSettingsParams,
) => {
	const input = UpdateEnvelopeNotificationSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/notification`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeNotificationSettingsOutputSchema.parse(data);
};

export const EnvelopeManagementInputSchemas = {
	deletePageFromDocumentInEnvelope: DeletePageFromDocumentInEnvelopeInputSchema,
	getEnvelopeNotificationDefaults: GetEnvelopeNotificationDefaultsInputSchema,
	getPageImageFromEnvelope: GetPageImageFromEnvelopeInputSchema,
	getSignatureInformationForRecipient:
		GetSignatureInformationForRecipientInputSchema,
	retrieveEnvelopeAuditEvents: RetrieveEnvelopeAuditEventsInputSchema,
	retrieveEnvelopeNotificationDetails:
		RetrieveEnvelopeNotificationDetailsInputSchema,
	retrieveSignerSignatureImageInformation:
		RetrieveSignerSignatureImageInformationInputSchema,
	retrieveUserInitialsImageForEnvelopes:
		RetrieveUserInitialsImageForEnvelopesInputSchema,
	returnsDocumentPageImagesBasedOnInput:
		ReturnsDocumentPageImagesBasedOnInputInputSchema,
	rotatePageImageForEnvelope: RotatePageImageForEnvelopeInputSchema,
	setInitialsImageForAccountlessSigner:
		SetInitialsImageForAccountlessSignerInputSchema,
	setSignatureImageForNoAccountSigner:
		SetSignatureImageForNoAccountSignerInputSchema,
	updateEnvelopeNotificationSettings:
		UpdateEnvelopeNotificationSettingsInputSchema,
};

export const EnvelopeManagementOutputSchemas = {
	deletePageFromDocumentInEnvelope:
		DeletePageFromDocumentInEnvelopeOutputSchema,
	getEnvelopeNotificationDefaults: GetEnvelopeNotificationDefaultsOutputSchema,
	getPageImageFromEnvelope: GetPageImageFromEnvelopeOutputSchema,
	getSignatureInformationForRecipient:
		GetSignatureInformationForRecipientOutputSchema,
	retrieveEnvelopeAuditEvents: RetrieveEnvelopeAuditEventsOutputSchema,
	retrieveEnvelopeNotificationDetails:
		RetrieveEnvelopeNotificationDetailsOutputSchema,
	retrieveSignerSignatureImageInformation:
		RetrieveSignerSignatureImageInformationOutputSchema,
	retrieveUserInitialsImageForEnvelopes:
		RetrieveUserInitialsImageForEnvelopesOutputSchema,
	returnsDocumentPageImagesBasedOnInput:
		ReturnsDocumentPageImagesBasedOnInputOutputSchema,
	rotatePageImageForEnvelope: RotatePageImageForEnvelopeOutputSchema,
	setInitialsImageForAccountlessSigner:
		SetInitialsImageForAccountlessSignerOutputSchema,
	setSignatureImageForNoAccountSigner:
		SetSignatureImageForNoAccountSignerOutputSchema,
	updateEnvelopeNotificationSettings:
		UpdateEnvelopeNotificationSettingsOutputSchema,
};
