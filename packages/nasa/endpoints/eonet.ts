import type { NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * EONET labels its JSON `application/rss+xml`, so corsair/http hands it back as
 * text and `call` parses it. The GeoJSON variants on the same host answer a
 * different shape and are not wrapped.
 */
export const events: NasaEndpoints['eonetEvents'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'eonet.events',
			input: Inputs.eonetEvents,
			output: Outputs.eonetEvents,
		},
		input,
		({
			source,
			category,
			status,
			limit,
			days,
			start,
			end,
			magID,
			magMin,
			magMax,
			bbox,
		}) => ({
			method: 'GET',
			host: 'eonet',
			path: '/api/v3/events',
			query: {
				source: source?.join(','),
				category: category?.join(','),
				status,
				limit,
				days,
				start,
				end,
				magID,
				magMin,
				magMax,
				bbox,
			},
		}),
		{ log: (_, result) => ({ count: result.events.length }) },
	);

/**
 * An unknown ID answers a 500 with an HTML body, not a 404, so a bad identifier
 * reads as a server error.
 */
export const event: NasaEndpoints['eonetEvent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'eonet.event',
			input: Inputs.eonetEvent,
			output: Outputs.eonetEvent,
		},
		input,
		({ eventId }) => ({
			method: 'GET',
			host: 'eonet',
			path: `/api/v3/events/${encodeURIComponent(eventId)}`,
		}),
		{ log: ({ eventId }) => ({ eventId }) },
	);

export const categories: NasaEndpoints['eonetCategories'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'eonet.categories',
			input: Inputs.eonetCategories,
			output: Outputs.eonetCategories,
		},
		input,
		() => ({ method: 'GET', host: 'eonet', path: '/api/v3/categories' }),
		{ log: (_, result) => ({ count: result.categories.length }) },
	);
