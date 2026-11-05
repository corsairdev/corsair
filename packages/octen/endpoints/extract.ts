import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const extractPost: OctenEndpoints['extractPost'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.extractPost.parse(input);
	const response = await makeOctenRequest('/extract', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.extractPost.parse(response);

	// A 200 response can still contain per-URL failures, so the event records
	// how many URLs were requested rather than implying full success.
	await logEventFromContext(
		ctx,
		'octen.extract.post',
		{ urlCount: parsedInput.urls.length },
		'completed',
	);

	return parsed;
};
