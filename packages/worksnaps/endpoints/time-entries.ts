import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

/** The time some users logged on a project within a range. */
export const list: WorksnapsEndpoints['timeEntriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.list',
			input: Inputs.timeEntriesList,
			output: Outputs.timeEntriesList,
		},
		input,
		({ project_id, user_ids, from_timestamp, to_timestamp }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/time_entries.xml`,
			// The API answers 400 without user_ids and both timestamps.
			query: { user_ids: user_ids.join(';'), from_timestamp, to_timestamp },
		}),
		{
			log: (_, result) => ({
				count: result.time_entries.length,
				// The sum, which is what a report cares about; not the per-entry
				// comments, which are the worker's own notes.
				minutes: result.time_entries.reduce(
					(total, entry) => total + (entry.duration_in_minutes ?? 0),
					0,
				),
			}),
		},
	);

/** The time one user logged on a project, which is the same route nested deeper. */
export const byUser: WorksnapsEndpoints['timeEntriesByUser'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.byUser',
			input: Inputs.timeEntriesByUser,
			output: Outputs.timeEntriesByUser,
		},
		input,
		({ project_id, user_id, from_timestamp, to_timestamp }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/users/${segment(user_id)}/time_entries.xml`,
			query: { from_timestamp, to_timestamp },
		}),
		{
			log: (parsed, result) => ({
				user: parsed.user_id,
				count: result.time_entries.length,
			}),
		},
	);

export const get: WorksnapsEndpoints['timeEntriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.get',
			input: Inputs.timeEntriesGet,
			output: Outputs.timeEntriesGet,
		},
		input,
		({ project_id, time_entry_id, full_resolution_url }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/time_entries/${segment(time_entry_id)}.xml`,
			// The docs also document this as a separate route with the flag baked
			// into the path; it is a query parameter, which is the same request.
			query: { full_resolution_url: full_resolution_url ? 1 : undefined },
		}),
		{
			log: (_, result) => ({
				id: result.time_entry?.id ?? undefined,
				minutes: result.time_entry?.duration_in_minutes ?? undefined,
			}),
		},
	);

/**
 * Logs offline time for yourself against a task you are assigned to. The API
 * splits it into 10-minute entries and answers with all of them.
 */
export const create: WorksnapsEndpoints['timeEntriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.create',
			input: Inputs.timeEntriesCreate,
			output: Outputs.timeEntriesCreate,
		},
		input,
		({
			project_id,
			task_id,
			from_timestamp,
			duration_in_minutes,
			user_comment,
		}) => ({
			method: 'POST',
			path: `/projects/${segment(project_id)}/time_entries.xml`,
			body: toXml('time_entry', {
				task_id,
				from_timestamp,
				duration_in_minutes,
				user_comment,
			}),
		}),
		{
			log: (parsed, result) => ({
				count: result.time_entries.length,
				task: parsed.task_id,
				minutes: parsed.duration_in_minutes,
			}),
		},
	);

export const update: WorksnapsEndpoints['timeEntriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.update',
			input: Inputs.timeEntriesUpdate,
			output: Outputs.timeEntriesUpdate,
		},
		input,
		({ project_id, time_entry_id, task_id, user_comment }) => ({
			method: 'PUT',
			path: `/projects/${segment(project_id)}/time_entries/${segment(time_entry_id)}.xml`,
			body: toXml('time_entry', { task_id, user_comment }),
		}),
		{
			log: (parsed, result) => ({
				id: parsed.time_entry_id,
				count: result.time_entries.length,
			}),
		},
	);

export const remove: WorksnapsEndpoints['timeEntriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.delete',
			input: Inputs.timeEntriesDelete,
			output: Outputs.timeEntriesDelete,
		},
		input,
		({ project_id, time_entry_id }) => ({
			method: 'DELETE',
			path: `/projects/${segment(project_id)}/time_entries/${segment(time_entry_id)}.xml`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.time_entry_id, deleted: true }),
			log: ({ time_entry_id }) => ({ id: time_entry_id }),
		},
	);
