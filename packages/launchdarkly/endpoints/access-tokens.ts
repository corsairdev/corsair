import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['accessTokensList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accessTokensList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/tokens',
		ctx.key,
		{
			method: 'GET',
			query: {
				showAll: parsedInput.showAll,
				limit: parsedInput.limit,
				offset: parsedInput.offset,
			},
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accessTokensList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accessTokens.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['accessTokensGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accessTokensGet.parse(input);
	const path = `/api/v2/tokens/${encodeURIComponent(parsedInput.id)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accessTokensGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accessTokens.get',
		{ status: 'ok' },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['accessTokensCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accessTokensCreate.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/tokens',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accessTokensCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accessTokens.create',
		{ status: 'ok' },
		'completed',
	);
	return parsed;
};

export const deleteToken: LaunchDarklyEndpoints['accessTokensDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accessTokensDelete.parse(input);
	const path = `/api/v2/tokens/${encodeURIComponent(parsedInput.id)}`;
	await makeLaunchDarklyRequest<void>(path, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'launchdarkly.accessTokens.delete',
		{ status: 'ok' },
		'completed',
	);
};

export const AccessTokens = {
	list,
	get,
	create,
	delete: deleteToken,
};
