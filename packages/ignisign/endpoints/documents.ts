import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import {
	appEnvPath,
	fileFromBase64,
	makeIgnisignBinaryRequest,
	makeIgnisignRequest,
} from '../client';
import type { Document, DocumentContext } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const initialize: IgnisignEndpoint<'documents.initialize'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.initialize'].parse(input);
	const { appId, appEnv, ...body } = parsedInput;
	const endpoint = `${appEnvPath(ctx.key, { appId, appEnv })}/init-documents`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response =
		IgnisignEndpointOutputSchemas['documents.initialize'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.documents.initialize',
		{ documentId: response.documentId },
		'completed',
	);
	return response;
};

export const get: IgnisignEndpoint<'documents.get'> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.get'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}`;
	const response = await makeIgnisignRequest<Document>(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed = IgnisignEndpointOutputSchemas['documents.get'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.documents.get',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return parsed;
};

export const getContext: IgnisignEndpoint<'documents.getContext'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.getContext'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/context`;
	const response = await makeIgnisignRequest<DocumentContext>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['documents.getContext'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.documents.getContext',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return parsed;
};

export const update: IgnisignEndpoint<'documents.update'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.update'].parse(input);
	const { documentId, ...body } = parsedInput;
	const endpoint = `/v4/documents/${encodeURIComponent(documentId)}`;
	const response = await makeIgnisignRequest<Document>(endpoint, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const parsed =
		IgnisignEndpointOutputSchemas['documents.update'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.documents.update',
		{ documentId },
		'completed',
	);
	return parsed;
};

export const remove: IgnisignEndpoint<'documents.remove'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.remove'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'DELETE',
	});
	const response =
		IgnisignEndpointOutputSchemas['documents.remove'].parse(rawResponse);
	await logEventFromContext(
		ctx,
		'ignisign.documents.remove',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return response;
};

export const removeContent: IgnisignEndpoint<
	'documents.removeContent'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.removeContent'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/content`;
	const response = await makeIgnisignRequest<Document>(endpoint, ctx.key, {
		method: 'DELETE',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['documents.removeContent'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.documents.removeContent',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return parsed;
};

export const provideJsonContent: IgnisignEndpoint<
	'documents.provideJsonContent'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.provideJsonContent'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/data-json-content`;
	const response = await makeIgnisignRequest<Document>(endpoint, ctx.key, {
		method: 'POST',
		body: { jsonContent: parsedInput.jsonContent },
	});
	const parsed =
		IgnisignEndpointOutputSchemas['documents.provideJsonContent'].parse(
			response,
		);
	await logEventFromContext(
		ctx,
		'ignisign.documents.provideJsonContent',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return parsed;
};

export const providePrivateContent: IgnisignEndpoint<
	'documents.providePrivateContent'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.providePrivateContent'].parse(
			input,
		);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/private-content`;
	const response = await makeIgnisignRequest<Document>(endpoint, ctx.key, {
		method: 'POST',
		body: { documentHash: parsedInput.documentHash },
	});
	const parsed =
		IgnisignEndpointOutputSchemas['documents.providePrivateContent'].parse(
			response,
		);
	await logEventFromContext(
		ctx,
		'ignisign.documents.providePrivateContent',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return parsed;
};

export const provideFileContent: IgnisignEndpoint<
	'documents.provideFileContent'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.provideFileContent'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/file`;
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		formData: {
			file: fileFromBase64(
				parsedInput.fileBase64,
				parsedInput.fileName,
				parsedInput.mimeType,
			),
		},
	});
	const response =
		IgnisignEndpointOutputSchemas['documents.provideFileContent'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.documents.provideFileContent',
		{ documentId: parsedInput.documentId },
		'completed',
	);
	return response;
};

export const downloadOriginalDoc: IgnisignEndpoint<
	'documents.downloadOriginalDoc'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.downloadOriginalDoc'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/file`;
	const binaryResponse = await makeIgnisignBinaryRequest(endpoint, ctx.key, {
		method: 'GET',
	});
	const parsed =
		IgnisignEndpointOutputSchemas['documents.downloadOriginalDoc'].parse(
			binaryResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.documents.downloadOriginalDoc',
		{ documentId: parsedInput.documentId, size: parsed.size },
		'completed',
	);
	return parsed;
};

export const checkAuthenticity: IgnisignEndpoint<
	'documents.checkAuthenticity'
> = async (ctx, input) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['documents.checkAuthenticity'].parse(input);
	const endpoint = `/v4/documents/${encodeURIComponent(parsedInput.documentId)}/check-authenticity`;
	// IgniSign compares the uploaded file with the signed one (multipart `file`).
	// `unknown` because response JSON from provider must be validated by the Zod output schema.
	const rawResponse: unknown = await makeIgnisignRequest(endpoint, ctx.key, {
		method: 'POST',
		formData: {
			file: fileFromBase64(
				parsedInput.fileBase64,
				parsedInput.fileName,
				parsedInput.mimeType,
			),
		},
	});
	const response =
		IgnisignEndpointOutputSchemas['documents.checkAuthenticity'].parse(
			rawResponse,
		);
	await logEventFromContext(
		ctx,
		'ignisign.documents.checkAuthenticity',
		{
			documentId: parsedInput.documentId,
			authenticityValidated: response.authenticityValidated,
		},
		'completed',
	);
	return response;
};

export const DocumentsEndpoints = {
	initialize,
	get,
	getContext,
	update,
	remove,
	removeContent,
	provideJsonContent,
	providePrivateContent,
	provideFileContent,
	downloadOriginalDoc,
	checkAuthenticity,
} as const;
