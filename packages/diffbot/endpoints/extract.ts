import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const getArticle: DiffbotEndpoints['getArticle'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getArticle']>>
	>('article', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
			paging: input.paging,
			maxTags: input.maxTags,
			naturalLanguage: input.naturalLanguage,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getArticle',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getProduct: DiffbotEndpoints['getProduct'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getProduct']>>
	>('product', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
			discussion: input.discussion,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getProduct',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getAnalyze: DiffbotEndpoints['getAnalyze'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getAnalyze']>>
	>('analyze', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
			fallback: input.fallback,
			discussion: input.discussion,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getAnalyze',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getImage: DiffbotEndpoints['getImage'] = async (ctx, input) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getImage']>>
	>('image', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getImage',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getVideo: DiffbotEndpoints['getVideo'] = async (ctx, input) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getVideo']>>
	>('video', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getVideo',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getDiscussion: DiffbotEndpoints['getDiscussion'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getDiscussion']>>
	>('discussion', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
			maxTags: input.maxTags,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getDiscussion',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getEvent: DiffbotEndpoints['getEvent'] = async (ctx, input) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getEvent']>>
	>('event', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.getEvent',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const extractList: DiffbotEndpoints['extractList'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['extractList']>>
	>('list', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.extractList',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const extractJob: DiffbotEndpoints['extractJob'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['extractJob']>>
	>('job', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			fields: input.fields,
			timeout: input.timeout,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.extractJob',
		{ url: input.url },
		'completed',
	);
	return response;
};
