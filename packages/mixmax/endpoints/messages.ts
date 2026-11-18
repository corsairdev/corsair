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
		{
			// Recipient addresses and bodies are private; the event history
			// records only their shape, never the values.
			recipients:
				(input.to?.length ?? 0) +
				(input.cc?.length ?? 0) +
				(input.bcc?.length ?? 0),
			hasBody: input.body !== undefined,
		},
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
		{
			// Same redaction as create: shape only, no addresses or bodies.
			id: input.id,
			recipients:
				(input.to?.length ?? 0) +
				(input.cc?.length ?? 0) +
				(input.bcc?.length ?? 0),
			hasBody: input.body !== undefined,
		},
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
		{
			// The optional `data` payload carries message fields; log the id only.
			id: input.id,
		},
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
		{
			// The optional `data` payload carries message fields; log the id only.
			id: input.id,
		},
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
		{
			// The body may contain private content; log its presence only.
			hasBody: input.body !== undefined,
		},
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
		{
			// The html body and recipient addresses are private; log the
			// html presence only.
			hasHtml: input.message.html !== undefined,
		},
		'completed',
	);
	return result;
};
