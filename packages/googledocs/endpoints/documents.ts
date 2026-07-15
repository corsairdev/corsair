import { logEventFromContext } from 'corsair/core';
import {
	countWords,
	DOCS_API_BASE,
	DRIVE_API_BASE,
	extractPlainText,
	makeAuthenticatedGoogleRequest,
	runBatchUpdate,
	summarizeStructure,
} from '../client';
import type { GoogleDocsBoundEndpoints, GoogleDocsEndpoints } from '../index';
import type { Document } from '../types';
import type { GoogleDocsEndpointOutputs } from './types';

const DOCUMENT_MIME_TYPE = 'application/vnd.google-apps.document';
const DOCUMENT_FIELDS =
	'nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,webViewLink,parents,trashed)';

async function persistDocument(
	ctx: Parameters<GoogleDocsEndpoints['getDocument']>[0],
	document: Document,
) {
	if (!ctx.db.documents?.upsertByEntityId || !document.documentId) return;
	try {
		const text = extractPlainText(document);
		const structure = summarizeStructure(document);
		const triggers = ctx.options.triggers ?? {};

		// Merge with the prior record instead of replacing it: a full replace
		// would wipe webhook-maintained fields (like the placeholder baseline)
		// that the edge-based triggers compare against.
		const prior = (await ctx.db.documents.findByEntityId?.(
			document.documentId,
		)) as { data?: Record<string, unknown> } | undefined;

		await ctx.db.documents.upsertByEntityId(document.documentId, {
			createdAt: new Date(),
			...(prior?.data ?? {}),
			id: document.documentId,
			documentId: document.documentId,
			title: document.title,
			revisionId: document.revisionId,
			// Use the same metric the webhook persists so the threshold
			// trigger's baseline stays comparable across both write paths.
			wordCount:
				triggers.countBy === 'characters' ? text.length : countWords(text),
			headerCount: structure.headers,
			footerCount: structure.footers,
			footnoteCount: structure.footnotes,
			tableCount: structure.tables,
			imageCount: structure.images,
			// We have the full document text here, so refresh the placeholder
			// and keyword baselines rather than letting them go stale until the
			// next webhook delivery.
			...(triggers.placeholder
				? { hasPlaceholder: text.includes(triggers.placeholder) }
				: {}),
			...(triggers.keyword
				? {
						hasKeyword: text
							.toLowerCase()
							.includes(triggers.keyword.toLowerCase()),
					}
				: {}),
			...(triggers.searchQuery
				? {
						hasSearchMatch:
							(document.title ?? '')
								.toLowerCase()
								.includes(triggers.searchQuery.toLowerCase()) ||
							text.toLowerCase().includes(triggers.searchQuery.toLowerCase()),
					}
				: {}),
		});
	} catch (error) {
		console.warn('Failed to save document to database:', error);
	}
}

function documentEndIndex(document: Document): number {
	const content = document.body?.content ?? [];
	const last = content[content.length - 1];
	return last?.endIndex ?? 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// documents
// ─────────────────────────────────────────────────────────────────────────────

export const createDocument: GoogleDocsEndpoints['createDocument'] = async (
	ctx,
	input,
) => {
	const document = await makeAuthenticatedGoogleRequest<
		GoogleDocsEndpointOutputs['createDocument']
	>(DOCS_API_BASE, '/documents', ctx, {
		method: 'POST',
		body: { title: input.title },
	});

	if (input.text && document.documentId) {
		await runBatchUpdate(ctx, document.documentId, [
			{ insertText: { location: { index: 1 }, text: input.text } },
		]);
	}

	await persistDocument(ctx, document);
	await logEventFromContext(
		ctx,
		'googledocs.documents.createDocument',
		{ ...input },
		'completed',
	);
	return document;
};

export const createBlankDocument: GoogleDocsEndpoints['createBlankDocument'] =
	async (ctx, input) => {
		const document = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['createBlankDocument']
		>(DOCS_API_BASE, '/documents', ctx, {
			method: 'POST',
			body: { title: input.title },
		});

		await persistDocument(ctx, document);
		await logEventFromContext(
			ctx,
			'googledocs.documents.createBlankDocument',
			{ ...input },
			'completed',
		);
		return document;
	};

export const createDocumentMarkdown: GoogleDocsEndpoints['createDocumentMarkdown'] =
	async (ctx, input) => {
		const document = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['createDocumentMarkdown']
		>(DOCS_API_BASE, '/documents', ctx, {
			method: 'POST',
			body: { title: input.title ?? 'Untitled' },
		});

		if (document.documentId) {
			await runBatchUpdate(ctx, document.documentId, [
				{ insertText: { location: { index: 1 }, text: input.markdown } },
			]);
		}

		await persistDocument(ctx, document);
		await logEventFromContext(
			ctx,
			'googledocs.documents.createDocumentMarkdown',
			{ ...input },
			'completed',
		);
		return document;
	};

export const copyDocument: GoogleDocsEndpoints['copyDocument'] = async (
	ctx,
	input,
) => {
	const file = await makeAuthenticatedGoogleRequest<
		GoogleDocsEndpointOutputs['copyDocument']
	>(DRIVE_API_BASE, `/files/${input.fileId}/copy`, ctx, {
		method: 'POST',
		body: {
			name: input.name,
			parents: input.parents,
		},
	});

	if (file.id && ctx.db.documents?.upsertByEntityId) {
		try {
			await ctx.db.documents.upsertByEntityId(file.id, {
				id: file.id,
				title: file.name,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save copied document to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledocs.documents.copyDocument',
		{ fileId: input.fileId },
		'completed',
	);
	return file;
};

export const getDocument: GoogleDocsEndpoints['getDocument'] = async (
	ctx,
	input,
) => {
	const document = await makeAuthenticatedGoogleRequest<
		GoogleDocsEndpointOutputs['getDocument']
	>(DOCS_API_BASE, `/documents/${input.documentId}`, ctx, { method: 'GET' });

	await persistDocument(ctx, document);
	await logEventFromContext(
		ctx,
		'googledocs.documents.getDocument',
		{ ...input },
		'completed',
	);
	return document;
};

export const getDocumentPlaintext: GoogleDocsEndpoints['getDocumentPlaintext'] =
	async (ctx, input) => {
		const document = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['getDocument']
		>(DOCS_API_BASE, `/documents/${input.documentId}`, ctx, { method: 'GET' });

		const text = extractPlainText(document);
		const result = {
			documentId: input.documentId,
			title: document.title,
			text,
			wordCount: countWords(text),
		};

		await persistDocument(ctx, document);
		await logEventFromContext(
			ctx,
			'googledocs.documents.getDocumentPlaintext',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateDocumentMarkdown: GoogleDocsEndpoints['updateDocumentMarkdown'] =
	async (ctx, input) => {
		const document = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['getDocument']
		>(DOCS_API_BASE, `/documents/${input.documentId}`, ctx, { method: 'GET' });

		const endIndex = documentEndIndex(document);
		// Delete the body first (indices are still valid), then insert the new
		// content at 1. Pin the batchUpdate to the revision we just read: if a
		// collaborator edits between the GET and this POST, the indices are stale
		// and the write would silently leave old tail content behind — better to
		// fail the request than corrupt the document.
		const response = await runBatchUpdate(
			ctx,
			input.documentId,
			[
				{ deleteContentRange: { range: { startIndex: 1, endIndex } } },
				{ insertText: { location: { index: 1 }, text: input.markdown } },
			],
			document.revisionId
				? { requiredRevisionId: document.revisionId }
				: undefined,
		);

		await logEventFromContext(
			ctx,
			'googledocs.documents.updateDocumentMarkdown',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const updateDocumentSectionMarkdown: GoogleDocsEndpoints['updateDocumentSectionMarkdown'] =
	async (ctx, input) => {
		const requests: Record<string, unknown>[] = [];
		if (input.endIndex !== undefined) {
			requests.push({
				deleteContentRange: {
					range: { startIndex: input.startIndex, endIndex: input.endIndex },
				},
			});
		}
		requests.push({
			insertText: {
				location: { index: input.startIndex },
				text: input.markdown,
			},
		});

		const response = await runBatchUpdate(ctx, input.documentId, requests);

		await logEventFromContext(
			ctx,
			'googledocs.documents.updateDocumentSectionMarkdown',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const updateDocumentStyle: GoogleDocsEndpoints['updateDocumentStyle'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{
				updateDocumentStyle: {
					documentStyle: input.documentStyle,
					fields: input.fields,
				},
			},
		]);

		await logEventFromContext(
			ctx,
			'googledocs.documents.updateDocumentStyle',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const updateExistingDocument: GoogleDocsEndpoints['updateExistingDocument'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(
			ctx,
			input.documentId,
			input.requests,
			input.writeControl,
		);

		await logEventFromContext(
			ctx,
			'googledocs.documents.updateExistingDocument',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

// GOOGLEDOCS_UPDATE_DOCUMENT_BATCH is deprecated upstream; prefer updateExistingDocument.
export const updateDocumentBatch: GoogleDocsEndpoints['updateDocumentBatch'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(
			ctx,
			input.documentId,
			input.requests,
			input.writeControl,
		);

		await logEventFromContext(
			ctx,
			'googledocs.documents.updateDocumentBatch',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const exportDocumentAsPdf: GoogleDocsEndpoints['exportDocumentAsPdf'] =
	async (ctx, input) => {
		// Export returns raw PDF bytes, so it cannot go through the JSON
		// request helper; mirror its one-shot 401 force-refresh retry here.
		const url = `${DRIVE_API_BASE}/files/${input.fileId}/export?mimeType=application/pdf`;
		const doFetch = (token: string) =>
			fetch(url, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});

		// _refreshAuth is attached ad hoc by the keyBuilder (see index.ts); it is
		// not part of the typed plugin context, so read it structurally here.
		const refreshAuth = (ctx as { _refreshAuth?: () => Promise<string> })
			._refreshAuth;
		let response = await doFetch(ctx.key);
		if (response.status === 401 && refreshAuth) {
			const freshToken = await refreshAuth();
			response = await doFetch(freshToken);
		}

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Failed to export document as PDF: ${error}`);
		}

		const buffer = Buffer.from(await response.arrayBuffer());
		const result = {
			fileId: input.fileId,
			mimeType: 'application/pdf',
			data: buffer.toString('base64'),
		};

		await logEventFromContext(
			ctx,
			'googledocs.documents.exportDocumentAsPdf',
			{ fileId: input.fileId },
			'completed',
		);
		return result;
	};

export const searchDocuments: GoogleDocsEndpoints['searchDocuments'] = async (
	ctx,
	input,
) => {
	const query = input.q
		? `mimeType='${DOCUMENT_MIME_TYPE}' and (${input.q})`
		: `mimeType='${DOCUMENT_MIME_TYPE}'`;

	const result = await makeAuthenticatedGoogleRequest<
		GoogleDocsEndpointOutputs['searchDocuments']
	>(DRIVE_API_BASE, '/files', ctx, {
		method: 'GET',
		query: {
			q: query,
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			orderBy: input.orderBy,
			fields: DOCUMENT_FIELDS,
		},
	});

	if (result.files && ctx.db.documents?.upsertByEntityId) {
		try {
			for (const file of result.files) {
				if (file.id) {
					// Merge with the prior record: search results only carry id and
					// name, and replacing the record would wipe the structure-count
					// and trigger baselines the webhook comparisons depend on.
					const prior = (await ctx.db.documents.findByEntityId?.(file.id)) as
						| { data?: Record<string, unknown> }
						| undefined;
					await ctx.db.documents.upsertByEntityId(file.id, {
						createdAt: new Date(),
						...(prior?.data ?? {}),
						id: file.id,
						title: file.name,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save documents to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googledocs.documents.searchDocuments',
		{ ...input },
		'completed',
	);
	return result;
};

export const listSpreadsheetCharts: GoogleDocsEndpoints['listSpreadsheetCharts'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['listSpreadsheetCharts']
		>(
			`https://sheets.googleapis.com/v4`,
			`/spreadsheets/${input.spreadsheetId}`,
			ctx,
			{
				method: 'GET',
				query: { fields: 'sheets(charts(chartId,spec,position))' },
			},
		);

		await logEventFromContext(
			ctx,
			'googledocs.documents.listSpreadsheetCharts',
			{ ...input },
			'completed',
		);
		return result;
	};

export const DocumentsEndpoints = {
	createDocument,
	createBlankDocument,
	createDocumentMarkdown,
	copyDocument,
	getDocument,
	getDocumentPlaintext,
	updateDocumentMarkdown,
	updateDocumentSectionMarkdown,
	updateDocumentStyle,
	updateExistingDocument,
	updateDocumentBatch,
	exportDocumentAsPdf,
	searchDocuments,
	listSpreadsheetCharts,
};

// Re-exported so the markdown-replace handlers can reuse the index math above.
export { documentEndIndex };

// Imported for type-only reuse by callers that need the bound endpoint tree.
export type { GoogleDocsBoundEndpoints };
