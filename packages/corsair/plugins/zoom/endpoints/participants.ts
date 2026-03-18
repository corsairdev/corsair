import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const getPastMeeting: ZoomEndpoints['participantsGetPastMeeting'] =
	async (ctx, input) => {
		const result = await makeZoomRequest<
			ZoomEndpointOutputs['participantsGetPastMeeting']
		>(`past_meetings/${input.meetingId}/participants`, ctx.key, {
			method: 'GET',
			query: {
				page_size: input.page_size,
				next_page_token: input.next_page_token,
			},
		});

		if (result.participants && ctx.db.participants) {
			try {
				for (const participant of result.participants) {
					if (participant.id) {
						await ctx.db.participants.upsertByEntityId(participant.id, {
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
