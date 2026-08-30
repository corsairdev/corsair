import { logEventFromContext } from 'corsair/core';
import type { BeeminderEndpoints } from '../index';
import { auditPayload } from './logging';
import { beeminderCall, compactBody } from './shared';
import type { BeeminderEndpointOutputs } from './types';

/**
 * Creates a charge against a Beeminder user.
 *
 * The amount must be >= $1.00 USD.
 */
export const create: BeeminderEndpoints['chargesCreate'] = async (
	ctx,
	input,
) => {
	const result = await beeminderCall<BeeminderEndpointOutputs['chargesCreate']>(
		ctx,
		'charges.json',
		{
			method: 'POST',
			body: compactBody({ ...input }),
		},
	);

	await logEventFromContext(
		ctx,
		'beeminder.charges.create',
		auditPayload(input, ['user_id', 'amount']),
		'completed',
	);
	return result;
};
