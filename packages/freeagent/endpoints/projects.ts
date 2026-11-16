import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['projectsList'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/projects',
		ctx,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.projectsList.omit({ pagination: true }),
	);
	const output = FreeAgentEndpointOutputSchemas.projectsList.parse({
		...response.data,
		pagination: response.pagination,
	});
	await logEventFromContext(
		ctx,
		'freeagent.projects.list',
		{ count: output.projects.length },
		'completed',
	);
	return output;
};

export const get: FreeAgentEndpoints['projectsGet'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsGet.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/projects/${encodeURIComponent(parsed.id)}`,
		ctx,
	);
	return FreeAgentEndpointOutputSchemas.projectsGet.parse(response);
};

export const create: FreeAgentEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsCreate.parse(input);
	const response = await makeFreeAgentRequest('/v2/projects', ctx, {
		method: 'POST',
		body: { project: parsed.project },
	});
	return FreeAgentEndpointOutputSchemas.projectsCreate.parse(response);
};

export const update: FreeAgentEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsUpdate.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/projects/${encodeURIComponent(parsed.id)}`,
		ctx,
		{ method: 'PUT', body: { project: parsed.project } },
	);
	return FreeAgentEndpointOutputSchemas.projectsUpdate.parse(response);
};

export const remove: FreeAgentEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsDelete.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/projects/${encodeURIComponent(parsed.id)}`,
		ctx,
		{ method: 'DELETE' },
	);
	return FreeAgentEndpointOutputSchemas.projectsDelete.parse(response);
};
