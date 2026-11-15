import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['monitorGroupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitorGroups.list',
			input: Inputs.monitorGroupsList,
			output: Outputs.monitorGroupsList,
		},
		input,
		({ limit, cursor }) => ({
			method: 'GET',
			path: '/monitor-groups',
			query: { limit, cursor },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const create: UptimeRobotEndpoints['monitorGroupsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'monitorGroups.create',
			input: Inputs.monitorGroupsCreate,
			output: Outputs.monitorGroupsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/monitor-groups', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				monitors: parsed.monitorIds?.length ?? 0,
			}),
		},
	);

export const remove: UptimeRobotEndpoints['monitorGroupsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'monitorGroups.delete',
			input: Inputs.monitorGroupsDelete,
			output: Outputs.monitorGroupsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/monitor-groups/${segment(id)}` }),
		{
			// UptimeRobot answers 204. The group's monitors are kept and become
			// ungrouped, which is why this is not destructive to the monitors.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
