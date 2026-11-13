import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['templates.list'] = async (ctx, input) => {
	GristEndpointInputSchemas['templates.list'].parse(input);
	const response = await makeGristRequest<unknown>('/templates', ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['templates.list'].parse(response);
	await logEventFromContext(ctx, 'grist.templates.list', {}, 'completed');
	return parsed;
};

export const get: GristEndpoints['templates.get'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['templates.get'].parse(input);
	const tplIdStr = encodeURIComponent(String(parsedInput.templateId));
	const response = await makeGristRequest<unknown>(
		`/templates/${tplIdStr}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['templates.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.templates.get',
		{ templateId: parsedInput.templateId },
		'completed',
	);
	return parsed;
};
