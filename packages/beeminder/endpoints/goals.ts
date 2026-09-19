import { logEventFromContext } from 'corsair/core';
import type { BeeminderEndpoints } from '../index';
import { auditPayload } from './logging';
import { beeminderCall, compactQuery } from './shared';
import type { BeeminderEndpointOutputs } from './types';

/**
 * Gets all active goals for the user.
 *
 * Goals are sorted in descending order of urgency (most urgent first).
 */
export const list: BeeminderEndpoints['goalsList'] = async (ctx, input) => {
	const result = await beeminderCall<BeeminderEndpointOutputs['goalsList']>(
		ctx,
		'users/{username}/goals.json',
		{
			query: compactQuery({
				emaciated: input.emaciated,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'beeminder.goals.list',
		{ ...auditPayload(input, []), returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Gets all archived goals for the user.
 */
export const listArchived: BeeminderEndpoints['goalsListArchived'] = async (
	ctx,
	input,
) => {
	const result = await beeminderCall<
		BeeminderEndpointOutputs['goalsListArchived']
	>(ctx, 'users/{username}/goals/archived.json', {
		query: compactQuery({
			emaciated: input.emaciated,
		}),
	});

	await logEventFromContext(
		ctx,
		'beeminder.goals.listArchived',
		{ ...auditPayload(input, []), returned: result.length },
		'completed',
	);
	return result;
};
