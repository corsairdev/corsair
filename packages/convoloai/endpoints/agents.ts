import { logEventFromContext } from 'corsair/core';
import { makeConvoloAiRequest } from '../client';
import type { ConvoloAiEndpointOutputs, ConvoloAiEndpoints } from '../index';

export const list: ConvoloAiEndpoints['agentList'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentList']
	>('api/v1/agents', ctx.key, {
		method: 'GET',
		query: {
			searchString: input.searchString,
			page: input.page,
			itemsPerPage: input.itemsPerPage,
			sortBy: input.sortBy,
			sortDirection: input.sortDirection,
			status: input.status,
			withStats: input.withStats,
			withActiveWidgetsData: input.withActiveWidgetsData,
			withDeletedWidgetsData: input.withDeletedWidgetsData,
			dateFrom: input.dateFrom,
			dateTo: input.dateTo,
			isDeleted: input.isDeleted,
			isDelegate: input.isDelegate,
			teamMemberOnly: input.teamMemberOnly,
			fullAccountAccess: input.fullAccountAccess,
			delegateAccessToDialerAgentId: input.delegateAccessToDialerAgentId,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const listV2: ConvoloAiEndpoints['agentListV2'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentListV2']
	>('api/v2/agents', ctx.key, {
		method: 'GET',
		query: {
			searchString: input.searchString,
			page: input.page,
			itemsPerPage: input.itemsPerPage,
			sortBy: input.sortBy,
			sortDirection: input.sortDirection,
			status: input.status,
			withStats: input.withStats,
			withActiveWidgetsData: input.withActiveWidgetsData,
			withDeletedWidgetsData: input.withDeletedWidgetsData,
			dateFrom: input.dateFrom,
			dateTo: input.dateTo,
			isDeleted: input.isDeleted,
			isDelegate: input.isDelegate,
			teamMemberOnly: input.teamMemberOnly,
			fullAccountAccess: input.fullAccountAccess,
			delegateAccessToDialerAgentId: input.delegateAccessToDialerAgentId,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.listV2',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: ConvoloAiEndpoints['agentGet'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentGet']
	>(`api/v1/agents/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: ConvoloAiEndpoints['agentCreate'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentCreate']
	>('api/v1/agents', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: ConvoloAiEndpoints['agentUpdate'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentUpdate']
	>(`api/v1/agents/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: ConvoloAiEndpoints['agentDelete'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentDelete']
	>(`api/v1/agents/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateSchedule: ConvoloAiEndpoints['agentUpdateSchedule'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['agentUpdateSchedule']
	>(`api/v1/agents/update-schedule/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.agent.updateSchedule',
		{ ...input },
		'completed',
	);

	return response;
};
