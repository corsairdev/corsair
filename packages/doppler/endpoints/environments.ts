import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerEnvironmentEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'environment';

/**
 * An environment's `id` (confirmed live to equal its `slug`, e.g. `dev`) is
 * only unique *within* a project - every project has its own `dev`. Caching
 * by `id` alone lets two projects' `dev` environments collide in the local
 * mirror: whichever was cached second overwrites the first, and deleting
 * either evicts the row both think is theirs. Composite `project:id` key,
 * the same fix already applied to configs (`endpoints/configs.ts`), which
 * has the identical per-project-uniqueness shape.
 */
const entityId = (e: { project?: string | null; id: string }) =>
	`${e.project}:${e.id}`;

/** Lists environments within a project. */
export const list: DopplerEndpoints['environmentsList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		environments: DopplerEndpointOutputs['environmentsList'];
	}>(ctx, 'environments', { query: { project: input.project } });

	await cacheEntities(
		ctx.db.environments,
		DopplerEnvironmentEntity,
		result.environments,
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.environments.list',
		{
			...auditPayload(input, ['project']),
			returned: result.environments.length,
		},
		'completed',
	);
	return result.environments;
};

/** Retrieves a single environment. */
export const get: DopplerEndpoints['environmentsGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		environment: DopplerEndpointOutputs['environmentsGet'];
	}>(ctx, 'environments/environment', {
		query: { project: input.project, environment: input.environment },
	});

	await cacheEntity(
		ctx.db.environments,
		DopplerEnvironmentEntity,
		result.environment,
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.environments.get',
		auditPayload(input, ['project', 'environment']),
		'completed',
	);
	return result.environment;
};

/** Creates a new environment within a project. */
export const create: DopplerEndpoints['environmentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		environment: DopplerEndpointOutputs['environmentsCreate'];
	}>(ctx, 'environments', {
		method: 'POST',
		query: { project: input.project },
		body: compact({
			name: input.name,
			slug: input.slug,
			personal_configs: input.personalConfigs,
		}),
	});

	await cacheEntity(
		ctx.db.environments,
		DopplerEnvironmentEntity,
		result.environment,
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.environments.create',
		auditPayload(input, ['project', 'name', 'slug', 'personalConfigs']),
		'completed',
	);
	return result.environment;
};

/** Renames an environment's display name, slug, and/or personal-configs setting. */
export const rename: DopplerEndpoints['environmentsRename'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		environment: DopplerEndpointOutputs['environmentsRename'];
	}>(ctx, 'environments/environment', {
		method: 'PUT',
		query: { project: input.project, environment: input.environment },
		body: compact({
			name: input.name,
			slug: input.slug,
			personal_configs: input.personalConfigs,
		}),
	});

	await cacheEntity(
		ctx.db.environments,
		DopplerEnvironmentEntity,
		result.environment,
		{ label: LABEL, entityId },
	);
	// A rename can change the slug, which is also the entity's `id` - the
	// composite key above is then a *different* key than the one this
	// environment was cached under before the call. Evict the old key so a
	// renamed environment does not leave a stale duplicate row behind.
	const oldKey = `${input.project}:${input.environment}`;
	const newKey = entityId(result.environment);
	if (oldKey !== newKey) await evictEntity(ctx.db.environments, oldKey, LABEL);
	await logEventFromContext(
		ctx,
		'doppler.environments.rename',
		auditPayload(input, [
			'project',
			'environment',
			'name',
			'slug',
			'personalConfigs',
		]),
		'completed',
	);
	return result.environment;
};

/** Deletes an environment. */
export const remove: DopplerEndpoints['environmentsDelete'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<
		DopplerEndpointOutputs['environmentsDelete']
	>(ctx, 'environments/environment', {
		method: 'DELETE',
		query: { project: input.project, environment: input.environment },
	});

	await evictEntity(
		ctx.db.environments,
		`${input.project}:${input.environment}`,
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'doppler.environments.delete',
		auditPayload(input, ['project', 'environment']),
		'completed',
	);
	return result;
};
