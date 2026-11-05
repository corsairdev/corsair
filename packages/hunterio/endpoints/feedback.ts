import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const create: HunterioEndpoints['feedbackCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.feedbackCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['feedbackCreate']
	>('/feedback', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.feedbackCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.feedback.create',
		{ feedbackType: parsed.feedback_type },
		'completed',
	);

	return parsedResponse;
};
