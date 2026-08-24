import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerProjectEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'project';

/**
 * Every project route addresses the resource by `project` (its slug), not
 * its opaque `id` - `get`/`update`/`delete` all take a slug, and every other
 * family (environments, configs, ...) references a project by that same
 * slug. Mirroring by `id` would leave `delete` unable to find the row it
 * just removed, since a delete response carries no body to read an `id`
 * back out of. Mirror by slug so every operation, including delete, keys
 * off the one value they all actually have.
 */
const entityId = (p: { slug?: string | null; id?: string }) => p.slug ?? p.id;

/** Lists projects in the workplace, paginated. */
export const list: DopplerEndpoints['projectsList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		page: number;
		projects: DopplerEndpointOutputs['projectsList']['projects'];
	}>(ctx, 'projects', {
		query: compact({ page: input.page, per_page: input.perPage }),
	});

	await cacheEntities(ctx.db.projects, DopplerProjectEntity, result.projects, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.projects.list',
		{ returned: result.projects.length },
		'completed',
	);
	return result;
};

/** Retrieves a single project by slug. */
export const get: DopplerEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		project: DopplerEndpointOutputs['projectsGet'];
	}>(ctx, 'projects/project', { query: { project: input.project } });

	await cacheEntity(ctx.db.projects, DopplerProjectEntity, result.project, {
		label: LABEL,
		entityId: (p) => p.slug ?? input.project,
	});
	await logEventFromContext(
		ctx,
		'doppler.projects.get',
		auditPayload(input, ['project']),
		'completed',
	);
	return result.project;
};

/** Creates a new project. */
export const create: DopplerEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		project: DopplerEndpointOutputs['projectsCreate'];
	}>(ctx, 'projects', {
		method: 'POST',
		body: compact({ name: input.name, description: input.description }),
	});

	await cacheEntity(ctx.db.projects, DopplerProjectEntity, result.project, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.projects.create',
		auditPayload(input, ['name']),
		'completed',
	);
	return result.project;
};

/** Updates a project's name and/or description. */
export const update: DopplerEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		project: DopplerEndpointOutputs['projectsUpdate'];
	}>(ctx, 'projects/project', {
		method: 'POST',
		body: compact({
			project: input.project,
			name: input.name,
			description: input.description,
		}),
	});

	await cacheEntity(ctx.db.projects, DopplerProjectEntity, result.project, {
		label: LABEL,
		entityId: (p) => p.slug ?? input.project,
	});
	await logEventFromContext(
		ctx,
		'doppler.projects.update',
		auditPayload(input, ['project', 'name']),
		'completed',
	);
	return result.project;
};

/** Deletes a project. */
export const remove: DopplerEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<DopplerEndpointOutputs['projectsDelete']>(
		ctx,
		'projects/project',
		{ method: 'DELETE', body: { project: input.project } },
	);

	await evictEntity(ctx.db.projects, input.project, LABEL);
	await logEventFromContext(
		ctx,
		'doppler.projects.delete',
		auditPayload(input, ['project']),
		'completed',
	);
	return result;
};
