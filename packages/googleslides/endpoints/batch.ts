import type { GoogleSlidesEndpoints } from '..';
import { runBatchUpdate } from '../client';
import { call, compact } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

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
