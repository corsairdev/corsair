import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import type { TallyEndpointOutputs } from './types';
import { makeTallyRequest } from '../client';

export const list: TallyEndpoints['questionsList'] = async (ctx, input) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['questionsList']
	>(`forms/${input.formId}/questions`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'tally.questions.list',
		{ ...input },
		'completed',
	);
	return result;
};
