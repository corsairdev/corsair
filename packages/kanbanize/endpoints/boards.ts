import type { KanbanizeEndpoints } from '..';
import { queryFor, segment, withIdField } from '../client';
import { call, deletedResult, withId } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['boardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.list',
			input: Inputs.boardsList,
			output: Outputs.boardsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/boards',
			query: queryFor({
				board_ids: parsed.board_ids,
				workspace_ids: parsed.workspace_ids,
				is_archived: parsed.is_archived,
				if_assigned: parsed.if_assigned,
				fields: withIdField(parsed.fields, 'board_id'),
				expand: parsed.expand,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: KanbanizeEndpoints['boardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.get',
			input: Inputs.boardsGet,
			output: Outputs.boardsGet,
		},
		input,
		({ board_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}`,
		}),
		{
			shape: (raw, { board_id }) => withId(raw, 'board_id', board_id),
			log: (_, result) => ({ boardId: result.data.board_id }),
		},
	);

export const create: KanbanizeEndpoints['boardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.create',
			input: Inputs.boardsCreate,
			output: Outputs.boardsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/boards',
			body: {
				workspace_id: parsed.workspace_id,
				name: parsed.name,
				description: parsed.description,
				type: parsed.type,
			},
		}),
		{ log: (_, result) => ({ boardId: result.data.board_id }) },
	);

export const update: KanbanizeEndpoints['boardsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.update',
			input: Inputs.boardsUpdate,
			output: Outputs.boardsUpdate,
		},
		input,
		({ board_id, ...changes }) => ({
			method: 'PATCH',
			path: `/boards/${segment(board_id)}`,
			body: changes,
		}),
		{
			shape: (raw, { board_id }) => withId(raw, 'board_id', board_id),
			log: ({ board_id }) => ({ boardId: board_id }),
		},
	);

export const remove: KanbanizeEndpoints['boardsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.delete',
			input: Inputs.boardsRemove,
			output: Outputs.boardsRemove,
		},
		input,
		({ board_id }) => ({
			method: 'DELETE',
			path: `/boards/${segment(board_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ board_id }) => ({ boardId: board_id }),
		},
	);
