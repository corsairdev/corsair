import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerConfigEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'config';

/**
 * Config `name` is unique only within a project. Official examples put the
 * opaque project id on the record; every route addresses by slug. Key the
 * mirror by the slug the caller used so cache and evict cannot diverge.
 */
const entityId = (project: string, name: string) => `${project}:${name}`;

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
		entityId: (c) => entityId(input.project, c.name),
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
		entityId: (c) => entityId(input.project, c.name),
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
		entityId: (c) => entityId(input.project, c.name),
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
		entityId: (c) => entityId(input.project, c.name),
	});
	// A rename changes `name`, which is half of the composite entityId - the
	// call above just cached the config under a *new* key. Evict the old one
	// so the renamed config does not leave a stale duplicate row behind, the
	// same fix applied to `environments.rename`.
	if (input.name !== input.config) {
		await evictEntity(
			ctx.db.configs,
			entityId(input.project, input.config),
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
		entityId(input.project, input.config),
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
		entityId: (c) => entityId(input.project, c.name),
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.clone',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return result.config;
};

/** Locks a config so it cannot be renamed or deleted. */
export const lock: DopplerEndpoints['configsLock'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsLock'];
	}>(ctx, 'configs/config/lock', {
		method: 'POST',
		body: { project: input.project, config: input.config },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId: (c) => entityId(input.project, c.name),
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.lock',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result.config;
};

/** Unlocks a config so it can be renamed or deleted. */
export const unlock: DopplerEndpoints['configsUnlock'] = async (ctx, input) => {
	const result = await dopplerCall<{
		config: DopplerEndpointOutputs['configsUnlock'];
	}>(ctx, 'configs/config/unlock', {
		method: 'POST',
		body: { project: input.project, config: input.config },
	});

	await cacheEntity(ctx.db.configs, DopplerConfigEntity, result.config, {
		label: LABEL,
		entityId: (c) => entityId(input.project, c.name),
	});
	await logEventFromContext(
		ctx,
		'doppler.configs.unlock',
		auditPayload(input, ['project', 'config']),
		'completed',
	);
	return result.config;
};
