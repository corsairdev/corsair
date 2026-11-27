import type { FileInput } from 'corsair/http';
import { resolveFileInput } from 'corsair/http';
import type { RagieEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RagieEndpointInputSchemas as Inputs,
	RagieEndpointOutputSchemas as Outputs,
	ResponseOKSchema,
} from './types';

// Ragie documents no upload size cap, so core's default download limit
// applies to a link or base64 file input.
async function uploadFile(file: FileInput): Promise<Blob> {
	if (file instanceof Blob) return file;
	return (await resolveFileInput(file, { fallbackName: 'document' })).file;
}

// GET /documents/{document_id}/source is not wrapped: it answers the original
// file as application/octet-stream, and corsair/http reads bodies as JSON or
// text, so the bytes cannot come back as they were.

export const list: RagieEndpoints['documentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.list',
			input: Inputs.documentsList,
			output: Outputs.documentsList,
		},
		input,
		({ filter, partition, cursor, page_size }) => ({
			method: 'GET',
			path: '/documents',
			query: { filter, partition, cursor, page_size },
		}),
	);

export const create: RagieEndpoints['documentsCreate'] = async (ctx, input) => {
	const parsed = Inputs.documentsCreate.parse(input ?? {});
	const form: Record<string, string | Blob | object> = {
		file: await uploadFile(parsed.file),
	};
	if (parsed.mode !== undefined) form.mode = parsed.mode;
	// getFormData JSON-stringifies non-string values, which is how Ragie wants
	// a metadata object inside a form field (the SDK sends it the same way).
	if (parsed.metadata !== undefined) form.metadata = parsed.metadata;
	if (parsed.name !== undefined) form.name = parsed.name;
	if (parsed.external_id !== undefined) form.external_id = parsed.external_id;
	if (parsed.partition !== undefined) form.partition = parsed.partition;
	return call(
		ctx,
		{
			event: 'documents.create',
			input: Inputs.documentsCreate,
			output: Outputs.documentsCreate,
		},
		parsed,
		() => ({ method: 'POST', path: '/documents', formData: form }),
		{
			log: (_parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);
};

export const createRaw: RagieEndpoints['documentsCreateRaw'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.createRaw',
			input: Inputs.documentsCreateRaw,
			output: Outputs.documentsCreateRaw,
		},
		input,
		({ data, mode, metadata, name, external_id, partition }) => ({
			method: 'POST',
			path: '/documents/raw',
			body: { data, mode, metadata, name, external_id, partition },
		}),
		{
			log: (_parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);

export const createFromUrl: RagieEndpoints['documentsCreateFromUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createFromUrl',
			input: Inputs.documentsCreateFromUrl,
			output: Outputs.documentsCreateFromUrl,
		},
		input,
		({ url, mode, metadata, name, external_id, partition }) => ({
			method: 'POST',
			path: '/documents/url',
			body: { url, mode, metadata, name, external_id, partition },
		}),
		{
			log: (_parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);

export const get: RagieEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		({ document_id }) => ({
			method: 'GET',
			path: `/documents/${segment(document_id)}`,
		}),
		{
			log: (_parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);

// The document keeps processing asynchronously; deletion itself is immediate
// on the API side and cannot be undone.
export const remove: RagieEndpoints['documentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.delete',
			input: Inputs.documentsDelete,
			output: Outputs.documentsDelete,
		},
		input,
		({ document_id }) => ({
			method: 'DELETE',
			path: `/documents/${segment(document_id)}`,
		}),
		{
			// A bodyless 200: parse it through the permissive OK schema rather
			// than letting the missing body fail the read.
			shape: (raw) => ResponseOKSchema.parse(raw ?? {}),
		},
	);

export const updateFile: RagieEndpoints['documentsUpdateFile'] = async (
	ctx,
	input,
) => {
	const parsed = Inputs.documentsUpdateFile.parse(input ?? {});
	const form: Record<string, string | Blob | object> = {
		file: await uploadFile(parsed.file),
	};
	return call(
		ctx,
		{
			event: 'documents.updateFile',
			input: Inputs.documentsUpdateFile,
			output: Outputs.documentsUpdateFile,
		},
		parsed,
		() => ({
			method: 'PUT',
			path: `/documents/${segment(parsed.document_id)}/file`,
			query:
				parsed.partition !== undefined
					? { partition: parsed.partition }
					: undefined,
			formData: form,
		}),
		{
			log: (_parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);
};

export const updateRaw: RagieEndpoints['documentsUpdateRaw'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.updateRaw',
			input: Inputs.documentsUpdateRaw,
			output: Outputs.documentsUpdateRaw,
		},
		input,
		({ document_id, data, partition }) => ({
			method: 'PUT',
			path: `/documents/${segment(document_id)}/raw`,
			query: partition !== undefined ? { partition } : undefined,
			body: { data },
		}),
	);

export const updateFromUrl: RagieEndpoints['documentsUpdateFromUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.updateFromUrl',
			input: Inputs.documentsUpdateFromUrl,
			output: Outputs.documentsUpdateFromUrl,
		},
		input,
		({ document_id, url, partition }) => ({
			method: 'PUT',
			path: `/documents/${segment(document_id)}/url`,
			query: partition !== undefined ? { partition } : undefined,
			body: { url },
		}),
	);

export const patchMetadata: RagieEndpoints['documentsPatchMetadata'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.patchMetadata',
			input: Inputs.documentsPatchMetadata,
			output: Outputs.documentsPatchMetadata,
		},
		input,
		({ document_id, metadata }) => ({
			method: 'PATCH',
			path: `/documents/${segment(document_id)}/metadata`,
			body: { metadata },
		}),
	);

export const getChunks: RagieEndpoints['documentsGetChunks'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.getChunks',
			input: Inputs.documentsGetChunks,
			output: Outputs.documentsGetChunks,
		},
		input,
		({ document_id, cursor, page_size }) => ({
			method: 'GET',
			path: `/documents/${segment(document_id)}/chunks`,
			query: { cursor, page_size },
		}),
	);

export const getContent: RagieEndpoints['documentsGetContent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.getContent',
			input: Inputs.documentsGetContent,
			output: Outputs.documentsGetContent,
		},
		input,
		({ document_id }) => ({
			method: 'GET',
			path: `/documents/${segment(document_id)}/content`,
		}),
	);

export const getSummary: RagieEndpoints['documentsGetSummary'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.getSummary',
			input: Inputs.documentsGetSummary,
			output: Outputs.documentsGetSummary,
		},
		input,
		({ document_id }) => ({
			method: 'GET',
			path: `/documents/${segment(document_id)}/summary`,
		}),
	);
