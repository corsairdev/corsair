import type { WrikeEndpoints } from '..';
import { id } from '../client';
import { call } from './call';
import {
	WrikeEndpointInputSchemas as Inputs,
	WrikeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Tasks are searched account-wide here. A list filter that Wrike takes as a
 * comma-separated value is joined rather than repeated, since that is the form
 * the API documents.
 */
export const list: WrikeEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.list',
			input: Inputs.tasksList,
			output: Outputs.tasksList,
		},
		input,
		({
			pageSize,
			nextPageToken,
			title,
			status,
			importance,
			startDate,
			dueDate,
			createdDate,
			updatedDate,
			completedDate,
			authors,
			responsibles,
			permalink,
			type,
			subTasks,
			withInvitations,
			sortField,
			sortOrder,
			fields,
		}) => ({
			method: 'GET',
			path: '/tasks',
			query: {
				pageSize,
				nextPageToken,
				title,
				status: status?.join(','),
				importance,
				startDate,
				dueDate,
				createdDate,
				updatedDate,
				completedDate,
				authors: authors?.join(','),
				responsibles: responsibles?.join(','),
				permalink,
				type,
				subTasks,
				withInvitations,
				sortField,
				sortOrder,
				fields,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				kind: result.kind ?? undefined,
			}),
		},
	);

export const get: WrikeEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.get', input: Inputs.tasksGet, output: Outputs.tasksGet },
		input,
		({ id: taskId }) => ({ method: 'GET', path: `/tasks/${id(taskId)}` }),
		{
			log: (_, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				status: result.data?.[0]?.status ?? undefined,
			}),
		},
	);

/**
 * Creates a task under a folder. Wrike has no account-level `POST /tasks`: a
 * task always has a parent, and the account root is a virtual folder whose id
 * `account.get` returns as `rootFolderId`.
 */
export const create: WrikeEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		({ folderId, ...body }) => ({
			method: 'POST',
			path: `/folders/${id(folderId)}/tasks`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				folder: parsed.folderId,
				hasDates: parsed.startDate !== undefined || parsed.dates !== undefined,
			}),
		},
	);

export const update: WrikeEndpoints['tasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.update',
			input: Inputs.tasksUpdate,
			output: Outputs.tasksUpdate,
		},
		input,
		({ id: taskId, ...body }) => ({
			method: 'PUT',
			path: `/tasks/${id(taskId)}`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.data?.[0]?.id ?? parsed.id,
				status: result.data?.[0]?.status ?? undefined,
			}),
		},
	);

/**
 * Deletes a task. Wrike moves it to the recycle bin rather than destroying it
 * outright, and `tasks.update` with `restore` brings it back — which is why the
 * risk is destructive but recoverable.
 */
export const remove: WrikeEndpoints['tasksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.delete',
			input: Inputs.tasksDelete,
			output: Outputs.tasksDelete,
		},
		input,
		({ id: taskId }) => ({
			method: 'DELETE',
			path: `/tasks/${id(taskId)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id: taskId }) => ({ id: taskId }),
		},
	);
