import type { GoogleSlidesEndpoints } from '..';
import { runBatchUpdate } from '../client';
import type { BatchUpdateResponse } from '../types';
import { call, compact, replyAt } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

/**
 * Every text operation is one batchUpdate request. The reply is a positional
 * list, and only replaceAllText reports a count, so the shared shape reports
 * the reply count and the count when the provider sent one.
 */
function summarizeWrite(response: BatchUpdateResponse, index = 0) {
	const reply = replyAt(response.replies, index);
	const occurrences = reply?.replaceAllText as
		| { occurrencesChanged?: number }
		| undefined;
	return {
		presentationId: response.presentationId ?? '',
		replyCount: response.replies?.length ?? 0,
		occurrencesChanged: occurrences?.occurrencesChanged,
	};
}

export const textInsert: GoogleSlidesEndpoints['textInsert'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'text.insert',
			input: GoogleSlidesEndpointInputSchemas.textInsert,
			output: GoogleSlidesEndpointOutputSchemas.textInsert,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					insertText: compact({
						objectId: parsed.objectId,
						text: parsed.text,
						insertionIndex: parsed.insertionIndex,
						cellLocation: parsed.cellLocation,
					}),
				},
			]);
			return summarizeWrite(response);
		},
		(parsed) => ({
			objectId: parsed.objectId,
			length: parsed.text.length,
		}),
	);

export const textReplaceAll: GoogleSlidesEndpoints['textReplaceAll'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'text.replaceAll',
			input: GoogleSlidesEndpointInputSchemas.textReplaceAll,
			output: GoogleSlidesEndpointOutputSchemas.textReplaceAll,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					replaceAllText: compact({
						containsText: compact({
							text: parsed.find,
							matchCase: parsed.matchCase,
							searchByRegex: parsed.searchByRegex,
						}),
						replaceText: parsed.replace,
						pageObjectIds: parsed.pageObjectIds,
					}),
				},
			]);
			const summary = summarizeWrite(response);
			return { ...summary, presentationId: parsed.presentationId };
		},
		(parsed) => ({ find: parsed.find, replace: parsed.replace }),
	);

export const textDelete: GoogleSlidesEndpoints['textDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'text.delete',
			input: GoogleSlidesEndpointInputSchemas.textDelete,
			output: GoogleSlidesEndpointOutputSchemas.textDelete,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					deleteText: compact({
						objectId: parsed.objectId,
						textRange: parsed.textRange,
						cellLocation: parsed.cellLocation,
					}),
				},
			]);
			const summary = summarizeWrite(response);
			return { ...summary, presentationId: parsed.presentationId };
		},
		(parsed) => ({
			objectId: parsed.objectId,
			range: parsed.textRange.type,
		}),
	);

export const textUpdateStyle: GoogleSlidesEndpoints['textUpdateStyle'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'text.updateStyle',
			input: GoogleSlidesEndpointInputSchemas.textUpdateStyle,
			output: GoogleSlidesEndpointOutputSchemas.textUpdateStyle,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					updateTextStyle: compact({
						objectId: parsed.objectId,
						textRange: parsed.textRange,
						style: parsed.style,
						// The mask is comma-separated; a slash-separated path is a
						// different address for the same property.
						fields: parsed.fields.join(','),
						cellLocation: parsed.cellLocation,
					}),
				},
			]);
			const summary = summarizeWrite(response);
			return { ...summary, presentationId: parsed.presentationId };
		},
		(parsed) => ({
			objectId: parsed.objectId,
			fields: parsed.fields.join(','),
		}),
	);

export const textCreateBullets: GoogleSlidesEndpoints['textCreateBullets'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'text.createBullets',
				input: GoogleSlidesEndpointInputSchemas.textCreateBullets,
				output: GoogleSlidesEndpointOutputSchemas.textCreateBullets,
			},
			input,
			async (parsed) => {
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						createParagraphBullets: compact({
							objectId: parsed.objectId,
							textRange: parsed.textRange,
							// Google documents BULLET_DISC_CIRCLE_SQUARE as the default, so
							// omitting the field here keeps the provider's own default.
							bulletPreset: parsed.bulletPreset,
							cellLocation: parsed.cellLocation,
						}),
					},
				]);
				const summary = summarizeWrite(response);
				return { ...summary, presentationId: parsed.presentationId };
			},
			(parsed) => ({
				objectId: parsed.objectId,
				preset: parsed.bulletPreset ?? 'BULLET_DISC_CIRCLE_SQUARE',
			}),
		);

export const textRemoveBullets: GoogleSlidesEndpoints['textRemoveBullets'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'text.removeBullets',
				input: GoogleSlidesEndpointInputSchemas.textRemoveBullets,
				output: GoogleSlidesEndpointOutputSchemas.textRemoveBullets,
			},
			input,
			async (parsed) => {
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						deleteParagraphBullets: compact({
							objectId: parsed.objectId,
							textRange: parsed.textRange,
							cellLocation: parsed.cellLocation,
						}),
					},
				]);
				const summary = summarizeWrite(response);
				return { ...summary, presentationId: parsed.presentationId };
			},
			(parsed) => ({ objectId: parsed.objectId }),
		);

export const TextEndpoints = {
	insert: textInsert,
	replaceAll: textReplaceAll,
	delete: textDelete,
	updateStyle: textUpdateStyle,
	createBullets: textCreateBullets,
	removeBullets: textRemoveBullets,
};
