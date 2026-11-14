import type { KanbanizeEndpoints } from '..';
import { queryFor, segment, withIdField } from '../client';
import { call, deletedResult, withId } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['columnsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'columns.list',
			input: Inputs.columnsList,
			output: Outputs.columnsList,
		},
		input,
		({ board_id, fields }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/columns`,
			query: queryFor({ fields: withIdField(fields, 'column_id') }),
		}),
		{
			log: ({ board_id }, result) => ({
				boardId: board_id,
				count: result.data.length,
			}),
		},
	);

export const get: KanbanizeEndpoints['columnsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'columns.get',
			input: Inputs.columnsGet,
			output: Outputs.columnsGet,
		},
		input,
		({ board_id, column_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/columns/${segment(column_id)}`,
		}),
		{
			shape: (raw, { column_id }) => withId(raw, 'column_id', column_id),
			log: (_, result) => ({ columnId: result.data.column_id }),
		},
	);

// A column body has two documented shapes: a main column (`workflow_id` with
// `section`) or a subcolumn (`parent_column_id`). The input schema has already
// rejected a mix, so this sends only the keys the chosen shape defines.
export const create: KanbanizeEndpoints['columnsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'columns.create',
			input: Inputs.columnsCreate,
			output: Outputs.columnsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/boards/${segment(parsed.board_id)}/columns`,
			body: Object.fromEntries(
				Object.entries({
					name: parsed.name,
					position: parsed.position,
					description: parsed.description,
					color: parsed.color,
					workflow_id: parsed.workflow_id,
					section: parsed.section,
					parent_column_id: parsed.parent_column_id,
				}).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ columnId: result.data.column_id }) },
	);

export const update: KanbanizeEndpoints['columnsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'columns.update',
			input: Inputs.columnsUpdate,
			output: Outputs.columnsUpdate,
		},
		input,
		({ board_id, column_id, ...changes }) => ({
			method: 'PATCH',
			path: `/boards/${segment(board_id)}/columns/${segment(column_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: (raw, { column_id }) => withId(raw, 'column_id', column_id),
			log: ({ column_id }) => ({ columnId: column_id }),
		},
	);

export const remove: KanbanizeEndpoints['columnsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'columns.delete',
			input: Inputs.columnsRemove,
			output: Outputs.columnsRemove,
		},
		input,
		({ board_id, column_id }) => ({
			method: 'DELETE',
			path: `/boards/${segment(board_id)}/columns/${segment(column_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ board_id, column_id }) => ({
				boardId: board_id,
				columnId: column_id,
			}),
		},
	);
