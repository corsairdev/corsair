import type { LeigaEndpoints } from '..';
import { call, wrapList } from './call';
import {
	LeigaEndpointInputSchemas as Inputs,
	LeigaEndpointOutputSchemas as Outputs,
} from './types';

export const list: LeigaEndpoints['sprintsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sprints.list',
			input: Inputs.sprintsList,
			output: Outputs.sprintsList,
		},
		input,
		// A POST with the project id in the body, not a query parameter.
		({ projectId }) => ({
			method: 'POST',
			path: '/sprint/list-with-count',
			body: { projectId },
		}),
		{
			shape: (raw) => ({ sprints: wrapList(raw, 'sprint list') }),
			log: (_, result) => ({ count: result.sprints.length }),
		},
	);

export const get: LeigaEndpoints['sprintsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sprints.get',
			input: Inputs.sprintsGet,
			output: Outputs.sprintsGet,
		},
		input,
		// The query parameter is `id`, not `sprintId`: the latter answers
		// `{"code":"100","msg":"id should not be null"}` on HTTP 200.
		({ sprintId }) => ({
			method: 'GET',
			path: '/sprint/get',
			query: { id: sprintId },
		}),
		{ log: (_, result) => ({ sprintId: result.id }) },
	);

export const workflows: LeigaEndpoints['workflowsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.list',
			input: Inputs.workflowsList,
			output: Outputs.workflowsList,
		},
		input,
		({ projectId }) => ({
			method: 'POST',
			path: '/workflow/list',
			body: { projectId },
		}),
		{
			shape: (raw) => ({ workflows: wrapList(raw, 'workflow list') }),
			log: (_, result) => ({ count: result.workflows.length }),
		},
	);

export const nextStates: LeigaEndpoints['workflowsNextStates'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.nextStates',
			input: Inputs.workflowsNextStates,
			output: Outputs.workflowsNextStates,
		},
		input,
		// Three fields, not two: a bare state id answers
		// `{"code":"100","msg":"defId should not be null"}`. `defId` is the
		// workflow id, which is also what `issues.types` reports as `workflowId`.
		({ projectId, stateId, defId }) => ({
			method: 'POST',
			path: '/workflow/list/next-state',
			body: { projectId, stateId, defId },
		}),
		{
			shape: (raw) => ({ states: wrapList(raw, 'next state list') }),
			log: (_, result) => ({ count: result.states.length }),
		},
	);

export const tags: LeigaEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		({ projectId }) => ({
			method: 'POST',
			path: '/tag/list',
			body: { projectId },
		}),
		{
			shape: (raw) => ({ tags: wrapList(raw, 'tag list') }),
			log: (_, result) => ({ count: result.tags.length }),
		},
	);

export const members: LeigaEndpoints['membersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.list',
			input: Inputs.membersList,
			output: Outputs.membersList,
		},
		input,
		({ projectId, keyword }) => ({
			method: 'GET',
			path: '/user/project-user-list',
			query: {
				projectId,
				...(keyword === undefined ? {} : { keyword }),
			},
		}),
		{
			shape: (raw) => ({ members: wrapList(raw, 'member list') }),
			log: (_, result) => ({ count: result.members.length }),
		},
	);
