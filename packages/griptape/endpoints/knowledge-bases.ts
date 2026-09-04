import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['knowledgeBaseList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseList']
	>('knowledge-bases', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['knowledgeBaseCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseCreate']
	>('knowledge-bases', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['knowledgeBaseGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseGet']
	>(`knowledge-bases/${input.knowledge_base_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['knowledgeBaseUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseUpdate']
	>(`knowledge-bases/${input.knowledge_base_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['knowledgeBaseDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseDelete']
	>(`knowledge-bases/${input.knowledge_base_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const query: GriptapeEndpoints['knowledgeBaseQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseQuery']
	>(`knowledge-bases/${input.knowledge_base_id}/query`, ctx.key, {
		method: 'POST',
		body: {
			query: input.query,
			...(input.query_args !== undefined
				? { query_args: input.query_args }
				: {}),
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.query',
		{ ...input },
		'completed',
	);

	return response;
};

export const search: GriptapeEndpoints['knowledgeBaseSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseSearch']
	>(`knowledge-bases/${input.knowledge_base_id}/search`, ctx.key, {
		method: 'POST',
		body: {
			query: input.query,
			...(input.query_args !== undefined
				? { query_args: input.query_args }
				: {}),
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.search',
		{ ...input },
		'completed',
	);

	return response;
};

export const listQueries: GriptapeEndpoints['knowledgeBaseListQueries'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['knowledgeBaseListQueries']
		>(`knowledge-bases/${input.knowledge_base_id}/queries`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'griptape.knowledgeBase.listQueries',
			{ ...input },
			'completed',
		);

		return response;
	};

export const listSearches: GriptapeEndpoints['knowledgeBaseListSearches'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['knowledgeBaseListSearches']
		>(`knowledge-bases/${input.knowledge_base_id}/searches`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'griptape.knowledgeBase.listSearches',
			{ ...input },
			'completed',
		);

		return response;
	};

export const getSearch: GriptapeEndpoints['knowledgeBaseGetSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseGetSearch']
	>(`knowledge-base-searches/${input.knowledge_base_search_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.getSearch',
		{ ...input },
		'completed',
	);

	return response;
};

export const createJob: GriptapeEndpoints['knowledgeBaseCreateJob'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseCreateJob']
	>(`knowledge-bases/${input.knowledge_base_id}/knowledge-base-jobs`, ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.createJob',
		{ ...input },
		'completed',
	);

	return response;
};

export const listJobs: GriptapeEndpoints['knowledgeBaseListJobs'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseListJobs']
	>(`knowledge-bases/${input.knowledge_base_id}/knowledge-base-jobs`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.listJobs',
		{ ...input },
		'completed',
	);

	return response;
};

export const getJob: GriptapeEndpoints['knowledgeBaseGetJob'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['knowledgeBaseGetJob']
	>(`knowledge-base-jobs/${input.knowledge_base_job_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.knowledgeBase.getJob',
		{ ...input },
		'completed',
	);

	return response;
};
