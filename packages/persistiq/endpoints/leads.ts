import type { PersistiqEndpoints } from '..';
import { call, segment } from './call';
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
		(query) => ({ method: 'GET', path: '/v1/leads', query }),
		{
			log: (_, page) => ({
				count: page.leads.length,
				hasMore: page.has_more ?? undefined,
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
		{ log: (_, result) => ({ leadId: result.lead.id }) },
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
			path: `/v1/leads/${segment(id)}`,
		}),
		{ log: (_, result) => ({ leadId: result.lead.id }) },
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
			path: `/v1/leads/${segment(id)}`,
			body,
		}),
		{ log: (_, result) => ({ leadId: result.lead.id }) },
	);
