import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
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
		query: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesCreate,
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
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesUpdate']
	>('/api/v1/external/voice/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.voiceMessagesUpdate,
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
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['voiceMessagesReset']
	>('/api/v1/external/voice/reset', ctx.key, {
		method: 'POST',
		query: input,
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
