import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

/**
 * Time entries are transactional, not reference data: they are appended
 * continuously and are only meaningful against a date range, so none of these
 * operations write to the local cache.
 *
 * Notes on an entry describe client work in free text, so they are never
 * recorded in the event log either.
 */

/** Lists time entries, filtered by user, project, task, billing state or date. */
export const list: HarvestEndpoints['timeEntriesList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['timeEntriesList']>(
		ctx,
		'time_entries',
		{
			query: compactQuery({
				user_id: input.user_id,
				client_id: input.client_id,
				project_id: input.project_id,
				task_id: input.task_id,
				external_reference_id: input.external_reference_id,
				is_billed: input.is_billed,
				is_running: input.is_running,
				approval_status: input.approval_status,
				from: input.from,
				to: input.to,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'harvest.timeEntries.list',
		auditPayload(input, [
			'user_id',
			'client_id',
			'project_id',
			'task_id',
			'from',
			'to',
			'page',
			'per_page',
		]),
		'completed',
	);
	return result;
};

/** Retrieves one time entry by id. */
export const get: HarvestEndpoints['timeEntriesGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['timeEntriesGet']>(
		ctx,
		`time_entries/${input.time_entry_id}`,
	);

	await logEventFromContext(
		ctx,
		'harvest.timeEntries.get',
		auditPayload(input, ['time_entry_id']),
		'completed',
	);
	return result;
};

/**
 * Logs time against a project and task.
 *
 * Whether Harvest expects `hours` or a `started_time`/`ended_time` pair depends
 * on the account's `wants_timestamp_timers` setting, so both forms are passed
 * through and the API decides which it accepts. Omitting all three starts a
 * running timer.
 */
export const create: HarvestEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['timeEntriesCreate']>(
		ctx,
		'time_entries',
		{
			method: 'POST',
			body: compactBody({
				project_id: input.project_id,
				task_id: input.task_id,
				spent_date: input.spent_date,
				user_id: input.user_id,
				hours: input.hours,
				started_time: input.started_time,
				ended_time: input.ended_time,
				notes: input.notes,
				external_reference: input.external_reference,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'harvest.timeEntries.create',
		{
			project_id: input.project_id,
			task_id: input.task_id,
			time_entry_id: result.id,
		},
		'completed',
	);
	return result;
};

/** Updates a time entry. Omitted fields are left unchanged. */
export const update: HarvestEndpoints['timeEntriesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['timeEntriesUpdate']>(
		ctx,
		`time_entries/${input.time_entry_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				project_id: input.project_id,
				task_id: input.task_id,
				spent_date: input.spent_date,
				hours: input.hours,
				started_time: input.started_time,
				ended_time: input.ended_time,
				notes: input.notes,
				external_reference: input.external_reference,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'harvest.timeEntries.update',
		auditPayload(input, ['time_entry_id', 'project_id', 'task_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a time entry.
 *
 * Harvest refuses with 422 once the entry has been invoiced, approved or
 * locked, or when its project or task has been archived.
 */
export const remove: HarvestEndpoints['timeEntriesDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(ctx, `time_entries/${input.time_entry_id}`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'harvest.timeEntries.delete',
		auditPayload(input, ['time_entry_id']),
		'completed',
	);
	return { success: true, id: input.time_entry_id };
};
