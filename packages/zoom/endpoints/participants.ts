import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const getPastMeeting: ZoomEndpoints['participantsGetPastMeeting'] =
	async (ctx, input) => {
		const { meetingId, ...query } = input;
		const result = await makeZoomRequest<
			ZoomEndpointOutputs['participantsGetPastMeeting']
		>(`past_meetings/${meetingId}/participants`, ctx.key, {
			method: 'GET',
			query,
		});

		if (result.participants && ctx.db.participants) {
			try {
				for (const participant of result.participants) {
					const entityKey = participant.user_id || participant.id;
					if (entityKey) {
						await ctx.db.participants.upsertByEntityId(entityKey, {
							...participant,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save participants to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.participants.getPastMeeting',
			{ ...input },
			'completed',
		);
		return result;
	};
