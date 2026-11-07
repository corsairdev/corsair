import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const messagesList: MixmaxEndpoints['messagesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesList']
	>('/v1/messages', ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			next: input.next,
			previous: input.previous,
			fields: input.fields,
		},
	});

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
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesCreate']
	>('/v1/messages', ctx.key, {
		method: 'POST',
		body: {
			from: input.from,
			to: input.to,
			cc: input.cc,
			bcc: input.bcc,
			subject: input.subject,
			body: input.body,
			trackingEnabled: input.trackingEnabled,
			smartFollowupsEnabled: input.smartFollowupsEnabled,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesGet: MixmaxEndpoints['messagesGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesGet']
	>(`/v1/messages/${input.id}`, ctx.key, {
		method: 'GET',
	});

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
	const { id, ...updateFields } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesUpdate']
	>(`/v1/messages/${id}`, ctx.key, {
		method: 'PATCH',
		body: updateFields,
	});

	await logEventFromContext(
		ctx,
		'mixmax.messages.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const messagesSend: MixmaxEndpoints['messagesSend'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesSend']
	>(`/v1/messages/${input.id}/send`, ctx.key, {
		method: 'POST',
	});

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
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesSchedule']
	>(`/v1/messages/${input.id}/schedule`, ctx.key, {
		method: 'POST',
		body: {
			sendAt: input.sendAt,
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
	>(`/v1/messages/${input.id}/schedule`, ctx.key, {
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
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['messagesTest']
	>('/v1/messages/test', ctx.key, {
		method: 'POST',
		body: {
			subject: input.subject,
			body: input.body,
			meetingTypeId: input.meetingTypeId,
		},
	});

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
	>('/v1/send', ctx.key, {
		method: 'POST',
		body: {
			to: input.to,
			subject: input.subject,
			body: input.body,
			from: input.from,
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

export const envVarsList: MixmaxEndpoints['envVarsList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['envVarsList']>(/v1/services/env-vars, ctx.key, {
		method: 'GET',
		query: {
		cursor: input.cursor,
		limit: input.limit,
		},
	});
	await logEventFromContext(ctx, 'mixmax.envVars.list', { ...input }, 'completed');
	return result;
};
