import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	conditionParam,
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/** Create or update, keyed by your own group id. */
export const upsert: UserflowEndpoints['groupsUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.upsert',
			input: Inputs.groupsUpsert,
			output: Outputs.groupsUpsert,
		},
		input,
		(body) => ({ method: 'POST', path: '/groups', body }),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				attributes: parsed.attributes
					? Object.keys(parsed.attributes).length
					: 0,
				created: result.created_at !== undefined,
			}),
		},
	);

export const get: UserflowEndpoints['groupsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.get',
			input: Inputs.groupsGet,
			output: Outputs.groupsGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/groups/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ id }) },
	);

/**
 * Deleting a group removes its attributes, memberships and events. The users
 * who were members stay; only their membership of this group goes.
 */
export const remove: UserflowEndpoints['groupsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.delete',
			input: Inputs.groupsDelete,
			output: Outputs.groupsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/groups/${segment(id)}` }),
		{
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ id }) => ({ id }),
		},
	);

export const list: UserflowEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		({
			limit,
			starting_after,
			condition,
			user_id,
			segment_id,
			order_by,
			expand,
		}) => ({
			method: 'GET',
			path: '/groups',
			query: {
				limit,
				starting_after,
				condition: conditionParam(condition),
				user_id,
				segment_id,
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
