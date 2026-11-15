import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['projectsList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.projectsList.parse(input);
	// `unknown` because the provider response is narrowed by the output schema.
	const response = await makeLaunchDarklyRequest<unknown>(
		'/api/v2/projects',
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
	const parsed = LaunchDarklyEndpointOutputSchemas.projectsList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.projects.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['projectsGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.projectsGet.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}`;
	// `unknown` because the provider response is narrowed by the output schema.
	const response = await makeLaunchDarklyRequest<unknown>(path, ctx.key, {
		method: 'GET',
		query: {
			expand: parsedInput.expand,
		},
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.projectsGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.projects.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.projectsCreate.parse(input);
	// `unknown` because the provider response is narrowed by the output schema.
	const response = await makeLaunchDarklyRequest<unknown>(
		'/api/v2/projects',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.projectsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.projects.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.projectsUpdate.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}`;
	// `unknown` because the provider response is narrowed by the output schema.
	const response = await makeLaunchDarklyRequest<unknown>(path, ctx.key, {
		method: 'PATCH',
		body: parsedInput.patch,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.projectsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.projects.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteProject: LaunchDarklyEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.projectsDelete.parse(input);
	const path = `/api/v2/projects/${encodeURIComponent(parsedInput.projectKey)}`;
	// `unknown` because even an empty response is checked against the endpoint output schema.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'DELETE',
	});
	LaunchDarklyEndpointOutputSchemas.projectsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.projects.delete',
		{ status: 'ok' },
		'completed',
	);
};

export const Projects = {
	list,
	get,
	create,
	update,
	delete: deleteProject,
};
