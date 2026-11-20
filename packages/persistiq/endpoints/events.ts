import type { PersistiqEndpoints } from '..';
import { call } from './call';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersistiqEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
		},
		input,
		({ next_page }) => ({
			method: 'GET',
			path: '/v1/events',
			query: { next_page },
		}),
		{
			log: (_, page) => ({
				count: page.data.length,
				hasMore: page.page.has_more,
			}),
		},
	);
