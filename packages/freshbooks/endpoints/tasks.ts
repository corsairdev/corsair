import type { FreshBooksEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	FreshBooksEndpointInputSchemas as Inputs,
	FreshBooksEndpointOutputSchemas as Outputs,
} from './types';

// Billable tasks live under the projects path inside the accounting API, and
// unlike the other accounting resources they have no delete call at all.
const base = (accountId: string) =>
	`/accounting/account/${segment(accountId)}/projects/tasks`;

export const list: FreshBooksEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.list',
			input: Inputs.tasksList,
			output: Outputs.tasksList,
			envelope: 'accounting',
		},
		input,
		({ accountId, page, per_page }) => ({
			method: 'GET',
			path: base(accountId),
			query: { page, per_page },
		}),
		{ log: ({ accountId }) => ({ accountId }) },
	);

export const get: FreshBooksEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.get',
			input: Inputs.tasksGet,
			output: Outputs.tasksGet,
			envelope: 'accounting',
		},
		input,
		({ accountId, taskId }) => ({
			method: 'GET',
			path: `${base(accountId)}/${segment(taskId)}`,
		}),
		{ log: ({ accountId, taskId }) => ({ accountId, taskId }) },
	);

export const create: FreshBooksEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
			envelope: 'accounting',
		},
		input,
		({ accountId, task }) => ({
			method: 'POST',
			path: base(accountId),
			body: { task },
		}),
		{ log: ({ accountId, task }) => ({ accountId, name: task.name }) },
	);

export const update: FreshBooksEndpoints['tasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.update',
			input: Inputs.tasksUpdate,
			output: Outputs.tasksUpdate,
			envelope: 'accounting',
		},
		input,
		({ accountId, taskId, task }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(taskId)}`,
			body: { task },
		}),
		{ log: ({ accountId, taskId }) => ({ accountId, taskId }) },
	);
