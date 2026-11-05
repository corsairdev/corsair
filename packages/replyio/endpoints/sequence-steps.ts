import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const list: ReplyioEndpoint<'stepsList'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['stepsList']
	>(`sequences/${input.sequenceId}/steps`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'replyio.steps.list',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const get: ReplyioEndpoint<'stepsGet'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<ReplyioEndpointOutputs['stepsGet']>(
		`sequences/${input.sequenceId}/steps/${input.stepId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'replyio.steps.get',
		{ sequenceId: input.sequenceId, stepId: input.stepId },
		'completed',
	);
	return response;
};

export const create: ReplyioEndpoint<'stepsCreate'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['stepsCreate']
	>(`sequences/${input.sequenceId}/steps`, ctx.key, {
		method: 'POST',
		body: input.step,
	});

	await logEventFromContext(
		ctx,
		'replyio.steps.create',
		{ sequenceId: input.sequenceId, type: input.step.type },
		'completed',
	);
	return response;
};
