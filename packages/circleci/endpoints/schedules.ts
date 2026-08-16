import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIScheduleEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Lists a project's schedules.
 *
 * The catalog claims only this one schedule operation, though the v2 spec
 * has five (create, list, get, patch, delete). Matched as-is rather than
 * filled in - the catalog defines the surface, the same decision as
 * Habitica's partial webhook family.
 */
export const list: CircleCIEndpoints['schedulesList'] = async (ctx, input) => {
	// This route wraps its results in `{items: [...]}`, confirmed in the spec
	// and live - the same envelope as project env vars and context env vars.
	const result = await circleCICall<{
		items: CircleCIEndpointOutputs['schedulesList'];
	}>(ctx, `project/${input.projectSlug}/schedule`);

	await cacheEntities(ctx.db.schedules, CircleCIScheduleEntity, result.items, {
		label: 'schedule',
	});

	await logEventFromContext(
		ctx,
		'circleci.schedules.list',
		{ ...auditPayload(input, ['projectSlug']), returned: result.items.length },
		'completed',
	);
	return result.items;
};
