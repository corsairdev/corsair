import type { DemioContext } from '..';
import { segment } from '../client';
import { callDemio } from './call';
import type { DemioEndpointInputs, DemioEndpointOutputs } from './types';
import {
	DemioEventsGetDateInputSchema,
	DemioEventsGetDateResponseSchema,
	DemioEventsGetInputSchema,
	DemioEventsGetResponseSchema,
	DemioEventsListInputSchema,
	DemioEventsListResponseSchema,
	DemioPingInputSchema,
	DemioPingResponseSchema,
} from './types';

/**
 * `active` is a string enum in the specification rather than a boolean, and
 * Demio reads any value other than `false` as `true`. Sending it only when the
 * caller asked for it keeps the default unambiguous.
 */
export const list = (
	ctx: DemioContext,
	input: DemioEndpointInputs['eventsList'],
): Promise<DemioEndpointOutputs['eventsList']> =>
	callDemio(
		ctx,
		{
			event: 'events.list',
			input: DemioEventsListInputSchema,
			output: DemioEventsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/events',
			query: parsed.type ? { type: parsed.type } : undefined,
		}),
		{
			log: (_parsed, result) => ({ events: result.length }),
		},
	);

export const get = (
	ctx: DemioContext,
	input: DemioEndpointInputs['eventsGet'],
): Promise<DemioEndpointOutputs['eventsGet']> =>
	callDemio(
		ctx,
		{
			event: 'events.get',
			input: DemioEventsGetInputSchema,
			output: DemioEventsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/event/${segment(parsed.id)}`,
			query: parsed.active ? { active: 'true' } : undefined,
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				active: parsed.active ?? false,
				dates: result.dates.length,
			}),
		},
	);

export const getDate = (
	ctx: DemioContext,
	input: DemioEndpointInputs['eventsGetDate'],
): Promise<DemioEndpointOutputs['eventsGetDate']> =>
	callDemio(
		ctx,
		{
			event: 'events.getDate',
			input: DemioEventsGetDateInputSchema,
			output: DemioEventsGetDateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/event/${segment(parsed.id)}/date/${segment(parsed.date_id)}`,
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				date_id: parsed.date_id,
				status: result.status,
			}),
		},
	);

export const ping = (
	ctx: DemioContext,
	input: DemioEndpointInputs['pingCheck'],
): Promise<DemioEndpointOutputs['pingCheck']> =>
	callDemio(
		ctx,
		{
			event: 'ping.check',
			input: DemioPingInputSchema,
			output: DemioPingResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/ping' }),
		{
			log: (_parsed, result) => ({
				pong: result.pong,
				sandbox: result.sandbox ?? false,
			}),
		},
	);
