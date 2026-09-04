import { logEventFromContext } from 'corsair/core';
import { makeConvoloAiRequest } from '../client';
import type { ConvoloAiEndpointOutputs, ConvoloAiEndpoints } from '../index';

function callsQuery(input: {
	date_from?: string;
	date_to?: string;
	widget_ids?: string[];
	max_calls?: number;
	page?: number;
	search_string?: string;
	status?: string;
	filter_url?: string;
	filter_referer?: string;
	filter_lead_number?: string;
	filter_agent?: string;
	filter_answer_time_from?: number;
	filter_answer_time_to?: number;
	filter_talk_time_from?: number;
	filter_talk_time_to?: number;
	filter_wait_time_from?: number;
	filter_wait_time_to?: number;
	filter_disconnected_by?: string;
	timezone?: string;
}) {
	return {
		date_from: input.date_from,
		date_to: input.date_to,
		widget_ids: input.widget_ids,
		max_calls: input.max_calls,
		page: input.page,
		search_string: input.search_string,
		status: input.status,
		filter_url: input.filter_url,
		filter_referer: input.filter_referer,
		filter_lead_number: input.filter_lead_number,
		filter_agent: input.filter_agent,
		filter_answer_time_from: input.filter_answer_time_from,
		filter_answer_time_to: input.filter_answer_time_to,
		filter_talk_time_from: input.filter_talk_time_from,
		filter_talk_time_to: input.filter_talk_time_to,
		filter_wait_time_from: input.filter_wait_time_from,
		filter_wait_time_to: input.filter_wait_time_to,
		filter_disconnected_by: input.filter_disconnected_by,
		timezone: input.timezone,
	};
}

export const list: ConvoloAiEndpoints['callList'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callList']
	>('api/v1/calls/list', ctx.key, {
		method: 'GET',
		query: callsQuery(input),
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const listV5: ConvoloAiEndpoints['callListV5'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callListV5']
	>('api/v5/calls/list', ctx.key, {
		method: 'GET',
		query: callsQuery(input),
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.listV5',
		{ ...input },
		'completed',
	);

	return response;
};

export const listWithTags: ConvoloAiEndpoints['callListWithTags'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callListWithTags']
	>('api/v1/calls/list-with-tags', ctx.key, {
		method: 'GET',
		query: {
			...callsQuery(input),
			filter_s2l_ai_action_set_ids: input.filter_s2l_ai_action_set_ids,
			filter_s2l_tag_names: input.filter_s2l_tag_names,
			filter_s2l_tag_categories: input.filter_s2l_tag_categories,
			filter_s2l_has_tag: input.filter_s2l_has_tag,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.listWithTags',
		{ ...input },
		'completed',
	);

	return response;
};

export const getDetails: ConvoloAiEndpoints['callGetDetails'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callGetDetails']
	>(`api/v1/calls/details/${encodeURIComponent(input.callId)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.getDetails',
		{ ...input },
		'completed',
	);

	return response;
};

export const getLog: ConvoloAiEndpoints['callGetLog'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callGetLog']
	>(`api/v1/calls/log/${encodeURIComponent(input.callId)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.getLog',
		{ ...input },
		'completed',
	);

	return response;
};

export const getEndWebhookPayload: ConvoloAiEndpoints['callGetEndWebhookPayload'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['callGetEndWebhookPayload']
		>(
			`api/v1/calls/payload-end-call-webhook-by-call-id/${encodeURIComponent(input.callId)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'convoloai.call.getEndWebhookPayload',
			{ ...input },
			'completed',
		);

		return response;
	};

export const listPayloadData: ConvoloAiEndpoints['callListPayloadData'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['callListPayloadData']
		>('api/v2/calls/payload-data-list', ctx.key, {
			method: 'GET',
			query: callsQuery(input),
		});

		await logEventFromContext(
			ctx,
			'convoloai.call.listPayloadData',
			{ ...input },
			'completed',
		);

		return response;
	};

export const setS2lTag: ConvoloAiEndpoints['callSetS2lTag'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callSetS2lTag']
	>(`api/v1/ext/calls/${encodeURIComponent(input.callId)}/s2l-tag`, ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.setS2lTag',
		{ ...input },
		'completed',
	);

	return response;
};

export const setRating: ConvoloAiEndpoints['callSetRating'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callSetRating']
	>(`api/v1/ext/set-rating/${encodeURIComponent(input.callId)}`, ctx.key, {
		method: 'GET',
		query: {
			tag: input.tag,
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.setRating',
		{ ...input },
		'completed',
	);

	return response;
};

export const trigger: ConvoloAiEndpoints['callTrigger'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['callTrigger']
	>('rest/v1/ext/add_call_api/', ctx.key, {
		method: 'POST',
		query: {
			api_key: input.api_key,
			widget_key: input.widget_key,
		},
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.call.trigger',
		{ api_key: '***', widget_key: '***', body: input.body },
		'completed',
	);

	return response;
};
