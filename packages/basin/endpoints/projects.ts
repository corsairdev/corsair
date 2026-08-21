import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toProjectRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const create: BasinEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['projectsCreate']>(
		'projects',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.projects,
			result.id,
			toProjectRecord(result),
			'project',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.projects.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: BasinEndpoints['projectsList'] = async (ctx, input = {}) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const result = await makeBasinRequest<BasinEndpointOutputs['projectsList']>(
		'projects',
		ctx.key,
		{ method: 'GET', query },
	);

	const projectsList = Array.isArray(result)
		? result
		: (result as { projects?: unknown[] }).projects;

	if (Array.isArray(projectsList)) {
		for (const project of projectsList) {
			if (project && typeof project === 'object' && 'id' in project) {
				await safeDbUpsert(
					ctx.db.projects,
					(project as { id: string | number }).id,
					toProjectRecord(project as Parameters<typeof toProjectRecord>[0]),
					'project',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.projects.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BasinEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['projectsGet']>(
		`projects/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.projects,
			result.id,
			toProjectRecord(result),
			'project',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.projects.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: BasinEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeBasinRequest<BasinEndpointOutputs['projectsUpdate']>(
		`projects/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.projects,
			result.id,
			toProjectRecord(result),
			'project',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.projects.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteProject: BasinEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['projectsDelete']>(
		`projects/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await safeDbDelete(ctx.db.projects, input.id, 'project');

	await logEventFromContext(
		ctx,
		'basin.projects.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const Projects = {
	create,
	list,
	get,
	update,
	delete: deleteProject,
};
