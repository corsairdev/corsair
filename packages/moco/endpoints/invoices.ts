import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['invoicesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
		},
		input,
		({
			page,
			status,
			include_disregarded,
			not_booked,
			date_from,
			date_to,
			service_period_from,
			service_period_to,
			tags,
			identifier,
			term,
			company_id,
			project_id,
		}) => ({
			replayable: true,
			method: 'GET',
			path: '/invoices',
			query: {
				page,
				status,
				include_disregarded,
				not_booked,
				date_from,
				date_to,
				service_period_from,
				service_period_to,
				tags,
				identifier,
				term,
				company_id,
				project_id,
			},
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['invoicesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/invoices/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

/**
 * Moves an invoice through the statuses the API accepts here (created, sent,
 * overdue, ignored). Locked and disregarded invoices refuse the change with
 * a 422.
 */
export const updateStatus: MocoEndpoints['invoicesUpdateStatus'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.updateStatus',
			input: Inputs.invoicesUpdateStatus,
			output: Outputs.invoicesUpdateStatus,
		},
		input,
		({ id, status }) => ({
			method: 'PUT',
			path: `/invoices/${segment(id)}/update_status`,
			body: { status },
			mediaType: 'application/json',
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, id),
			log: ({ id, status }) => ({ id, status }),
		},
	);
