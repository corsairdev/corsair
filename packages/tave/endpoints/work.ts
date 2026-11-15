import type { TaveEndpoints } from '..';
import { call, callDelete } from './call';
import {
	NotesCreateInputSchema,
	NotesCreateResponseSchema,
	NotesListInputSchema,
	NotesListResponseSchema,
	NotesRemoveInputSchema,
	TaskListsListInputSchema,
	TaskListsListResponseSchema,
	TasksCreateInputSchema,
	TasksCreateResponseSchema,
	TasksListInputSchema,
	TasksListResponseSchema,
	TasksRemoveInputSchema,
	TasksUpdateInputSchema,
	TasksUpdateResponseSchema,
} from './types';

export const tasksList: TaveEndpoints['tasksList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'tasks.list',
			input: TasksListInputSchema,
			output: TasksListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/task',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const tasksCreate: TaveEndpoints['tasksCreate'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'tasks.create',
			input: TasksCreateInputSchema,
			output: TasksCreateResponseSchema,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/task', body: parsed }),
	);
};

export const tasksUpdate: TaveEndpoints['tasksUpdate'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'tasks.update',
			input: TasksUpdateInputSchema,
			output: TasksUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { taskId, ...changes } = parsed;
			return { method: 'PUT', path: `/task/${taskId}`, body: changes };
		},
	);
};

export const tasksRemove: TaveEndpoints['tasksRemove'] = async (ctx, input) => {
	return callDelete(
		ctx,
		{ event: 'tasks.remove', input: TasksRemoveInputSchema },
		input,
		(parsed) => ({ method: 'DELETE', path: `/task/${parsed.taskId}` }),
	);
};

export const taskListsList: TaveEndpoints['taskListsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'taskLists.list',
			input: TaskListsListInputSchema,
			output: TaskListsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/task-list',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const notesList: TaveEndpoints['notesList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'notes.list',
			input: NotesListInputSchema,
			output: NotesListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/note',
			query: {
				page: parsed.page,
				pageSize: parsed.pageSize,
				jobId: parsed.jobId,
			},
		}),
	);
};

export const notesCreate: TaveEndpoints['notesCreate'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'notes.create',
			input: NotesCreateInputSchema,
			output: NotesCreateResponseSchema,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/note', body: parsed }),
	);
};

export const notesRemove: TaveEndpoints['notesRemove'] = async (ctx, input) => {
	return callDelete(
		ctx,
		{ event: 'notes.remove', input: NotesRemoveInputSchema },
		input,
		(parsed) => ({ method: 'DELETE', path: `/note/${parsed.noteId}` }),
	);
};
