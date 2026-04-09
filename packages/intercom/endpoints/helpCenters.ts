import { logEventFromContext } from 'corsair/core';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const list: IntercomEndpoints['helpCentersList'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['helpCentersList']
	>('help_center/help_centers', ctx.key);

	await logEventFromContext(ctx, 'intercom.helpCenters.list', {}, 'completed');
	return result;
};

export const get: IntercomEndpoints['helpCentersGet'] = async (ctx, input) => {
	const { id, ...query } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['helpCentersGet']
	>(`help_center/help_centers/${id}`, ctx.key, {
		query,
	});

	await logEventFromContext(
		ctx,
		'intercom.helpCenters.get',
		{ ...input },
		'completed',
	);
	return result;
};
