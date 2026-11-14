import type { KanbanizeEndpoints } from '..';
import { segment } from '../client';
import { call, deletedResult } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['subtasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subtasks.list',
			input: Inputs.subtasksList,
			output: Outputs.subtasksList,
		},
		input,
		({ card_id }) => ({
			method: 'GET',
			path: `/cards/${segment(card_id)}/subtasks`,
		}),
		{
			log: ({ card_id }, result) => ({
				cardId: card_id,
				count: result.data.length,
			}),
		},
	);

export const create: KanbanizeEndpoints['subtasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subtasks.create',
			input: Inputs.subtasksCreate,
			output: Outputs.subtasksCreate,
		},
		input,
		({ card_id, ...body }) => ({
			method: 'POST',
			path: `/cards/${segment(card_id)}/subtasks`,
			body: Object.fromEntries(
				Object.entries(body).filter(([, value]) => value !== undefined),
			),
		}),
		{
			log: ({ card_id }, result) => ({
				cardId: card_id,
				subtaskId: result.data.subtask_id,
			}),
		},
	);

export const update: KanbanizeEndpoints['subtasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subtasks.update',
			input: Inputs.subtasksUpdate,
			output: Outputs.subtasksUpdate,
		},
		input,
		({ card_id, subtask_id, ...changes }) => ({
			method: 'PATCH',
			path: `/cards/${segment(card_id)}/subtasks/${segment(subtask_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			// Businessmap answers 204 when the change was made but the key's user
			// may not read the subtask back; the result then carries only its ID.
			shape: (raw, { subtask_id }) =>
				raw === undefined || raw === null ? { data: { subtask_id } } : raw,
			log: ({ card_id, subtask_id }) => ({
				cardId: card_id,
				subtaskId: subtask_id,
			}),
		},
	);

export const remove: KanbanizeEndpoints['subtasksRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subtasks.delete',
			input: Inputs.subtasksRemove,
			output: Outputs.subtasksRemove,
		},
		input,
		({ card_id, subtask_id }) => ({
			method: 'DELETE',
			path: `/cards/${segment(card_id)}/subtasks/${segment(subtask_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ card_id, subtask_id }) => ({
				cardId: card_id,
				subtaskId: subtask_id,
			}),
		},
	);
