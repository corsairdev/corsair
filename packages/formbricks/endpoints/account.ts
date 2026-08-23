import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { formbricksCall } from './shared';
import type { FormbricksEndpointOutputs } from './types';

// No `auditPayload` here, unlike every other endpoint file: all five operations take an empty
// input, so there is nothing caller-supplied to record. The events below carry only a derived
// count, which is why they pass a literal rather than a built payload.

/**
 * Account identity and service health.
 *
 * Five catalog operations over **three** routes, which is worth stating plainly rather than
 * disguising: the catalog lists three ids for account identity and two for health, and there are
 * only two identity routes and one health route. The duplicates are documented on the operations
 * that share a route rather than being quietly dropped, because a caller comparing the catalog to
 * this plugin should find every id present.
 *
 * Nothing here is mirrored. Identity is the caller's own key metadata and changes when the key
 * does; health is a live probe whose whole value is being current.
 */

/**
 * Reads the identity and permissions of the API key in use.
 *
 * **This is the operation a caller needs first.** Most writes require a `workspaceId` in the body,
 * and `workspacePermissions` is where it comes from - each entry is
 * `{permissions, workspaceId, workspaceName}`. `organizationId` comes back here too, which the
 * team and role operations need and which is a different value from the workspace id.
 *
 * `environmentPermissions` is also returned and was empty on the recon account. Formbricks
 * documents environments as deprecated in favour of workspaces, so it is passed through and not
 * relied on.
 */
export const getMe: FormbricksEndpoints['meGet'] = async (ctx, input) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['meGet']>(
		ctx,
		'v2',
		'me',
	);

	await logEventFromContext(
		ctx,
		'formbricks.me.get',
		{
			// The workspace and organization ids identify the account, so they are not logged.
			// The count is enough to tell a single-workspace key from a multi-workspace one.
			workspace_count: result.workspacePermissions?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/**
 * Reads the v1 account payload - **environment** identity, which is a different question from
 * {@link getMe}.
 *
 * Observed live:
 *
 * ```
 * { id, type: "production", createdAt, updatedAt, appSetupCompleted: true,
 *   workspace: {id, name}, project: {id, name} }
 * ```
 *
 * An earlier version of this comment said the shape was "not observed", because this route rejects an
 * organization-scoped key:
 *
 * ```
 * 400 "This endpoint only supports API keys that are scoped to a single workspace.
 *      Use GET /api/v2/me to inspect organization-level API keys or keys with access
 *      to multiple workspaces."
 * ```
 *
 * That 400 is real, and the conclusion drawn from it was not: the workspace-scoped key used for
 * everything else in recon reads this route without trouble. The shape had been observable all along
 * and simply was not asked for a second time after the first refusal. Two routes that reject
 * different keys is still the reason both operations exist.
 */
export const getManagementMe: FormbricksEndpoints['meGetManagement'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['meGetManagement']
	>(ctx, 'v1', 'management/me');

	await logEventFromContext(
		ctx,
		'formbricks.me.getManagement',
		{},
		'completed',
	);
	return result;
};

/**
 * Reads account information - the catalog's third account-identity id, over the **v1** route.
 *
 * Which route this belongs to is settled by the catalog's own description: "environment information
 * for the authenticated API key ... including the associated project and setup completion status".
 * `v1/management/me` returns `type` (`production` or `development`), `project` and
 * `appSetupCompleted`. `v2/me` returns none of those three.
 *
 * An earlier version pointed this operation at `v2/me` and called it a duplicate of {@link getMe} -
 * matching the one thing the description does not mention and missing the three it does. So the
 * overlapping pair is this operation and {@link getManagementMe}, both v1. The same count of
 * duplicated ids as before, assigned to the routes the descriptions actually name.
 *
 * The overlap is documented rather than disguised behind a contrived difference, and the id is
 * registered so a caller working from the catalog does not find it missing.
 */
export const getAccountInfo: FormbricksEndpoints['meGetAccountInfo'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['meGetAccountInfo']
	>(ctx, 'v1', 'management/me');

	await logEventFromContext(
		ctx,
		'formbricks.me.getAccountInfo',
		{
			// The environment kind is configuration, not identity - the ids and names are neither
			// logged nor derived from each other.
			environment_type: typeof result.type === 'string' ? result.type : null,
			app_setup_completed: result.appSetupCompleted ?? null,
		},
		'completed',
	);
	return result;
};

/**
 * Checks service health.
 *
 * Returns `{main_database, cache_database}` - **snake_case**, unlike every other shape in this API,
 * which is camelCase. Passed through as observed rather than normalised, because renaming a field
 * is how a plugin starts describing something other than its provider.
 *
 * The only operation here that needs no authentication in principle, though the key is sent anyway
 * for consistency.
 */
export const checkHealth: FormbricksEndpoints['healthCheck'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['healthCheck']>(
		ctx,
		'v2',
		'health',
	);

	await logEventFromContext(ctx, 'formbricks.health.check', {}, 'completed');
	return result;
};

/**
 * The catalog's second health id, over the single `v2/health` route.
 *
 * Same situation as {@link getAccountInfo}: one route, two catalog ids. Both registered so the
 * catalog surface is complete, with the overlap documented rather than implied away.
 */
export const listHealth: FormbricksEndpoints['healthList'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['healthList']>(
		ctx,
		'v2',
		'health',
	);

	await logEventFromContext(ctx, 'formbricks.health.list', {}, 'completed');
	return result;
};
