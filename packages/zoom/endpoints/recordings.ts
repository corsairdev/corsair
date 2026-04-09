import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const getMeeting: ZoomEndpoints['recordingsGetMeeting'] = async (
	ctx,
	input,
) => {
	const { meetingId, ...query } = input;
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['recordingsGetMeeting']
	>(`meetings/${meetingId}/recordings`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.recording_files && ctx.db.recordings) {
		try {
			for (const recording of result.recording_files) {
				if (recording.id) {
					await ctx.db.recordings.upsertByEntityId(recording.id, {
						...recording,
						meeting_id: String(result.id ?? meetingId),
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
	const { meetingId } = input;
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['recordingsDeleteMeeting']
	>(`meetings/${meetingId}/recordings`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.recordings) {
		try {
			const stored = await ctx.db.recordings.search({
				data: { meeting_id: String(meetingId) },
			});
			for (const recording of stored) {
				await ctx.db.recordings.deleteByEntityId(recording.entity_id);
			}
		} catch (error) {
			console.warn('Failed to delete recordings from database:', error);
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
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['recordingsListAll']
	>('users/me/recordings', ctx.key, {
		method: 'GET',
		query: input,
	});

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
