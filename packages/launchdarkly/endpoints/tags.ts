import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['tagsList'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.tagsList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/tags',
		ctx.key,
		{
			method: 'GET',
			query: {
				kind: parsedInput.kind,
				pre: parsedInput.pre,
				archived: parsedInput.archived,
				limit: parsedInput.limit,
				offset: parsedInput.offset,
				asOf: parsedInput.asOf,
			},
		},
	);
	const parsed = LaunchDarklyEndpointOutputSchemas.tagsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.tags.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const Tags = {
	list,
};
