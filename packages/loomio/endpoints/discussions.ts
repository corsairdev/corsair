import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { bodyWithout, call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

export const list: LoomioEndpoints['discussionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.list',
			input: Inputs.discussionsList,
			output: Outputs.discussionsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/discussions',
			query: {
				group_id: parsed.group_id,
				status: parsed.status,
				limit: parsed.limit,
				offset: parsed.offset,
				...relatedQuery(parsed),
			},
		}),
		{
			shape: (raw, parsed) =>
				withPaging(raw, 'discussions', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.discussions.length }),
		},
	);

export const get: LoomioEndpoints['discussionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.get',
			input: Inputs.discussionsGet,
			output: Outputs.discussionsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/discussions/${segment(parsed.id)}`,
			query: relatedQuery(parsed),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({ discussionId: result.discussion.id }),
		},
	);

export const create: LoomioEndpoints['discussionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.create',
			input: Inputs.discussionsCreate,
			output: Outputs.discussionsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/discussions', body: parsed }),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({
				discussionId: result.discussion.id,
				groupId: result.discussion.group_id ?? undefined,
			}),
		},
	);

export const update: LoomioEndpoints['discussionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.update',
			input: Inputs.discussionsUpdate,
			output: Outputs.discussionsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/discussions/${segment(parsed.id)}`,
			body: bodyWithout(parsed, 'id'),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({ discussionId: result.discussion.id }),
		},
	);

export const remove: LoomioEndpoints['discussionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discussions.delete',
			input: Inputs.discussionsDelete,
			output: Outputs.discussionsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/discussions/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'discussions', 'discussion'),
			log: (_, result) => ({ discussionId: result.discussion.id }),
		},
	);
