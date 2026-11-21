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
		(query) => ({ method: 'GET', path: '/v1/events', query }),
		{
			log: (_, page) => ({
				count: page.events.length,
				hasMore: page.has_more ?? undefined,
			}),
		},
	);
