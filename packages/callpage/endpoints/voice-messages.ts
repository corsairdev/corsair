import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { saveVoiceMessages } from './persist';
import type { CallPageEndpointOutputs } from './types';
import { CallPageEndpointOutputSchemas } from './types';

export const list: CallPageEndpoints['voiceMessagesList'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesList']
	>('/api/v1/external/voice/all', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesList,
	});
	await saveVoiceMessages(ctx, input.widget_id, result);
	await logEventFromContext(
		ctx,
		'callpage.voiceMessages.list',
		input,
		'completed',
	);
	return result;
};

export const create: CallPageEndpoints['voiceMessagesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesCreate']
	>('/api/v1/external/voice/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesCreate,
	});
	await saveVoiceMessages(ctx, input.widget_id, [
		{ message_id: input.message_id, enabled: input.enabled },
	]);
	await logEventFromContext(
		ctx,
		'callpage.voiceMessages.create',
		input,
		'completed',
	);
	return result;
};

export const update: CallPageEndpoints['voiceMessagesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesUpdate']
	>('/api/v1/external/voice/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesUpdate,
	});
	await saveVoiceMessages(ctx, input.widget_id, [
		{ message_id: input.message_id, enabled: input.enabled },
	]);
	await logEventFromContext(
		ctx,
		'callpage.voiceMessages.update',
		input,
		'completed',
	);
	return result;
};

export const reset: CallPageEndpoints['voiceMessagesReset'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesReset']
	>('/api/v1/external/voice/reset', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesReset,
	});
	await logEventFromContext(
		ctx,
		'callpage.voiceMessages.reset',
		input,
		'completed',
	);
	return result;
};
