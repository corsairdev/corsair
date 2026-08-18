import { logEventFromContext } from 'corsair/core';
import type { BigmlEndpoints } from '../index';
import { BigmlProjectEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmlCall, compact, listQuery } from './shared';
import type { BigmlEndpointOutputs } from './types';

const LABEL = 'project';

/** Creates a project. */
export const create: BigmlEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['projectsCreate']>(
		ctx,
		'project',
		{
			method: 'POST',
			body: compact({
				name: input.name,
				description: input.description,
				tags: input.tags,
				category: input.category,
			}),
		},
	);

	await cacheEntity(ctx.db.projects, BigmlProjectEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.projects.create',
		auditPayload(input, ['name']),
		'completed',
	);
	return result;
};

/** Retrieves a single project. */
export const get: BigmlEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['projectsGet']>(
		ctx,
		input.projectId,
	);

	await cacheEntity(ctx.db.projects, BigmlProjectEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.projects.get',
		auditPayload(input, ['projectId']),
		'completed',
	);
	return result;
};

/** Permanently deletes a project. */
export const remove: BigmlEndpoints['projectsDelete'] = async (ctx, input) => {
	await bigmlCall<BigmlEndpointOutputs['projectsDelete']>(
		ctx,
		input.projectId,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.projects, input.projectId, LABEL);
	await logEventFromContext(
		ctx,
		'bigml.projects.delete',
		auditPayload(input, ['projectId']),
		'completed',
	);
};

/** Lists projects in the account. */
export const list: BigmlEndpoints['projectsList'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['projectsList']>(
		ctx,
		'project',
		{ query: listQuery(input) },
	);

	await cacheEntities(ctx.db.projects, BigmlProjectEntity, result.objects, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.projects.list',
		{ returned: result.objects.length },
		'completed',
	);
	return result;
};
