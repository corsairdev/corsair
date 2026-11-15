import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest, resolveGristBaseUrl } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['widgets.list'] = async (ctx, input) => {
	GristEndpointInputSchemas['widgets.list'].parse(input);
	const response = await makeGristRequest('/widgets', ctx.key, {
		method: 'GET',
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed = GristEndpointOutputSchemas['widgets.list'].parse(response);
	await logEventFromContext(ctx, 'grist.widgets.list', {}, 'completed');
	return parsed;
};
