import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

/** `tags[]` keys so the API reads the values as an array. */
export function tagQuery(
	tags: string[] | undefined,
	matchany: boolean | undefined,
) {
	return { 'tags[]': tags, matchany };
}

export const list: StatusCakeEndpoints['heartbeatList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'heartbeat.list',
			input: Inputs.heartbeatList,
			output: Outputs.heartbeatList,
		},
		input,
		({ status, page, limit, tags, matchany }) => ({
			method: 'GET',
			path: '/heartbeat',
			query: { status, page, limit, ...tagQuery(tags, matchany) },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['heartbeatCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'heartbeat.create',
			input: Inputs.heartbeatCreate,
			output: Outputs.heartbeatCreate,
		},
		input,
		({ name, period, contact_groups, host, paused, tags }) => ({
			method: 'POST',
			path: '/heartbeat',
			form: { name, period, contact_groups, host, paused, tags },
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['heartbeatGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'heartbeat.get',
			input: Inputs.heartbeatGet,
			output: Outputs.heartbeatGet,
		},
		input,
		({ test_id }) => ({
			method: 'GET',
			path: `/heartbeat/${segment(test_id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.id ?? undefined,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const update: StatusCakeEndpoints['heartbeatUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'heartbeat.update',
			input: Inputs.heartbeatUpdate,
			output: Outputs.heartbeatUpdate,
		},
		input,
		({ test_id, name, period, contact_groups, host, paused, tags }) => ({
			method: 'PUT',
			path: `/heartbeat/${segment(test_id)}`,
			form: { name, period, contact_groups, host, paused, tags },
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StatusCakeEndpoints['heartbeatDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'heartbeat.delete',
			input: Inputs.heartbeatDelete,
			output: Outputs.heartbeatDelete,
		},
		input,
		({ test_id }) => ({
			method: 'DELETE',
			path: `/heartbeat/${segment(test_id)}`,
		}),
		{
			shape: (_raw, { test_id }) => ({ success: true, id: test_id }),
			log: ({ test_id }) => ({ id: test_id }),
		},
	);
