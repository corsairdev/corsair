import { logEventFromContext } from 'corsair/core';
import { makePdfMonkeyRequest } from '../client';
import type { PDFMonkeyEndpoints } from '../index';
import type {
	PDFMonkeyEndpointInputs,
	PDFMonkeyEndpointOutputs,
} from './types';

/** Create a document (async, queues for generation) */
export const createDocument: PDFMonkeyEndpoints['createDocument'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['createDocument']
	>('/api/v1/documents', {
		apiKey: ctx.key,
		method: 'POST',
		body: {
			document: {
				document_template_id: input.document.document_template_id,
				status: input.document.status,
				payload: input.document.payload,
				meta: input.document.meta,
			},
		},
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.createDocument',
		{
			document_template_id: input.document.document_template_id,
			status: input.document.status,
		},
		'completed',
	);

	return response;
};

/** Create a document synchronously (waits for generation to complete) */
export const createDocumentSync: PDFMonkeyEndpoints['createDocumentSync'] =
	async (ctx, input) => {
		const response = await makePdfMonkeyRequest<
			PDFMonkeyEndpointOutputs['createDocumentSync']
		>('/api/v1/documents/sync', {
			apiKey: ctx.key,
			method: 'POST',
			body: {
				document: {
					document_template_id: input.document.document_template_id,
					status: input.document.status,
					payload: input.document.payload,
					meta: input.document.meta,
				},
			},
		});

		await logEventFromContext(
			ctx,
			'pdfmonkey.documents.createDocumentSync',
			{
				document_template_id: input.document.document_template_id,
				status: input.document.status,
			},
			'completed',
		);

		return response;
	};

/** Get a document card (status + download URL) */
export const getDocumentCard: PDFMonkeyEndpoints['getDocumentCard'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['getDocumentCard']
	>('/api/v1/document_cards/' + input.id, {
		apiKey: ctx.key,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.getDocumentCard',
		{ id: input.id },
		'completed',
	);

	return response;
};

/** List document cards (paginated with filters) */
export const listDocumentCards: PDFMonkeyEndpoints['listDocumentCards'] =
	async (ctx, input) => {
		const response = await makePdfMonkeyRequest<
			PDFMonkeyEndpointOutputs['listDocumentCards']
		>('/api/v1/document_cards', {
			apiKey: ctx.key,
			method: 'GET',
			query: {
				page: input.page,
				q_document_template_id: input.q_document_template_id,
				q_status: input.q_status,
				q_workspace_id: input.q_workspace_id,
				q_updated_since: input.q_updated_since,
				q_search: input.q_search,
			},
		});

		await logEventFromContext(
			ctx,
			'pdfmonkey.documents.listDocumentCards',
			{
				page: input.page,
				q_status: input.q_status,
			},
			'completed',
		);

		return response;
	};

/** Get a full document (with payload and generation logs) */
export const getDocument: PDFMonkeyEndpoints['getDocument'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['getDocument']
	>('/api/v1/documents/' + input.id, {
		apiKey: ctx.key,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.getDocument',
		{ id: input.id },
		'completed',
	);

	return response;
};

/** Update a document */
export const updateDocument: PDFMonkeyEndpoints['updateDocument'] = async (
	ctx,
	input,
) => {
	const document = input.document;
	if (!document) {
		throw new Error('document is required for update');
	}
	const body: Record<string, unknown> = {};
	if (document.document_template_id !== undefined)
		body.document_template_id = document.document_template_id;
	if (document.status !== undefined) body.status = document.status;
	if (document.payload !== undefined) body.payload = document.payload;
	if (document.meta !== undefined) body.meta = document.meta;

	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['updateDocument']
	>('/api/v1/documents/' + input.document_id, {
		apiKey: ctx.key,
		method: 'PUT',
		body: {
			document: body,
		},
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.updateDocument',
		{ document_id: input.document_id },
		'completed',
	);

	return response;
};

/** Delete a document */
export const deleteDocument: PDFMonkeyEndpoints['deleteDocument'] = async (
	ctx,
	input,
) => {
	const response = await makePdfMonkeyRequest<
		PDFMonkeyEndpointOutputs['deleteDocument']
	>('/api/v1/documents/' + input.id, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.deleteDocument',
		{ id: input.id },
		'completed',
	);

	return response;
};
