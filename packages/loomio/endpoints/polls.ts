import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { bodyWithout, call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

export const list: LoomioEndpoints['pollsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.list',
			input: Inputs.pollsList,
			output: Outputs.pollsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/polls',
			query: {
				group_id: parsed.group_id,
				status: parsed.status,
				limit: parsed.limit,
				offset: parsed.offset,
				...relatedQuery(parsed),
			},
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'polls', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.polls.length }),
		},
	);

export const get: LoomioEndpoints['pollsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.get',
			input: Inputs.pollsGet,
			output: Outputs.pollsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/polls/${segment(parsed.id)}`,
			query: relatedQuery(parsed),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({ pollId: result.poll.id }),
		},
	);

export const create: LoomioEndpoints['pollsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.create',
			input: Inputs.pollsCreate,
			output: Outputs.pollsCreate,
		},
		input,
		// An explicit closing_at: null keeps the poll a draft, which Loomio documents.
		(parsed) => ({ method: 'POST', path: '/polls', body: parsed }),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({
				pollId: result.poll.id,
				pollType: result.poll.poll_type ?? undefined,
			}),
		},
	);

export const update: LoomioEndpoints['pollsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.update',
			input: Inputs.pollsUpdate,
			output: Outputs.pollsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/polls/${segment(parsed.id)}`,
			body: bodyWithout(parsed, 'id'),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({ pollId: result.poll.id }),
		},
	);

export const remove: LoomioEndpoints['pollsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'polls.delete',
			input: Inputs.pollsDelete,
			output: Outputs.pollsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/polls/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'polls', 'poll'),
			log: (_, result) => ({ pollId: result.poll.id }),
		},
	);
