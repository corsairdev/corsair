import type { WrikeEndpoints } from '..';
import { id } from '../client';
import { call } from './call';
import {
	WrikeEndpointInputSchemas as Inputs,
	WrikeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Wrike reads a list filter as a JSON array in the query string
 * (`status=["Active"]`); a comma-joined value is refused as invalid.
 */
function jsonList(values: string[] | undefined): string | undefined {
	return values === undefined ? undefined : JSON.stringify(values);
}

/**
 * Wrike has no top-level start or due parameter on a create or an update; it
 * takes one `dates` object. The shorthands are folded into it, and an explicit
 * `dates` field wins.
 */
function foldDates<T extends object>(
	dates: T | undefined,
	startDate: string | undefined,
	dueDate: string | undefined,
): (T & { start?: string; due?: string }) | undefined {
	if (dates === undefined && startDate === undefined && dueDate === undefined) {
		return undefined;
	}
	return {
		...(startDate === undefined ? {} : { start: startDate }),
		...(dueDate === undefined ? {} : { due: dueDate }),
		...(dates ?? ({} as T)),
	};
}

/** Tasks are searched account-wide here. */
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
				status: jsonList(status),
				importance,
				startDate,
				dueDate,
				createdDate,
				updatedDate,
				completedDate,
				authors: jsonList(authors),
				responsibles: jsonList(responsibles),
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
		({ folderId, startDate, dueDate, dates, ...body }) => ({
			method: 'POST',
			path: `/folders/${id(folderId)}/tasks`,
			body: { ...body, dates: foldDates(dates, startDate, dueDate) },
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
		({ id: taskId, startDate, dueDate, dates, ...body }) => ({
			method: 'PUT',
			path: `/tasks/${id(taskId)}`,
			body: { ...body, dates: foldDates(dates, startDate, dueDate) },
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
