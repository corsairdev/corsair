import type { UserflowEndpoints } from '..';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Track an event. At least one of `user_id` and `group_id` is required — the
 * input schema enforces that, so an unattributed event never reaches the API.
 *
 * There is no list endpoint for events in the documented API; they arrive
 * through webhooks instead, so only tracking is wrapped here.
 */
export const track: UserflowEndpoints['eventsTrack'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.track',
			input: Inputs.eventsTrack,
			output: Outputs.eventsTrack,
		},
		input,
		({ name, user_id, group_id, attributes, time }) => ({
			method: 'POST',
			path: '/events',
			body: { name, user_id, group_id, attributes, time },
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
				user: parsed.user_id,
				group: parsed.group_id,
			}),
		},
	);
