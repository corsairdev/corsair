import { logEventFromContext } from 'corsair/core';
import { makeSynthflowRequest } from '../client';
import type { SynthflowEndpoints } from '../index';
import type { SynthflowEndpointOutputs } from './types';

export const create: SynthflowEndpoints['callsCreate'] = async (ctx, input) => {
	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['callsCreate']
	>('calls', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflow.calls.create',
		{ model_id: input.model_id, phone: input.phone },
		'completed',
	);

	return response;
};

export const list: SynthflowEndpoints['callsList'] = async (ctx, input) => {
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

	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['callsList']
	>('calls', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflow.calls.list',
		{ model_id: input.model_id },
		'completed',
	);

	return response;
};
