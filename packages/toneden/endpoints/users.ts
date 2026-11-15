import type { ToneDenEndpoints } from '..';
import { segment } from '../client';
import { call, writeBody } from './call';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './types';

export const get: ToneDenEndpoints['usersGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: ToneDenEndpointInputSchemas.getUser,
			output: ToneDenEndpointOutputSchemas.getUser,
		},
		input,
		(parsed) => ({ method: 'GET', path: `users/${segment(parsed.user_id)}` }),
		{ log: (parsed) => ({ user_id: parsed.user_id }) },
	);

export const update: ToneDenEndpoints['usersUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: ToneDenEndpointInputSchemas.updateUser,
			output: ToneDenEndpointOutputSchemas.updateUser,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `users/${segment(parsed.user_id)}`,
			// The email is never logged, so it is never in a log body either.
			body: writeBody(parsed as Record<string, unknown>, ['user_id']),
		}),
		{ log: (parsed) => ({ user_id: parsed.user_id }) },
	);
