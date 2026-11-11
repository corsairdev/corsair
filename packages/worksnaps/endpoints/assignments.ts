import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

/** Which user is assigned to which task, within a project. */
export const taskList: WorksnapsEndpoints['taskAssignmentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'taskAssignments.list',
			input: Inputs.taskAssignmentsList,
			output: Outputs.taskAssignmentsList,
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/task_assignments.xml`,
		}),
		{
			log: (_, result) => ({
				count: result.task_assignments?.length ?? 0,
			}),
		},
	);

export const taskCreate: WorksnapsEndpoints['taskAssignmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'taskAssignments.create',
			input: Inputs.taskAssignmentsCreate,
			output: Outputs.taskAssignmentsCreate,
		},
		input,
		({ project_id, task_id, user_id }) => ({
			method: 'POST',
			path: `/projects/${segment(project_id)}/task_assignments.xml`,
			body: toXml('task_assignment', { task_id, user_id }),
		}),
		{
			log: (parsed, result) => ({
				id: result.task_assignment?.id ?? undefined,
				task: parsed.task_id,
				user: parsed.user_id,
			}),
		},
	);

export const taskRemove: WorksnapsEndpoints['taskAssignmentsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'taskAssignments.delete',
			input: Inputs.taskAssignmentsDelete,
			output: Outputs.taskAssignmentsDelete,
		},
		input,
		({ project_id, task_assignment_id }) => ({
			method: 'DELETE',
			path: `/projects/${segment(project_id)}/task_assignments/${segment(task_assignment_id)}.xml`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.task_assignment_id, deleted: true }),
			log: ({ task_assignment_id }) => ({ id: task_assignment_id }),
		},
	);

/** A project membership, which carries the role and the time-logging windows. */
export const userList: WorksnapsEndpoints['userAssignmentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'userAssignments.list',
			input: Inputs.userAssignmentsList,
			output: Outputs.userAssignmentsList,
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/user_assignments.xml`,
		}),
		{
			log: (_, result) => ({
				count: result.user_assignments?.length ?? 0,
			}),
		},
	);

export const userGet: WorksnapsEndpoints['userAssignmentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'userAssignments.get',
			input: Inputs.userAssignmentsGet,
			output: Outputs.userAssignmentsGet,
		},
		input,
		({ project_id, user_assignment_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/user_assignments/${segment(user_assignment_id)}.xml`,
		}),
		{
			log: (_, result) => ({
				id: result.user_assignment?.id ?? undefined,
				role: result.user_assignment?.role ?? undefined,
			}),
		},
	);

export const userCreate: WorksnapsEndpoints['userAssignmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'userAssignments.create',
			input: Inputs.userAssignmentsCreate,
			output: Outputs.userAssignmentsCreate,
		},
		input,
		({
			project_id,
			user_id,
			role,
			hourly_rate,
			flag_allow_logging_time,
			window_for_deleting_time,
			window_for_adding_offline_time,
		}) => ({
			method: 'POST',
			path: `/projects/${segment(project_id)}/user_assignments.xml`,
			body: toXml('user_assignment', {
				user_id,
				role,
				hourly_rate,
				flag_allow_logging_time,
				window_for_deleting_time,
				window_for_adding_offline_time,
			}),
		}),
		{
			log: (parsed, result) => ({
				id: result.user_assignment?.id ?? undefined,
				user: parsed.user_id,
				role: parsed.role,
			}),
		},
	);

export const userUpdate: WorksnapsEndpoints['userAssignmentsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'userAssignments.update',
			input: Inputs.userAssignmentsUpdate,
			output: Outputs.userAssignmentsUpdate,
		},
		input,
		({
			project_id,
			user_assignment_id,
			role,
			hourly_rate,
			flag_allow_logging_time,
			window_for_deleting_time,
			window_for_adding_offline_time,
		}) => ({
			method: 'PUT',
			path: `/projects/${segment(project_id)}/user_assignments/${segment(user_assignment_id)}.xml`,
			body: toXml('user_assignment', {
				role,
				hourly_rate,
				flag_allow_logging_time,
				window_for_deleting_time,
				window_for_adding_offline_time,
			}),
		}),
		{
			log: (parsed, result) => ({
				id: result.user_assignment?.id ?? parsed.user_assignment_id,
				role: parsed.role,
			}),
		},
	);
