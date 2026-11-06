import type { Mem0Endpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	Mem0EndpointInputSchemas as Inputs,
	Mem0EndpointOutputSchemas as Outputs,
} from './types';

export const get: Mem0Endpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
		},
		input,
		({ event_id }) => ({
			method: 'GET',
			path: `/v1/event/${segment(event_id)}/`,
		}),
		{
			log: (_, result) => ({
				eventId: result.id,
				eventType: result.event_type ?? undefined,
				status: result.status ?? undefined,
				latencyMs: result.latency ?? undefined,
			}),
		},
	);

export const list: Mem0Endpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
		},
		input,
		({ page, page_size }) => ({
			method: 'GET',
			path: '/v1/events/',
			query: { page, page_size },
		}),
		{
			log: (_, result) => ({
				count: result.count,
				page: result.results.length,
			}),
		},
	);
