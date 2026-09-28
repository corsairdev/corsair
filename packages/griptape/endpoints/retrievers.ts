import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const listRetrievers: GriptapeEndpoints['retrieverList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverList']
	>('retrievers', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.retriever.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createRetriever: GriptapeEndpoints['retrieverCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverCreate']
	>('retrievers', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.retriever.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getRetriever: GriptapeEndpoints['retrieverGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverGet']
	>(`retrievers/${input.retriever_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.retriever.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateRetriever: GriptapeEndpoints['retrieverUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverUpdate']
	>(`retrievers/${input.retriever_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.retriever.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const queryRetriever: GriptapeEndpoints['retrieverQuery'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverQuery']
	>(`retrievers/${input.retriever_id}/query`, ctx.key, {
		method: 'POST',
		body: {
			query: input.query,
			...(input.retriever_components_query_args !== undefined
				? {
						retriever_components_query_args:
							input.retriever_components_query_args,
					}
				: {}),
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.retriever.query',
		{ ...input },
		'completed',
	);

	return response;
};

export const listComponents: GriptapeEndpoints['retrieverComponentList'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['retrieverComponentList']
		>('retriever-components', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		await logEventFromContext(
			ctx,
			'griptape.retrieverComponent.list',
			{ ...input },
			'completed',
		);

		return response;
	};

export const createComponent: GriptapeEndpoints['retrieverComponentCreate'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['retrieverComponentCreate']
		>('retriever-components', ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.retrieverComponent.create',
			{ ...input },
			'completed',
		);

		return response;
	};

export const getComponent: GriptapeEndpoints['retrieverComponentGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['retrieverComponentGet']
	>(`retriever-components/${input.retriever_component_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.retrieverComponent.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateComponent: GriptapeEndpoints['retrieverComponentUpdate'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['retrieverComponentUpdate']
		>(`retriever-components/${input.retriever_component_id}`, ctx.key, {
			method: 'PATCH',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.retrieverComponent.update',
			{ ...input },
			'completed',
		);

		return response;
	};
