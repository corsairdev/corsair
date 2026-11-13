import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const getActive: GristEndpoints['session.getActive'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['session.getActive'].parse(input);
	const response = await makeGristRequest<unknown>(
		'/session/access/active',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['session.getActive'].parse(response);
	await logEventFromContext(ctx, 'grist.session.getActive', {}, 'completed');
	return parsed;
};

export const getAll: GristEndpoints['session.getAll'] = async (ctx, input) => {
	GristEndpointInputSchemas['session.getAll'].parse(input);
	const response = await makeGristRequest<unknown>(
		'/session/access/all',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['session.getAll'].parse(response);
	await logEventFromContext(ctx, 'grist.session.getAll', {}, 'completed');
	return parsed;
};

export const setActive: GristEndpoints['session.setActive'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['session.setActive'].parse(input);
	const response = await makeGristRequest<unknown>(
		'/session/access/active',
		ctx.key,
		{
			method: 'POST',
			body: {
				email: parsedInput.email,
				...(parsedInput.org !== undefined ? { org: parsedInput.org } : {}),
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['session.setActive'].parse(response);
	// Never log personal email address
	await logEventFromContext(ctx, 'grist.session.setActive', {}, 'completed');
	return parsed;
};
