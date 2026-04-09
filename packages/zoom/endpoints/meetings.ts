import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const create: ZoomEndpoints['meetingsCreate'] = async (ctx, input) => {
	const { ...body } = input;
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsCreate']>(
		'users/me/meetings',
		ctx.key,
		{
			method: 'POST',
			body,
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
	const { meetingId, ...query } = input;
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsGet']>(
		`meetings/${meetingId}`,
		ctx.key,
		{
			method: 'GET',
			query,
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
			query: input,
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
	const { meetingId, ...body } = input;
	const result = await makeZoomRequest<ZoomEndpointOutputs['meetingsUpdate']>(
		`meetings/${meetingId}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	if (ctx.db.meetings) {
		try {
			// Meetings are stored under String(result.id) (numeric); normalise the
			// caller-supplied string to the same canonical form to avoid a silent miss
			const canonicalId = String(Number(meetingId));
			const existing = await ctx.db.meetings.findByEntityId(canonicalId);
			if (existing) {
				const { meetingId: _, ...updates } = input;
				await ctx.db.meetings.upsertByEntityId(canonicalId, {
					...existing.data,
					...updates,
				});
			} else {
				console.warn(
					`Meeting ${meetingId} not found in local DB; skipping update`,
				);
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
	const { meetingId, ...body } = input;
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['meetingsAddRegistrant']
	>(`meetings/${meetingId}/registrants`, ctx.key, {
		method: 'POST',
		body,
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
	const { meetingId, ...query } = input;
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['meetingsGetSummary']
	>(`meetings/${meetingId}/summary`, ctx.key, {
		query,
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
