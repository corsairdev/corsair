import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['callsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['callsCreate']
	>('calls', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.calls.create',
		{ model_id: input.model_id, phone: input.phone },
		'completed',
	);

	return response;
};

export const list: SynthflowAiEndpoints['callsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {
		model_id: input.model_id,
	};
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.offset !== undefined) query.offset = input.offset;
	if (input.from_date !== undefined) query.from_date = input.from_date;
	if (input.to_date !== undefined) query.to_date = input.to_date;
	if (input.call_status !== undefined) query.call_status = input.call_status;
	if (input.duration_min !== undefined) query.duration_min = input.duration_min;
	if (input.duration_max !== undefined) query.duration_max = input.duration_max;
	if (input.lead_phone_number !== undefined) {
		query.lead_phone_number = input.lead_phone_number;
	}

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['callsList']
	>('calls', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.calls.list',
		{ model_id: input.model_id },
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['callsGet'] = async (ctx, input) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['callsGet']
	>(`calls/${input.call_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.calls.get',
		{ call_id: input.call_id },
		'completed',
	);

	return response;
};
