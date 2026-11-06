import type { TicketmasterEndpoints } from '../index';
import { call } from './call';
import { readEmbedded, searchQuery } from './helpers';
import {
	TicketmasterEndpointInputSchemas as Inputs,
	TicketmasterEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Suggest returns the same `_embedded` envelope as the searches, despite its
 * docs describing the response only as "schema (string)". The live API answers
 * `{ _links, _embedded: { venues, attractions, events, products } }`, so this
 * reads the embedded collections and tolerates any of them being absent.
 *
 * A returned `event` or `product` row also carries its own nested `_embedded`
 * (venues, attractions); those are kept as sent, because they are shaped like
 * the search rows and pinning them would duplicate `EventSchema`.
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
			shape: (raw) => ({
				attractions: readEmbedded(raw, 'attractions'),
				events: readEmbedded(raw, 'events'),
				venues: readEmbedded(raw, 'venues'),
				products: readEmbedded(raw, 'products'),
			}),
			log: (_, result) => ({
				attractions: result.attractions.length,
				events: result.events.length,
				venues: result.venues.length,
				products: result.products.length,
			}),
		},
	);
