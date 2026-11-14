import type { KanbanizeEndpoints } from '..';
import { queryFor, withIdField } from '../client';
import { call } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const users: KanbanizeEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({ fields }) => ({
			method: 'GET',
			path: '/users',
			query: queryFor({ fields: withIdField(fields, 'user_id') }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const me: KanbanizeEndpoints['meGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'me.get',
			input: Inputs.meGet,
			output: Outputs.meGet,
		},
		input,
		() => ({ method: 'GET', path: '/me' }),
		{ log: (_, result) => ({ userId: result.data.user_id }) },
	);

export const limits: KanbanizeEndpoints['limitsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'limits.get',
			input: Inputs.limitsGet,
			output: Outputs.limitsGet,
		},
		input,
		() => ({ method: 'GET', path: '/apiLimits' }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
