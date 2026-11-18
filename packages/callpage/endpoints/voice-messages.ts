import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import {
	deleteVoiceMessages,
	patchVoiceMessage,
	saveVoiceMessages,
} from './persist';
import type { CallPageEndpointOutputs } from './types';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from './types';

export const list: CallPageEndpoints['voiceMessagesList'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.voiceMessagesList.parse(rawInput);
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
	rawInput,
) => {
	const input =
		CallPageEndpointInputSchemas.voiceMessagesCreate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesCreate']
	>('/api/v1/external/voice/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesCreate,
	});
	await patchVoiceMessage(ctx, input.widget_id, {
		message_id: input.message_id,
		enabled: input.enabled,
		// A replaced file has no known URL until the next list, so clear the old one.
		recording: input.file ? null : undefined,
	});
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
	rawInput,
) => {
	const input =
		CallPageEndpointInputSchemas.voiceMessagesUpdate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesUpdate']
	>('/api/v1/external/voice/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesUpdate,
	});
	await patchVoiceMessage(ctx, input.widget_id, {
		message_id: input.message_id,
		enabled: input.enabled,
		// A replaced file has no known URL until the next list, so clear the old one.
		recording: input.file ? null : undefined,
	});
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
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.voiceMessagesReset.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesReset']
	>('/api/v1/external/voice/reset', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesReset,
	});
	await deleteVoiceMessages(ctx, input.widget_id, input.message_id);
	await logEventFromContext(
		ctx,
		'callpage.voiceMessages.reset',
		input,
		'completed',
	);
	return result;
};
