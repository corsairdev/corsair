import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const create: StannpEndpoints['eventsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		(
			{ recipient_id, name, value, conversion, data, ref, idempotencyKey },
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/recipientEvents/create',
			form: { recipient_id, name, value, conversion, data, ref },
			idempotencyKey,
		}),
		{
			log: ({ name }, result) => ({ name, eventId: result }),
		},
	);
