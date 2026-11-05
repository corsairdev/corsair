import { segment } from '../client';
import type { TicketmasterEndpoints } from '../index';
import { call } from './call';
import { readEmbedded, readPage, searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	nextPage,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

export const search: TicketmasterEndpoints['venuesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'venues.search',
			input: Inputs.venuesSearch,
			output: Outputs.venuesSearch,
		},
		input,
		(parsed) => ({ path: '/venues.json', query: searchQuery(parsed) }),
		{
			shape: (raw, parsed) => {
				const page = readPage(raw);
				return {
					venues: readEmbedded(raw, 'venues'),
					page,
					next_page: nextPage(page, parsed),
				};
			},
			log: (parsed, result) => ({
				page: parsed.page ?? 0,
				count: result.venues.length,
				total: result.page?.totalElements ?? undefined,
			}),
		},
	);

export const get: TicketmasterEndpoints['venuesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'venues.get', input: Inputs.venuesGet, output: Outputs.venuesGet },
		input,
		({ id, ...query }) => ({ path: `/venues/${segment(id)}.json`, query }),
		{
			log: ({ id }) => ({ venueId: id }),
		},
	);
