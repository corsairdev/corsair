import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestTaskEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'task';

/** Lists tasks, mirroring each page into the local cache. */
export const list: HarvestEndpoints['tasksList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['tasksList']>(
		ctx,
		'tasks',
		{
			query: compactQuery({
				is_active: input.is_active,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.tasks, HarvestTaskEntity, result.tasks, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.tasks.list',
		auditPayload(input, ['is_active', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/** Retrieves one task by id. */
export const get: HarvestEndpoints['tasksGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['tasksGet']>(
		ctx,
		`tasks/${input.task_id}`,
	);

	await cacheEntity(ctx.db.tasks, HarvestTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.tasks.get',
		auditPayload(input, ['task_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a task.
 *
 * `is_default: true` assigns the task to every future project, so it is left
 * to the caller rather than defaulted.
 */
export const create: HarvestEndpoints['tasksCreate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['tasksCreate']>(
		ctx,
		'tasks',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				billable_by_default: input.billable_by_default,
				default_hourly_rate: input.default_hourly_rate,
				is_default: input.is_default,
				is_active: input.is_active,
			}),
		},
	);

	await cacheEntity(ctx.db.tasks, HarvestTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.tasks.create',
		{ task_id: result.id },
		'completed',
	);
	return result;
};

/** Updates a task. Omitted fields are left unchanged. */
export const update: HarvestEndpoints['tasksUpdate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['tasksUpdate']>(
		ctx,
		`tasks/${input.task_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				name: input.name,
				billable_by_default: input.billable_by_default,
				default_hourly_rate: input.default_hourly_rate,
				is_default: input.is_default,
				is_active: input.is_active,
			}),
		},
	);

	await cacheEntity(ctx.db.tasks, HarvestTaskEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.tasks.update',
		auditPayload(input, ['task_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a task.
 *
 * Harvest refuses with 422 when time has been tracked against it; archiving via
 * `update` with `is_active: false` is the alternative that preserves history.
 */
export const remove: HarvestEndpoints['tasksDelete'] = async (ctx, input) => {
	await harvestCall<void>(ctx, `tasks/${input.task_id}`, { method: 'DELETE' });

	await evictEntity(ctx.db.tasks, input.task_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.tasks.delete',
		auditPayload(input, ['task_id']),
		'completed',
	);
	return { success: true, id: input.task_id };
};
