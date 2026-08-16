import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIProjectEnvVarEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'project env var';

/** Creates a project environment variable. The value is never logged - masked server-side, but a mask is still part of a secret. */
export const create: CircleCIEndpoints['projectEnvVarsCreate'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['projectEnvVarsCreate']
	>(ctx, `project/${input.projectSlug}/envvar`, {
		method: 'POST',
		body: { name: input.name, value: input.value },
	});

	await cacheEntity(
		ctx.db.projectEnvVars,
		CircleCIProjectEnvVarEntity,
		result,
		{
			label: LABEL,
			entityId: (parsed) => parsed.name ?? undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.projectEnvVars.create',
		auditPayload(input, ['projectSlug', 'name']),
		'completed',
	);
	return result;
};

/** Deletes a project environment variable. */
export const remove: CircleCIEndpoints['projectEnvVarsDelete'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['projectEnvVarsDelete']
	>(ctx, `project/${input.projectSlug}/envvar/${input.name}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.projectEnvVars, input.name, LABEL);

	await logEventFromContext(
		ctx,
		'circleci.projectEnvVars.delete',
		auditPayload(input, ['projectSlug', 'name']),
		'completed',
	);
	return result;
};

/** Lists a project's environment variables. Values come back masked, never in full. */
export const list: CircleCIEndpoints['projectEnvVarsList'] = async (
	ctx,
	input,
) => {
	// Confirmed live and in the spec: this route wraps its results in
	// `{items: [...]}`, unlike the bare-array shape an earlier version of
	// this function assumed - that version passed live testing's mocks only
	// because the mock itself matched the wrong assumption, not the real API.
	const result = await circleCICall<{
		items: CircleCIEndpointOutputs['projectEnvVarsList'];
	}>(ctx, `project/${input.projectSlug}/envvar`);

	await cacheEntities(
		ctx.db.projectEnvVars,
		CircleCIProjectEnvVarEntity,
		result.items,
		{
			label: LABEL,
			entityId: (parsed) => parsed.name ?? undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.projectEnvVars.list',
		{ ...auditPayload(input, ['projectSlug']), returned: result.items.length },
		'completed',
	);
	return result.items;
};
