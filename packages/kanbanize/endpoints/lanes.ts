import type { KanbanizeEndpoints } from '..';
import { segment } from '../client';
import { call, deletedResult, withId } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['lanesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lanes.list',
			input: Inputs.lanesList,
			output: Outputs.lanesList,
		},
		input,
		({ board_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/lanes`,
		}),
		{
			log: ({ board_id }, result) => ({
				boardId: board_id,
				count: result.data.length,
			}),
		},
	);

export const get: KanbanizeEndpoints['lanesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lanes.get',
			input: Inputs.lanesGet,
			output: Outputs.lanesGet,
		},
		input,
		({ board_id, lane_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/lanes/${segment(lane_id)}`,
		}),
		{
			shape: (raw, { lane_id }) => withId(raw, 'lane_id', lane_id),
			log: (_, result) => ({ laneId: result.data.lane_id }),
		},
	);

export const create: KanbanizeEndpoints['lanesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lanes.create',
			input: Inputs.lanesCreate,
			output: Outputs.lanesCreate,
		},
		input,
		({ board_id, ...body }) => ({
			method: 'POST',
			path: `/boards/${segment(board_id)}/lanes`,
			body: Object.fromEntries(
				Object.entries(body).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ laneId: result.data.lane_id }) },
	);

export const update: KanbanizeEndpoints['lanesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lanes.update',
			input: Inputs.lanesUpdate,
			output: Outputs.lanesUpdate,
		},
		input,
		({ board_id, lane_id, ...changes }) => ({
			method: 'PATCH',
			path: `/boards/${segment(board_id)}/lanes/${segment(lane_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: (raw, { lane_id }) => withId(raw, 'lane_id', lane_id),
			log: ({ lane_id }) => ({ laneId: lane_id }),
		},
	);

export const remove: KanbanizeEndpoints['lanesRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lanes.delete',
			input: Inputs.lanesRemove,
			output: Outputs.lanesRemove,
		},
		input,
		({ board_id, lane_id }) => ({
			method: 'DELETE',
			path: `/boards/${segment(board_id)}/lanes/${segment(lane_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ board_id, lane_id }) => ({ boardId: board_id, laneId: lane_id }),
		},
	);
