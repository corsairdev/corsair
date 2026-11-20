import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['leadsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.list',
			input: Inputs.leadsList,
			output: Outputs.leadsList,
		},
		input,
		({ next_page }) => ({
			method: 'GET',
			path: '/v1/leads',
			query: { next_page },
		}),
		{
			log: (_, page) => ({
				count: page.data.length,
				hasMore: page.page.has_more,
			}),
		},
	);

export const create: PersistiqEndpoints['leadsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.create',
			input: Inputs.leadsCreate,
			output: Outputs.leadsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/leads', body }),
		{ log: (_, page) => ({ leadId: page.data[0]?.id ?? undefined }) },
	);

export const get: PersistiqEndpoints['leadsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.get',
			input: Inputs.leadsGet,
			output: Outputs.leadsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/leads/${encodeURIComponent(id)}`,
		}),
		{ log: (_, page) => ({ leadId: page.data[0]?.id ?? undefined }) },
	);

export const update: PersistiqEndpoints['leadsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.update',
			input: Inputs.leadsUpdate,
			output: Outputs.leadsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/v1/leads/${encodeURIComponent(id)}`,
			body,
		}),
		{ log: (_, page) => ({ leadId: page.data[0]?.id ?? undefined }) },
	);
