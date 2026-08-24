import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const getHardware: HuggingFaceEndpoints['jobsGetHardware'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/jobs/hardware', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'huggingface.jobs.getHardware',
		summarize(input),
		'completed',
	);
	return response;
};
