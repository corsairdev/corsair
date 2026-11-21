import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

export const list: PingdomEndpoints['maintenanceList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maintenance.list',
			input: Inputs.maintenanceList,
			output: Outputs.maintenanceList,
		},
		input,
		({ limit, offset, orderBy, order }) => ({
			method: 'GET',
			path: `${V31}/maintenance`,
			query: { limit, offset, orderby: orderBy, order },
		}),
		{ log: (_, page) => ({ count: page.maintenance.length }) },
	);

export const create: PingdomEndpoints['maintenanceCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maintenance.create',
			input: Inputs.maintenanceCreate,
			output: Outputs.maintenanceCreate,
		},
		input,
		(window_) => ({
			method: 'POST',
			path: `${V31}/maintenance`,
			body: {
				description: window_.description,
				from: window_.from,
				to: window_.to,
				recurrence: window_.recurrence,
				recurring: window_.recurring,
				effective_to: window_.effectiveTo,
				checks: window_.checks,
				teams: window_.teams,
				contacts: window_.contacts,
			},
		}),
		{
			log: (_, created) => ({
				windowId: created.maintenance.id ?? undefined,
			}),
		},
	);

export const get: PingdomEndpoints['maintenanceGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maintenance.get',
			input: Inputs.maintenanceGet,
			output: Outputs.maintenanceGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `${V31}/maintenance/${id}`,
		}),
		{ log: ({ id }) => ({ windowId: id }) },
	);

export const update: PingdomEndpoints['maintenanceUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'maintenance.update',
			input: Inputs.maintenanceUpdate,
			output: Outputs.maintenanceUpdate,
		},
		input,
		({ id, effectiveTo, ...rest }) => ({
			method: 'PUT',
			path: `${V31}/maintenance/${id}`,
			body: {
				description: rest.description,
				from: rest.from,
				to: rest.to,
				recurrence: rest.recurrence,
				recurring: rest.recurring,
				effective_to: effectiveTo,
				checks: rest.checks,
				teams: rest.teams,
				contacts: rest.contacts,
			},
		}),
		{ log: ({ id }) => ({ windowId: id }) },
	);

export const deleteWindow: PingdomEndpoints['maintenanceDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenance.delete',
			input: Inputs.maintenanceDelete,
			output: Outputs.maintenanceDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `${V31}/maintenance/${id}`,
		}),
		{ log: ({ id }) => ({ windowId: id }) },
	);

export const deleteMulti: PingdomEndpoints['maintenanceDeleteMulti'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'maintenance.deleteMulti',
			input: Inputs.maintenanceDeleteMulti,
			output: Outputs.maintenanceDeleteMulti,
		},
		input,
		({ windowIds }) => ({
			method: 'DELETE',
			path: `${V31}/maintenance`,
			query: { maintenanceids: windowIds.join(',') },
		}),
		{ log: ({ windowIds }) => ({ count: windowIds.length }) },
	);
