import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['projectsList'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsList.parse(input);
	const response = await makeFreeAgentRequest('/v2/projects', ctx.key, {
		query: parsed.query,
	});
	const output = FreeAgentEndpointOutputSchemas.projectsList.parse(response);
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
		ctx.key,
	);
	return FreeAgentEndpointOutputSchemas.projectsGet.parse(response);
};

export const create: FreeAgentEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.projectsCreate.parse(input);
	const response = await makeFreeAgentRequest('/v2/projects', ctx.key, {
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
		ctx.key,
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
		ctx.key,
		{ method: 'DELETE' },
	);
	return FreeAgentEndpointOutputSchemas.projectsDelete.parse(response);
};
