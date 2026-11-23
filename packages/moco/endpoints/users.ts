import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['usersList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({ page, include_archived, email, tags }) => ({
			replayable: true,
			method: 'GET',
			path: '/users',
			query: { page, include_archived, email, tags },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['usersGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/users/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
