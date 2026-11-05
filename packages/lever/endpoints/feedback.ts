import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withFeedbackPath = (
	opportunityId: string,
	feedbackId?: string,
): string => {
	const base = leverPathParameter(
		'/opportunities/{opportunityId}/feedback',
		'opportunityId',
		opportunityId,
	);
	return feedbackId === undefined
		? base
		: leverPathParameter(`${base}/{feedbackId}`, 'feedbackId', feedbackId);
};

export const listFeedback: LeverEndpoints['listFeedback'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listFeedback']>(
		ctx,
		withFeedbackPath(input.opportunityId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.feedback.list', input, 'completed');
	return response;
};

export const retrieveFeedback: LeverEndpoints['retrieveFeedback'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveFeedback']
	>(ctx, withFeedbackPath(input.opportunityId, input.feedbackId), {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'lever.feedback.retrieve', input, 'completed');
	return response;
};

export const createFeedback: LeverEndpoints['createFeedback'] = async (
	ctx,
	input,
) => {
	const { opportunityId, perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createFeedback']
	>(ctx, withFeedbackPath(opportunityId), {
		method: 'POST',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.feedback.create', input, 'completed');
	return response;
};

export const updateFeedback: LeverEndpoints['updateFeedback'] = async (
	ctx,
	input,
) => {
	const { opportunityId, feedbackId, perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateFeedback']
	>(ctx, withFeedbackPath(opportunityId, feedbackId), {
		method: 'PUT',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.feedback.update', input, 'completed');
	return response;
};

export const deleteFeedback: LeverEndpoints['deleteFeedback'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deleteFeedback']
	>(ctx, withFeedbackPath(input.opportunityId, input.feedbackId), {
		method: 'DELETE',
		query: { perform_as: input.perform_as },
	});
	await logEventFromContext(ctx, 'lever.feedback.delete', input, 'completed');
	return response;
};
