import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['assistantList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantList']
	>('assistants', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['assistantGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantGet']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['assistantCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantCreate']
	>('assistants', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['assistantUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantUpdate']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['assistantDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantDelete']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.assistant.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const createRun: GriptapeEndpoints['assistantRunCreate'] = async (
	ctx,
	input,
) => {
	// Note: the `model` field (and any credentials referenced by knowledge
	// bases/tools) is executed server-side by Griptape Cloud's Assistant
	// orchestration API — this is a resource-API call, not a direct LLM
	// provider call, so it intentionally does not route via llm.corsair.dev.
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantRunCreate']
	>(`assistants/${input.assistant_id}/runs`, ctx.key, {
		method: 'POST',
		body: {
			args: input.args,
			input: input.input,
			thread_id: input.thread_id,
			new_thread: input.new_thread,
			stream: input.stream,
			model: input.model,
			knowledge_base_ids: input.knowledge_base_ids,
			retriever_ids: input.retriever_ids,
			ruleset_ids: input.ruleset_ids,
			structure_ids: input.structure_ids,
			tool_ids: input.tool_ids,
			additional_knowledge_base_ids: input.additional_knowledge_base_ids,
			additional_retriever_ids: input.additional_retriever_ids,
			additional_ruleset_ids: input.additional_ruleset_ids,
			additional_structure_ids: input.additional_structure_ids,
			additional_tool_ids: input.additional_tool_ids,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.assistantRun.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const listRuns: GriptapeEndpoints['assistantRunList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantRunList']
	>(`assistants/${input.assistant_id}/runs`, ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.assistantRun.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const getRun: GriptapeEndpoints['assistantRunGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantRunGet']
	>(`assistant-runs/${input.assistant_run_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.assistantRun.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const cancelRun: GriptapeEndpoints['assistantRunCancel'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantRunCancel']
	>(`assistant-runs/${input.assistant_run_id}/cancel`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'griptape.assistantRun.cancel',
		{ ...input },
		'completed',
	);

	return response;
};

export const listEvents: GriptapeEndpoints['assistantRunEvents'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['assistantRunEvents']
	>(`assistant-runs/${input.assistant_run_id}/events`, ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.assistantRun.events',
		{ ...input },
		'completed',
	);

	return response;
};
