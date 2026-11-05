import { asRecord } from 'corsair/core';
import type { TicketmasterEndpoints } from '..';
import { call } from './call';
import { searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Suggest has no `_embedded` envelope: it answers `{ attractions, events,
 * venues, products }` at the top level, and the docs describe the response only
 * as a schema string, so a missing collection is an empty list rather than a
 * parse failure.
 */
export const get: TicketmasterEndpoints['suggestGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suggest.get',
			input: Inputs.suggestGet,
			output: Outputs.suggestGet,
		},
		input,
		(parsed) => ({ path: '/suggest.json', query: searchQuery(parsed) }),
		{
			shape: (raw) => {
				const body = asRecord(raw);
				return {
					attractions: body?.attractions,
					events: body?.events,
					venues: body?.venues,
					products: body?.products,
					_links: body?._links,
				};
			},
			log: (_, result) => ({
				attractions: result.attractions?.length ?? 0,
				events: result.events?.length ?? 0,
				venues: result.venues?.length ?? 0,
				products: result.products?.length ?? 0,
			}),
		},
	);
