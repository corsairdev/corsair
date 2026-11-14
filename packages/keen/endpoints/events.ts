import type { KeenEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	KeenEndpointInputSchemas as Inputs,
	KeenEndpointOutputSchemas as Outputs,
} from './types';

export const record: KeenEndpoints['eventsRecord'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.record',
			input: Inputs.eventsRecord,
			output: Outputs.eventsRecord,
		},
		input,
		({ collection, event }) => ({
			method: 'POST',
			path: `/events/${segment(collection)}`,
			body: event,
		}),
		// The event body is not logged: it holds whatever the caller recorded.
		{
			log: ({ collection }, result) => ({
				collection,
				created: result.created,
			}),
		},
	);

export const recordMany: KeenEndpoints['eventsRecordMany'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.recordMany',
			input: Inputs.eventsRecordMany,
			output: Outputs.eventsRecordMany,
		},
		input,
		({ events }) => ({
			method: 'POST',
			path: '/events',
			body: events,
		}),
		{
			log: (_, result) => ({
				collections: Object.keys(result).length,
				recorded: Object.values(result).reduce(
					(total, entries) =>
						total + entries.filter(({ success }) => success).length,
					0,
				),
			}),
		},
	);
