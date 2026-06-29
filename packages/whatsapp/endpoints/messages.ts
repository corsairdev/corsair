import { logEventFromContext } from 'corsair/core';
import { makeWhatsappRequest } from '../client';
import type { WhatsappContext, WhatsappEndpoints } from '../index';
import type { MessagesSendInput, WhatsappEndpointOutputs } from './types';

async function resolvePhoneNumberId(
	ctx: WhatsappContext,
	explicit?: string,
): Promise<string> {
	const phoneNumberId =
		explicit ??
		ctx.options.phoneNumberId ??
		(await ctx.keys.get_phone_number_id());
	if (!phoneNumberId) {
		throw new Error(
			'[auth-missing:whatsapp:phone_number_id]: WhatsApp phone number ID is missing',
		);
	}
	return phoneNumberId;
}

function messagePreview(input: MessagesSendInput): string | undefined {
	if (input.type === 'text') return input.text.body;
	if (input.type === 'image') return input.image.caption;
	if (input.type === 'document') return input.document.caption;
	if (input.type === 'video') return input.video.caption;
	if (input.type === 'template') return input.template.name;
	if (input.type === 'interactive') {
		const body = input.interactive.body?.text;
		if (typeof body === 'string') return body;
		return `[Interactive: ${input.interactive.type}]`;
	}
	if (input.type === 'audio') return '[Audio]';
	return undefined;
}

export const send: WhatsappEndpoints['messagesSend'] = async (ctx, input) => {
	const phoneNumberId = await resolvePhoneNumberId(ctx, input.phoneNumberId);
	const { phoneNumberId: _phoneNumberId, ...body } = input;
	const response = await makeWhatsappRequest<
		WhatsappEndpointOutputs['messagesSend']
	>(`${phoneNumberId}/messages`, ctx.key, { method: 'POST', body });

	for (const message of response.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(message.id, {
				id: message.id,
				to: input.to,
				type: input.type,
				text: messagePreview(input),
				status: message.message_status ?? 'accepted',
				direction: 'outbound',
				phoneNumberId,
				raw: body,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save WhatsApp message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'whatsapp.messages.send',
		{ ...input, phoneNumberId },
		'completed',
	);
	return response;
};

export const markRead: WhatsappEndpoints['messagesMarkRead'] = async (
	ctx,
	input,
) => {
	const phoneNumberId = await resolvePhoneNumberId(ctx, input.phoneNumberId);
	const response = await makeWhatsappRequest<
		WhatsappEndpointOutputs['messagesMarkRead']
	>(`${phoneNumberId}/messages`, ctx.key, {
		method: 'POST',
		body: {
			messaging_product: 'whatsapp',
			status: 'read',
			message_id: input.messageId,
		},
	});

	await logEventFromContext(
		ctx,
		'whatsapp.messages.markRead',
		{ ...input, phoneNumberId },
		'completed',
	);
	return response;
};

export { resolvePhoneNumberId };
