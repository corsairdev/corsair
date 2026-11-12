import type { KommoEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, pageFrom } from './call';
import {
	KommoEndpointInputSchemas as Inputs,
	KommoEndpointOutputSchemas as Outputs,
} from './types';

const LIST_LIMIT = 250;

export const list: KommoEndpoints['leadsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.list',
			input: Inputs.leadsList,
			output: Outputs.leadsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/leads',
			query: definedQuery({
				with:
					parsed.with && parsed.with.length > 0
						? parsed.with.join(',')
						: undefined,
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				// Kommo takes filters as bracketed keys, which corsair/http renders
				// from a nested object.
				'filter[pipeline_id][]': parsed.pipeline_id,
				'filter[responsible_user_id][]': parsed.responsible_user_id,
				'filter[created_at][from]': parsed.created_from,
				'filter[created_at][to]': parsed.created_to,
				'filter[updated_at][from]': parsed.updated_from,
				'filter[updated_at][to]': parsed.updated_to,
				'order[created_at]':
					parsed.order_by === 'created_at' ? parsed.order_direction : undefined,
				'order[updated_at]':
					parsed.order_by === 'updated_at' ? parsed.order_direction : undefined,
				'order[id]':
					parsed.order_by === 'id' ? parsed.order_direction : undefined,
			}),
		}),
		{
			// unknown: `raw` is an untyped HAL envelope; the output schema
			// validates whatever `shape` returns.
			shape: (raw, parsed) => {
				const leads =
					((raw as { _embedded?: { leads?: unknown[] } } | undefined)?._embedded
						?.leads as unknown[] | undefined) ?? [];
				return {
					...(raw as object),
					next_page: pageFrom(
						raw,
						parsed.page,
						leads.length,
						parsed.limit ?? LIST_LIMIT,
					),
				};
			},
			log: (_, result) => ({ count: result._embedded.leads.length }),
		},
	);

export const get: KommoEndpoints['leadsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.get',
			input: Inputs.leadsGet,
			output: Outputs.leadsGet,
		},
		input,
		({ leadId, with: embed }) => ({
			method: 'GET',
			path: `/leads/${segment(leadId)}`,
			query: definedQuery({
				with: embed && embed.length > 0 ? embed.join(',') : undefined,
			}),
		}),
		{ log: (_, result) => ({ leadId: result.id }) },
	);

export const create: KommoEndpoints['leadsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.create',
			input: Inputs.leadsCreate,
			output: Outputs.leadsCreate,
		},
		input,
		({ leads }) => ({ method: 'POST', path: '/leads', body: leads }),
		{
			log: (parsed, result) => ({
				submitted: parsed.leads.length,
				created: result._embedded?.leads.length ?? 0,
			}),
		},
	);

// Kommo updates leads with PATCH and an array, and each entry carries its `id`.
export const update: KommoEndpoints['leadsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.update',
			input: Inputs.leadsUpdate,
			output: Outputs.leadsUpdate,
		},
		input,
		({ leads }) => ({ method: 'PATCH', path: '/leads', body: leads }),
		{ log: (parsed) => ({ updated: parsed.leads.length }) },
	);
