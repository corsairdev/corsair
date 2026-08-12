import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const getDaily: HuggingFaceEndpoints['papersGetDaily'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/daily_papers', {
		method: 'GET',
		query: { date: input.date },
	});
	await logEventFromContext(
		ctx,
		'huggingface.papers.getDaily',
		summarize(input),
		'completed',
	);
	return response;
};

export const search: HuggingFaceEndpoints['papersSearch'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/papers/search', {
		method: 'GET',
		query: { q: input.q, limit: input.limit },
	});
	await logEventFromContext(
		ctx,
		'huggingface.papers.search',
		summarize(input),
		'completed',
	);
	return response;
};

export const createIndex: HuggingFaceEndpoints['papersCreateIndex'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/papers/index', {
		method: 'POST',
		body: { arxivId: input.paperId },
	});
	await logEventFromContext(
		ctx,
		'huggingface.papers.createIndex',
		summarize(input),
		'completed',
	);
	return response;
};

export const claimAuthorship: HuggingFaceEndpoints['papersClaimAuthorship'] =
	async (ctx, input) => {
		const response = await req(ctx, '/api/settings/papers/claim', {
			method: 'POST',
			body: { paperId: input.paperId, ...input.extra },
		});
		await logEventFromContext(
			ctx,
			'huggingface.papers.claimAuthorship',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createComment: HuggingFaceEndpoints['papersCreateComment'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/api/papers/${encodeURIComponent(input.paperId)}/comment`,
			{
				method: 'POST',
				body: { comment: input.comment },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.papers.createComment',
			summarize(input),
			'completed',
		);
		return response;
	};

export const createCommentReply: HuggingFaceEndpoints['papersCreateCommentReply'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/api/papers/${encodeURIComponent(input.paperId)}/comment/${encodeURIComponent(input.commentId)}/reply`,
			{
				method: 'POST',
				body: { comment: input.comment },
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.papers.createCommentReply',
			summarize(input),
			'completed',
		);
		return response;
	};
