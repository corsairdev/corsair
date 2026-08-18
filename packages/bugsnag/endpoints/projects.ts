import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { BugsnagProjectEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, compactBody, listParams, withQuery } from './shared';
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
		withQuery(`organizations/${input.organization_id}/projects`, {
			...listParams(input),
			q: input.q,
			sort: input.sort,
			direction: input.direction,
		}),
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

/**
 * Retrieves one project by id.
 *
 * Worth stating plainly, because it affects how this PR should be counted: **this
 * operation is not in the OSS catalog.** The catalog lists no get-single-project
 * operation, so this earns nothing and is kept only because it is genuinely useful -
 * `GET /projects/{id}` answers 200 with all 32 fields, confirmed live, and every other
 * project-scoped operation needs an id that has to come from somewhere. The surface
 * verifier records it as a deliberate orphan rather than letting it inflate the count.
 */
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
 * Answers **200**, not 201, with all 32 project fields including a freshly issued
 * `api_key` - confirmed live on a throwaway project. So only the id and the caller's
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
 * is why it is marked `destructive`. Answers 204. Verified live only against a
 * throwaway project created for the purpose and against nothing else; the live suite
 * itself is read-only.
 *
 * The mirrored row is evicted best-effort rather than required: a project holds no
 * personal data of its own, so a stale row is a tidiness problem rather than a
 * privacy one. Contrast the collaborator and organization deletes, which do carry
 * personal data.
 */
export const remove: BugsnagEndpoints['projectsDelete'] = async (ctx, input) =>
	await deleteAndEvict(ctx, {
		path: `projects/${input.project_id}`,
		event: 'bugsnag.projects.delete',
		input,
		identifierKeys: ['project_id'],
		resultId: input.project_id,
		mirror: {
			store: ctx.db.projects,
			entityId: input.project_id,
			label: LABEL,
			// Best-effort: a project carries no personal data of its own, so a stale row
			// is untidy rather than a disclosure.
		},
	});

/**
 * Regenerates a project's notifier API key.
 *
 * Marked `destructive` even though it deletes no data, because of what it breaks:
 * every deployed copy of the application reports using the old key, and all of them
 * stop being able to report the moment it is rotated. Recovering means redeploying
 * with the new key, so the blast radius is larger than most deletes.
 *
 * Two details, both confirmed live on a throwaway project:
 *
 * - The method is **DELETE**, not POST - it reads as deleting the old key.
 * - It answers **200 with the whole project**, not 204, and the `api_key` in that
 *   response is the new one. So the response is how a caller learns the new key, and
 *   the mirrored row is refreshed from it rather than evicted.
 *
 * Excluded from retries: a second rotation would invalidate the key the first one
 * issued, so a replay compounds the breakage rather than repeating it harmlessly.
 * The response carries the new secret, so nothing but the project id is logged.
 */
export const regenerateApiKey: BugsnagEndpoints['projectsRegenerateApiKey'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['projectsRegenerateApiKey']
		>(ctx, `projects/${input.project_id}/api_key`, { method: 'DELETE' });

		await cacheEntity(ctx.db.projects, BugsnagProjectEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'bugsnag.projects.regenerateApiKey',
			auditPayload(input, ['project_id']),
			'completed',
		);
		return result;
	};

/**
 * Retrieves a project's network grouping ruleset - the URL patterns used to group
 * network spans for performance monitoring.
 *
 * The path is `network_endpoint_grouping`, which is worth recording because this
 * operation was written off as enterprise-only during recon on the strength of three
 * candidate paths all returning 404. That conclusion was wrong: all three were simply
 * the wrong path, and the real one answers 200 with `{project_id, endpoints}` on a
 * free account. A route-absent 404 means the path is wrong; it only becomes evidence
 * of a plan restriction once the plausible paths are exhausted.
 *
 * Not mirrored - it is project configuration that belongs with the project, and there
 * is no id to key it by.
 */
export const networkGroupingRuleset: BugsnagEndpoints['projectsNetworkGroupingRuleset'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['projectsNetworkGroupingRuleset']
		>(ctx, `projects/${input.project_id}/network_endpoint_grouping`);

		await logEventFromContext(
			ctx,
			'bugsnag.projects.networkGroupingRuleset',
			auditPayload(input, ['project_id']),
			'completed',
		);
		return result;
	};
