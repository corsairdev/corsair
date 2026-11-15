import { logEventFromContext } from 'corsair/core';
import type { NeverBounceEndpoints } from '..';
import { makeNeverBounceRequest } from '../client';
import {
	NeverBounceEndpointInputSchemas,
	NeverBounceEndpointOutputSchemas,
} from './types';

export const check: NeverBounceEndpoints['check'] = async (ctx, input) => {
	const parsed = NeverBounceEndpointInputSchemas.check.parse(input);
	const response = await makeNeverBounceRequest(ctx.key, parsed);
	const output = NeverBounceEndpointOutputSchemas.check.parse(response);
	await logEventFromContext(ctx, 'neverbounce.single.check', {}, 'completed');
	return output;
};
