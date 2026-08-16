import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIGroupEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'group';

/**
 * Creates an organization group.
 *
 * Confirmed live to answer 403 "Permission denied" on the development
 * account, even though reading the same collection succeeds. Not documented
 * as plan-gated: the cause was not narrowed between a plan restriction and a
 * personal-GitHub-account limitation (the same ambiguity the GraphQL
 * `organization(name:,vcsType:)` lookup showed). The operation is still
 * implemented and tested against a mocked 201, since a different
 * organization on a different plan may reach it successfully.
 */
export const create: CircleCIEndpoints['groupsCreate'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['groupsCreate']>(
		ctx,
		`organizations/${input.orgId}/groups`,
		{
			method: 'POST',
			body: compact({ name: input.name, description: input.description }),
		},
	);

	await cacheEntity(ctx.db.groups, CircleCIGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'circleci.groups.create',
		auditPayload(input, ['orgId']),
		'completed',
	);
	return result;
};

/**
 * Deletes an organization group. Required eviction - CircleCI hard-deletes
 * groups.
 *
 * Logged before the eviction: see the identical reasoning on
 * `ContextsGraphQL.remove` in `contexts-graphql.ts`. The delete has already
 * happened remotely by the time this function reaches the log call; a
 * required eviction failing afterward must not erase the record that it did.
 */
export const remove: CircleCIEndpoints['groupsDelete'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['groupsDelete']>(
		ctx,
		`organizations/${input.orgId}/groups/${input.groupId}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'circleci.groups.delete',
		auditPayload(input, ['orgId', 'groupId']),
		'completed',
	);

	await evictEntity(ctx.db.groups, input.groupId, LABEL, { required: true });
	return result;
};

/** Retrieves an organization group. */
export const get: CircleCIEndpoints['groupsGet'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['groupsGet']>(
		ctx,
		`organizations/${input.orgId}/groups/${input.groupId}`,
	);

	await cacheEntity(ctx.db.groups, CircleCIGroupEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'circleci.groups.get',
		auditPayload(input, ['orgId', 'groupId']),
		'completed',
	);
	return result;
};

/**
 * Lists an organization's groups. Confirmed live: 200 with an empty list on
 * a free-plan account.
 *
 * Wrapped in `{items: [...], next_page_token, total_count}` per the spec, and
 * returned to the caller as that same envelope rather than unwrapped to a
 * bare array, so `next_page_token` is not silently discarded. Pass it back as
 * this operation's `pageToken` input to fetch the next page.
 */
export const list: CircleCIEndpoints['groupsList'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['groupsList']>(
		ctx,
		`organizations/${input.orgId}/groups`,
		{ query: compact({ limit: input.limit, 'page-token': input.pageToken }) },
	);

	await cacheEntities(ctx.db.groups, CircleCIGroupEntity, result.items, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'circleci.groups.list',
		{ ...auditPayload(input, ['orgId']), returned: result.items.length },
		'completed',
	);
	return result;
};
