import type { RocketlaneEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterOf } from './filters';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RocketlaneEndpointInputSchemas as Inputs,
	RocketlaneEndpointOutputSchemas as Outputs,
} from './types';

export const list: RocketlaneEndpoints['timeEntriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.list',
			input: Inputs.timeEntriesList,
			output: Outputs.timeEntriesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/1.0/time-entries',
			replayable: true,
			query: {
				...queryOf({
					pageSize: parsed.page_size,
					pageToken: parsed.page_token,
					sortBy: parsed.sort_by,
					sortOrder: parsed.sort_order,
					match: parsed.match,
				}),
				includeFields: parsed.include_fields,
				...filterOf('date', parsed.date),
				...filterOf('projectId', parsed.project_id),
				...filterOf('taskId', parsed.task_id),
				...filterOf('emailId', parsed.user_email),
				...filterOf('billable', parsed.billable),
				...filterOf('approvalStatus', parsed.approval_status),
				...filterOf('includeDeleted', parsed.include_deleted),
			},
		}),
		{
			shape: pagedShape('time_entries'),
			log: (_, result) => ({
				count: result.time_entries.length,
				hasMore: result.has_more,
			}),
		},
	);

export const get: RocketlaneEndpoints['timeEntriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.get',
			input: Inputs.timeEntriesGet,
			output: Outputs.timeEntriesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/1.0/time-entries/${segment(parsed.time_entry_id)}`,
			replayable: true,
			query: { includeFields: parsed.include_fields },
		}),
		{
			shape: singleShape('time_entry'),
			log: (_, result) => ({
				timeEntryId: result.time_entry.timeEntryId ?? 0,
			}),
		},
	);

export const create: RocketlaneEndpoints['timeEntriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.create',
			input: Inputs.timeEntriesCreate,
			output: Outputs.timeEntriesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/1.0/time-entries',
			replayable: false,
			body: {
				date: parsed.date,
				minutes: parsed.minutes,
				activityName: parsed.activity_name,
				notes: parsed.notes,
				billable: parsed.billable,
				project: parsed.project_id
					? { projectId: parsed.project_id }
					: undefined,
				task: parsed.task_id ? { taskId: parsed.task_id } : undefined,
				projectPhase: parsed.phase_id
					? { phaseId: parsed.phase_id }
					: undefined,
				user: parsed.user_email ? { emailId: parsed.user_email } : undefined,
				category: parsed.category_id
					? { categoryId: parsed.category_id }
					: undefined,
			},
		}),
		{
			shape: singleShape('time_entry'),
			// The notes and activity name are free text, so only the shape is logged.
			log: (_, result) => ({
				timeEntryId: result.time_entry.timeEntryId ?? 0,
				minutes: result.time_entry.minutes ?? 0,
			}),
		},
	);

export const remove: RocketlaneEndpoints['timeEntriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.delete',
			input: Inputs.timeEntriesDelete,
			output: Outputs.timeEntriesDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/1.0/time-entries/${segment(parsed.time_entry_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('time_entry_id'),
			log: (parsed) => ({ timeEntryId: parsed.time_entry_id }),
		},
	);
