import type { KommoEndpoints } from '..';
import { definedQuery } from '../client';
import { call, pageFrom } from './call';
import {
	KommoEndpointInputSchemas as Inputs,
	KommoEndpointOutputSchemas as Outputs,
} from './types';

const LIST_LIMIT = 250;

export const list: KommoEndpoints['companiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/companies',
			query: definedQuery({
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				'filter[responsible_user_id][]': parsed.responsible_user_id,
				'filter[updated_at][from]': parsed.updated_from,
				'filter[updated_at][to]': parsed.updated_to,
			}),
		}),
		{
			// unknown: `raw` is an untyped HAL envelope; the output schema
			// validates whatever `shape` returns.
			shape: (raw, parsed) => {
				const companies =
					((raw as { _embedded?: { companies?: unknown[] } } | undefined)
						?._embedded?.companies as unknown[] | undefined) ?? [];
				return {
					...(raw as object),
					next_page: pageFrom(
						raw,
						parsed.page,
						companies.length,
						parsed.limit ?? LIST_LIMIT,
					),
				};
			},
			log: (_, result) => ({ count: result._embedded.companies.length }),
		},
	);
