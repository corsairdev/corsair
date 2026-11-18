import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

export const listPostings: LeverEndpoints['listPostings'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listPostings']>(
		ctx,
		'/postings',
		{
			method: 'GET',
			query: input,
		},
	);
	await logEventFromContext(ctx, 'lever.postings.list', input, 'completed');
	return response;
};

export const retrievePosting: LeverEndpoints['retrievePosting'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrievePosting']
	>(
		ctx,
		leverPathParameter('/postings/{postingId}', 'postingId', input.postingId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.postings.retrieve', input, 'completed');
	return response;
};

export const listDeletedPostings: LeverEndpoints['listDeletedPostings'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listDeletedPostings']
		>(ctx, '/postings/deleted', {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'lever.postings.listDeleted',
			input,
			'completed',
		);
		return response;
	};

export const createPosting: LeverEndpoints['createPosting'] = async (
	ctx,
	input,
) => {
	const { perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createPosting']
	>(ctx, '/postings', {
		method: 'POST',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.postings.create', input, 'completed');
	return response;
};

export const updatePosting: LeverEndpoints['updatePosting'] = async (
	ctx,
	input,
) => {
	const { postingId, perform_as, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updatePosting']
	>(ctx, leverPathParameter('/postings/{postingId}', 'postingId', postingId), {
		method: 'POST',
		body,
		query: { perform_as },
	});
	await logEventFromContext(ctx, 'lever.postings.update', input, 'completed');
	return response;
};

export const retrievePostingApplicationQuestions: LeverEndpoints['retrievePostingApplicationQuestions'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrievePostingApplicationQuestions']
		>(
			ctx,
			leverPathParameter(
				'/postings/{postingId}/apply',
				'postingId',
				input.postingId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'lever.postings.retrieveApplicationQuestions',
			input,
			'completed',
		);
		return response;
	};

export const listPostingUsers: LeverEndpoints['listPostingUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listPostingUsers']
	>(
		ctx,
		leverPathParameter(
			'/postings/{postingId}/users',
			'postingId',
			input.postingId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'lever.postings.listUsers',
		input,
		'completed',
	);
	return response;
};

export const applyToPosting: LeverEndpoints['applyToPosting'] = async (
	ctx,
	input,
) => {
	const { postingId, send_confirmation_email, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['applyToPosting']
	>(
		ctx,
		leverPathParameter('/postings/{postingId}/apply', 'postingId', postingId),
		{ method: 'POST', body, query: { send_confirmation_email } },
	);
	await logEventFromContext(ctx, 'lever.postings.apply', input, 'completed');
	return response;
};
