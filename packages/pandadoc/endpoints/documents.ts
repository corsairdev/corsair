import type { PandadocEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	PandadocEndpointInputSchemas as Inputs,
	PandadocEndpointOutputSchemas as Outputs,
} from './types';

// unknown: a binary response arrives as core's { bytes, contentType } file
// shape; the endpoint narrows it and hands the rest to the output schema.
type BinaryFile = { bytes?: Uint8Array; contentType?: string | null };

const FILE_TYPES = new Set([
	'application/pdf',
	'application/zip',
	'application/x-zip-compressed',
	'application/octet-stream',
]);

/**
 * Shapes a document download. PandaDoc answers 202 while it renders, with a
 * body that is not a PDF, so the endpoint reports pending instead of
 * returning a zero-byte or non-PDF file.
 */
// unknown: raw is the untouched response body; the binary file shape is
// core's, and a non-binary reply is still possible on an error path.
function shapeDownload(raw: unknown): unknown {
	const file = (raw ?? {}) as BinaryFile;
	const bytes = file.bytes ?? new Uint8Array(0);
	const rawType = file.contentType?.split(';')[0]?.trim().toLowerCase();
	const contentType =
		rawType !== undefined && rawType.length > 0 ? rawType : 'application/pdf';
	// The documented 202 while rendering has no file body.
	if (bytes.byteLength === 0) {
		return { contentType, byteLength: 0, pending: true };
	}
	// A PDF, or a zip when separate_files is set. Anything else (an HTML
	// error page, a JSON body) is not the document.
	if (!FILE_TYPES.has(contentType)) {
		throw new Error(
			`PandaDoc download: unexpected ${contentType} response instead of a PDF`,
		);
	}
	return {
		contentType,
		byteLength: bytes.byteLength,
		contentBase64: Buffer.from(bytes).toString('base64'),
		pending: false,
	};
}

export const list: PandadocEndpoints['documentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.list',
			input: Inputs.documentsList,
			output: Outputs.documentsList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/public/v1/documents',
			query: {
				count: query.count,
				page: query.page,
				status: query.status,
				status__ne: query.statusNe,
				deleted: query.deleted,
				q: query.q,
				id: query.id,
				folder_uuid: query.folderUuid,
				template_id: query.templateId,
				contact_id: query.contactId,
				order_by: query.orderBy,
				created_from: query.createdFrom,
				created_to: query.createdTo,
				completed_from: query.completedFrom,
				completed_to: query.completedTo,
				modified_from: query.modifiedFrom,
				modified_to: query.modifiedTo,
				metadata: query.metadata,
				tag: query.tag,
			},
		}),
		{ log: (_, page) => ({ count: page.results.length }) },
	);

export const get: PandadocEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/public/v1/documents/${encodeURIComponent(id)}/details`,
		}),
		{ log: (_, doc) => ({ documentId: doc.id, status: doc.status }) },
	);

export const create: PandadocEndpoints['documentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.create',
			input: Inputs.documentsCreate,
			output: Outputs.documentsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/public/v1/documents',
			body,
		}),
		{
			log: (_, doc) => ({
				documentId: doc.id,
				status: doc.status ?? undefined,
			}),
		},
	);

export const send: PandadocEndpoints['documentsSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.send',
			input: Inputs.documentsSend,
			output: Outputs.documentsSend,
		},
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/public/v1/documents/${encodeURIComponent(id)}/send`,
			body,
		}),
		{
			log: (_, doc) => ({
				documentId: doc.id,
				status: doc.status ?? undefined,
			}),
		},
	);

export const update: PandadocEndpoints['documentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.update',
			input: Inputs.documentsUpdate,
			output: Outputs.documentsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/public/v1/documents/${encodeURIComponent(id)}`,
			body,
		}),
		{
			// PandaDoc answers 204 with no body.
			shape: (raw, { id }) => {
				expectEmptyBody(raw, 'documents.update');
				return { id, success: true };
			},
			log: (_, result) => ({ documentId: result.id }),
		},
	);

export const remove: PandadocEndpoints['documentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.delete',
			input: Inputs.documentsDelete,
			output: Outputs.documentsDelete,
		},
		input,
		({ id, forever }) => ({
			method: 'DELETE',
			path: `/public/v1/documents/${encodeURIComponent(id)}`,
			query: { forever },
		}),
		{
			shape: (raw, { id }) => {
				expectEmptyBody(raw, 'documents.delete');
				return { id, success: true };
			},
			log: (_, result) => ({ documentId: result.id }),
		},
	);

export const download: PandadocEndpoints['documentsDownload'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.download',
			input: Inputs.documentsDownload,
			output: Outputs.documentsDownload,
		},
		input,
		({
			id,
			watermark_color,
			watermark_font_size,
			watermark_opacity,
			watermark_text,
			separate_files,
		}) => ({
			method: 'GET',
			path: `/public/v1/documents/${encodeURIComponent(id)}/download`,
			query: {
				watermark_color,
				watermark_font_size,
				watermark_opacity,
				watermark_text,
				separate_files,
			},
			binary: true,
		}),
		{
			shape: shapeDownload,
			log: (_, file) => ({ pending: file.pending, bytes: file.byteLength }),
		},
	);

export const downloadProtected: PandadocEndpoints['documentsDownloadProtected'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'documents.downloadProtected',
				input: Inputs.documentsDownloadProtected,
				output: Outputs.documentsDownloadProtected,
			},
			input,
			({ id, separate_files }) => ({
				method: 'GET',
				path: `/public/v1/documents/${encodeURIComponent(id)}/download-protected`,
				query: { separate_files },
				binary: true,
			}),
			{
				shape: shapeDownload,
				log: (_, file) => ({ pending: file.pending, bytes: file.byteLength }),
			},
		);

export const listFields: PandadocEndpoints['documentsListFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.listFields',
			input: Inputs.documentsListFields,
			output: Outputs.documentsListFields,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/public/v1/documents/${encodeURIComponent(id)}/fields`,
		}),
		{ log: ({ id }, page) => ({ documentId: id, count: page.fields.length }) },
	);

export const createFields: PandadocEndpoints['documentsCreateFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createFields',
			input: Inputs.documentsCreateFields,
			output: Outputs.documentsCreateFields,
		},
		input,
		({ id, fields }) => ({
			method: 'POST',
			path: `/public/v1/documents/${encodeURIComponent(id)}/fields`,
			body: { fields },
		}),
		{
			log: (_, result) => ({ count: result.fields.length }),
		},
	);

export const move: PandadocEndpoints['documentsMove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.move',
			input: Inputs.documentsMove,
			output: Outputs.documentsMove,
		},
		input,
		({ id, folderId }) => ({
			method: 'POST',
			path: `/public/v1/documents/${encodeURIComponent(id)}/move-to-folder/${encodeURIComponent(folderId)}`,
		}),
		{
			shape: (raw, { id, folderId }) => {
				expectEmptyBody(raw, 'documents.move');
				return { id, folderId, success: true };
			},
			log: (_, result) => ({
				documentId: result.id,
				folderId: result.folderId,
			}),
		},
	);
