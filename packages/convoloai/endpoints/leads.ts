import { logEventFromContext } from 'corsair/core';
import { makeConvoloAiRequest } from '../client';
import type { ConvoloAiEndpointOutputs, ConvoloAiEndpoints } from '../index';

export const list: ConvoloAiEndpoints['leadList'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['leadList']
	>('api/v1/leads', ctx.key, {
		method: 'GET',
		query: {
			search_string: input.search_string,
			name: input.name,
			phone: input.phone,
			email: input.email,
			websites: input.websites,
			widgets: input.widgets,
			lc_params: input.lc_params,
			date_from: input.date_from,
			date_to: input.date_to,
			agent_answer_time_lte: input.agent_answer_time_lte,
			agent_answer_time_gte: input.agent_answer_time_gte,
			talk_time_lte: input.talk_time_lte,
			talk_time_gte: input.talk_time_gte,
			status: input.status,
			agents: input.agents,
			lead_status: input.lead_status,
			search_lead_data: input.search_lead_data,
			rating: input.rating,
			comment: input.comment,
			visitor_source: input.visitor_source,
			page: input.page,
			items_per_page: input.items_per_page,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.lead.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const listByPost: ConvoloAiEndpoints['leadListByPost'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['leadListByPost']
	>('api/v1/get-leads', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.lead.listByPost',
		{ ...input },
		'completed',
	);

	return response;
};

export const getOutcomeTags: ConvoloAiEndpoints['leadGetOutcomeTags'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['leadGetOutcomeTags']
	>(`api/v2/leads/outcome-tags/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.lead.getOutcomeTags',
		{ ...input },
		'completed',
	);

	return response;
};
