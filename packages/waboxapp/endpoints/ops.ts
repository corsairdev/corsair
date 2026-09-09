import { randomUUID } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { WaboxappContext, WaboxappEndpoints } from '..';
import { makeWaboxappRequest } from '../client';
import {
	AccountsGetStatusInputSchema,
	MessagesSendChatInputSchema,
	MessagesSendImageInputSchema,
	MessagesSendLinkInputSchema,
	MessagesSendMediaInputSchema,
	WaboxappEndpointOutputSchemas,
} from './types';

async function validated<I, O>(
	inputSchema: z.ZodType<I>,
	outputSchema: z.ZodType<O>,
	input: I,
	run: (parsed: I) => Promise<O>,
): Promise<O> {
	return outputSchema.parse(await run(inputSchema.parse(input)));
}

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

async function send(
	ctx: WaboxappContext,
	path: string,
	event: string,
	input: {
		uid?: string;
		to: string;
		custom_uid?: string;
		[key: string]: string | undefined;
	},
) {
	const uid = await resolveUid(ctx, input.uid);
	const fields = {
		...input,
		token: ctx.key,
		uid,
		custom_uid: input.custom_uid ?? randomUUID(),
	};
	const response = await makeWaboxappRequest<
		z.infer<typeof WaboxappEndpointOutputSchemas.messagesSendChat>
	>(path, { method: 'POST', fields });
	await logEventFromContext(
		ctx,
		event,
		{ to: input.to, uid: fields.uid, custom_uid: fields.custom_uid },
		'completed',
	);
	return response;
}

export const sendChat: WaboxappEndpoints['messagesSendChat'] = (ctx, input) =>
	validated(
		MessagesSendChatInputSchema,
		WaboxappEndpointOutputSchemas.messagesSendChat,
		input,
		(parsed) => send(ctx, 'send/chat', 'waboxapp.messages.sendChat', parsed),
	);

export const sendImage: WaboxappEndpoints['messagesSendImage'] = (ctx, input) =>
	validated(
		MessagesSendImageInputSchema,
		WaboxappEndpointOutputSchemas.messagesSendImage,
		input,
		(parsed) => send(ctx, 'send/image', 'waboxapp.messages.sendImage', parsed),
	);

export const sendLink: WaboxappEndpoints['messagesSendLink'] = (ctx, input) =>
	validated(
		MessagesSendLinkInputSchema,
		WaboxappEndpointOutputSchemas.messagesSendLink,
		input,
		(parsed) => send(ctx, 'send/link', 'waboxapp.messages.sendLink', parsed),
	);

export const sendMedia: WaboxappEndpoints['messagesSendMedia'] = (ctx, input) =>
	validated(
		MessagesSendMediaInputSchema,
		WaboxappEndpointOutputSchemas.messagesSendMedia,
		input,
		(parsed) => send(ctx, 'send/media', 'waboxapp.messages.sendMedia', parsed),
	);

export const getStatus: WaboxappEndpoints['accountsGetStatus'] = (ctx, input) =>
	validated(
		AccountsGetStatusInputSchema,
		WaboxappEndpointOutputSchemas.accountsGetStatus,
		input,
		async (parsed) => {
			const uid = await resolveUid(ctx, parsed.uid);
			const response = await makeWaboxappRequest<
				z.infer<typeof WaboxappEndpointOutputSchemas.accountsGetStatus>
			>(`status/${uid}`, {
				method: 'GET',
				fields: { token: ctx.key },
			});
			await logEventFromContext(
				ctx,
				'waboxapp.accounts.getStatus',
				{ uid },
				'completed',
			);
			return response;
		},
	);
