import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { BugsnagProjectEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bugsnagCall, compactBody, listQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

const LABEL = 'project';

/**
 * Projects - the unit everything else hangs off. Errors, events, releases, saved
 * searches and integrations are all addressed under a project id.
 *
 * A project record carries two secrets: `api_key`, which every deployed notifier
 * uses to report, and `upload_api_key` for build uploads. Neither is ever logged.
 */

/** Lists the projects in an organization. */
export const list: BugsnagEndpoints['projectsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['projectsList']>(
		ctx,
		`organizations/${input.organization_id}/projects`,
		{ query: listQuery(input) },
	);

	await cacheEntities(ctx.db.projects, BugsnagProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.projects.list',
		auditPayload(input, ['organization_id', 'per_page', 'offset']),
		'completed',
	);
	return result;
};

/** Retrieves one project by id. */
export const get: BugsnagEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['projectsGet']>(
		ctx,
		`projects/${input.project_id}`,
	);

	await cacheEntity(ctx.db.projects, BugsnagProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.projects.get',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a project in an organization.
 *
 * Genuinely non-idempotent: BugSnag accepts no idempotency key, and a replay would
 * create a second project with the same name rather than returning the first. So it
 * is excluded from network and 5xx retries - see `error-handlers.ts`.
 *
 * The response carries the new project's `api_key`, so only the id and the caller's
 * chosen type are logged; the name is caller-authored and the key is a secret.
 */
export const create: BugsnagEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['projectsCreate']>(
		ctx,
		`organizations/${input.organization_id}/projects`,
		{
			method: 'POST',
			body: compactBody({ name: input.name, type: input.type }),
		},
	);

	await cacheEntity(ctx.db.projects, BugsnagProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.projects.create',
		{ project_id: result.id, type: input.type },
		'completed',
	);
	return result;
};

/**
 * Deletes a project.
 *
 * This is irreversible and takes the project's entire error history with it, which
 * is why it is marked `destructive` and is never exercised by the live test.
 *
 * The mirrored row is evicted best-effort rather than required: a project holds no
 * personal data of its own, so a stale row is a tidiness problem rather than a
 * privacy one. Contrast the collaborator delete, which does carry a person's name
 * and email.
 */
export const remove: BugsnagEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	await bugsnagCall<unknown>(ctx, `projects/${input.project_id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.projects, input.project_id, LABEL);

	await logEventFromContext(
		ctx,
		'bugsnag.projects.delete',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return { success: true, id: input.project_id };
};
