import type { KommoEndpoints } from '..';
import { definedQuery } from '../client';
import { call, shapeList } from './call';
import {
	KommoEndpointInputSchemas as Inputs,
	KommoEndpointOutputSchemas as Outputs,
} from './types';

const LIST_LIMIT = 250;

export const list: KommoEndpoints['tasksList'] = (ctx, input) =>
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
			path: '/tasks',
			query: definedQuery({
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				'filter[responsible_user_id][]': parsed.responsible_user_id,
				'filter[entity_type]': parsed.entity_type,
				'filter[entity_id][]': parsed.entity_id,
				// Kommo takes 1 for completed and 0 for open.
				'filter[is_completed]':
					parsed.is_completed === undefined
						? undefined
						: Number(parsed.is_completed),
			}),
		}),
		{
			shape: (raw, parsed) =>
				shapeList(raw, 'tasks', parsed.page, parsed.limit ?? LIST_LIMIT),
			log: (_, result) => ({ count: result._embedded.tasks.length }),
		},
	);

// `complete_till` is required: Kommo refuses a task with no deadline.
export const create: KommoEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		({ tasks }) => ({ method: 'POST', path: '/tasks', body: tasks }),
		{
			log: (parsed, result) => ({
				submitted: parsed.tasks.length,
				created: result._embedded?.tasks.length ?? 0,
			}),
		},
	);
