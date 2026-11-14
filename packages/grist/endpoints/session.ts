import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest, resolveGristBaseUrl } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const getActive: GristEndpoints['session.getActive'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['session.getActive'].parse(input);
	const response = await makeGristRequest('/session/access/active', ctx.key, {
		method: 'GET',
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed =
		GristEndpointOutputSchemas['session.getActive'].parse(response);
	await logEventFromContext(ctx, 'grist.session.getActive', {}, 'completed');
	return parsed;
};

export const getAll: GristEndpoints['session.getAll'] = async (ctx, input) => {
	GristEndpointInputSchemas['session.getAll'].parse(input);
	const response = await makeGristRequest('/session/access/all', ctx.key, {
		method: 'GET',
		baseUrl: await resolveGristBaseUrl(ctx),
	});
	const parsed = GristEndpointOutputSchemas['session.getAll'].parse(response);
	await logEventFromContext(ctx, 'grist.session.getAll', {}, 'completed');
	return parsed;
};
