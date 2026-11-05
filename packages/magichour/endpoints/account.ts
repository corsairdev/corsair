import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const get: MagicHourEndpoints['accountGet'] = async (ctx, input) => {
	MagicHourEndpointInputSchemas.accountGet.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['accountGet']
	>('/v1/account', ctx.key, { method: 'GET' });

	const parsed = MagicHourEndpointOutputSchemas.accountGet.parse(response);

	// The account payload carries the owner's email (PII), so the event records
	// only that the call completed, not any returned field.
	await logEventFromContext(ctx, 'magichour.account.get', {}, 'completed');

	return parsed;
};
