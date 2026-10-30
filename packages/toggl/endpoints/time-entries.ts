import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

/** Lists the caller's time entries, by date range or modification time. */
export const list: TogglEndpoints['timeEntriesList'] = async (ctx, input) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesList']
	>('me/time_entries', ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			since: input.since,
			before: input.before,
			meta: input.meta,
		},
	});

	const entries = result ?? [];

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.list',
		auditPayload(input, ['start_date', 'end_date', 'since', 'before', 'meta']),
		'completed',
	);
	return entries;
};

/** Reads the caller's running timer, or null when none is running. */
export const getCurrent: TogglEndpoints['timeEntriesGetCurrent'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesGetCurrent']
	>('me/time_entries/current', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.getCurrent',
		auditPayload(input, []),
		'completed',
	);
	// Toggl returns null when no timer is running.
	return result ?? null;
};

/** Reads one of the caller's time entries by id. */
export const get: TogglEndpoints['timeEntriesGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['timeEntriesGet']>(
		`me/time_entries/${input.time_entry_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.get',
		auditPayload(input, ['time_entry_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a time entry. A negative duration starts a running timer, and
 * `created_with` defaults to this plugin when the caller omits it.
 */
export const create: TogglEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesCreate']
	>(`workspaces/${input.workspace_id}/time_entries`, ctx.key, {
		method: 'POST',
		body: {
			description: input.description,
			start: input.start,
			stop: input.stop,
			duration: input.duration,
			workspace_id: input.workspace_id,
			project_id: input.project_id,
			task_id: input.task_id,
			billable: input.billable,
			tags: input.tags,
			tag_ids: input.tag_ids,
			// Toggl requires a client identifier on writes.
			created_with: input.created_with ?? 'corsair',
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.create',
		auditPayload(input, [
			'workspace_id',
			'project_id',
			'task_id',
			'billable',
			'duration',
			'start',
			'stop',
		]),
		'completed',
	);
	return result;
};

/** Updates a single time entry. */
export const update: TogglEndpoints['timeEntriesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesUpdate']
	>(
		`workspaces/${input.workspace_id}/time_entries/${input.time_entry_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				description: input.description,
				start: input.start,
				stop: input.stop,
				duration: input.duration,
				project_id: input.project_id,
				task_id: input.task_id,
				billable: input.billable,
				tags: input.tags,
				tag_ids: input.tag_ids,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.update',
		auditPayload(input, [
			'workspace_id',
			'time_entry_id',
			'project_id',
			'task_id',
			'billable',
			'duration',
			'start',
			'stop',
		]),
		'completed',
	);
	return result;
};

/** Stops a running time entry, fixing its duration. */
export const stop: TogglEndpoints['timeEntriesStop'] = async (ctx, input) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesStop']
	>(
		`workspaces/${input.workspace_id}/time_entries/${input.time_entry_id}/stop`,
		ctx.key,
		{ method: 'PATCH' },
	);

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.stop',
		auditPayload(input, ['workspace_id', 'time_entry_id']),
		'completed',
	);
	return result;
};

/** Deletes a time entry. */
export const remove: TogglEndpoints['timeEntriesDelete'] = async (
	ctx,
	input,
) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/time_entries/${input.time_entry_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.delete',
		auditPayload(input, ['workspace_id', 'time_entry_id']),
		'completed',
	);
	return { deleted: true, id: input.time_entry_id };
};

/**
 * Applies the same JSON Patch operations to many entries at once. Toggl caps a
 * request at 100 entries and reports per-entry success and failure rather than
 * failing the whole batch.
 */
export const bulkEdit: TogglEndpoints['timeEntriesBulkEdit'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['timeEntriesBulkEdit']
	>(
		`workspaces/${input.workspace_id}/time_entries/${input.time_entry_ids.join(',')}`,
		ctx.key,
		{ method: 'PATCH', body: input.operations },
	);

	await logEventFromContext(
		ctx,
		'toggl.timeEntries.bulkEdit',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result ?? {};
};
