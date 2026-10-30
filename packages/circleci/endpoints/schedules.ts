import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIScheduleEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Lists a project's schedules.
 *
 * The catalog claims only this one schedule operation, though the v2 spec
 * has five (create, list, get, patch, delete). Matched as-is rather than
 * filled in - the catalog defines the surface, the same decision as
 * Habitica's partial webhook family.
 *
 * This route wraps its results in `{items: [...], next_page_token}`,
 * confirmed in the spec and live - the same envelope as project env vars and
 * context env vars. Returned to the caller as that same envelope rather than
 * unwrapped to a bare array, so `next_page_token` is not silently discarded.
 * Pass it back as this operation's `pageToken` input to fetch the next page.
 */
export const list: CircleCIEndpoints['schedulesList'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['schedulesList']>(
		ctx,
		`project/${input.projectSlug}/schedule`,
		{ query: compact({ 'page-token': input.pageToken }) },
	);

	await cacheEntities(ctx.db.schedules, CircleCIScheduleEntity, result.items, {
		label: 'schedule',
	});

	await logEventFromContext(
		ctx,
		'circleci.schedules.list',
		{ ...auditPayload(input, ['projectSlug']), returned: result.items.length },
		'completed',
	);
	return result;
};
