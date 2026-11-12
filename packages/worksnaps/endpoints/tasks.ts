import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

/** Tasks belong to a project, so every route is nested under one. */
export const list: WorksnapsEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.list',
			input: Inputs.tasksList,
			output: Outputs.tasksList,
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/tasks.xml`,
		}),
		{ log: (_, result) => ({ count: result.tasks?.length ?? 0 }) },
	);

export const get: WorksnapsEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.get', input: Inputs.tasksGet, output: Outputs.tasksGet },
		input,
		({ project_id, task_id }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/tasks/${segment(task_id)}.xml`,
		}),
		{
			log: (_, result) => ({
				id: result.task?.id ?? undefined,
				name: result.task?.name ?? undefined,
			}),
		},
	);

export const create: WorksnapsEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		({ project_id, name, description }) => ({
			method: 'POST',
			path: `/projects/${segment(project_id)}/tasks.xml`,
			body: toXml('task', { name, description }),
		}),
		{
			log: (parsed, result) => ({
				id: result.task?.id ?? undefined,
				name: parsed.name,
			}),
		},
	);

export const update: WorksnapsEndpoints['tasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.update',
			input: Inputs.tasksUpdate,
			output: Outputs.tasksUpdate,
		},
		input,
		({ project_id, task_id, name, description }) => ({
			method: 'PUT',
			path: `/projects/${segment(project_id)}/tasks/${segment(task_id)}.xml`,
			body: toXml('task', { name, description }),
		}),
		{
			log: (parsed, result) => ({
				id: result.task?.id ?? parsed.task_id,
				name: result.task?.name ?? undefined,
			}),
		},
	);

/** Deleting a task also deletes the time logged against it. */
export const remove: WorksnapsEndpoints['tasksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.delete',
			input: Inputs.tasksDelete,
			output: Outputs.tasksDelete,
		},
		input,
		({ project_id, task_id }) => ({
			method: 'DELETE',
			path: `/projects/${segment(project_id)}/tasks/${segment(task_id)}.xml`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.task_id, deleted: true }),
			log: ({ task_id }) => ({ id: task_id }),
		},
	);
