import { logEventFromContext } from 'corsair/core';
import type { AyrshareEndpoints } from '..';
import { makeAyrshareRequest } from '../client';
import type { AyrshareEndpointOutputs } from './types';

export const deletePost: AyrshareEndpoints['deletePost'] = async (ctx, input) => {
	const profileKey = ctx.options.profileKey ?? (await ctx.keys.get_profile_key()) ?? undefined;
	const response = await makeAyrshareRequest<AyrshareEndpointOutputs['deletePost']>(
		'/post', ctx.key, profileKey, { method: 'DELETE', body: input },
	);
	await logEventFromContext(ctx, 'ayrshare.posts.delete', input, 'completed');
	return response;
};

export const history: AyrshareEndpoints['getPostHistory'] = async (ctx, input) => {
	const profileKey = ctx.options.profileKey ?? (await ctx.keys.get_profile_key()) ?? undefined;
	const response = await makeAyrshareRequest<AyrshareEndpointOutputs['getPostHistory']>(
		'/history', ctx.key, profileKey, {
			method: 'GET',
			query: {
				limit: input.lastRecords,
				startDate: input.startDate,
				endDate: input.endDate,
				status: input.status,
			},
		},
	);
	await logEventFromContext(ctx, 'ayrshare.posts.history', input, 'completed');
	return response;
};
