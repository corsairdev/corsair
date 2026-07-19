import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getInterview: WorkdayEndpoints['getInterview'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getInterview']
	>('v1/interview/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.interview.getInterview',
		input ?? {},
		'completed',
	);
	return response;
};

export const getInterviewFeedback2: WorkdayEndpoints['getInterviewFeedback2'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getInterviewFeedback2']
		>('v1/interview/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.interview.getInterviewFeedback2',
			input ?? {},
			'completed',
		);
		return response;
	};
