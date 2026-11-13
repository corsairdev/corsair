import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['widgets.list'] = async (ctx, input) => {
	GristEndpointInputSchemas['widgets.list'].parse(input);
	const response = await makeGristRequest<unknown>('/widgets', ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['widgets.list'].parse(response);
	await logEventFromContext(ctx, 'grist.widgets.list', {}, 'completed');
	return parsed;
};
