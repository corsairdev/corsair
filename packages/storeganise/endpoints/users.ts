import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

// The best-practices page documents list reads with updatedAfter for
// incremental sync and ids for batch fetch, with users as the named example.
export const list: StoreganiseEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({ updatedAfter, ids }, base) => ({
			method: 'GET',
			base,
			path: '/admin/users',
			query: { updatedAfter, ids: ids?.join(',') },
		}),
		{
			log: (_, users) => ({ count: users.length }),
		},
	);

export const get: StoreganiseEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ userIdOrEmail }, base) => ({
			method: 'GET',
			base,
			path: `/admin/users/${encodeURIComponent(userIdOrEmail)}`,
		}),
		{
			log: (_, user) => ({ userId: user.id }),
		},
	);
