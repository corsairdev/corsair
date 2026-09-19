import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['memoryStoresCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['memoryStoresCreate']
	>('memory_stores', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.memoryStores.create',
		{ title: input.title },
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['memoryStoresGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['memoryStoresGet']
	>(`memory_stores/${input.memory_store_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.memoryStores.get',
		{ memory_store_id: input.memory_store_id },
		'completed',
	);

	return response;
};

export const list: SynthflowAiEndpoints['memoryStoresList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.title !== undefined) query.title = input.title;
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['memoryStoresList']
	>('memory_stores', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.memoryStores.list',
		input ? { title: input.title } : {},
		'completed',
	);

	return response;
};

export const update: SynthflowAiEndpoints['memoryStoresUpdate'] = async (
	ctx,
	input,
) => {
	const { memory_store_id, ...body } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['memoryStoresUpdate']
	>(`memory_stores/${memory_store_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.memoryStores.update',
		{ memory_store_id },
		'completed',
	);

	return response;
};

export const deleteMemoryStore: SynthflowAiEndpoints['memoryStoresDelete'] =
	async (ctx, input) => {
		const response = await makeSynthflowAiRequest<
			SynthflowAiEndpointOutputs['memoryStoresDelete']
		>(`memory_stores/${input.memory_store_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'synthflowai.memoryStores.delete',
			{ memory_store_id: input.memory_store_id },
			'completed',
		);

		return response;
	};

export const attachToAgent: SynthflowAiEndpoints['memoryStoresAttachToAgent'] =
	async (ctx, input) => {
		const response = await makeSynthflowAiRequest<
			SynthflowAiEndpointOutputs['memoryStoresAttachToAgent']
		>(`memory_stores/${input.memory_store_id}/attach`, ctx.key, {
			method: 'POST',
			query: {
				model_id: input.model_id,
			},
		});

		await logEventFromContext(
			ctx,
			'synthflowai.memoryStores.attachToAgent',
			{
				memory_store_id: input.memory_store_id,
				model_id: input.model_id,
			},
			'completed',
		);

		return response;
	};

export const detachFromAgent: SynthflowAiEndpoints['memoryStoresDetachFromAgent'] =
	async (ctx, input) => {
		const response = await makeSynthflowAiRequest<
			SynthflowAiEndpointOutputs['memoryStoresDetachFromAgent']
		>(`memory_stores/${input.memory_store_id}/detach`, ctx.key, {
			method: 'POST',
			query: {
				model_id: input.model_id,
			},
		});

		await logEventFromContext(
			ctx,
			'synthflowai.memoryStores.detachFromAgent',
			{
				memory_store_id: input.memory_store_id,
				model_id: input.model_id,
			},
			'completed',
		);

		return response;
	};
