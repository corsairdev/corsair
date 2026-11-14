import { logEventFromContext } from 'corsair/core';
import { makeDocumensoRequest } from '../client';
import type { DocumensoEndpoint } from '../index';
import {
	DocumensoEndpointInputSchemas,
	DocumensoEndpointOutputSchemas,
} from './types';

export const envelopeAttachmentFind: DocumensoEndpoint<
	'envelopeAttachmentFind'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAttachmentFind.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAttachmentFind',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAttachmentFind.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAttachmentFind',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeAttachmentCreate: DocumensoEndpoint<
	'envelopeAttachmentCreate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAttachmentCreate.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAttachmentCreate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAttachmentCreate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAttachmentCreate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeAttachmentUpdate: DocumensoEndpoint<
	'envelopeAttachmentUpdate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAttachmentUpdate.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAttachmentUpdate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAttachmentUpdate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAttachmentUpdate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeAttachmentDelete: DocumensoEndpoint<
	'envelopeAttachmentDelete'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAttachmentDelete.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAttachmentDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAttachmentDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAttachmentDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeItemCreateMany: DocumensoEndpoint<
	'envelopeItemCreateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeItemCreateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeItemCreateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeItemCreateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeItemCreateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeItemUpdateMany: DocumensoEndpoint<
	'envelopeItemUpdateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeItemUpdateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeItemUpdateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeItemUpdateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeItemUpdateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeItemDelete: DocumensoEndpoint<
	'envelopeItemDelete'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeItemDelete.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeItemDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeItemDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeItemDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeItemDownload: DocumensoEndpoint<
	'envelopeItemDownload'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeItemDownload.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeItemDownload',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeItemDownload.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeItemDownload',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRecipientGet: DocumensoEndpoint<
	'envelopeRecipientGet'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRecipientGet.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeRecipientGet',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRecipientGet.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRecipientGet',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRecipientCreateMany: DocumensoEndpoint<
	'envelopeRecipientCreateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRecipientCreateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeRecipientCreateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRecipientCreateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRecipientCreateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRecipientUpdateMany: DocumensoEndpoint<
	'envelopeRecipientUpdateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRecipientUpdateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeRecipientUpdateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRecipientUpdateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRecipientUpdateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRecipientDelete: DocumensoEndpoint<
	'envelopeRecipientDelete'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRecipientDelete.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeRecipientDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRecipientDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRecipientDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRecipientRejectOnBehalfOf: DocumensoEndpoint<
	'envelopeRecipientRejectOnBehalfOf'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRecipientRejectOnBehalfOf.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'envelopeRecipientRejectOnBehalfOf',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRecipientRejectOnBehalfOf.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRecipientRejectOnBehalfOf',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeFieldGet: DocumensoEndpoint<'envelopeFieldGet'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeFieldGet.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeFieldGet',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeFieldGet.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeFieldGet',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeFieldCreateMany: DocumensoEndpoint<
	'envelopeFieldCreateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeFieldCreateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeFieldCreateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeFieldCreateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeFieldCreateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeFieldUpdateMany: DocumensoEndpoint<
	'envelopeFieldUpdateMany'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeFieldUpdateMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeFieldUpdateMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeFieldUpdateMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeFieldUpdateMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeFieldDelete: DocumensoEndpoint<
	'envelopeFieldDelete'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeFieldDelete.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeFieldDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeFieldDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeFieldDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeFind: DocumensoEndpoint<'envelopeFind'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeFind.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeFind',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeFind.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeFind',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeAuditLogFind: DocumensoEndpoint<
	'envelopeAuditLogFind'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAuditLogFind.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAuditLogFind',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAuditLogFind.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAuditLogFind',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeAuditLogDownloadPdf: DocumensoEndpoint<
	'envelopeAuditLogDownloadPdf'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeAuditLogDownloadPdf.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeAuditLogDownloadPdf',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeAuditLogDownloadPdf.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeAuditLogDownloadPdf',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeCertificateDownloadPdf: DocumensoEndpoint<
	'envelopeCertificateDownloadPdf'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeCertificateDownloadPdf.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeCertificateDownloadPdf',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeCertificateDownloadPdf.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeCertificateDownloadPdf',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeGet: DocumensoEndpoint<'envelopeGet'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeGet.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeGet',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeGet.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeGet',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeGetMany: DocumensoEndpoint<'envelopeGetMany'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeGetMany.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeGetMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeGetMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeGetMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeCreate: DocumensoEndpoint<'envelopeCreate'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeCreate.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeCreate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeCreate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeCreate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeUse: DocumensoEndpoint<'envelopeUse'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeUse.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeUse',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeUse.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeUse',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeUpdate: DocumensoEndpoint<'envelopeUpdate'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeUpdate.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeUpdate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeUpdate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeUpdate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeDelete: DocumensoEndpoint<'envelopeDelete'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeDelete.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeCancel: DocumensoEndpoint<'envelopeCancel'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.envelopeCancel.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeCancel',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeCancel.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeCancel',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeDuplicate: DocumensoEndpoint<'envelopeDuplicate'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeDuplicate.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeDuplicate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeDuplicate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeDuplicate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeDistribute: DocumensoEndpoint<
	'envelopeDistribute'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeDistribute.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeDistribute',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeDistribute.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeDistribute',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const envelopeRedistribute: DocumensoEndpoint<
	'envelopeRedistribute'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.envelopeRedistribute.parse(input);
	const response = await makeDocumensoRequest(
		'envelopeRedistribute',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.envelopeRedistribute.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.envelopeRedistribute',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentGet: DocumensoEndpoint<'documentGet'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.documentGet.parse(input);
	const response = await makeDocumensoRequest(
		'documentGet',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentGet.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentGet',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentGetMany: DocumensoEndpoint<'documentGetMany'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentGetMany.parse(input);
	const response = await makeDocumensoRequest(
		'documentGetMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentGetMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentGetMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentFind: DocumensoEndpoint<'documentFind'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.documentFind.parse(input);
	const response = await makeDocumensoRequest(
		'documentFind',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentFind.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentFind',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentCreate: DocumensoEndpoint<'documentCreate'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.documentCreate.parse(input);
	const response = await makeDocumensoRequest(
		'documentCreate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentCreate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentCreate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentUpdate: DocumensoEndpoint<'documentUpdate'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.documentUpdate.parse(input);
	const response = await makeDocumensoRequest(
		'documentUpdate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentUpdate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentUpdate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentDelete: DocumensoEndpoint<'documentDelete'> = async (
	ctx,
	input,
) => {
	const parsedInput = DocumensoEndpointInputSchemas.documentDelete.parse(input);
	const response = await makeDocumensoRequest(
		'documentDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentDuplicate: DocumensoEndpoint<'documentDuplicate'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentDuplicate.parse(input);
	const response = await makeDocumensoRequest(
		'documentDuplicate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentDuplicate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentDuplicate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentDistribute: DocumensoEndpoint<
	'documentDistribute'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentDistribute.parse(input);
	const response = await makeDocumensoRequest(
		'documentDistribute',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentDistribute.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentDistribute',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentRedistribute: DocumensoEndpoint<
	'documentRedistribute'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentRedistribute.parse(input);
	const response = await makeDocumensoRequest(
		'documentRedistribute',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentRedistribute.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentRedistribute',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentDownload: DocumensoEndpoint<'documentDownload'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentDownload.parse(input);
	const response = await makeDocumensoRequest(
		'documentDownload',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentDownload.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentDownload',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentDownloadBeta: DocumensoEndpoint<
	'documentDownloadBeta'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentDownloadBeta.parse(input);
	const response = await makeDocumensoRequest(
		'documentDownloadBeta',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentDownloadBeta.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentDownloadBeta',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentCreateDocumentTemporary: DocumensoEndpoint<
	'documentCreateDocumentTemporary'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentCreateDocumentTemporary.parse(input);
	const response = await makeDocumensoRequest(
		'documentCreateDocumentTemporary',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentCreateDocumentTemporary.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentCreateDocumentTemporary',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentAttachmentCreate: DocumensoEndpoint<
	'documentAttachmentCreate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentAttachmentCreate.parse(input);
	const response = await makeDocumensoRequest(
		'documentAttachmentCreate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentAttachmentCreate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentAttachmentCreate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentAttachmentUpdate: DocumensoEndpoint<
	'documentAttachmentUpdate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentAttachmentUpdate.parse(input);
	const response = await makeDocumensoRequest(
		'documentAttachmentUpdate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentAttachmentUpdate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentAttachmentUpdate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentAttachmentDelete: DocumensoEndpoint<
	'documentAttachmentDelete'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentAttachmentDelete.parse(input);
	const response = await makeDocumensoRequest(
		'documentAttachmentDelete',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentAttachmentDelete.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentAttachmentDelete',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const documentAttachmentFind: DocumensoEndpoint<
	'documentAttachmentFind'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.documentAttachmentFind.parse(input);
	const response = await makeDocumensoRequest(
		'documentAttachmentFind',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.documentAttachmentFind.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.documentAttachmentFind',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldGetDocumentField: DocumensoEndpoint<
	'fieldGetDocumentField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldGetDocumentField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldGetDocumentField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldGetDocumentField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldGetDocumentField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldCreateDocumentField: DocumensoEndpoint<
	'fieldCreateDocumentField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldCreateDocumentField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldCreateDocumentField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldCreateDocumentField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldCreateDocumentField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldCreateDocumentFields: DocumensoEndpoint<
	'fieldCreateDocumentFields'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldCreateDocumentFields.parse(input);
	const response = await makeDocumensoRequest(
		'fieldCreateDocumentFields',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldCreateDocumentFields.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldCreateDocumentFields',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldUpdateDocumentField: DocumensoEndpoint<
	'fieldUpdateDocumentField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldUpdateDocumentField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldUpdateDocumentField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldUpdateDocumentField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldUpdateDocumentField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldUpdateDocumentFields: DocumensoEndpoint<
	'fieldUpdateDocumentFields'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldUpdateDocumentFields.parse(input);
	const response = await makeDocumensoRequest(
		'fieldUpdateDocumentFields',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldUpdateDocumentFields.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldUpdateDocumentFields',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldDeleteDocumentField: DocumensoEndpoint<
	'fieldDeleteDocumentField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldDeleteDocumentField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldDeleteDocumentField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldDeleteDocumentField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldDeleteDocumentField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldCreateTemplateField: DocumensoEndpoint<
	'fieldCreateTemplateField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldCreateTemplateField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldCreateTemplateField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldCreateTemplateField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldCreateTemplateField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldGetTemplateField: DocumensoEndpoint<
	'fieldGetTemplateField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldGetTemplateField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldGetTemplateField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldGetTemplateField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldGetTemplateField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldCreateTemplateFields: DocumensoEndpoint<
	'fieldCreateTemplateFields'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldCreateTemplateFields.parse(input);
	const response = await makeDocumensoRequest(
		'fieldCreateTemplateFields',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldCreateTemplateFields.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldCreateTemplateFields',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldUpdateTemplateField: DocumensoEndpoint<
	'fieldUpdateTemplateField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldUpdateTemplateField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldUpdateTemplateField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldUpdateTemplateField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldUpdateTemplateField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldUpdateTemplateFields: DocumensoEndpoint<
	'fieldUpdateTemplateFields'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldUpdateTemplateFields.parse(input);
	const response = await makeDocumensoRequest(
		'fieldUpdateTemplateFields',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldUpdateTemplateFields.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldUpdateTemplateFields',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const fieldDeleteTemplateField: DocumensoEndpoint<
	'fieldDeleteTemplateField'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.fieldDeleteTemplateField.parse(input);
	const response = await makeDocumensoRequest(
		'fieldDeleteTemplateField',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.fieldDeleteTemplateField.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.fieldDeleteTemplateField',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const folderFindFolders: DocumensoEndpoint<'folderFindFolders'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.folderFindFolders.parse(input);
	const response = await makeDocumensoRequest(
		'folderFindFolders',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.folderFindFolders.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.folderFindFolders',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const folderCreateFolder: DocumensoEndpoint<
	'folderCreateFolder'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.folderCreateFolder.parse(input);
	const response = await makeDocumensoRequest(
		'folderCreateFolder',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.folderCreateFolder.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.folderCreateFolder',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const folderUpdateFolder: DocumensoEndpoint<
	'folderUpdateFolder'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.folderUpdateFolder.parse(input);
	const response = await makeDocumensoRequest(
		'folderUpdateFolder',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.folderUpdateFolder.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.folderUpdateFolder',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const folderDeleteFolder: DocumensoEndpoint<
	'folderDeleteFolder'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.folderDeleteFolder.parse(input);
	const response = await makeDocumensoRequest(
		'folderDeleteFolder',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.folderDeleteFolder.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.folderDeleteFolder',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientGetDocumentRecipient: DocumensoEndpoint<
	'recipientGetDocumentRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientGetDocumentRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientGetDocumentRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientGetDocumentRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientGetDocumentRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientCreateDocumentRecipient: DocumensoEndpoint<
	'recipientCreateDocumentRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientCreateDocumentRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientCreateDocumentRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientCreateDocumentRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientCreateDocumentRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientCreateDocumentRecipients: DocumensoEndpoint<
	'recipientCreateDocumentRecipients'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientCreateDocumentRecipients.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'recipientCreateDocumentRecipients',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientCreateDocumentRecipients.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientCreateDocumentRecipients',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientUpdateDocumentRecipient: DocumensoEndpoint<
	'recipientUpdateDocumentRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientUpdateDocumentRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientUpdateDocumentRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientUpdateDocumentRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientUpdateDocumentRecipients: DocumensoEndpoint<
	'recipientUpdateDocumentRecipients'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientUpdateDocumentRecipients.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'recipientUpdateDocumentRecipients',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientUpdateDocumentRecipients.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientUpdateDocumentRecipients',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientDeleteDocumentRecipient: DocumensoEndpoint<
	'recipientDeleteDocumentRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientDeleteDocumentRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientDeleteDocumentRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientDeleteDocumentRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientDeleteDocumentRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientGetTemplateRecipient: DocumensoEndpoint<
	'recipientGetTemplateRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientGetTemplateRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientGetTemplateRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientGetTemplateRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientGetTemplateRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientCreateTemplateRecipient: DocumensoEndpoint<
	'recipientCreateTemplateRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientCreateTemplateRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientCreateTemplateRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientCreateTemplateRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientCreateTemplateRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientCreateTemplateRecipients: DocumensoEndpoint<
	'recipientCreateTemplateRecipients'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientCreateTemplateRecipients.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'recipientCreateTemplateRecipients',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientCreateTemplateRecipients.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientCreateTemplateRecipients',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientUpdateTemplateRecipient: DocumensoEndpoint<
	'recipientUpdateTemplateRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientUpdateTemplateRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientUpdateTemplateRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientUpdateTemplateRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientUpdateTemplateRecipients: DocumensoEndpoint<
	'recipientUpdateTemplateRecipients'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientUpdateTemplateRecipients.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'recipientUpdateTemplateRecipients',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientUpdateTemplateRecipients.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientUpdateTemplateRecipients',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const recipientDeleteTemplateRecipient: DocumensoEndpoint<
	'recipientDeleteTemplateRecipient'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.recipientDeleteTemplateRecipient.parse(input);
	const response = await makeDocumensoRequest(
		'recipientDeleteTemplateRecipient',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.recipientDeleteTemplateRecipient.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.recipientDeleteTemplateRecipient',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateFindTemplates: DocumensoEndpoint<
	'templateFindTemplates'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateFindTemplates.parse(input);
	const response = await makeDocumensoRequest(
		'templateFindTemplates',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateFindTemplates.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateFindTemplates',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateGetTemplateById: DocumensoEndpoint<
	'templateGetTemplateById'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateGetTemplateById.parse(input);
	const response = await makeDocumensoRequest(
		'templateGetTemplateById',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateGetTemplateById.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateGetTemplateById',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateGetMany: DocumensoEndpoint<'templateGetMany'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateGetMany.parse(input);
	const response = await makeDocumensoRequest(
		'templateGetMany',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateGetMany.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateGetMany',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateCreateTemplate: DocumensoEndpoint<
	'templateCreateTemplate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateCreateTemplate.parse(input);
	const response = await makeDocumensoRequest(
		'templateCreateTemplate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateCreateTemplate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateCreateTemplate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateCreateTemplateTemporary: DocumensoEndpoint<
	'templateCreateTemplateTemporary'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateCreateTemplateTemporary.parse(input);
	const response = await makeDocumensoRequest(
		'templateCreateTemplateTemporary',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateCreateTemplateTemporary.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateCreateTemplateTemporary',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateUpdateTemplate: DocumensoEndpoint<
	'templateUpdateTemplate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateUpdateTemplate.parse(input);
	const response = await makeDocumensoRequest(
		'templateUpdateTemplate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateUpdateTemplate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateUpdateTemplate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateDuplicateTemplate: DocumensoEndpoint<
	'templateDuplicateTemplate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateDuplicateTemplate.parse(input);
	const response = await makeDocumensoRequest(
		'templateDuplicateTemplate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateDuplicateTemplate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateDuplicateTemplate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateDeleteTemplate: DocumensoEndpoint<
	'templateDeleteTemplate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateDeleteTemplate.parse(input);
	const response = await makeDocumensoRequest(
		'templateDeleteTemplate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateDeleteTemplate.parse(response);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateDeleteTemplate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateCreateDocumentFromTemplate: DocumensoEndpoint<
	'templateCreateDocumentFromTemplate'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateCreateDocumentFromTemplate.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'templateCreateDocumentFromTemplate',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateCreateDocumentFromTemplate.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateCreateDocumentFromTemplate',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateCreateTemplateDirectLink: DocumensoEndpoint<
	'templateCreateTemplateDirectLink'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateCreateTemplateDirectLink.parse(input);
	const response = await makeDocumensoRequest(
		'templateCreateTemplateDirectLink',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateCreateTemplateDirectLink.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateCreateTemplateDirectLink',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateDeleteTemplateDirectLink: DocumensoEndpoint<
	'templateDeleteTemplateDirectLink'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateDeleteTemplateDirectLink.parse(input);
	const response = await makeDocumensoRequest(
		'templateDeleteTemplateDirectLink',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateDeleteTemplateDirectLink.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateDeleteTemplateDirectLink',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const templateToggleTemplateDirectLink: DocumensoEndpoint<
	'templateToggleTemplateDirectLink'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.templateToggleTemplateDirectLink.parse(input);
	const response = await makeDocumensoRequest(
		'templateToggleTemplateDirectLink',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.templateToggleTemplateDirectLink.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.templateToggleTemplateDirectLink',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const embeddingPresignCreateEmbeddingPresignToken: DocumensoEndpoint<
	'embeddingPresignCreateEmbeddingPresignToken'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.embeddingPresignCreateEmbeddingPresignToken.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'embeddingPresignCreateEmbeddingPresignToken',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.embeddingPresignCreateEmbeddingPresignToken.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.embeddingPresignCreateEmbeddingPresignToken',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};

export const embeddingPresignVerifyEmbeddingPresignToken: DocumensoEndpoint<
	'embeddingPresignVerifyEmbeddingPresignToken'
> = async (ctx, input) => {
	const parsedInput =
		DocumensoEndpointInputSchemas.embeddingPresignVerifyEmbeddingPresignToken.parse(
			input,
		);
	const response = await makeDocumensoRequest(
		'embeddingPresignVerifyEmbeddingPresignToken',
		{ key: ctx.key, baseUrl: ctx.options.baseUrl },
		parsedInput,
	);
	const parsedResponse =
		DocumensoEndpointOutputSchemas.embeddingPresignVerifyEmbeddingPresignToken.parse(
			response,
		);
	// Log only the operation name and status; document content, signer PII, tokens, and file content stay private.
	await logEventFromContext(
		ctx,
		'documenso.embeddingPresignVerifyEmbeddingPresignToken',
		{ status: 'completed' },
		'completed',
	);
	return parsedResponse;
};
