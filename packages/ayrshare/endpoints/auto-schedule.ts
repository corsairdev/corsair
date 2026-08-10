import { logEventFromContext } from 'corsair/core';
import type { AyrshareEndpoints } from '..';
import { makeAyrshareRequest } from '../client';
import type { AyrshareEndpointOutputs } from './types';

export const set: AyrshareEndpoints['setAutoSchedule'] = async (ctx, input) => {
	const profileKey = ctx.options.profileKey ?? (await ctx.keys.get_profile_key()) ?? undefined;
	const response = await makeAyrshareRequest<AyrshareEndpointOutputs['setAutoSchedule']>(
		'/auto-schedule/set', ctx.key, profileKey, { method: 'POST', body: input },
	);
	await logEventFromContext(ctx, 'ayrshare.autoSchedule.set', input, 'completed');
	return response;
};

export const list: AyrshareEndpoints['listAutoSchedules'] = async (ctx) => {
	const profileKey = ctx.options.profileKey ?? (await ctx.keys.get_profile_key()) ?? undefined;
	const response = await makeAyrshareRequest<AyrshareEndpointOutputs['listAutoSchedules']>(
		'/auto-schedule/list', ctx.key, profileKey,
	);
	await logEventFromContext(ctx, 'ayrshare.autoSchedule.list', {}, 'completed');
	return response;
};
