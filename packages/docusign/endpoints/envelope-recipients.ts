import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateIdproofResourceTokenForRecipientInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	token_scopes: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateIdproofResourceTokenForRecipientOutputSchema = z
	.object({})
	.passthrough();

export type CreateIdproofResourceTokenForRecipientParams = z.infer<
	typeof CreateIdproofResourceTokenForRecipientInputSchema
>;

export const createIdproofResourceTokenForRecipient = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateIdproofResourceTokenForRecipientParams,
) => {
	const input = CreateIdproofResourceTokenForRecipientInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.token_scopes !== undefined)
		query.append('token_scopes', String(input.token_scopes));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${input.envelopeId}/recipients/${input.recipientId}/identity_proof_token` +
			qs,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateIdproofResourceTokenForRecipientOutputSchema.parse(data);
};

export const CreateRecipientManualReviewLinkInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateRecipientManualReviewLinkOutputSchema = z
	.object({})
	.passthrough();

export type CreateRecipientManualReviewLinkParams = z.infer<
	typeof CreateRecipientManualReviewLinkInputSchema
>;

export const createRecipientManualReviewLink = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateRecipientManualReviewLinkParams,
) => {
	const input = CreateRecipientManualReviewLinkInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/recipients/${input.recipientId}/views/identity_manual_review`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateRecipientManualReviewLinkOutputSchema.parse(data);
};

export const CreateRecipientPreviewForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateRecipientPreviewForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type CreateRecipientPreviewForEnvelopeParams = z.infer<
	typeof CreateRecipientPreviewForEnvelopeInputSchema
>;

export const createRecipientPreviewForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateRecipientPreviewForEnvelopeParams,
) => {
	const input = CreateRecipientPreviewForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/recipient_preview`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateRecipientPreviewForEnvelopeOutputSchema.parse(data);
};

export const CreateSenderViewUrlForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateSenderViewUrlForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type CreateSenderViewUrlForEnvelopeParams = z.infer<
	typeof CreateSenderViewUrlForEnvelopeInputSchema
>;

export const createSenderViewUrlForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateSenderViewUrlForEnvelopeParams,
) => {
	const input = CreateSenderViewUrlForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/sender`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateSenderViewUrlForEnvelopeOutputSchema.parse(data);
};

export const GenerateEditViewUrlforEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const GenerateEditViewUrlforEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type GenerateEditViewUrlforEnvelopeParams = z.infer<
	typeof GenerateEditViewUrlforEnvelopeInputSchema
>;

export const generateEditViewUrlforEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GenerateEditViewUrlforEnvelopeParams,
) => {
	const input = GenerateEditViewUrlforEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/edit`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return GenerateEditViewUrlforEnvelopeOutputSchema.parse(data);
};

export const GenerateEnvelopeCorrectionUrlInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const GenerateEnvelopeCorrectionUrlOutputSchema = z
	.object({})
	.passthrough();

export type GenerateEnvelopeCorrectionUrlParams = z.infer<
	typeof GenerateEnvelopeCorrectionUrlInputSchema
>;

export const generateEnvelopeCorrectionUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: GenerateEnvelopeCorrectionUrlParams,
) => {
	const input = GenerateEnvelopeCorrectionUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/correct`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return GenerateEnvelopeCorrectionUrlOutputSchema.parse(data);
};

export const GenerateRecipientSharedViewUrlInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const GenerateRecipientSharedViewUrlOutputSchema = z
	.object({})
	.passthrough();

export type GenerateRecipientSharedViewUrlParams = z.infer<
	typeof GenerateRecipientSharedViewUrlInputSchema
>;

export const generateRecipientSharedViewUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: GenerateRecipientSharedViewUrlParams,
) => {
	const input = GenerateRecipientSharedViewUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/shared`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return GenerateRecipientSharedViewUrlOutputSchema.parse(data);
};

export const GetElectronicDisclosureForRecipientInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	langCode: z.string(),
});

export const GetElectronicDisclosureForRecipientOutputSchema = z
	.object({})
	.passthrough();

export type GetElectronicDisclosureForRecipientParams = z.infer<
	typeof GetElectronicDisclosureForRecipientInputSchema
>;

export const getElectronicDisclosureForRecipient = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetElectronicDisclosureForRecipientParams,
) => {
	const input = GetElectronicDisclosureForRecipientInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/recipients/${input.recipientId}/consumer_disclosure/${input.langCode}`,
		{
			method: 'GET',
		},
	);
	return GetElectronicDisclosureForRecipientOutputSchema.parse(data);
};

export const GetUrlforEmbeddingDocusignUiInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const GetUrlforEmbeddingDocusignUiOutputSchema = z
	.object({})
	.passthrough();

export type GetUrlforEmbeddingDocusignUiParams = z.infer<
	typeof GetUrlforEmbeddingDocusignUiInputSchema
>;

export const getUrlforEmbeddingDocusignUi = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUrlforEmbeddingDocusignUiParams,
) => {
	const input = GetUrlforEmbeddingDocusignUiInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/views/console`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return GetUrlforEmbeddingDocusignUiOutputSchema.parse(data);
};

export const RetrieveAccountVerificationWorkflowsInputSchema = z.object({
	identity_verification_workflow_status: z.string().optional(),
});

export const RetrieveAccountVerificationWorkflowsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountVerificationWorkflowsParams = z.infer<
	typeof RetrieveAccountVerificationWorkflowsInputSchema
>;

export const retrieveAccountVerificationWorkflows = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountVerificationWorkflowsParams,
) => {
	const input = RetrieveAccountVerificationWorkflowsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.identity_verification_workflow_status !== undefined)
		query.append(
			'identity_verification_workflow_status',
			String(input.identity_verification_workflow_status),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/identity_verification` + qs, {
		method: 'GET',
	});
	return RetrieveAccountVerificationWorkflowsOutputSchema.parse(data);
};

export const RetrieveDefaultDisclosureForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	langCode: z.string().optional(),
});

export const RetrieveDefaultDisclosureForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveDefaultDisclosureForEnvelopeParams = z.infer<
	typeof RetrieveDefaultDisclosureForEnvelopeInputSchema
>;

export const retrieveDefaultDisclosureForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveDefaultDisclosureForEnvelopeParams,
) => {
	const input = RetrieveDefaultDisclosureForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.langCode !== undefined)
		query.append('langCode', String(input.langCode));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${input.envelopeId}/recipients/${input.recipientId}/consumer_disclosure` +
			qs,
		{
			method: 'GET',
		},
	);
	return RetrieveDefaultDisclosureForEnvelopeOutputSchema.parse(data);
};

export const RevokeEnvelopeCorrectionUrlInputSchema = z.object({
	envelopeId: z.string(),
});

export const RevokeEnvelopeCorrectionUrlOutputSchema = z
	.object({})
	.passthrough();

export type RevokeEnvelopeCorrectionUrlParams = z.infer<
	typeof RevokeEnvelopeCorrectionUrlInputSchema
>;

export const revokeEnvelopeCorrectionUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: RevokeEnvelopeCorrectionUrlParams,
) => {
	const input = RevokeEnvelopeCorrectionUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${input.envelopeId}/views/correct`,
		{
			method: 'DELETE',
		},
	);
	return RevokeEnvelopeCorrectionUrlOutputSchema.parse(data);
};

export const EnvelopeRecipientsInputSchemas = {
	createIdproofResourceTokenForRecipient:
		CreateIdproofResourceTokenForRecipientInputSchema,
	createRecipientManualReviewLink: CreateRecipientManualReviewLinkInputSchema,
	createRecipientPreviewForEnvelope:
		CreateRecipientPreviewForEnvelopeInputSchema,
	createSenderViewUrlForEnvelope: CreateSenderViewUrlForEnvelopeInputSchema,
	generateEditViewUrlforEnvelope: GenerateEditViewUrlforEnvelopeInputSchema,
	generateEnvelopeCorrectionUrl: GenerateEnvelopeCorrectionUrlInputSchema,
	generateRecipientSharedViewUrl: GenerateRecipientSharedViewUrlInputSchema,
	getElectronicDisclosureForRecipient:
		GetElectronicDisclosureForRecipientInputSchema,
	getUrlforEmbeddingDocusignUi: GetUrlforEmbeddingDocusignUiInputSchema,
	retrieveAccountVerificationWorkflows:
		RetrieveAccountVerificationWorkflowsInputSchema,
	retrieveDefaultDisclosureForEnvelope:
		RetrieveDefaultDisclosureForEnvelopeInputSchema,
	revokeEnvelopeCorrectionUrl: RevokeEnvelopeCorrectionUrlInputSchema,
};

export const EnvelopeRecipientsOutputSchemas = {
	createIdproofResourceTokenForRecipient:
		CreateIdproofResourceTokenForRecipientOutputSchema,
	createRecipientManualReviewLink: CreateRecipientManualReviewLinkOutputSchema,
	createRecipientPreviewForEnvelope:
		CreateRecipientPreviewForEnvelopeOutputSchema,
	createSenderViewUrlForEnvelope: CreateSenderViewUrlForEnvelopeOutputSchema,
	generateEditViewUrlforEnvelope: GenerateEditViewUrlforEnvelopeOutputSchema,
	generateEnvelopeCorrectionUrl: GenerateEnvelopeCorrectionUrlOutputSchema,
	generateRecipientSharedViewUrl: GenerateRecipientSharedViewUrlOutputSchema,
	getElectronicDisclosureForRecipient:
		GetElectronicDisclosureForRecipientOutputSchema,
	getUrlforEmbeddingDocusignUi: GetUrlforEmbeddingDocusignUiOutputSchema,
	retrieveAccountVerificationWorkflows:
		RetrieveAccountVerificationWorkflowsOutputSchema,
	retrieveDefaultDisclosureForEnvelope:
		RetrieveDefaultDisclosureForEnvelopeOutputSchema,
	revokeEnvelopeCorrectionUrl: RevokeEnvelopeCorrectionUrlOutputSchema,
};
