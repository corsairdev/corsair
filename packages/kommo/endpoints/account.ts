import type { KommoEndpoints } from '..';
import { definedQuery } from '../client';
import { call } from './call';
import {
	KommoEndpointInputSchemas as Inputs,
	KommoEndpointOutputSchemas as Outputs,
} from './types';

export const pipelines: KommoEndpoints['pipelinesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pipelines.list',
			input: Inputs.pipelinesList,
			output: Outputs.pipelinesList,
		},
		input,
		() => ({ method: 'GET', path: '/leads/pipelines' }),
		{ log: (_, result) => ({ count: result._embedded.pipelines.length }) },
	);

export const users: KommoEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/users',
			query: definedQuery({ page: parsed.page, limit: parsed.limit }),
		}),
		{ log: (_, result) => ({ count: result._embedded.users.length }) },
	);

export const account: KommoEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
		{ log: (_, result) => ({ accountId: result.id }) },
	);
