import { z } from 'zod';
import { resolveClient } from './context';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	DocusignExecutionContext,
	FetchRecipientNamesForEmailParams,
	GetEnvelopeParams,
	SendEnvelopeParams,
} from './types';
import {
	CreateEnvelopeInputSchema,
	CreateEnvelopeOutputSchema,
	CreateRecipientViewUrlInputSchema,
	CreateRecipientViewUrlOutputSchema,
	FetchRecipientNamesForEmailInputSchema,
	FetchRecipientNamesForEmailOutputSchema,
	GetEnvelopeInputSchema,
	GetEnvelopeOutputSchema,
	SendEnvelopeInputSchema,
	SendEnvelopeOutputSchema,
} from './types';

export const createEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateEnvelopeParams,
) => {
	const input = CreateEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request('/envelopes', {
		method: 'POST',
		body: JSON.stringify(input),
	});
	return CreateEnvelopeOutputSchema.parse(data);
};

export const getEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeParams,
) => {
	const input = GetEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/envelopes/${input.envelopeId}`);
	return GetEnvelopeOutputSchema.parse(data);
};

export const sendEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: SendEnvelopeParams,
) => {
	const input = SendEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/envelopes/${input.envelopeId}`, {
		method: 'PUT',
		body: JSON.stringify({ status: 'sent' }),
	});
	return SendEnvelopeOutputSchema.parse(data);
};

export const createRecipientViewUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateRecipientViewUrlParams,
) => {
	const input = CreateRecipientViewUrlInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const {
		envelopeId,
		authenticationMethod = 'none',
		recipientId = '1',
		...rest
	} = input;

	const data = await client.request(
		`/envelopes/${envelopeId}/views/recipient`,
		{
			method: 'POST',
			body: JSON.stringify({
				authenticationMethod,
				recipientId,
				...rest,
			}),
		},
	);
	return CreateRecipientViewUrlOutputSchema.parse(data);
};

const EnvelopeRecipientSchema = z
	.object({
		email: z.string().optional(),
		name: z.string().optional(),
		userName: z.string().optional(),
	})
	.passthrough();

const EnvelopeRecipientsResponseSchema = z
	.object({
		recipients: z
			.object({
				signers: z.array(EnvelopeRecipientSchema).optional(),
				carbonCopies: z.array(EnvelopeRecipientSchema).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const fetchRecipientNamesForEmail = async (
	ctxOrClient: DocusignExecutionContext,
	params: FetchRecipientNamesForEmailParams,
) => {
	const input = FetchRecipientNamesForEmailInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = EnvelopeRecipientsResponseSchema.parse(
		await client.request(`/envelopes/${input.envelopeId}/recipients`),
	);
	const target = input.email.toLowerCase();
	const candidates = [
		...(data.recipients?.signers ?? []),
		...(data.recipients?.carbonCopies ?? []),
	];
	const names = candidates
		.filter(
			(recipient) =>
				typeof recipient.email === 'string' &&
				recipient.email.toLowerCase() === target,
		)
		.map((recipient) => recipient.name ?? recipient.userName ?? '')
		.filter((name) => name.length > 0);
	return FetchRecipientNamesForEmailOutputSchema.parse({
		email: input.email,
		names,
		count: names.length,
	});
};
