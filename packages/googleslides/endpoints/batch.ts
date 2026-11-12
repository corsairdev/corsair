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
 * The typed operation that performs each refused request, where one exists.
 * The refusal names it, or says there is none, so an agent does not go looking
 * for an operation the plugin lacks.
 */
const TYPED_DELETIONS: Partial<
	Record<(typeof IRREVERSIBLE_REQUEST_TYPES)[number], string>
> = {
	deleteObject:
		'slides.remove deletes a slide; page elements have no delete operation in this plugin',
	deleteText: 'use text.delete',
	deleteParagraphBullets: 'use text.removeBullets',
};

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
			// Every key with a value is checked, not only the first: a request
			// written as { insertText: undefined, deleteObject: {...} } keeps both
			// keys after parsing, and JSON encoding then drops the undefined one,
			// so Google would receive the deletion alone.
			const irreversible = parsed.requests
				.flatMap((request) =>
					Object.entries(request)
						.filter(([, value]) => value !== undefined)
						.map(([key]) => key),
				)
				.filter((key) =>
					IRREVERSIBLE_REQUEST_TYPES.includes(
						key as (typeof IRREVERSIBLE_REQUEST_TYPES)[number],
					),
				);
			if (irreversible.length > 0) {
				const routes = [...new Set(irreversible)].map(
					(key) =>
						`${key}: ${TYPED_DELETIONS[key as keyof typeof TYPED_DELETIONS] ?? 'no operation in this plugin performs it'}`,
				);
				throw new Error(
					`batch.update cannot carry deletions, which need their own destructive operation and approval. ${routes.join('. ')}.`,
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
				// The applied revision, which a caller passes as the
				// requiredRevisionId of a later batch to detect interference.
				writeControl: response.writeControl
					? { requiredRevisionId: response.writeControl.requiredRevisionId }
					: undefined,
				commentUpdateState: response.commentUpdateState,
			};
		},
		(parsed) => ({ requestCount: parsed.requests.length }),
	);

export const BatchEndpoints = {
	update: batchUpdate,
};
