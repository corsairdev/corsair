import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['maintenanceWindowsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenanceWindows.list',
			input: Inputs.maintenanceWindowsList,
			output: Outputs.maintenanceWindowsList,
		},
		input,
		({ limit, cursor }) => ({
			method: 'GET',
			path: '/maintenance-windows',
			query: { limit, cursor },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const create: UptimeRobotEndpoints['maintenanceWindowsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenanceWindows.create',
			input: Inputs.maintenanceWindowsCreate,
			output: Outputs.maintenanceWindowsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/maintenance-windows', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				interval: parsed.interval,
			}),
		},
	);

export const update: UptimeRobotEndpoints['maintenanceWindowsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenanceWindows.update',
			input: Inputs.maintenanceWindowsUpdate,
			output: Outputs.maintenanceWindowsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/maintenance-windows/${segment(id)}`,
			body,
		}),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const remove: UptimeRobotEndpoints['maintenanceWindowsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenanceWindows.delete',
			input: Inputs.maintenanceWindowsDelete,
			output: Outputs.maintenanceWindowsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/maintenance-windows/${segment(id)}`,
		}),
		{
			// UptimeRobot answers 204 with no body.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
