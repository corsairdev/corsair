import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIOrbAllowlistEntryEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity, evictEntity } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'orb allow-list entry';

/**
 * Creates a URL orb allow-list entry.
 *
 * Confirmed live: the response is `{id, message}` only - `name`/`prefix`/
 * `auth` are not echoed back, so what is mirrored is built from the input
 * rather than the response, with the id the API assigned.
 */
export const create: CircleCIEndpoints['orbAllowlistCreate'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['orbAllowlistCreate']
	>(ctx, `organization/${input.orgSlugOrId}/url-orb-allow-list`, {
		method: 'POST',
		body: { name: input.name, prefix: input.prefix, auth: input.auth },
	});

	if (result.id) {
		await cacheEntity(
			ctx.db.orbAllowlistEntries,
			CircleCIOrbAllowlistEntryEntity,
			{
				id: result.id,
				name: input.name,
				prefix: input.prefix,
				auth: input.auth,
			},
			{ label: LABEL },
		);
	}

	await logEventFromContext(
		ctx,
		'circleci.orbAllowlist.create',
		auditPayload(input, ['orgSlugOrId', 'auth']),
		'completed',
	);
	return result;
};

/**
 * Removes a URL orb allow-list entry.
 *
 * Logged before the eviction, matching `ContextsGraphQL.remove`'s reasoning
 * in `contexts-graphql.ts`: the delete has already happened remotely by the
 * time this function reaches the log call. Eviction here stays best-effort
 * (not `required: true`) - an allow-list entry is a URL prefix, not a
 * secret or personal data, so a stale mirror row after a failed cache write
 * is a freshness bug, not the kind of breach `required` exists to prevent.
 */
export const remove: CircleCIEndpoints['orbAllowlistDelete'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['orbAllowlistDelete']
	>(
		ctx,
		`organization/${input.orgSlugOrId}/url-orb-allow-list/${input.entryId}`,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.orbAllowlist.delete',
		auditPayload(input, ['orgSlugOrId', 'entryId']),
		'completed',
	);

	await evictEntity(ctx.db.orbAllowlistEntries, input.entryId, LABEL);
	return result;
};
