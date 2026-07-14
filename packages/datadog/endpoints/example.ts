import { logEventFromContext } from 'corsair/core';
import type { DatadogEndpoints } from '..';
import { makeDatadogRequest } from '../client';
import type { DatadogEndpointOutputs } from './types';

export const get: DatadogEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDatadogRequest<
		DatadogEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'datadog.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
