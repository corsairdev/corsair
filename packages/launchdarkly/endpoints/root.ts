import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const get: LaunchDarklyEndpoints['rootGet'] = async (ctx, input) => {
	LaunchDarklyEndpointInputSchemas.rootGet.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2',
		undefined,
		{
			method: 'GET',
		},
	);
	const parsed = LaunchDarklyEndpointOutputSchemas.rootGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.root.get',
		{ status: 'ok' },
		'completed',
	);
	return parsed;
};

export const Root = {
	get,
};
