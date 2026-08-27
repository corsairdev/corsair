import { logEventFromContext } from 'corsair/core';
import { makeVestaboardRequest, VESTABOARD_PLATFORM_API_BASE } from '../client';
import type { VestaboardEndpoints } from '../index';
import type { VestaboardEndpointOutputs } from './types';

export const get: VestaboardEndpoints['viewerGet'] = async (ctx, _input) => {
	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['viewerGet']>(
		'viewer',
		ctx.key,
		{
			method: 'GET',
			baseUrl: VESTABOARD_PLATFORM_API_BASE,
			apiSecret: ctx.options.apiSecret,
		},
	);

	if (result._id && ctx.db?.viewer) {
		try {
			await ctx.db.viewer.upsertByEntityId(result._id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save viewer to database:', error);
		}
	}

	await logEventFromContext(ctx, 'vestaboard.viewer.get', {}, 'completed');
	return result;
};
