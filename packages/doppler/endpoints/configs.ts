import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerConfigEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'config';

/**
 * A config's `name` (the mirror's declared primary key) is only unique
 * *within* a project - `dev` exists in every project. Mirroring by `name`
 * alone would collide across projects, so every cache/evict call here keys
 * by `project:name` instead. Same composite-id pattern used for CircleCI's
 * project env vars.
 */
const entityId = (c: { project?: string | null; name: string }) =>
	`${c.project}:${c.name}`;

/** Lists configs within a project, optionally scoped to one environment. */
export const list: DopplerEndpoints['configsList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		page: number;
		configs: DopplerEndpointOutputs['configsList']['configs'];
	}>(ctx, 'configs', {
		query: compact({
			project: input.project,
			environment: input.environment,
			page: input.page,
			per_page: input.perPage,
		}),
	});

	await cacheEntities(ctx.db.configs, DopplerConfigEntity, result.configs, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.list',
		{ ...auditPayload(input, ['project']), returned: result.configs.length },
		'completed',
	);
	return result;
};

/** Retrieves a single config. */
export const get: DopplerEndpoints['configsGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsGet'];
	}>(ctx, 'configs/config', {
		query: { project: input.project, config: input.config },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.get',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result.config;
};

/** Creates a branch config within an environment. */
export const create: DopplerEndpoints['configsCreate'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsCreate'];
	}>(ctx, 'configs', {
		method: 'POST',
		body: {
			project: input.project,
			environment: input.environment,
			name: input.name,
		},
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.create',
		auditPayload(input, ['project', 'environment', 'name']),
		'completed',
	);
	return result.config;
};

/** Renames a config. */
export const update: DopplerEndpoints['configsUpdate'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsUpdate'];
	}>(ctx, 'configs/config', {
		method: 'POST',
		body: { project: input.project, config: input.config, name: input.name },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	// A rename changes `name`, which is half of the composite entityId - the
	// call above just cached the config under a *new* key. Evict the old one
	// so the renamed config does not leave a stale duplicate row behind, the
	// same fix applied to `environments.rename`.
	if (input.name !== input.config) {
		await evictEntity(
			ctx.db.configs,
			entityId({ project: input.project, name: input.config }),
			LABEL,
		);
	}
	await logEventFromContext(
		ctx,
		'doppler.configs.update',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return result.config;
};

/** Deletes a config. */
export const remove: DopplerEndpoints['configsDelete'] = async (ctx, input) => {
	const result = await dopplerCall<DopplerEndpointOutputs['configsDelete']>(
		ctx,
		'configs/config',
		{
			method: 'DELETE',
			query: { project: input.project, config: input.config },
		},
	);

	await evictEntity(
		ctx.db.configs,
		entityId({ project: input.project, name: input.config }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'doppler.configs.delete',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result;
};

/** Clones a config into a new branch config. */
export const clone: DopplerEndpoints['configsClone'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsClone'];
	}>(ctx, 'configs/config/clone', {
		method: 'POST',
		body: { project: input.project, config: input.config, name: input.name },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.clone',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return result.config;
};

/** Locks a config, preventing further writes. */
export const lock: DopplerEndpoints['configsLock'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsLock'];
	}>(ctx, 'configs/config/lock', {
		method: 'POST',
		body: { project: input.project, config: input.config },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.lock',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result.config;
};

/** Unlocks a previously locked config. */
export const unlock: DopplerEndpoints['configsUnlock'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsUnlock'];
	}>(ctx, 'configs/config/unlock', {
		method: 'POST',
		body: { project: input.project, config: input.config },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId,
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.unlock',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result.config;
};
