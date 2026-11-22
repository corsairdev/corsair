import type { ParsioEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	decodeFile,
	ParsioEndpointInputSchemas as Inputs,
	ParsioEndpointOutputSchemas as Outputs,
	shapeDocument,
} from './types';

export const createSync: ParsioEndpoints['documentsCreateSync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createSync',
			input: Inputs.documentsCreateSync,
			output: Outputs.documentsCreateSync,
		},
		input,
		({ mailboxId, ...body }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/doc-sync`,
			// Parsio holds a sync parse until it finishes.
			timeoutMs: 120_000,
			body,
		}),
		{
			shape: shapeDocument,
			log: (_, doc) => ({
				documentId: doc.doc_id,
				status: doc.status ?? undefined,
				inProgress: doc.parsing_in_progress ?? undefined,
			}),
		},
	);

export const createAsync: ParsioEndpoints['documentsCreateAsync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createAsync',
			input: Inputs.documentsCreateAsync,
			output: Outputs.documentsCreateAsync,
		},
		input,
		({ mailboxId, ...body }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/doc`,
			body,
		}),
		{
			shape: shapeDocument,
			log: (_, doc) => ({
				documentId: doc.doc_id,
				status: doc.status ?? undefined,
			}),
		},
	);

export const uploadSync: ParsioEndpoints['documentsUploadSync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.uploadSync',
			input: Inputs.documentsUploadSync,
			output: Outputs.documentsUploadSync,
		},
		input,
		({ mailboxId, filename, contentBase64 }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/upload-sync`,
			// Parsio holds a sync parse until it finishes.
			timeoutMs: 120_000,
			formData: { file: decodeFile(filename, contentBase64), filename },
		}),
		{
			shape: shapeDocument,
			log: (_, doc) => ({
				documentId: doc.doc_id,
				status: doc.status ?? undefined,
				inProgress: doc.parsing_in_progress ?? undefined,
			}),
		},
	);

export const uploadAsync: ParsioEndpoints['documentsUploadAsync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.uploadAsync',
			input: Inputs.documentsUploadAsync,
			output: Outputs.documentsUploadAsync,
		},
		input,
		({ mailboxId, filename, contentBase64 }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/upload`,
			formData: { file: decodeFile(filename, contentBase64), filename },
		}),
		{
			shape: shapeDocument,
			log: (_, doc) => ({
				documentId: doc.doc_id,
				status: doc.status ?? undefined,
			}),
		},
	);

export const list: ParsioEndpoints['documentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.list',
			input: Inputs.documentsList,
			output: Outputs.documentsList,
		},
		input,
		({ mailboxId, ...query }) => ({
			method: 'GET',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/docs`,
			query,
		}),
		{ log: (_, page) => ({ count: page.docs.length }) },
	);

export const get: ParsioEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		({ documentId }) => ({
			method: 'GET',
			path: `/docs/${encodeURIComponent(documentId)}`,
		}),
		{
			shape: shapeDocument,
			log: (_, doc) => ({
				documentId: doc.doc_id,
				status: doc.status ?? undefined,
			}),
		},
	);

export const reparse: ParsioEndpoints['documentsReparse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.reparse',
			input: Inputs.documentsReparse,
			output: Outputs.documentsReparse,
		},
		input,
		({ documentId }) => ({
			method: 'POST',
			path: `/docs/${encodeURIComponent(documentId)}/parse`,
		}),
		{
			// The API answers a bare number (live); the document id is echoed.
			shape: (raw, { documentId }) => {
				// The documented success is a bare number (sometimes as text).
				if (
					!(
						typeof raw === 'number' ||
						(typeof raw === 'string' && /^\d+$/.test(raw))
					)
				) {
					throw new Error(
						'Parsio documents.reparse: unexpected answer (not the queued number)',
					);
				}
				return { doc_id: documentId, queued: true, result: raw };
			},
			log: (_, doc) => ({ documentId: doc.doc_id }),
		},
	);

export const skipMany: ParsioEndpoints['documentsSkipMany'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.skipMany',
			input: Inputs.documentsSkipMany,
			output: Outputs.documentsSkipMany,
		},
		input,
		({ mailboxId, ids }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/docs/skip`,
			body: { ids },
		}),
		{
			shape: (raw, { ids }) => {
				expectEmptyBody(raw, 'documents.skipMany');
				return { count: ids.length, success: true };
			},
			log: (_, result) => ({ count: result.count }),
		},
	);
