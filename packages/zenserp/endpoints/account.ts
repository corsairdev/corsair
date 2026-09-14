import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import { StatusInputSchema, StatusResponseSchema } from './types';

export const getStatus: ZenserpEndpoints['accountGetStatus'] = async (
	ctx,
	rawInput,
) => {
	StatusInputSchema.parse(rawInput);
	const response = StatusResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/status', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'zenserp.account.getStatus',
		{ remainingRequests: response.remaining_requests },
		'completed',
	);
	return response;
};
