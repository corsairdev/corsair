import { segment } from '../client';
import type { TicketmasterEndpoints } from '../index';
import { call } from './call';
import { readEmbedded, readPage, searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	nextPage,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

export const search: TicketmasterEndpoints['eventsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.search',
			input: Inputs.eventsSearch,
			output: Outputs.eventsSearch,
		},
		input,
		(parsed) => ({ path: '/events.json', query: searchQuery(parsed) }),
		{
			shape: (raw, parsed) => {
				const page = readPage(raw);
				return {
					events: readEmbedded(raw, 'events'),
					page,
					next_page: nextPage(page, parsed),
				};
			},
			log: (parsed, result) => ({
				page: parsed.page ?? 0,
				count: result.events.length,
				total: result.page?.totalElements ?? undefined,
			}),
		},
	);

export const get: TicketmasterEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'events.get', input: Inputs.eventsGet, output: Outputs.eventsGet },
		input,
		({ id, ...query }) => ({ path: `/events/${segment(id)}.json`, query }),
		{
			log: ({ id }) => ({ eventId: id }),
		},
	);

export const getImages: TicketmasterEndpoints['eventsGetImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.getImages',
			input: Inputs.eventsGetImages,
			output: Outputs.eventsGetImages,
		},
		input,
		({ id, ...query }) => ({
			path: `/events/${segment(id)}/images.json`,
			query,
		}),
		{
			log: ({ id }, result) => ({ eventId: id, count: result.images.length }),
		},
	);
