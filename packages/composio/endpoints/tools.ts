import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioEndpoints } from '../index';
import { ComposioEndpointOutputSchemas } from './types';

export const list: ComposioEndpoints['toolsList'] = async (ctx, input) => {
	const response = await makeComposioRequest(
		'/tools',
		ctx.key,
		ComposioEndpointOutputSchemas.toolsList,
		{ query: input },
	);
	await logEventFromContext(ctx, 'composio.tools.list', input, 'completed');
	return response;
};

export const get: ComposioEndpoints['toolGet'] = async (ctx, input) => {
	const response = await makeComposioRequest(
		`/tools/${encodeURIComponent(input.tool_slug)}`,
		ctx.key,
		ComposioEndpointOutputSchemas.toolGet,
		{ query: { version: input.version } },
	);
	await logEventFromContext(
		ctx,
		'composio.tools.get',
		{ tool_slug: input.tool_slug },
		'completed',
	);
	return response;
};

export const execute: ComposioEndpoints['toolExecute'] = async (ctx, input) => {
	const { tool_slug, ...body } = input;
	const response = await makeComposioRequest(
		`/tools/execute/${encodeURIComponent(tool_slug)}`,
		ctx.key,
		ComposioEndpointOutputSchemas.toolExecute,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'composio.tools.execute',
		{ tool_slug, successful: response.successful },
		'completed',
	);
	return response;
};
