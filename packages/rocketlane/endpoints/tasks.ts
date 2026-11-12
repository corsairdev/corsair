import type { z } from 'zod';
import type { RocketlaneEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterOf } from './filters';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RocketlaneEndpointInputSchemas as Inputs,
	RocketlaneEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The fields a create and an update share, all optional: an update sends only
 * what changed, while a create's schema has already made its own fields
 * required before reaching this builder.
 */
type TaskWriteBody = Partial<z.output<(typeof Inputs)['tasksCreate']>>;

/** Custom field values go out as `{ fieldId, fieldValue }`. */
function fieldsBody(fields: TaskWriteBody['fields']) {
	return fields?.map((field) => ({
		fieldId: field.fieldId,
		fieldValue: field.value,
	}));
}

export const list: RocketlaneEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.list',
			input: Inputs.tasksList,
			output: Outputs.tasksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/1.0/tasks',
			replayable: true,
			query: {
				...queryOf({
					pageSize: parsed.page_size,
					pageToken: parsed.page_token,
					includeAllFields: parsed.include_all_fields,
					sortBy: parsed.sort_by,
					sortOrder: parsed.sort_order,
					match: parsed.match,
				}),
				// Repeated parameter, so it stays out of queryOf.
				includeFields: parsed.include_fields,
				...filterOf('projectId', parsed.project_id),
				...filterOf('phaseId', parsed.phase_id),
				...filterOf('taskName', parsed.task_name),
				...filterOf('task.status', parsed.task_status),
				...filterOf('project.status', parsed.project_status),
				...filterOf('includeArchive', parsed.include_archive),
				...filterOf('externalReferenceId', parsed.external_reference_id),
				...filterOf('assignee.userId', parsed.assignee_user_id),
				...filterOf('effortInMinutes', parsed.effort_in_minutes),
				...filterOf('progress', parsed.progress),
				...filterOf('startDate', parsed.start_date),
				...filterOf('dueDate', parsed.due_date),
				...filterOf('createdAt', parsed.created_at),
				...filterOf('updatedAt', parsed.updated_at),
			},
		}),
		{
			shape: pagedShape('tasks'),
			log: (_, result) => ({
				count: result.tasks.length,
				hasMore: result.has_more,
			}),
		},
	);

export const get: RocketlaneEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.get',
			input: Inputs.tasksGet,
			output: Outputs.tasksGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/1.0/tasks/${segment(parsed.task_id)}`,
			replayable: true,
			query: {
				...queryOf({ includeAllFields: parsed.include_all_fields }),
				includeFields: parsed.include_fields,
			},
		}),
		{
			shape: singleShape('task'),
			log: (_, result) => ({ taskId: result.task.taskId ?? 0 }),
		},
	);

/** The write body shared by create, renamed to the wire spelling. */
// unknown: the body is assembled under provider field names from a
// schema-validated input, so its values are the provider's own shapes.
function taskBody(input: TaskWriteBody): Record<string, unknown> {
	return {
		taskName: input.task_name,
		project:
			input.project_id === undefined
				? undefined
				: { projectId: input.project_id },
		taskDescription: input.task_description,
		taskPrivateNote: input.task_private_note,
		startDate: input.start_date,
		dueDate: input.due_date,
		effortInMinutes: input.effort_in_minutes,
		progress: input.progress,
		atRisk: input.at_risk,
		type: input.type,
		phase: input.phase
			? { phaseId: input.phase.phaseId, phaseName: input.phase.phaseName }
			: undefined,
		status: input.status ? { value: input.status.value } : undefined,
		externalReferenceId: input.external_reference_id,
		private: input.private,
		billable: input.billable,
		assignees: input.assignees
			? {
					// The API names these userId and emailId in the body.
					members: input.assignees.map((assignee) => ({
						userId: assignee.user_id,
						emailId: assignee.email,
					})),
				}
			: undefined,
		followers: input.follower_ids
			? { members: input.follower_ids.map((userId) => ({ userId })) }
			: undefined,
		parent: input.parent_task_id ? { taskId: input.parent_task_id } : undefined,
		fields: fieldsBody(input.fields),
	};
}

export const create: RocketlaneEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/1.0/tasks',
			replayable: false,
			body: taskBody(parsed),
		}),
		{
			shape: singleShape('task'),
			log: (_, result) => ({ taskId: result.task.taskId ?? 0 }),
		},
	);

export const update: RocketlaneEndpoints['tasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.update',
			input: Inputs.tasksUpdate,
			output: Outputs.tasksUpdate,
		},
		input,
		(parsed) => {
			// The id travels in the path, so it is not part of the body.
			const { task_id: taskId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/1.0/tasks/${segment(taskId)}`,
				replayable: false,
				body: taskBody(rest),
			};
		},
		{
			shape: singleShape('task'),
			log: (parsed, result) => ({
				taskId: parsed.task_id,
				progress: result.task.progress ?? undefined,
			}),
		},
	);

export const remove: RocketlaneEndpoints['tasksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.delete',
			input: Inputs.tasksDelete,
			output: Outputs.tasksDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/1.0/tasks/${segment(parsed.task_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('task_id'),
			log: (parsed) => ({ taskId: parsed.task_id }),
		},
	);
