import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

export const list: SpondyrEndpoints['eventTypesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'eventTypes.list',
			input: SpondyrEndpointInputSchemas.listEventTypes,
			output: SpondyrEndpointOutputSchemas.listEventTypes,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'EventTypes',
			query: { TransactionType: parsed.transaction_type },
		}),
		{
			log: (parsed, result) => ({
				transaction_type: parsed.transaction_type,
				event_types: result.Data.length,
			}),
		},
	);

export const get: SpondyrEndpoints['eventTypesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'eventTypes.get',
			input: SpondyrEndpointInputSchemas.getEventType,
			output: SpondyrEndpointOutputSchemas.getEventType,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'EventType',
			query: { EventType: parsed.event_type },
		}),
		{ log: (parsed) => ({ event_type: parsed.event_type }) },
	);

const writes = adminWrites({
	resource: 'EventType',
	event: 'eventTypes',
	create: {
		input: SpondyrEndpointInputSchemas.createEventType,
		output: SpondyrEndpointOutputSchemas.createEventType,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateEventType,
		output: SpondyrEndpointOutputSchemas.updateEventType,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteEventType,
		output: SpondyrEndpointOutputSchemas.deleteEventType,
	},
	body: (parsed) => ({
		TransactionType: parsed.transaction_type,
		Name: parsed.name,
		...(parsed.event_type === undefined
			? {}
			: { EventType: parsed.event_type }),
	}),
	name: (parsed) => String(parsed.event_type),
	logCreate: (parsed) => ({
		transaction_type: parsed.transaction_type,
		event_type: parsed.name ?? parsed.event_type,
	}),
});

export const create: SpondyrEndpoints['eventTypesCreate'] = writes.create;
export const update: SpondyrEndpoints['eventTypesUpdate'] = writes.update;
export const remove: SpondyrEndpoints['eventTypesDelete'] = writes.remove;
