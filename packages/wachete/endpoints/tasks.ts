import type { WacheteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WacheteEndpointInputSchemas as Inputs,
	WacheteEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Creates or updates a monitor. This is a `PUT` on a collection, which is
 * unusual: the body's `id` decides between creating and updating rather than
 * the route. That is why the input schema makes `id` optional and the others
 * required.
 */
export const upsert: WacheteEndpoints['tasksUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.upsert',
			input: Inputs.tasksUpsert,
			output: Outputs.tasksUpsert,
		},
		input,
		(body) => ({
			// An empty id would read as "update the monitor whose id is empty",
			// so it is dropped rather than sent.
			method: 'PUT',
			path: '/thirdparty/v1/task',
			body: body.id ? body : { ...body, id: undefined },
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? parsed.id,
				created: parsed.id === undefined,
				recurrence: parsed.recurrenceInSeconds,
				jobType: String(parsed.jobType ?? 'SinglePage'),
			}),
		},
	);

export const get: WacheteEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.get', input: Inputs.tasksGet, output: Outputs.tasksGet },
		input,
		({ id }) => ({ method: 'GET', path: `/thirdparty/v1/task/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				hasError: (result.data?.error ?? '').length > 0,
				recurrence: result.recurrenceInSeconds ?? undefined,
			}),
		},
	);

export const remove: WacheteEndpoints['tasksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.delete',
			input: Inputs.tasksDelete,
			output: Outputs.tasksDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/thirdparty/v1/task/${segment(id)}`,
		}),
		{
			// The answer is a bodyless 200, so state what was deleted.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

/**
 * Search is `/task/search`, which is declared *after* `/task/{id}` in the
 * OpenAPI document — so a router that matched `{id}` first would treat
 * "search" as a monitor id. Wachete's own routing resolves it correctly; the
 * plugin calls the documented path.
 */
export const search: WacheteEndpoints['tasksSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.search',
			input: Inputs.tasksSearch,
			output: Outputs.tasksSearch,
		},
		input,
		({ query }) => ({
			method: 'GET',
			path: '/thirdparty/v1/task/search',
			query: { query },
		}),
		{
			log: (_, result) => ({ count: result.tasks?.length ?? 0 }),
		},
	);

/** The pages a Portal monitor crawled, which is what it is watching. */
export const pages: WacheteEndpoints['tasksPages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.pages',
			input: Inputs.tasksPages,
			output: Outputs.tasksPages,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/thirdparty/v1/task/${segment(id)}/pages`,
		}),
		{
			log: (_, result) => ({ count: result.pages?.length ?? 0 }),
		},
	);
