import type { GoogleSlidesEndpoints } from '..';
import { runBatchUpdate } from '../client';
import { call, compact } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

/**
 * Request types that cannot be undone. The typed groups refuse them through
 * their own risk levels; this list keeps the raw path honest, since it can carry
 * any of the 49 request types under one declaration.
 */
const IRREVERSIBLE_REQUEST_TYPES = [
	'deleteObject',
	'deleteText',
	'deleteTableRow',
	'deleteTableColumn',
	'deleteParagraphBullets',
	'deleteComment',
	'deleteCommentReply',
] as const;

/**
 * The typed groups cover the common edits. This exposes the rest of the 49
 * batchUpdate request types (mergeTableCells, updateParagraphStyle, comments,
 * Sheets chart refreshes) without a schema per type, which is the only way to
 * reach them from an agent.
 *
 * The requests are validated by Google before any is applied: an invalid entry
 * fails the whole batch rather than half-applying it.
 */
export const batchUpdate: GoogleSlidesEndpoints['batchUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'batch.update',
			input: GoogleSlidesEndpointInputSchemas.batchUpdate,
			output: GoogleSlidesEndpointOutputSchemas.batchUpdate,
		},
		input,
		async (parsed) => {
			// Refused rather than forwarded: this endpoint is declared destructive
			// so a deletion needs approval, and forwarding one here anyway would
			// let it through under a different declaration than slides.remove.
			const irreversible = parsed.requests
				.map((request) => Object.keys(request)[0])
				.filter((key) =>
					IRREVERSIBLE_REQUEST_TYPES.includes(
						key as (typeof IRREVERSIBLE_REQUEST_TYPES)[number],
					),
				);
			if (irreversible.length > 0) {
				throw new Error(
					`batch.update cannot carry ${irreversible.join(', ')}: use the typed operation for that request, which marks it destructive and asks for approval.`,
				);
			}

			// compact drops an absent revision id, and an undefined second
			// argument sends no writeControl at all. Passing {} instead would ask
			// Google to parse an empty write control on every batch.
			const writeControl = compact({
				requiredRevisionId: parsed.writeControl?.requiredRevisionId,
			});
			const response = await runBatchUpdate(
				ctx,
				parsed.presentationId,
				parsed.requests,
				Object.keys(writeControl).length > 0 ? writeControl : undefined,
			);
			return {
				presentationId: parsed.presentationId,
				replies: response.replies ?? [],
			};
		},
		(parsed) => ({ requestCount: parsed.requests.length }),
	);

export const BatchEndpoints = {
	update: batchUpdate,
};
