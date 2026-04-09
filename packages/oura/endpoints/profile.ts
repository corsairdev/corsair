import { logEventFromContext } from 'corsair/core';
import type { OuraEndpoints } from '..';
import { makeOuraRequest } from '../client';
import type { OuraEndpointOutputs } from './types';

export const get: OuraEndpoints['profileGet'] = async (ctx, _input) => {
	const result = await makeOuraRequest<OuraEndpointOutputs['profileGet']>(
		'usercollection/personal_info',
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.personalInfo) {
		try {
			await ctx.db.personalInfo.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save personal info to database:', error);
		}
	}

	await logEventFromContext(ctx, 'oura.profile.get', {}, 'completed');
	return result;
};
