import { logEventFromContext } from 'corsair/core';
import type { BeeminderEndpoints } from '../index';
import { auditPayload } from './logging';
import { beeminderCall, compactQuery } from './shared';
import type { BeeminderEndpointOutputs } from './types';

export const get: BeeminderEndpoints['userGet'] = async (ctx, input) => {
	const result = await beeminderCall<BeeminderEndpointOutputs['userGet']>(
		ctx,
		'users/{username}.json',
		{
			query: compactQuery({
				associations: input.associations,
				diff_since: input.diff_since,
				skinny: input.skinny,
				emaciated: input.emaciated,
				datapoints_count: input.datapoints_count,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'beeminder.user.get',
		auditPayload(input, ['diff_since']),
		'completed',
	);
	return result;
};
