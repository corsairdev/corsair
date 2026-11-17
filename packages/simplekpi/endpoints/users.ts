import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Users are read-only: there is no `users:write` scope, and people are added
 * and changed in the app. A user id is what an entry is recorded against.
 */
export const list: SimplekpiEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.list', input: Inputs.usersList, output: Outputs.usersList },
		input,
		({ page, rows }) => ({
			method: 'GET',
			path: '/v1/users',
			query: { page, rows },
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const get: SimplekpiEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.get', input: Inputs.usersGet, output: Outputs.usersGet },
		input,
		({ id }) => ({ method: 'GET', path: `/v1/users/${segment(id)}` }),
		// The email is a sign-in address, so only the id and role are logged.
		{
			log: ({ id }, result) => ({
				userId: id,
				userType: result.user_type ?? undefined,
			}),
		},
	);
