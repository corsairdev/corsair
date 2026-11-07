import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const messagesList: MixmaxEndpoints['messagesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['messagesList']>(
		ctx,
		'/v1/messages',
		{
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
				fields: input.fields,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.messages.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesCreate: MixmaxEndpoints['messagesCreate'] = async (
	ctx,
	input,
) => {
	const { ...message } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesCreate']
	>(ctx, '/v1/messages', {
		method: 'POST',
		body: message,
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesGet: MixmaxEndpoints['messagesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['messagesGet']>(
		ctx,
		mixmaxPathParameter('/v1/messages/{id}', 'id', input.id),
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'mixmax.messages.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesUpdate: MixmaxEndpoints['messagesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...update } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesUpdate']
	>(ctx, mixmaxPathParameter('/v1/messages/{id}', 'id', id), {
		method: 'PATCH',
		body: update,
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesSend: MixmaxEndpoints['messagesSend'] = async (
	ctx,
	input,
) => {
	const { id, data, options } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['messagesSend']>(
		ctx,
		mixmaxPathParameter('/v1/messages/{id}/send', 'id', id),
		{
			method: 'POST',
			body: {
				data,
				options,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.messages.send',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesSchedule: MixmaxEndpoints['messagesSchedule'] = async (
	ctx,
	input,
) => {
	const { id, options, data } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesSchedule']
	>(ctx, mixmaxPathParameter('/v1/messages/{id}/schedule', 'id', id), {
		method: 'POST',
		body: {
			options,
			data,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.schedule',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesUnschedule: MixmaxEndpoints['messagesUnschedule'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesUnschedule']
	>(ctx, mixmaxPathParameter('/v1/messages/{id}/schedule', 'id', input.id), {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.unschedule',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesTest: MixmaxEndpoints['messagesTest'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['messagesTest']>(
		ctx,
		'/v1/messages/test',
		{
			method: 'POST',
			body: {
				subject: input.subject,
				body: input.body,
				meetingTypeId: input.meetingTypeId,
				meetingTimeMs: input.meetingTimeMs,
				primaryTimeZone: input.primaryTimeZone,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.messages.test',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesSendPlain: MixmaxEndpoints['messagesSendPlain'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesSendPlain']
	>(ctx, '/v1/send', {
		method: 'POST',
		body: {
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.sendPlain',
		{ ...input },
		'completed',
	);
	return result;
};
