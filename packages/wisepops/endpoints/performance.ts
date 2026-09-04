import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';
import {
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './types';

export const get: WisepopsEndpoints['performanceGet'] = async (ctx, input) => {
	const validatedInput =
		WisepopsEndpointInputSchemas.performanceGet.parse(input);
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['performanceGet']
	>('api2/wisepops', ctx.key, { method: 'GET', query: validatedInput });

	await logEventFromContext(
		ctx,
		'wisepops.performance.get',
		{ ...validatedInput },
		'completed',
	);
	return WisepopsEndpointOutputSchemas.performanceGet.parse(response);
};
