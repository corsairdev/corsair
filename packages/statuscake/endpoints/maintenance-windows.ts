import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const list: StatusCakeEndpoints['maintenanceWindowsList'] = (
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
		({ page, limit, state }) => ({
			method: 'GET',
			path: '/maintenance-windows',
			query: { page, limit, state },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['maintenanceWindowsCreate'] = (
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
		({ name, start_at, end_at, timezone, repeat_interval, tests, tags }) => ({
			method: 'POST',
			path: '/maintenance-windows',
			form: { name, start_at, end_at, timezone, repeat_interval, tests, tags },
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['maintenanceWindowsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maintenanceWindows.get',
			input: Inputs.maintenanceWindowsGet,
			output: Outputs.maintenanceWindowsGet,
		},
		input,
		({ window_id }) => ({
			method: 'GET',
			path: `/maintenance-windows/${segment(window_id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.id ?? undefined,
				state: result.data.state ?? undefined,
			}),
		},
	);

export const update: StatusCakeEndpoints['maintenanceWindowsUpdate'] = (
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
		({
			window_id,
			name,
			start_at,
			end_at,
			timezone,
			repeat_interval,
			tests,
			tags,
		}) => ({
			method: 'PUT',
			path: `/maintenance-windows/${segment(window_id)}`,
			form: { name, start_at, end_at, timezone, repeat_interval, tests, tags },
		}),
		{
			shape: (_raw, { window_id }) => ({ success: true, id: window_id }),
			log: ({ window_id }) => ({ id: window_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StatusCakeEndpoints['maintenanceWindowsDelete'] = (
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
		({ window_id }) => ({
			method: 'DELETE',
			path: `/maintenance-windows/${segment(window_id)}`,
		}),
		{
			shape: (_raw, { window_id }) => ({ success: true, id: window_id }),
			log: ({ window_id }) => ({ id: window_id }),
		},
	);
