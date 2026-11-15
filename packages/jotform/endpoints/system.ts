import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const getPlan: JotformEndpoints['system.getPlan'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['system.getPlan'].parse(input);
	const response = await makeJotformRequest(
		`/system/plan/${encodeURIComponent(parsedInput.planName)}`,
		undefined, // keyless public route per Jotform documentation
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['system.getPlan'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.system.getPlan',
		{ planName: parsedInput.planName },
		'completed',
	);
	return parsed;
};
