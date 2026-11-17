import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, docparserRequest, seg } from '../client';
import type { DocparserContext } from '../context';
import type {
	DocumentIdsInput,
	FetchDocumentInput,
	ImportResponse,
	ScheduledResponse,
	UploadDocumentInput,
} from './types';
import {
	DocumentIdsInputSchema,
	FetchDocumentInputSchema,
	ImportResponseSchema,
	ScheduledResponseSchema,
	UploadDocumentInputSchema,
} from './types';

// Narrows one untyped JSON value.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// Same as text(), for numbers.
function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// body is the raw JSON response of an import.
function importOf(body: unknown, idKey: 'id' | 'document_id'): ImportResponse {
	const row = asRecord(body);
	const documentId = text(row?.[idKey]);
	if (!documentId)
		throw new Error('Docparser import response was missing the document id');
	return ImportResponseSchema.parse({
		documentId,
		quotaUsed: num(row?.quota_used),
		quotaLeft: num(row?.quota_left),
		quotaRefill: text(row?.quota_refill),
	});
}

export const fetchDocument: CorsairEndpoint<
	DocparserContext,
	FetchDocumentInput,
	ImportResponse
> = async (ctx, input) => {
	const parsed = FetchDocumentInputSchema.parse(input);
	const body = await docparserRequest<unknown>(
		ctx.key,
		'POST',
		`/v2/document/fetch/${seg(parsed.parserId)}`,
		{ formData: { url: parsed.url, remote_id: parsed.remoteId } },
	);
	const result = importOf(body, 'document_id');
	// The document URL stays out of the event.
	await logEventFromContext(
		ctx,
		'docparser.documents.fetch',
		{ count: 1 },
		'completed',
	);
	return result;
};

export const uploadDocument: CorsairEndpoint<
	DocparserContext,
	UploadDocumentInput,
	ImportResponse
> = async (ctx, input) => {
	const parsed = UploadDocumentInputSchema.parse(input);
	const body = await docparserRequest<unknown>(
		ctx.key,
		'POST',
		`/v1/document/upload/${seg(parsed.parserId)}`,
		{
			formData: {
				file_content: parsed.fileContent,
				file_name: parsed.fileName,
				remote_id: parsed.remoteId,
			},
		},
	);
	const result = importOf(body, 'id');
	await logEventFromContext(
		ctx,
		'docparser.documents.upload',
		{ count: 1 },
		'completed',
	);
	return result;
};

async function schedule(
	ctx: DocparserContext,
	input: DocumentIdsInput,
	action: 'reparse' | 'reintegrate',
): Promise<ScheduledResponse> {
	const parsed = DocumentIdsInputSchema.parse(input);
	const body = asRecord(
		await docparserRequest<unknown>(
			ctx.key,
			'POST',
			`/v1/document/${action}/${seg(parsed.parserId)}`,
			{ formData: { 'document_ids[]': parsed.documentIds } },
		),
	);
	// Docparser answers total_reparsed or total_reintegrate.
	const scheduled = num(body?.total_reparsed) ?? num(body?.total_reintegrate);
	if (scheduled === undefined)
		throw new Error(`Docparser ${action} response was missing the total`);
	await logEventFromContext(
		ctx,
		`docparser.documents.${action}`,
		{ count: scheduled },
		'completed',
	);
	return ScheduledResponseSchema.parse({ scheduled });
}

export const reparseDocuments: CorsairEndpoint<
	DocparserContext,
	DocumentIdsInput,
	ScheduledResponse
> = async (ctx, input) => schedule(ctx, input, 'reparse');

export const reintegrateDocuments: CorsairEndpoint<
	DocparserContext,
	DocumentIdsInput,
	ScheduledResponse
> = async (ctx, input) => schedule(ctx, input, 'reintegrate');
