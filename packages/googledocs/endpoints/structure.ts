import { logEventFromContext } from 'corsair/core';
import { runBatchUpdate } from '../client';
import type { GoogleDocsEndpoints } from '../index';

function buildRequest(
	type: string,
	payload: Record<string, unknown>,
): Record<string, unknown> {
	return { [type]: payload };
}

export const createHeader: GoogleDocsEndpoints['createHeader'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = { type: input.type ?? 'DEFAULT' };
	if (input.sectionBreakLocation) {
		payload.sectionBreakLocation = input.sectionBreakLocation;
	}
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('createHeader', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.createHeader',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const createFooter: GoogleDocsEndpoints['createFooter'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = { type: input.type ?? 'DEFAULT' };
	if (input.sectionBreakLocation) {
		payload.sectionBreakLocation = input.sectionBreakLocation;
	}
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('createFooter', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.createFooter',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const createFootnote: GoogleDocsEndpoints['createFootnote'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = {};
	if (input.location) {
		payload.location = input.location;
	} else if (input.endOfSegmentLocation) {
		payload.endOfSegmentLocation = input.endOfSegmentLocation;
	} else {
		payload.endOfSegmentLocation = {};
	}
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('createFootnote', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.createFootnote',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const createNamedRange: GoogleDocsEndpoints['createNamedRange'] = async (
	ctx,
	input,
) => {
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('createNamedRange', {
			name: input.name,
			range: { startIndex: input.startIndex, endIndex: input.endIndex },
		}),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.createNamedRange',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const createParagraphBullets: GoogleDocsEndpoints['createParagraphBullets'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			buildRequest('createParagraphBullets', {
				range: { startIndex: input.startIndex, endIndex: input.endIndex },
				bulletPreset: input.bulletPreset ?? 'BULLET_DISC_CIRCLE_SQUARE',
			}),
		]);

		await logEventFromContext(
			ctx,
			'googledocs.structure.createParagraphBullets',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const deleteParagraphBullets: GoogleDocsEndpoints['deleteParagraphBullets'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			buildRequest('deleteParagraphBullets', {
				range: { startIndex: input.startIndex, endIndex: input.endIndex },
			}),
		]);

		await logEventFromContext(
			ctx,
			'googledocs.structure.deleteParagraphBullets',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const deleteHeader: GoogleDocsEndpoints['deleteHeader'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = {};
	if (input.headerId) payload.headerId = input.headerId;
	if (input.type) payload.type = input.type;
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('deleteHeader', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.deleteHeader',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const deleteFooter: GoogleDocsEndpoints['deleteFooter'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = {};
	if (input.footerId) payload.footerId = input.footerId;
	if (input.type) payload.type = input.type;
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('deleteFooter', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.deleteFooter',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const deleteNamedRange: GoogleDocsEndpoints['deleteNamedRange'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = {};
	if (input.namedRangeId) payload.namedRangeId = input.namedRangeId;
	if (input.name) payload.name = input.name;
	const response = await runBatchUpdate(ctx, input.documentId, [
		buildRequest('deleteNamedRange', payload),
	]);

	await logEventFromContext(
		ctx,
		'googledocs.structure.deleteNamedRange',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const StructureEndpoints = {
	createHeader,
	createFooter,
	createFootnote,
	createNamedRange,
	createParagraphBullets,
	deleteParagraphBullets,
	deleteHeader,
	deleteFooter,
	deleteNamedRange,
};
