import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const create: ZoomEndpoints['meetingsCreate'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsCreate']>(
		'users/me/meetings',
		ctx.key,
		{
			method: 'POST',
			body: input
		},
	);

	if (result.id && ctx.db.meetings) {
		try {
			await ctx.db.meetings.upsertByEntityId(String(result.id), result);
		} catch (error) {
			console.warn('Failed to save meeting to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.meetings.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: ZoomEndpoints['meetingsGet'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsGet']>(
		`meetings/${input.meetingId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.meetings) {
		try {
			await ctx.db.meetings.upsertByEntityId(String(result.id), {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save meeting to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.meetings.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: ZoomEndpoints['meetingsList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsList']>(
		'users/me/meetings',
		ctx.key,
		{
			method: 'GET',
			query: input
		},
	);

	if (result.meetings && ctx.db.meetings) {
		try {
			for (const meeting of result.meetings) {
				if (meeting.id) {
					await ctx.db.meetings.upsertByEntityId(String(meeting.id), {
						...meeting,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save meetings to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.meetings.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: ZoomEndpoints['meetingsUpdate'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsUpdate']>(
		`meetings/${input.meetingId}`,
		ctx.key,
		{
			method: 'PATCH',
			body: input
		},
	);

	if (ctx.db.meetings) {
		try {
			const existing = await ctx.db.meetings.findByEntityId(
				input.meetingId,
			);
			if (existing) {
				await ctx.db.meetings.upsertByEntityId(input.meetingId, existing.data);
			}
		} catch (error) {
			console.warn('Failed to update meeting in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.meetings.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const addRegistrant: ZoomEndpoints['meetingsAddRegistrant'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['meetingsAddRegistrant']
	>(`meetings/${input.meetingId}/registrants`, ctx.key, {
		method: 'POST',
		body: input
	});

	await logEventFromContext(
		ctx,
		'zoom.meetings.addRegistrant',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSummary: ZoomEndpoints['meetingsGetSummary'] = async (
	ctx,
	input,
) => {
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['meetingsGetSummary']
	>(`meetings/${input.meetingId}/summary`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'zoom.meetings.getSummary',
		{ ...input },
		'completed',
	);
	return result;
};
