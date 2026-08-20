import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import { makeComposioRequest, omitUndefined } from '../client';
import type { ComposioEndpointOutputs } from './types';

export const list: ComposioEndpoints['toolsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['toolsList']
	>('/v3/tools', ctx.key, {
		method: 'GET',
		// Zod-validated optional query params for GET /v3/tools
		query: omitUndefined({
			toolkit_slug: input.toolkit_slug,
			tool_slugs: input.tool_slugs,
			query: input.query ?? input.search,
			important: input.important,
			include_deprecated: input.include_deprecated,
			toolkit_versions: input.toolkit_versions ?? 'latest',
			limit: input.limit,
			cursor: input.cursor,
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.tools.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ComposioEndpoints['toolGet'] = async (ctx, input) => {
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['toolGet']
	>(`/v3/tools/${encodeURIComponent(input.tool_slug)}`, ctx.key, {
		method: 'GET',
		query: omitUndefined({
			version: input.version,
			toolkit_versions: input.toolkit_versions ?? 'latest',
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.tools.get',
		{ ...input },
		'completed',
	);
	return response;
};
