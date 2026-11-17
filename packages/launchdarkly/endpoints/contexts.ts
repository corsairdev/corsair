import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const search: LaunchDarklyEndpoints['contextsSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.contextsSearch.parse(input);
	const { projectKey, environmentKey, ...query } = parsedInput;
	const path = `/api/v2/projects/${encodeURIComponent(projectKey)}/environments/${encodeURIComponent(environmentKey)}/contexts/search`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'POST',
		query,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.contextsSearch.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.contexts.search',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['contextsGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.contextsGet.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/environments/${encodeURIComponent(parsedInput.environmentKey)}/contexts/${encodeURIComponent(parsedInput.kind)}/${encodeURIComponent(parsedInput.key)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			limit: parsedInput.limit,
			continuationToken: parsedInput.continuationToken,
			sort: parsedInput.sort,
			filter: parsedInput.filter,
			includeTotalCount: parsedInput.includeTotalCount,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.contextsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.contexts.get',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const listKinds: LaunchDarklyEndpoints['contextsListKinds'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.contextsListKinds.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}/context-kinds`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.contextsListKinds.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.contexts.listKinds',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const Contexts = {
	search,
	get,
	listKinds,
};
