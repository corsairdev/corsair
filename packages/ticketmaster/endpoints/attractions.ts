import { segment } from '../client';
import type { TicketmasterEndpoints } from '../index';
import { call } from './call';
import { readEmbedded, readPage, searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	nextPage,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

export const search: TicketmasterEndpoints['attractionsSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attractions.search',
			input: Inputs.attractionsSearch,
			output: Outputs.attractionsSearch,
		},
		input,
		(parsed) => ({ path: '/attractions.json', query: searchQuery(parsed) }),
		{
			shape: (raw, parsed) => {
				const page = readPage(raw);
				return {
					attractions: readEmbedded(raw, 'attractions'),
					page,
					next_page: nextPage(page, parsed),
				};
			},
			log: (parsed, result) => ({
				page: parsed.page ?? 0,
				count: result.attractions.length,
				total: result.page?.totalElements ?? undefined,
			}),
		},
	);

export const get: TicketmasterEndpoints['attractionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attractions.get',
			input: Inputs.attractionsGet,
			output: Outputs.attractionsGet,
		},
		input,
		({ id, ...query }) => ({ path: `/attractions/${segment(id)}.json`, query }),
		{
			log: ({ id }) => ({ attractionId: id }),
		},
	);
