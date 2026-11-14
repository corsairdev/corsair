import { logEventFromContext } from 'corsair/core';
import type { TicketTailorEndpoints } from '..';
import type { TicketTailorEndpointOutputs } from './types';
import { makeTicketTailorRequest } from '../client';

export const get: TicketTailorEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTicketTailorRequest<TicketTailorEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'tickettailor.example.get', { ...input }, 'completed');
	return response;
};
