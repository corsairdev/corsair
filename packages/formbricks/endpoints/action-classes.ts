import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { FormbricksActionClassEntity } from '../schema/database';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity } from './persist';
// No `listParams` or `withQuery`: this route ignores every paging parameter, so the list sends a
// bare path.
import { compactBody, formbricksCall } from './shared';
import type { FormbricksEndpointOutputs } from './types';

const LABEL = 'actionClass';

/**
 * Action classes - the events that can trigger a survey to appear.
 *
 * Mirrored: configuration, small, and referenced by a survey's `triggers`, so resolving an id to a
 * name is the lookup a local copy exists for.
 *
 * The catalog lists only **list** and **create** for this family. The API also serves
 * `GET`, `PUT` and `DELETE` on `action-classes/{id}` - confirmed from the route file's exports -
 * but those are not catalog operations and are not registered here. Implementing them would inflate
 * the surface with work that earns nothing and that nobody asked for.
 */

/**
 * Lists the action classes in the workspace.
 *
 * **Not pageable.** This route ignores `limit`, `offset` and `skip` alike - three seeded rows and
 * `?limit=1` returns all three - so the operation takes no paging parameters rather than advertising
 * ones Formbricks discards. There is no v2 route to fall back to.
 */
export const list: FormbricksEndpoints['actionClassesList'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['actionClassesList']
	>(ctx, 'v1', 'management/action-classes');

	await cacheEntities(
		ctx.db.actionClasses,
		FormbricksActionClassEntity,
		result,
		{
			label: LABEL,
		},
	);

	await logEventFromContext(
		ctx,
		'formbricks.actionClasses.list',
		{
			action_class_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Creates an action class.
 *
 * `workspaceId` is required in the body. `type` is an enum of `code` or `noCode`, and the two are
 * genuinely different things:
 *
 * - **`code`** fires when the application reports it by name, so `key` is what it reports itself as
 *   and is required. The input schema enforces that pairing rather than leaving the API to reject
 *   it - a create missing `key` for a code action produces a validation error that does not say
 *   which field.
 * - **`noCode`** is matched by a selector or URL rule held in `noCodeConfig`, whose shape depends on
 *   the rule type and is carried unmodelled.
 *
 * Non-idempotent: names are not unique, so a replay creates a second action class.
 */
export const create: FormbricksEndpoints['actionClassesCreate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['actionClassesCreate']
	>(ctx, 'v1', 'management/action-classes', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			name: input.name,
			description: input.description,
			type: input.type,
			key: input.key,
			noCodeConfig: input.noCodeConfig,
		}),
	});

	await cacheEntity(ctx.db.actionClasses, FormbricksActionClassEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.actionClasses.create',
		{
			...auditPayload(input, ['workspaceId', 'type']),
			action_class_id: result.id,
		},
		'completed',
	);
	return result;
};
