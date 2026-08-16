import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIContextEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity } from './persist';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'context';

/**
 * `GET`/`POST context` embed `environment_variables` inline, each carrying
 * `truncated_value` - the masked value's last four characters. A masked
 * fragment is still part of a secret, so it is dropped from what reaches the
 * mirror. Declaring `CircleCIContextEnvVarEntity` without the field would
 * not achieve this on its own - every entity here is `.loose()`, and a
 * `.loose()` schema does not strip a field merely for being undeclared; only
 * code that removes it before the cache write does. The caller-facing
 * return value is unaffected - it still carries the masked value straight
 * from the response.
 */
function cacheableContext(
	record: Record<string, unknown>,
): Record<string, unknown> {
	const envVars = record.environment_variables;
	if (!Array.isArray(envVars)) return record;
	return {
		...record,
		environment_variables: envVars.map((envVar) => {
			if (!envVar || typeof envVar !== 'object') return envVar;
			const { truncated_value: _omittedValue, ...rest } = envVar as Record<
				string,
				unknown
			>;
			return rest;
		}),
	};
}

/** Creates a context. */
export const create: CircleCIEndpoints['contextsCreate'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<CircleCIEndpointOutputs['contextsCreate']>(
		ctx,
		'context',
		{
			method: 'POST',
			body: {
				name: input.name,
				owner: compact({ id: input.ownerId, type: input.ownerType }),
			},
		},
	);

	await cacheEntity(
		ctx.db.contexts,
		CircleCIContextEntity,
		cacheableContext(result as Record<string, unknown>),
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.create',
		auditPayload(input, ['ownerId', 'ownerType']),
		'completed',
	);
	return result;
};

/** Retrieves a context, including its env-var metadata and restrictions. */
export const get: CircleCIEndpoints['contextsGet'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['contextsGet']>(
		ctx,
		`context/${input.contextId}`,
	);

	await cacheEntity(
		ctx.db.contexts,
		CircleCIContextEntity,
		cacheableContext(result as Record<string, unknown>),
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.contexts.get',
		auditPayload(input, ['contextId']),
		'completed',
	);
	return result;
};

/**
 * Lists a context's environment variables.
 *
 * `truncated_value` is CircleCI's own masking - the last four characters of
 * the real value - and it is not treated as safe to log even in that form.
 *
 * Wrapped in `{items: [...], next_page_token}` per the spec - and returned to
 * the caller as that same envelope, not unwrapped to a bare array, so the
 * continuation token is not silently discarded. Pass the returned
 * `next_page_token` back as this operation's `pageToken` input to fetch the
 * next page.
 */
export const listEnvVars: CircleCIEndpoints['contextsListEnvVars'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['contextsListEnvVars']
	>(ctx, `context/${input.contextId}/environment-variable`, {
		query: compact({ 'page-token': input.pageToken }),
	});

	await logEventFromContext(
		ctx,
		'circleci.contexts.listEnvVars',
		{ ...auditPayload(input, ['contextId']), returned: result.items.length },
		'completed',
	);
	return result;
};

/** Adds or updates an environment variable in a context. The value is never logged. */
export const upsertEnvVar: CircleCIEndpoints['contextsUpsertEnvVar'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['contextsUpsertEnvVar']
	>(ctx, `context/${input.contextId}/environment-variable/${input.variable}`, {
		method: 'PUT',
		body: { value: input.value },
	});

	await logEventFromContext(
		ctx,
		'circleci.contexts.upsertEnvVar',
		auditPayload(input, ['contextId', 'variable']),
		'completed',
	);
	return result;
};

/** Adds a project, expression, or group restriction to a context. */
export const createRestriction: CircleCIEndpoints['contextsCreateRestriction'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['contextsCreateRestriction']
		>(ctx, `context/${input.contextId}/restrictions`, {
			method: 'POST',
			body: {
				restriction_type: input.restrictionType,
				restriction_value: input.restrictionValue,
			},
		});

		await logEventFromContext(
			ctx,
			'circleci.contexts.createRestriction',
			auditPayload(input, ['contextId', 'restrictionType']),
			'completed',
		);
		return result;
	};

/**
 * Removes a restriction from a context.
 *
 * Creating a context auto-creates a default "All members" restriction whose
 * `id` is borrowed from the org - confirmed live. Deleting the last
 * restriction on a context is not tested here; CircleCI's own behaviour in
 * that case is left to the API rather than guessed at.
 */
export const deleteRestriction: CircleCIEndpoints['contextsDeleteRestriction'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['contextsDeleteRestriction']
		>(ctx, `context/${input.contextId}/restrictions/${input.restrictionId}`, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'circleci.contexts.deleteRestriction',
			auditPayload(input, ['contextId', 'restrictionId']),
			'completed',
		);
		return result;
	};
