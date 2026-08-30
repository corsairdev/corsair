import { logEventFromContext } from 'corsair/core';
import { makePdfMonkeyRequest } from '../client';
import type { PDFMonkeyEndpoints } from '../index';
import {
	CreateDocumentInputSchema,
	CreateDocumentSyncInputSchema,
	DeleteDocumentInputSchema,
	DocumentCardResponseSchema,
	DocumentResponseSchema,
	GetDocumentCardInputSchema,
	GetDocumentInputSchema,
	ListDocumentCardsInputSchema,
	ListDocumentCardsOutputSchema,
	PDFMonkeyEndpointOutputSchemas,
	UpdateDocumentInputSchema,
} from './types';

export const createDocument: PDFMonkeyEndpoints['createDocument'] = async (
	ctx,
	input,
) => {
	const parsed = CreateDocumentInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>('/api/v1/documents', {
		apiKey: ctx.key,
		method: 'POST',
		body: {
			document: parsed.document,
		},
	});

	const document = DocumentResponseSchema.parse(response).document;

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.createDocument',
		{
			document_template_id: parsed.document.document_template_id,
			status: parsed.document.status,
		},
		'completed',
	);

	return document;
};

export const createDocumentSync: PDFMonkeyEndpoints['createDocumentSync'] =
	async (ctx, input) => {
		const parsed = CreateDocumentSyncInputSchema.parse(input);
		const response = await makePdfMonkeyRequest<unknown>(
			'/api/v1/documents/sync',
			{
				apiKey: ctx.key,
				method: 'POST',
				body: {
					document: parsed.document,
				},
			},
		);

		const documentCard =
			DocumentCardResponseSchema.parse(response).document_card;

		await logEventFromContext(
			ctx,
			'pdfmonkey.documents.createDocumentSync',
			{
				document_template_id: parsed.document.document_template_id,
				status: parsed.document.status,
			},
			'completed',
		);

		return documentCard;
	};

export const getDocumentCard: PDFMonkeyEndpoints['getDocumentCard'] = async (
	ctx,
	input,
) => {
	const parsed = GetDocumentCardInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/document_cards/' + parsed.id,
		{
			apiKey: ctx.key,
			method: 'GET',
		},
	);

	const documentCard = DocumentCardResponseSchema.parse(response).document_card;

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.getDocumentCard',
		{ id: parsed.id },
		'completed',
	);

	return documentCard;
};

export const listDocumentCards: PDFMonkeyEndpoints['listDocumentCards'] =
	async (ctx, input) => {
		const parsed = ListDocumentCardsInputSchema.parse(input);
		const response = await makePdfMonkeyRequest<unknown>(
			'/api/v1/document_cards',
			{
				apiKey: ctx.key,
				method: 'GET',
				query: {
					page: { number: parsed.page },
					q: {
						document_template_id: parsed.q?.document_template_id,
						status: parsed.q?.status,
						workspace_id: parsed.q?.workspace_id,
						updated_since: parsed.q?.updated_since,
						search: parsed.q?.search,
					},
				},
			},
		);

		const output = ListDocumentCardsOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'pdfmonkey.documents.listDocumentCards',
			{
				page: parsed.page,
				status: parsed.q?.status,
			},
			'completed',
		);

		return output;
	};

export const getDocument: PDFMonkeyEndpoints['getDocument'] = async (
	ctx,
	input,
) => {
	const parsed = GetDocumentInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/documents/' + parsed.id,
		{
			apiKey: ctx.key,
			method: 'GET',
		},
	);

	const document = DocumentResponseSchema.parse(response).document;

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.getDocument',
		{ id: parsed.id },
		'completed',
	);

	return document;
};

export const updateDocument: PDFMonkeyEndpoints['updateDocument'] = async (
	ctx,
	input,
) => {
	const parsed = UpdateDocumentInputSchema.parse(input);
	const response = await makePdfMonkeyRequest<unknown>(
		'/api/v1/documents/' + parsed.document_id,
		{
			apiKey: ctx.key,
			method: 'PUT',
			body: {
				document: parsed.document,
			},
		},
	);

	const document = DocumentResponseSchema.parse(response).document;

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.updateDocument',
		{ document_id: parsed.document_id },
		'completed',
	);

	return document;
};

export const deleteDocument: PDFMonkeyEndpoints['deleteDocument'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteDocumentInputSchema.parse(input);
	await makePdfMonkeyRequest<unknown>('/api/v1/documents/' + parsed.id, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'pdfmonkey.documents.deleteDocument',
		{ id: parsed.id },
		'completed',
	);

	return PDFMonkeyEndpointOutputSchemas.deleteDocument.parse({ success: true });
};
