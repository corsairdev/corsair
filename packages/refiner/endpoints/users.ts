import type { RefinerEndpoints } from '..';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Identify a user, creating the contact on first sight.
 *
 * Refiner reads any key it does not reserve as a trait, so the payload is the
 * caller's object with only `id`, `email` and `account` treated specially; every
 * other key is forwarded untouched. A trait's type is inferred by Refiner from the
 * value, which is why nothing here coerces one.
 */
export const identify: RefinerEndpoints['identifyUser'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.identify',
			input: Inputs.identifyUser,
			output: Outputs.identifyUser,
		},
		input,
		({ id, email, account, ...traits }) => ({
			method: 'POST',
			path: '/identify-user',
			body: { id, email, account, ...traits },
			// Identifying the same user twice updates the same contact, so a replay
			// writes the same traits again rather than creating a duplicate.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				contactUuid: result.contact_uuid ?? undefined,
			}),
		},
	);

/**
 * Track an event for a user.
 *
 * Refiner creates the user when no contact matches, which is why this is a
 * `write` rather than a read: the call can change who exists in the account.
 */
export const track: RefinerEndpoints['trackEvent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.track',
			input: Inputs.trackEvent,
			output: Outputs.trackEvent,
		},
		input,
		({ id, email, event }) => ({
			method: 'POST',
			path: '/track-event',
			body: { id, email, event },
			// An event is a fact that happened; a replay records it twice, and
			// Refiner offers no idempotency key to collapse the two.
			replayable: false,
		}),
		{
			log: (parsed) => ({ event: parsed.event }),
		},
	);
