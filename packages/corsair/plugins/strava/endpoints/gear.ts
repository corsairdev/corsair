import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const get: StravaEndpoints['gearGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['gearGet']>(
		`gear/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.gears) {
		try {
			await ctx.db.gears.upsertByEntityId(result.id, { ...result });
		} catch (error) {
			console.warn('Failed to save gear to database:', error);
		}
	}

	return result;
};
