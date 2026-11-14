import type { UserlistEndpoints } from '..';
import { call } from './call';
import {
	UserlistEndpointInputSchemas as Inputs,
	UserlistEndpointOutputSchemas as Outputs,
} from './types';

function ref(value: string | number | Record<string, unknown>): string {
	if (typeof value === 'object') {
		const record = value as { identifier?: string | number };
		return record.identifier === undefined
			? '(embedded)'
			: String(record.identifier);
	}
	return String(value);
}

/**
 * Records an event against a user, a company or both. The event drives
 * segments, campaigns and automation, and its properties are readable in a
 * message template as `{{ event.<key> }}`.
 */
export const create: UserlistEndpoints['eventsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
			label: 'events.create',
		},
		input,
		(body) => ({ method: 'POST', path: '/events', body }),
		{
			identifier: (parsed) => parsed.name,
			log: (parsed) => ({
				name: parsed.name,
				user: parsed.user === undefined ? undefined : ref(parsed.user),
				company: parsed.company === undefined ? undefined : ref(parsed.company),
				properties: parsed.properties
					? Object.keys(parsed.properties).length
					: 0,
			}),
		},
	);
