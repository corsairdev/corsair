import { logEventFromContext } from 'corsair/core';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpoints } from '../index';
import type { AmplitudeEndpointOutputs } from './types';

export const search: AmplitudeEndpoints['usersSearch'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['usersSearch']
	>('/api/2/usersearch', ctx.key, {
		method: 'GET',
		query: {
			user: input.user,
			limit: input.limit,
			offset: input.offset,
		},
	});

	if (result.matches && ctx.db.users) {
		try {
			for (const match of result.matches) {
				const userId = match.user_id ?? String(match.amplitude_id);
				await ctx.db.users.upsertByEntityId(userId, {
					...match,
					id: userId,
					canonical_amplitude_id: match.amplitude_id,
				});
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.users.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProfile: AmplitudeEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['usersGetProfile']
	>('/api/2/userprofile', ctx.key, {
		method: 'GET',
		query: {
			user_id: input.user_id,
			amplitude_id: input.amplitude_id,
		},
	});

	if (result.userData) {
		try {
			const userId =
				result.userData.user_id ??
				(result.userData.amplitude_id
					? String(result.userData.amplitude_id)
					: undefined);

			if (userId && ctx.db.users) {
				await ctx.db.users.upsertByEntityId(userId, {
					...result.userData,
					id: userId,
				});
			}
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.users.getProfile',
		{ ...input },
		'completed',
	);
	return result;
};

export const getActivity: AmplitudeEndpoints['usersGetActivity'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['usersGetActivity']
	>('/api/2/useractivity', ctx.key, {
		method: 'GET',
		query: {
			user: input.user,
			limit: input.limit,
			offset: input.offset,
		},
	});

	if (result.events && ctx.db.events) {
		try {
			for (const event of result.events) {
				const entityId = [
					String(event.amplitude_id ?? input.user),
					event.event_time ?? '',
					event.event_type ?? '',
				].join(':');
				await ctx.db.events.upsertByEntityId(entityId, {
					...event,
					id: entityId,
					event_type: event.event_type ?? '',
					createdAt: event.event_time ? new Date(event.event_time) : new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save activity events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.users.getActivity',
		{ ...input },
		'completed',
	);
	return result;
};
