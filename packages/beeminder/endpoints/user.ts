import { logEventFromContext } from 'corsair/core';
import type { BeeminderEndpoints } from '../index';
import { beeminderCall } from './shared';
import type { BeeminderEndpointOutputs } from './types';

/**
 * Gets information about the authenticated user.
 *
 * Uses "me" as the username alias, which Beeminder expands to the
 * authenticated user's username.
 */
export const get: BeeminderEndpoints['userGet'] = async (ctx) => {
	const result = await beeminderCall<BeeminderEndpointOutputs['userGet']>(
		ctx,
		'users/{username}.json',
	);

	await logEventFromContext(
		ctx,
		'beeminder.user.get',
		{ recorded: 'attempt only' },
		'completed',
	);
	return result;
};
