import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIProjectEnvVarEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'project env var';
const PROJECT_ENV_VAR_MIRROR_FIELDS = [
	'name',
	'created_at',
	'created-at',
] as const;

/**
 * Env var names are unique per project, not globally - `API_KEY` on one
 * followed project and `API_KEY` on another are different records. An
 * earlier version of this file keyed the mirror by name alone, so a second
 * project's env var of the same name would silently overwrite the first
 * project's cached row. Composed the same way everywhere this store is
 * written or evicted, so the three sites cannot drift apart.
 */
function projectEnvVarEntityId(projectSlug: string, name: string): string {
	return `${projectSlug}:${name}`;
}

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
			fields: PROJECT_ENV_VAR_MIRROR_FIELDS,
			entityId: (parsed) =>
				parsed.name
					? projectEnvVarEntityId(input.projectSlug, parsed.name)
					: undefined,
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

/**
 * Deletes a project environment variable.
 *
 * Logged before the eviction, matching `ContextsGraphQL.remove`'s reasoning
 * in `contexts-graphql.ts`: the delete has already happened remotely by the
 * time this function reaches the log call.
 */
export const remove: CircleCIEndpoints['projectEnvVarsDelete'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['projectEnvVarsDelete']
	>(ctx, `project/${input.projectSlug}/envvar/${input.name}`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'circleci.projectEnvVars.delete',
		auditPayload(input, ['projectSlug', 'name']),
		'completed',
	);

	await evictEntity(
		ctx.db.projectEnvVars,
		projectEnvVarEntityId(input.projectSlug, input.name),
		LABEL,
	);
	return result;
};

/**
 * Lists a project's environment variables. Values come back masked, never in
 * full.
 *
 * Confirmed live and in the spec: this route wraps its results in
 * `{items: [...], next_page_token}`, unlike the bare-array shape an earlier
 * version of this function assumed - that version passed live testing's
 * mocks only because the mock itself matched the wrong assumption, not the
 * real API. Returned to the caller as that same envelope rather than
 * unwrapped to a bare array. **The spec's own query parameters for this route
 * declare no `page-token`**, so `next_page_token` is surfaced here as a
 * signal only - there is no documented way to request the next page it
 * points to. See the input schema's doc comment.
 */
export const list: CircleCIEndpoints['projectEnvVarsList'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['projectEnvVarsList']
	>(ctx, `project/${input.projectSlug}/envvar`);

	await cacheEntities(
		ctx.db.projectEnvVars,
		CircleCIProjectEnvVarEntity,
		result.items,
		{
			label: LABEL,
			fields: PROJECT_ENV_VAR_MIRROR_FIELDS,
			entityId: (parsed) =>
				parsed.name
					? projectEnvVarEntityId(input.projectSlug, parsed.name)
					: undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.projectEnvVars.list',
		{ ...auditPayload(input, ['projectSlug']), returned: result.items.length },
		'completed',
	);
	return result;
};
