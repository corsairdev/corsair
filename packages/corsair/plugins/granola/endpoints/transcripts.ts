import { logEventFromContext } from '../../utils/events';
import type { GranolaEndpoints } from '..';
import { makeGranolaRequest } from '../client';
import type { GranolaEndpointOutputs } from './types';

export const get: GranolaEndpoints['transcriptsGet'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['transcriptsGet']>(
		`v1/notes/${input.note_id}/transcript`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.transcript && ctx.db.transcripts) {
		try {
			await ctx.db.transcripts.upsertByEntityId(result.transcript.id, {
				...result.transcript,
				created_at: result.transcript.created_at
					? new Date(result.transcript.created_at)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save transcript to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.transcripts.get', { ...input }, 'completed');
	return result;
};
