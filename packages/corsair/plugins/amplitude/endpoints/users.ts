import { logEventFromContext } from '../../utils/events';
import type { AmplitudeEndpoints } from '..';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const search: AmplitudeEndpoints['usersSearch'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['usersSearch']>(
		'/api/2/usersearch',
		ctx.key,
		{
			method: 'GET',
			query: {
				user: input.user,
				limit: input.limit,
				offset: input.offset,
			},
		},
	);

	await logEventFromContext(ctx, 'amplitude.users.search', { ...input }, 'completed');
	return result;
};

export const getProfile: AmplitudeEndpoints['usersGetProfile'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['usersGetProfile']>(
		'/api/2/userprofile',
		ctx.key,
		{
			method: 'GET',
			query: {
				user_id: input.user_id,
				amplitude_id: input.amplitude_id,
			},
		},
	);

	if (result.userData) {
		try {
			const userId =
				result.userData.user_id ??
				(result.userData.amplitude_id
					? String(result.userData.amplitude_id)
					: undefined);

			if (userId && ctx.db.users) {
				await ctx.db.users.upsertByEntityId(userId, {
					id: userId,
					user_id: result.userData.user_id,
					canonical_amplitude_id: result.userData.canonical_amplitude_id,
					// User properties are open-ended key-value pairs
					user_properties: result.userData.user_properties,
					is_identified: result.userData.is_identified,
					country: result.userData.country,
					region: result.userData.region,
					city: result.userData.city,
					language: result.userData.language,
					platform: result.userData.platform,
					os: result.userData.os,
					device: result.userData.device,
					last_seen: result.userData.last_seen,
				});
			}
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'amplitude.users.getProfile', { ...input }, 'completed');
	return result;
};

export const getActivity: AmplitudeEndpoints['usersGetActivity'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['usersGetActivity']>(
		'/api/2/useractivity',
		ctx.key,
		{
			method: 'GET',
			query: {
				user: input.user,
				limit: input.limit,
				offset: input.offset,
			},
		},
	);

	await logEventFromContext(ctx, 'amplitude.users.getActivity', { ...input }, 'completed');
	return result;
};
