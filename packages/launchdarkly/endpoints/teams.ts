import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['teamsList'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.teamsList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/teams',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: parsedInput.limit,
				offset: parsedInput.offset,
				filter: parsedInput.filter,
				sort: parsedInput.sort,
				expand: parsedInput.expand,
			},
		},
	);
	const parsed = LaunchDarklyEndpointOutputSchemas.teamsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.teams.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['teamsGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.teamsGet.parse(input);
	const path = `/api/v2/teams/${encodeURIComponent(parsedInput.teamKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
		query: {
			expand: parsedInput.expand,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.teamsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.teams.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['teamsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.teamsCreate.parse(input);
	const { expand, ...body } = parsedInput;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/teams',
		ctx.key,
		{
			method: 'POST',
			body,
			query: { expand },
		},
	);
	const parsed = LaunchDarklyEndpointOutputSchemas.teamsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.teams.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['teamsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.teamsUpdate.parse(input);
	const path = `/api/v2/teams/${encodeURIComponent(parsedInput.teamKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: {
			instructions: parsedInput.instructions,
			comment: parsedInput.comment,
		},
		mediaType: 'application/json; domain-model=launchdarkly.semanticpatch',
		query: {
			expand: parsedInput.expand,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.teamsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.teams.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteTeam: LaunchDarklyEndpoints['teamsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.teamsDelete.parse(input);
	const path = `/api/v2/teams/${encodeURIComponent(parsedInput.teamKey)}`;
	// `unknown` because even an empty response is checked against the endpoint output schema.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'DELETE',
	});
	LaunchDarklyEndpointOutputSchemas.teamsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.teams.delete',
		{ key: parsedInput.teamKey },
		'completed',
	);
};

export const Teams = {
	list,
	get,
	create,
	update,
	delete: deleteTeam,
};
