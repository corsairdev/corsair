import { logEventFromContext } from 'corsair/core';
import type { IncidentioEndpoints } from '..';
import { makeIncidentioRequest } from '../client';
import type { IncidentioEndpointOutputs } from './types';

export const get: IncidentioEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeIncidentioRequest<
		IncidentioEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'incidentio.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
