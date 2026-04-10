import { logEventFromContext } from 'corsair/core';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const get: ZoomEndpoints['webinarsGet'] = async (ctx, input) => {
	const { webinarId, ...query } = input;
	const result = await makeZoomRequest<ZoomEndpointOutputs['webinarsGet']>(
		`webinars/${webinarId}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result.id && ctx.db.webinars) {
		try {
			await ctx.db.webinars.upsertByEntityId(String(result.id), {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save webinar to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.webinars.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: ZoomEndpoints['webinarsList'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['webinarsList']>(
		'users/me/webinars',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.webinars && ctx.db.webinars) {
		try {
			for (const webinar of result.webinars) {
				if (webinar.id) {
					await ctx.db.webinars.upsertByEntityId(String(webinar.id), {
						...webinar,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save webinars to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zoom.webinars.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const addRegistrant: ZoomEndpoints['webinarsAddRegistrant'] = async (
	ctx,
	input,
) => {
	const { webinarId, ...body } = input;
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['webinarsAddRegistrant']
	>(`webinars/${webinarId}/registrants`, ctx.key, {
		body,
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'zoom.webinars.addRegistrant',
		{ ...input },
		'completed',
	);
	return result;
};

export const listParticipants: ZoomEndpoints['webinarsListParticipants'] =
	async (ctx, input) => {
		const { webinarId, ...query } = input;
		const result = await makeZoomRequest<
			ZoomEndpointOutputs['webinarsListParticipants']
		>(`past_webinars/${webinarId}/participants`, ctx.key, {
			query,
			method: 'GET',
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
			'zoom.webinars.listParticipants',
			{ ...input },
			'completed',
		);
		return result;
	};
