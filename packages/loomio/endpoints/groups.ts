import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
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
		({ limit, offset }) => ({
			method: 'GET',
			path: '/groups',
			query: { limit, offset },
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
		({ id }) => ({
			method: 'GET',
			path: `/groups/${segment(id)}`,
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'groups', 'group'),
			log: (_, result) => ({ groupId: result.group.id }),
		},
	);
