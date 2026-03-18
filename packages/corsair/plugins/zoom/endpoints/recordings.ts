import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const getMeeting: ZoomEndpoints['recordingsGetMeeting'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['recordingsGetMeeting']
	>(`meetings/${input.meetingId}/recordings`, ctx.key, {
		method: 'GET',
	});

	if (result.recording_files && ctx.db.recordings) {
		try {
			for (const recording of result.recording_files) {
				if (recording.id) {
					await ctx.db.recordings.upsertByEntityId(recording.id, {
						...recording,
						meeting_id: String(result.id ?? input.meetingId),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save recordings to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.recordings.getMeeting',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMeeting: ZoomEndpoints['recordingsDeleteMeeting'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['recordingsDeleteMeeting']
	>(`meetings/${input.meetingId}/recordings`, ctx.key, {
		method: 'DELETE',
		query: {
			action: input.action,
		},
	});

	if (ctx.db.recordings) {
		try {
			await ctx.db.recordings.deleteByEntityId(input.meetingId);
		} catch (error) {
			console.warn('Failed to find recordings in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.recordings.deleteMeeting',
		{ ...input },
		'completed',
	);
	return result;
};

export const listAll: ZoomEndpoints['recordingsListAll'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['recordingsListAll']>(
		'users/me/recordings',
		ctx.key,
		{
			method: 'GET',
			query: {
				from: input.from,
				to: input.to,
				page_size: input.page_size,
				next_page_token: input.next_page_token,
				mc: input.mc,
				trash: input.trash,
			},
		},
	);

	if (result.meetings && ctx.db.recordings) {
		try {
			for (const meeting of result.meetings) {
				if (meeting.recording_files) {
					for (const recording of meeting.recording_files) {
						if (recording.id) {
							await ctx.db.recordings.upsertByEntityId(recording.id, {
								...recording,
								meeting_id: String(meeting.id),
							});
						}
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save recordings to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.recordings.listAll',
		{ ...input },
		'completed',
	);
	return result;
};
