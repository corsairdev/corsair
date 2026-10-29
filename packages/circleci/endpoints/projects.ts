import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIProjectEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity, evictEntity } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'project';

/**
 * Projects are looked up everywhere else in this plugin by `slug`
 * (`project/{project-slug}`), not by the `id` UUID `defaultEntityId` would
 * pick - so every project mirror in this file is keyed by slug consistently,
 * including on create.
 */
const projectEntityId = (parsed: {
	slug?: string | null;
	id?: string | null;
}) => parsed.slug ?? parsed.id ?? undefined;

/** Follows a repository as a new CircleCI project within an organization. */
export const create: CircleCIEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<CircleCIEndpointOutputs['projectsCreate']>(
		ctx,
		`organization/${input.orgSlugOrId}/project`,
		{ method: 'POST', body: { name: input.name } },
	);

	await cacheEntity(ctx.db.projects, CircleCIProjectEntity, result, {
		label: LABEL,
		entityId: projectEntityId,
	});

	await logEventFromContext(
		ctx,
		'circleci.projects.create',
		auditPayload(input, ['orgSlugOrId', 'name']),
		'completed',
	);
	return result;
};

/**
 * Permanently removes a project. Never exercised live - destructive, and the
 * only followed project on this account.
 *
 * Logged before the eviction: see the identical reasoning on
 * `ContextsGraphQL.remove` in `contexts-graphql.ts`. The delete has already
 * happened remotely by the time this function reaches the log call; a
 * required eviction failing afterward must not erase the record that it did.
 */
export const remove: CircleCIEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<CircleCIEndpointOutputs['projectsDelete']>(
		ctx,
		`project/${input.projectSlug}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'circleci.projects.delete',
		auditPayload(input, ['projectSlug']),
		'completed',
	);

	await evictEntity(ctx.db.projects, input.projectSlug, LABEL, {
		required: true,
	});
	return result;
};

/** Retrieves a project by its slug. */
export const get: CircleCIEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['projectsGet']>(
		ctx,
		`project/${input.projectSlug}`,
	);

	await cacheEntity(ctx.db.projects, CircleCIProjectEntity, result, {
		label: LABEL,
		entityId: projectEntityId,
	});

	await logEventFromContext(
		ctx,
		'circleci.projects.get',
		auditPayload(input, ['projectSlug']),
		'completed',
	);
	return result;
};
