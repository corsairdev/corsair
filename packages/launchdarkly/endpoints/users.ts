import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['usersList'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.usersList.parse(input);
	const path = `/api/v2/users/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			limit: parsedInput.limit,
			searchAfter: parsedInput.searchAfter,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.users.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['usersGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.usersGet.parse(input);
	const path = `/api/v2/users/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}/${encodeURIComponent(parsedInput.userKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.usersGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.users.get',
		{ status: 'ok' },
		'completed',
	);
	return parsed;
};

export const search: LaunchDarklyEndpoints['usersSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.usersSearch.parse(input);
	const path = `/api/v2/user-search/${encodeURIComponent(parsedInput.projectKey)}/${encodeURIComponent(parsedInput.environmentKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			q: parsedInput.q,
			limit: parsedInput.limit,
			searchAfter: parsedInput.searchAfter,
			filter: parsedInput.filter,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.usersSearch.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.users.search',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const Users = {
	list,
	get,
	search,
};
