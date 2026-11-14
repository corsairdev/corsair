import type { RetentlyEndpoints } from '..';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const send: RetentlyEndpoints['surveySend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'survey.send',
			input: Inputs.surveySend,
			output: Outputs.surveySend,
		},
		input,
		({ campaign, delay, subscribers }) => ({
			method: 'POST',
			path: '/survey',
			body:
				delay === undefined
					? { campaign, subscribers }
					: { campaign, delay, subscribers },
			// Queuing the same customers twice sends them two surveys, and the
			// response is an empty `queued` acknowledgement with no ID to dedupe on.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				recipients: parsed.subscribers.length,
				status: result.status ?? undefined,
			}),
		},
	);
