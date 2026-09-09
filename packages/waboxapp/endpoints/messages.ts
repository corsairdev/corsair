import { randomUUID } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeWaboxappRequest } from '../client';
import type { WaboxappContext, WaboxappEndpoints } from '../index';
import type { WaboxappEndpointOutputs } from './types';

async function resolveUid(
	ctx: WaboxappContext,
	inputUid: string | undefined,
): Promise<string> {
	if (inputUid) return inputUid;
	if (ctx.options.uid) return ctx.options.uid;
	const stored = await ctx.keys.get_uid();
	if (stored) return stored;
	throw new AuthMissingError('waboxapp', 'api_key');
}

async function sendFields(
	ctx: WaboxappContext,
	input: {
		uid?: string;
		to: string;
		custom_uid?: string;
		[key: string]: string | undefined;
	},
): Promise<Record<string, string | undefined>> {
	const uid = await resolveUid(ctx, input.uid);
	return {
		...input,
		token: ctx.key,
		uid,
		custom_uid: input.custom_uid ?? randomUUID(),
	};
}

export const sendChat: WaboxappEndpoints['messagesSendChat'] = async (
	ctx,
	input,
) => {
	const fields = await sendFields(ctx, input);
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['messagesSendChat']
	>('send/chat', { method: 'POST', fields });
	await logEventFromContext(
		ctx,
		'waboxapp.messages.sendChat',
		{ to: input.to, uid: fields.uid, custom_uid: fields.custom_uid },
		'completed',
	);
	return response;
};

export const sendImage: WaboxappEndpoints['messagesSendImage'] = async (
	ctx,
	input,
) => {
	const fields = await sendFields(ctx, input);
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['messagesSendImage']
	>('send/image', { method: 'POST', fields });
	await logEventFromContext(
		ctx,
		'waboxapp.messages.sendImage',
		{ to: input.to, uid: fields.uid, custom_uid: fields.custom_uid },
		'completed',
	);
	return response;
};

export const sendLink: WaboxappEndpoints['messagesSendLink'] = async (
	ctx,
	input,
) => {
	const fields = await sendFields(ctx, input);
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['messagesSendLink']
	>('send/link', { method: 'POST', fields });
	await logEventFromContext(
		ctx,
		'waboxapp.messages.sendLink',
		{ to: input.to, uid: fields.uid, custom_uid: fields.custom_uid },
		'completed',
	);
	return response;
};

export const sendMedia: WaboxappEndpoints['messagesSendMedia'] = async (
	ctx,
	input,
) => {
	const fields = await sendFields(ctx, input);
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['messagesSendMedia']
	>('send/media', { method: 'POST', fields });
	await logEventFromContext(
		ctx,
		'waboxapp.messages.sendMedia',
		{ to: input.to, uid: fields.uid, custom_uid: fields.custom_uid },
		'completed',
	);
	return response;
};
