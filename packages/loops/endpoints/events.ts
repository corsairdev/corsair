import type { LoopsEndpoints } from '..';
import { call, withCustomProperties } from './call';
import {
	LoopsEndpointInputSchemas as Inputs,
	LoopsEndpointOutputSchemas as Outputs,
} from './types';

export const send: LoopsEndpoints['eventsSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.send',
			input: Inputs.eventsSend,
			output: Outputs.eventsSend,
		},
		input,
		({
			eventName,
			email,
			userId,
			eventProperties,
			mailingLists,
			idempotencyKey,
			...rest
		}) => ({
			method: 'POST',
			path: '/v1/events/send',
			body: {
				eventName,
				email,
				userId,
				eventProperties,
				mailingLists,
				...withCustomProperties(rest),
			},
			idempotencyKey,
		}),
		{
			log: (parsed) => ({ eventName: parsed.eventName, userId: parsed.userId }),
		},
	);
