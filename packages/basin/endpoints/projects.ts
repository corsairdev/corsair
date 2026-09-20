import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['projectsList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.projectsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.page !== undefined) query.page = validated.page;
	if (validated.query !== undefined) query.query = validated.query;

	const res = await makeBasinRequest<unknown>('projects', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.projectsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['projectsGet'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.projectsGet.parse(input);
	const res = await makeBasinRequest<unknown>(
		`projects/${validated.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.projectsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.get',
		{ ...validated },
		'completed',
	);
	return response;
};

export const create: BasinEndpoints['projectsCreate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.projectsCreate.parse(input);
	const { project, name } = validated;
	const body = project ? { project } : { project: { name: name ?? '' } };

	const res = await makeBasinRequest<unknown>('projects', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.projectsCreate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.create',
		{ ...validated },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['projectsUpdate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.projectsUpdate.parse(input);
	const { id, project, name } = validated;
	const body = project ? { project } : { project: { name: name ?? '' } };

	const res = await makeBasinRequest<unknown>(`projects/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.projectsUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.update',
		{ ...validated },
		'completed',
	);
	return response;
};

export const deleteProject: BasinEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.projectsDelete.parse(input);
	const res = await makeBasinRequest<unknown>(
		`projects/${validated.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.projectsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.delete',
		{ ...validated },
		'completed',
	);
	return response;
};
