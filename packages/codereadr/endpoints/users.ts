import type { CodereadrEndpoints } from '..';
import { call, idList } from './call';
import { readCreatedId, shapeUsers } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			section: 'users',
			action: 'retrieve',
			user_id: idList(parsed.user_id),
		}),
		{
			shape: (root) => shapeUsers(root),
			log: (_, result) => ({ count: result.users.length }),
			replaySafe: true,
		},
	);

export const create: CodereadrEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		(parsed) => ({
			section: 'users',
			action: 'create',
			username: parsed.username,
			password: parsed.password,
			limit: parsed.device_limit,
		}),
		{
			shape: (root) => ({
				success: true,
				user_id: readCreatedId(root),
			}),
			// The username and password are not logged.
			log: (_, result) => ({ userId: result.user_id }),
		},
	);

export const update: CodereadrEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		(parsed) => ({
			section: 'users',
			action: 'update',
			user_id: parsed.user_id,
			username: parsed.username,
			password: parsed.password,
			limit: parsed.device_limit,
		}),
		{
			shape: (_, parsed) => ({
				success: true,
				user_id: parsed.user_id,
			}),
			log: ({ user_id }) => ({ userId: user_id }),
		},
	);

export const remove: CodereadrEndpoints['usersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
		},
		input,
		(parsed) => ({
			section: 'users',
			action: 'delete',
			user_id: idList(parsed.user_id),
		}),
		{
			shape: () => ({ success: true }),
			log: ({ user_id }) => ({
				count: user_id === 'all' ? 'all' : user_id.length,
			}),
		},
	);
