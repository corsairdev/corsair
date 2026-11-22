import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

export const list: PingdomEndpoints['occurrencesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'occurrences.list',
			input: Inputs.occurrencesList,
			output: Outputs.occurrencesList,
		},
		input,
		({ maintenanceId, from, to }) => ({
			method: 'GET',
			path: `${V31}/maintenance.occurrences`,
			query: { maintenanceid: maintenanceId, from, to },
		}),
		{
			log: (_, page) => ({
				count: page.occurrences.length,
			}),
		},
	);

export const get: PingdomEndpoints['occurrencesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'occurrences.get',
			input: Inputs.occurrencesGet,
			output: Outputs.occurrencesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `${V31}/maintenance.occurrences/${id}`,
		}),
		{ log: ({ id }) => ({ occurrenceId: id }) },
	);

export const update: PingdomEndpoints['occurrencesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'occurrences.update',
			input: Inputs.occurrencesUpdate,
			output: Outputs.occurrencesUpdate,
		},
		input,
		({ id, from, to }) => ({
			method: 'PUT',
			path: `${V31}/maintenance.occurrences/${id}`,
			body: { from, to },
		}),
		{ log: ({ id }) => ({ occurrenceId: id }) },
	);

export const deleteOccurrence: PingdomEndpoints['occurrencesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'occurrences.delete',
			input: Inputs.occurrencesDelete,
			output: Outputs.occurrencesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `${V31}/maintenance.occurrences/${id}`,
		}),
		{ log: ({ id }) => ({ occurrenceId: id }) },
	);
