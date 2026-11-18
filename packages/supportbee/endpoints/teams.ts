import type { SupportbeeEndpoints } from '..';
import { call, queryOf } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['teamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.list',
			input: Inputs.teamsList,
			output: Outputs.teamsList,
		},
		input,
		({ with_users, user }) => ({
			method: 'GET',
			path: '/teams',
			query: queryOf({ with_users, user }),
		}),
		{
			log: (_, result) => ({ count: result.teams.length }),
		},
	);
