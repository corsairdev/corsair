import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { saveSmsMessages } from './persist';
import type { CallPageEndpointOutputs } from './types';
import { CallPageEndpointOutputSchemas } from './types';

export const list: CallPageEndpoints['smsList'] = async (ctx, input) => {
	const result = await makeCallPageRequest<CallPageEndpointOutputs['smsList']>(
		'/api/v1/external/sms/all',
		ctx.key,
		{ query: input, schema: CallPageEndpointOutputSchemas.smsList },
	);
	await saveSmsMessages(ctx, input.widget_id, result);
	await logEventFromContext(ctx, 'callpage.sms.list', input, 'completed');
	return result;
};

export const create: CallPageEndpoints['smsCreate'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['smsCreate']
	>('/api/v1/external/sms/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.smsCreate,
	});
	await saveSmsMessages(ctx, input.widget_id, [
		{ message_id: input.message_id, text: input.text, enabled: input.enabled },
	]);
	await logEventFromContext(ctx, 'callpage.sms.create', input, 'completed');
	return result;
};

export const update: CallPageEndpoints['smsUpdate'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['smsUpdate']
	>('/api/v1/external/sms/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.smsUpdate,
	});
	await saveSmsMessages(ctx, input.widget_id, [
		{ message_id: input.message_id, text: input.text, enabled: input.enabled },
	]);
	await logEventFromContext(ctx, 'callpage.sms.update', input, 'completed');
	return result;
};

export const reset: CallPageEndpoints['smsReset'] = async (ctx, input) => {
	const result = await makeCallPageRequest<CallPageEndpointOutputs['smsReset']>(
		'/api/v1/external/sms/reset',
		ctx.key,
		{
			method: 'POST',
			body: input,
			schema: CallPageEndpointOutputSchemas.smsReset,
		},
	);
	await logEventFromContext(ctx, 'callpage.sms.reset', input, 'completed');
	return result;
};
