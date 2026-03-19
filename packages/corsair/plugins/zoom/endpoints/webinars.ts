import { logEventFromContext } from '../../utils/events';
import type { ZoomEndpoints } from '..';
import { makeZoomRequest } from '../client';
import type { ZoomEndpointOutputs } from './types';

export const get: ZoomEndpoints['webinarsGet'] = async (ctx, input) => {
	const result = await makeZoomRequest<ZoomEndpointOutputs['webinarsGet']>(
		`webinars/${input.webinarId}`,
		ctx.key,
		{
			method: 'GET',
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
			query: {
				page_size: input.page_size,
				page_number: input.page_number,
			},
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
	const result = await makeZoomRequest<
		ZoomEndpointOutputs['webinarsAddRegistrant']
	>(`webinars/${input.webinarId}/registrants`, ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
			first_name: input.first_name,
			last_name: input.last_name,
			auto_approve: input.auto_approve,
		},
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
		const result = await makeZoomRequest<
			ZoomEndpointOutputs['webinarsListParticipants']
		>(`past_webinars/${input.webinarId}/participants`, ctx.key, {
			method: 'GET',
			query: {
				page_size: input.page_size,
				next_page_token: input.next_page_token,
			},
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
