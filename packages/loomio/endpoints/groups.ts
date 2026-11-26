import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

export const list: LoomioEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/groups',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				...relatedQuery(parsed),
			},
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'groups', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.groups.length }),
		},
	);

export const get: LoomioEndpoints['groupsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.get',
			input: Inputs.groupsGet,
			output: Outputs.groupsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/groups/${segment(parsed.id)}`,
			query: relatedQuery(parsed),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'groups', 'group'),
			log: (_, result) => ({ groupId: result.group.id }),
		},
	);
