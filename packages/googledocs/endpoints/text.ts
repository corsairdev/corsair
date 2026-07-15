import { logEventFromContext } from 'corsair/core';
import {
	DOCS_API_BASE,
	makeAuthenticatedGoogleRequest,
	runBatchUpdate,
} from '../client';
import type { GoogleDocsEndpoints } from '../index';
import type { GoogleDocsEndpointOutputs } from './types';

export const insertText: GoogleDocsEndpoints['insertText'] = async (
	ctx,
	input,
) => {
	let requests: Record<string, unknown>[];
	if (input.appendToEnd) {
		requests = [{ insertText: { endOfSegmentLocation: {}, text: input.text } }];
	} else {
		if (input.insertionIndex === undefined) {
			throw new Error(
				'[googledocs] insertText requires insertionIndex or appendToEnd',
			);
		}
		requests = [
			{
				insertText: {
					location: { index: input.insertionIndex },
					text: input.text,
				},
			},
		];
	}

	const response = await runBatchUpdate(ctx, input.documentId, requests);

	await logEventFromContext(
		ctx,
		'googledocs.text.insertText',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const replaceAllText: GoogleDocsEndpoints['replaceAllText'] = async (
	ctx,
	input,
) => {
	const response = await runBatchUpdate(ctx, input.documentId, [
		{
			replaceAllText: {
				containsText: {
					text: input.find,
					matchCase: input.matchCase ?? false,
				},
				replaceText: input.replace,
			},
		},
	]);

	await logEventFromContext(
		ctx,
		'googledocs.text.replaceAllText',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const deleteContentRange: GoogleDocsEndpoints['deleteContentRange'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{
				deleteContentRange: {
					range: { startIndex: input.startIndex, endIndex: input.endIndex },
				},
			},
		]);

		await logEventFromContext(
			ctx,
			'googledocs.text.deleteContentRange',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const insertInlineImage: GoogleDocsEndpoints['insertInlineImage'] =
	async (ctx, input) => {
		let request: Record<string, unknown>;
		if (input.appendToEnd) {
			request = {
				insertInlineImage: {
					endOfSegmentLocation: {},
					uri: input.uri,
					...(input.size ? { objectSize: input.size } : {}),
				},
			};
		} else {
			if (input.insertionIndex === undefined) {
				throw new Error(
					'[googledocs] insertInlineImage requires insertionIndex or appendToEnd',
				);
			}
			request = {
				insertInlineImage: {
					location: { index: input.insertionIndex },
					uri: input.uri,
					...(input.size ? { objectSize: input.size } : {}),
				},
			};
		}

		const response = await runBatchUpdate(ctx, input.documentId, [request]);

		await logEventFromContext(
			ctx,
			'googledocs.text.insertInlineImage',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const replaceImage: GoogleDocsEndpoints['replaceImage'] = async (
	ctx,
	input,
) => {
	const response = await runBatchUpdate(ctx, input.documentId, [
		{
			replaceImage: {
				imageObjectId: input.imageObjectId,
				uri: input.uri,
				imageReplaceMethod: input.imageReplaceMethod ?? 'CENTER_CROP',
			},
		},
	]);

	await logEventFromContext(
		ctx,
		'googledocs.text.replaceImage',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

// The Docs API has no dedicated page-break request; the supported way to push
// content onto a new page is to set pageBreakBefore on the paragraph.
export const insertPageBreak: GoogleDocsEndpoints['insertPageBreak'] = async (
	ctx,
	input,
) => {
	let startIndex = input.insertionIndex;
	let writeControl: Record<string, unknown> | undefined;
	if (startIndex === undefined) {
		if (!input.appendToEnd) {
			throw new Error(
				'[googledocs] insertPageBreak requires insertionIndex or appendToEnd',
			);
		}
		const document = await makeAuthenticatedGoogleRequest<
			GoogleDocsEndpointOutputs['getDocument']
		>(DOCS_API_BASE, `/documents/${input.documentId}`, ctx, { method: 'GET' });
		const content = document.body?.content ?? [];
		startIndex = (content[content.length - 1]?.endIndex ?? 1) - 1;
		// Pin the write to the revision the index was computed from: a
		// concurrent edit between the GET and the batchUpdate would shift the
		// indices and silently misplace the page break.
		if (document.revisionId) {
			writeControl = { requiredRevisionId: document.revisionId };
		}
	}

	const response = await runBatchUpdate(
		ctx,
		input.documentId,
		[
			{
				updateParagraphStyle: {
					range: { startIndex, endIndex: startIndex + 1 },
					fields: 'pageBreakBefore',
					paragraphStyle: { pageBreakBefore: true },
				},
			},
		],
		writeControl,
	);

	await logEventFromContext(
		ctx,
		'googledocs.text.insertPageBreak',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const TextEndpoints = {
	insertText,
	replaceAllText,
	deleteContentRange,
	insertInlineImage,
	replaceImage,
	insertPageBreak,
};
