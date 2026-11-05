import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withInterviewPath = (
	opportunityId: string,
	interviewId?: string,
): string => {
	let path = leverPathParameter(
		'/opportunities/{opportunityId}/interviews',
		'opportunityId',
		opportunityId,
	);
	return interviewId === undefined
		? path
		: leverPathParameter(`${path}/{interviewId}`, 'interviewId', interviewId);
};

export const listInterviews: LeverEndpoints['listInterviews'] = async (
	ctx,
	input,
) => {
	const { opportunityId, expand, ...query } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listInterviews']
	>(ctx, withInterviewPath(opportunityId), {
		method: 'GET',
		query: { ...query, expand },
	});
	await logEventFromContext(ctx, 'lever.interviews.list', input, 'completed');
	return response;
};

export const retrieveInterview: LeverEndpoints['retrieveInterview'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveInterview']
	>(ctx, withInterviewPath(input.opportunityId, input.interviewId), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'lever.interviews.retrieve',
		input,
		'completed',
	);
	return response;
};

export const createInterview: LeverEndpoints['createInterview'] = async (
	ctx,
	input,
) => {
	const { opportunityId, perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createInterview']
	>(ctx, withInterviewPath(opportunityId), {
		method: 'POST',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.interviews.create', input, 'completed');
	return response;
};

export const updateInterview: LeverEndpoints['updateInterview'] = async (
	ctx,
	input,
) => {
	const { opportunityId, interviewId, perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateInterview']
	>(ctx, withInterviewPath(opportunityId, interviewId), {
		method: 'PUT',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.interviews.update', input, 'completed');
	return response;
};

export const deleteInterview: LeverEndpoints['deleteInterview'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deleteInterview']
	>(ctx, withInterviewPath(input.opportunityId, input.interviewId), {
		method: 'DELETE',
		query: { perform_as: input.perform_as },
	});
	await logEventFromContext(ctx, 'lever.interviews.delete', input, 'completed');
	return response;
};
