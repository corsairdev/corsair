import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const get: StravaEndpoints['clubsGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['clubsGet']>(
		`clubs/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.clubs) {
		try {
			await ctx.db.clubs.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save club to database:', error);
		}
	}

	return result;
};
