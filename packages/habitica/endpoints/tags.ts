import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { HabiticaTagEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { habiticaCall, pathSegment } from './shared';
import type { HabiticaEndpointOutputs } from './types';

const LABEL = 'tag';

/**
 * A tag's name is user-authored text, so it is not logged. Only ids are.
 */

/** Creates a tag. */
export const create: HabiticaEndpoints['tagsCreate'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tagsCreate']>(
		ctx,
		'tags',
		{ method: 'POST', body: { name: input.name } },
	);

	await cacheEntity(ctx.db.tags, HabiticaTagEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tags.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/**
 * Lists every tag on the account.
 *
 * Unpaginated, and small: a tag carries only `id` and `name`.
 */
export const list: HabiticaEndpoints['tagsList'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tagsList']>(
		ctx,
		'tags',
	);

	await cacheEntities(ctx.db.tags, HabiticaTagEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tags.list',
		{ ...auditPayload(input, []), returned: result.length },
		'completed',
	);
	return result;
};

/** Renames a tag. */
export const update: HabiticaEndpoints['tagsUpdate'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tagsUpdate']>(
		ctx,
		`tags/${pathSegment(input.tagId)}`,
		{ method: 'PUT', body: { name: input.name } },
	);

	await cacheEntity(ctx.db.tags, HabiticaTagEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'habitica.tags.update',
		auditPayload(input, ['tagId']),
		'completed',
	);
	return result;
};

/**
 * Deletes a tag.
 *
 * Required eviction, for the same reason as tasks: Habitica hard-deletes, so a
 * surviving mirror row could never be reconciled with the remote side.
 *
 * Note that deleting a tag also removes it from every task that carried it, and
 * those mirrored tasks still list the tag id until the next `tasks.list`. The
 * tag row itself is what this operation promises to remove, and that is what is
 * evicted; the stale references are noted rather than chased, since finding
 * them would mean re-reading the whole task list on every tag delete.
 */
export const remove: HabiticaEndpoints['tagsDelete'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['tagsDelete']>(
		ctx,
		`tags/${pathSegment(input.tagId)}`,
		{ method: 'DELETE' },
	);

	// Logged before the eviction - see the note on `tasks.delete`.
	await logEventFromContext(
		ctx,
		'habitica.tags.delete',
		auditPayload(input, ['tagId']),
		'completed',
	);

	await evictEntity(ctx.db.tags, input.tagId, LABEL, { required: true });

	return result;
};
