import type { PipelineCrmEndpoints } from '..';
import { call } from './call';
import {
	conditionsQuery,
	PipelineCrmEndpointInputSchemas as Inputs,
	PipelineCrmEndpointOutputSchemas as Outputs,
} from './types';

const V3 = '/api/v3';

export const list: PipelineCrmEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({ conditions, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/users`,
			query: { ...conditionsQuery(conditions), page, per_page: perPage },
		}),
		{ log: (_, page_) => ({ count: page_.entries.length }) },
	);

export const get: PipelineCrmEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/users/${id}` }),
		{ log: (_, user) => ({ userId: user.id ?? undefined }) },
	);
