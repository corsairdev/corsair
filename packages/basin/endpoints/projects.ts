import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['projectsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const res = await makeBasinRequest<unknown>('projects', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.projectsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['projectsGet'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(`projects/${input.id}`, ctx.key, {
		method: 'GET',
	});
	const response = BasinEndpointOutputSchemas.projectsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BasinEndpoints['projectsCreate'] = async (ctx, input) => {
	const { project, name } = input;
	const body = project ? { project } : { project: { name: name ?? '' } };

	const res = await makeBasinRequest<unknown>('projects', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.projectsCreate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { id, project, name } = input;
	const body = project ? { project } : { project: { name: name ?? '' } };

	const res = await makeBasinRequest<unknown>(`projects/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.projectsUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteProject: BasinEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const res = await makeBasinRequest<unknown>(`projects/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
	const response = BasinEndpointOutputSchemas.projectsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.projects.delete',
		{ ...input },
		'completed',
	);
	return response;
};
