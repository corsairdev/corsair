import type { KanbanizeEndpoints } from '..';
import { segment } from '../client';
import { call, deletedResult, withId } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['workflowsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.list',
			input: Inputs.workflowsList,
			output: Outputs.workflowsList,
		},
		input,
		({ board_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/workflows`,
		}),
		{
			log: ({ board_id }, result) => ({
				boardId: board_id,
				count: result.data.length,
			}),
		},
	);

export const get: KanbanizeEndpoints['workflowsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.get',
			input: Inputs.workflowsGet,
			output: Outputs.workflowsGet,
		},
		input,
		({ board_id, workflow_id }) => ({
			method: 'GET',
			path: `/boards/${segment(board_id)}/workflows/${segment(workflow_id)}`,
		}),
		{
			shape: (raw, { workflow_id }) => withId(raw, 'workflow_id', workflow_id),
			log: (_, result) => ({ workflowId: result.data.workflow_id }),
		},
	);

export const create: KanbanizeEndpoints['workflowsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.create',
			input: Inputs.workflowsCreate,
			output: Outputs.workflowsCreate,
		},
		input,
		({ board_id, ...body }) => ({
			method: 'POST',
			path: `/boards/${segment(board_id)}/workflows`,
			body: Object.fromEntries(
				Object.entries(body).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ workflowId: result.data.workflow_id }) },
	);

export const update: KanbanizeEndpoints['workflowsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.update',
			input: Inputs.workflowsUpdate,
			output: Outputs.workflowsUpdate,
		},
		input,
		({ board_id, workflow_id, ...changes }) => ({
			method: 'PATCH',
			path: `/boards/${segment(board_id)}/workflows/${segment(workflow_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: (raw, { workflow_id }) => withId(raw, 'workflow_id', workflow_id),
			log: (_, result) => ({ workflowId: result.data.workflow_id }),
		},
	);

export const remove: KanbanizeEndpoints['workflowsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.delete',
			input: Inputs.workflowsRemove,
			output: Outputs.workflowsRemove,
		},
		input,
		({ board_id, workflow_id }) => ({
			method: 'DELETE',
			path: `/boards/${segment(board_id)}/workflows/${segment(workflow_id)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ board_id, workflow_id }) => ({
				boardId: board_id,
				workflowId: workflow_id,
			}),
		},
	);
