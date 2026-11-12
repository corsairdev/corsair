import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Create or update. Userflow treats this as one operation: an unseen `id`
 * creates the user, a known one merges the attributes in. Because of that it is
 * not safe to replay a 5xx — the first attempt may have landed.
 */
export const upsert: UserflowEndpoints['usersUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.upsert',
			input: Inputs.usersUpsert,
			output: Outputs.usersUpsert,
		},
		input,
		(body) => ({ method: 'POST', path: '/users', body }),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				attributes: parsed.attributes
					? Object.keys(parsed.attributes).length
					: 0,
				groups: parsed.groups?.length ?? parsed.memberships?.length ?? 0,
				created: result.created_at !== undefined,
			}),
		},
	);

export const get: UserflowEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/users/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ id }) },
	);

/**
 * Deleting removes the user's attributes, memberships, events and flow history.
 * It is idempotent, so an unknown id still answers `deleted: true`.
 */
export const remove: UserflowEndpoints['usersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/users/${segment(id)}` }),
		{
			// Userflow documents a body here, but state what happened anyway so a
			// caller never has to read the flag.
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ id }) => ({ id }),
		},
	);

export const list: UserflowEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({
			limit,
			starting_after,
			email,
			group_id,
			segment_id,
			condition,
			order_by,
			expand,
		}) => ({
			method: 'GET',
			path: '/users',
			query: {
				limit,
				starting_after,
				email,
				group_id,
				segment_id,
				condition,
				// The client sends an array as order_by[]=a&order_by[]=b.
				order_by,
				expand,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);
