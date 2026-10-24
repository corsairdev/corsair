import { logEventFromContext } from 'corsair/core';
import type { TimelyEndpoints } from '..';
import { makeTimelyRequest } from '../client';
import type { TimelyEndpointOutputs } from './types';
import {
	TimelyEndpointInputSchemas,
	TimelyEndpointOutputSchemas,
} from './types';

export const get: TimelyEndpoints['exampleGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.exampleGet.parse(input);

	const response = await makeTimelyRequest<TimelyEndpointOutputs['exampleGet']>(
		`example/${parsedInput.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsedResponse = TimelyEndpointOutputSchemas.exampleGet.parse(response);

	await logEventFromContext(
		ctx,
		'timely.example.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
