import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import {
	CopyDocumentInputSchema,
	CopyDocumentOutputSchema,
	CreateEmailDocumentInputSchema,
	CreateEmailDocumentOutputSchema,
	DeleteDocumentInputSchema,
	DeleteDocumentOutputSchema,
	GetDocumentInputSchema,
	GetDocumentLogsInputSchema,
	GetDocumentLogsOutputSchema,
	GetDocumentOutputSchema,
	ListDocumentsInputSchema,
	ListDocumentsOutputSchema,
	ProcessDocumentInputSchema,
	ProcessDocumentOutputSchema,
	SkipDocumentInputSchema,
	SkipDocumentOutputSchema,
	UploadDocumentInputSchema,
	UploadDocumentOutputSchema,
} from './types';

export const listDocuments: ParseurEndpoints['listDocuments'] = async (
	ctx,
	input,
) => {
	const parsed = ListDocumentsInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/document_set`,
		{
			apiKey: ctx.key,
			method: 'GET',
			query: {
				page: parsed.page,
				page_size: parsed.page_size,
				search: parsed.search,
				ordering: parsed.ordering,
				status: parsed.status,
				received_after: parsed.received_after,
				received_before: parsed.received_before,
				processed_after: parsed.processed_after,
				processed_before: parsed.processed_before,
				tz: parsed.tz,
				with_result: parsed.with_result,
			},
		},
	);

	const output = ListDocumentsOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.listDocuments',
		{ mailboxId: parsed.id, page: parsed.page },
		'completed',
	);

	return output;
};

export const getDocument: ParseurEndpoints['getDocument'] = async (
	ctx,
	input,
) => {
	const parsed = GetDocumentInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(`/document/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'GET',
	});

	const output = GetDocumentOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.getDocument',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const deleteDocument: ParseurEndpoints['deleteDocument'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteDocumentInputSchema.parse(input);
	await makeParseurRequest<unknown>(`/document/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'parseur.documents.deleteDocument',
		{ id: parsed.id },
		'completed',
	);

	return DeleteDocumentOutputSchema.parse({ success: true });
};

export const getDocumentLogs: ParseurEndpoints['getDocumentLogs'] = async (
	ctx,
	input,
) => {
	const parsed = GetDocumentLogsInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/document/${parsed.id}/log_set`,
		{
			apiKey: ctx.key,
			method: 'GET',
			query: {
				page: parsed.page,
				page_size: parsed.page_size,
			},
		},
	);

	const output = GetDocumentLogsOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.getDocumentLogs',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const uploadDocument: ParseurEndpoints['uploadDocument'] = async (
	ctx,
	input,
) => {
	const parsed = UploadDocumentInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/upload`,
		{
			apiKey: ctx.key,
			method: 'POST',
			body: {
				file: parsed.file,
				file_name: parsed.file_name,
			},
		},
	);

	const output = UploadDocumentOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.uploadDocument',
		{ mailboxId: parsed.id },
		'completed',
	);

	return output;
};

export const createEmailDocument: ParseurEndpoints['createEmailDocument'] =
	async (ctx, input) => {
		const parsed = CreateEmailDocumentInputSchema.parse(input);
		const response = await makeParseurRequest<unknown>('/email', {
			apiKey: ctx.key,
			method: 'POST',
			body: parsed,
		});

		const output = CreateEmailDocumentOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'parseur.documents.createEmailDocument',
			{ parser_id: parsed.parser_id ?? parsed.mailbox_id },
			'completed',
		);

		return output;
	};

export const processDocument: ParseurEndpoints['processDocument'] = async (
	ctx,
	input,
) => {
	const parsed = ProcessDocumentInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/document/${parsed.id}/process`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = ProcessDocumentOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.processDocument',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const skipDocument: ParseurEndpoints['skipDocument'] = async (
	ctx,
	input,
) => {
	const parsed = SkipDocumentInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/document/${parsed.id}/skip`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = SkipDocumentOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.skipDocument',
		{ id: parsed.id },
		'completed',
	);

	return output;
};

export const copyDocument: ParseurEndpoints['copyDocument'] = async (
	ctx,
	input,
) => {
	const parsed = CopyDocumentInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/document/${parsed.id}/copy/${parsed.target_mailbox_id}`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = CopyDocumentOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.documents.copyDocument',
		{ id: parsed.id, targetMailboxId: parsed.target_mailbox_id },
		'completed',
	);

	return output;
};
