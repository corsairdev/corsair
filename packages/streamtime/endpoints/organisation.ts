import { logEventFromContext } from 'corsair/core';
import type { StreamtimeEndpoints } from '..';
import { makeStreamtimeRequest } from '../client';
import {
	StreamtimeEndpointInputSchemas,
	StreamtimeEndpointOutputSchemas,
} from './types';

export const getOrganisation: StreamtimeEndpoints['getOrganisation'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		StreamtimeEndpointInputSchemas.getOrganisation.parse(input);
	const response = await makeStreamtimeRequest<unknown>(
		'organisation',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed =
		StreamtimeEndpointOutputSchemas.getOrganisation.parse(response);
	await logEventFromContext(
		ctx,
		'streamtime.organisation.get',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
