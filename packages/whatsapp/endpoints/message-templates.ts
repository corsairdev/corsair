import { logEventFromContext } from 'corsair/core';
import { makeWhatsappRequest } from '../client';
import type { WhatsappContext, WhatsappEndpoints } from '../index';
import type { WhatsappEndpointOutputs } from './types';

export async function resolveBusinessAccountId(
	ctx: WhatsappContext,
	explicit?: string,
): Promise<string> {
	const businessAccountId =
		explicit ??
		ctx.options.businessAccountId ??
		(await ctx.keys.get_business_account_id());
	if (!businessAccountId) {
		throw new Error(
			'[auth-missing:whatsapp:business_account_id]: WhatsApp business account ID is missing',
		);
	}
	return businessAccountId;
}

export const createMessageTemplate: WhatsappEndpoints['messageTemplatesCreate'] =
	async (ctx, input) => {
		const businessAccountId = await resolveBusinessAccountId(
			ctx,
			input.businessAccountId,
		);

		const result = await makeWhatsappRequest<
			WhatsappEndpointOutputs['messageTemplatesCreate']
		>(`${businessAccountId}/message_templates`, ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				language: input.language,
				category: input.category,
				components: input.components,
			},
		});

		await logEventFromContext(
			ctx,
			'whatsapp.messageTemplates.create',
			{ businessAccountId, templateName: input.name },
			'completed',
		);
		return result;
	};

export const deleteMessageTemplate: WhatsappEndpoints['messageTemplatesDelete'] =
	async (ctx, input) => {
		const businessAccountId = await resolveBusinessAccountId(
			ctx,
			input.businessAccountId,
		);

		const result = await makeWhatsappRequest<
			WhatsappEndpointOutputs['messageTemplatesDelete']
		>(`${businessAccountId}/message_templates`, ctx.key, {
			method: 'DELETE',
			query: { name: input.name },
		});

		await logEventFromContext(
			ctx,
			'whatsapp.messageTemplates.delete',
			{ businessAccountId, templateName: input.name },
			'completed',
		);
		return result;
	};

export const listMessageTemplates: WhatsappEndpoints['messageTemplatesList'] =
	async (ctx, input) => {
		const businessAccountId = await resolveBusinessAccountId(
			ctx,
			input.businessAccountId,
		);

		const result = await makeWhatsappRequest<
			WhatsappEndpointOutputs['messageTemplatesList']
		>(`${businessAccountId}/message_templates`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'whatsapp.messageTemplates.list',
			{ businessAccountId },
			'completed',
		);
		return result;
	};

export const getTemplateStatus: WhatsappEndpoints['messageTemplatesGetStatus'] =
	async (ctx, input) => {
		const businessAccountId = await resolveBusinessAccountId(
			ctx,
			input.businessAccountId,
		);

		const result = await makeWhatsappRequest<
			WhatsappEndpointOutputs['messageTemplatesGetStatus']
		>(`${businessAccountId}/message_templates`, ctx.key, {
			method: 'GET',
			query: { name: input.name },
		});

		await logEventFromContext(
			ctx,
			'whatsapp.messageTemplates.getStatus',
			{ businessAccountId, templateName: input.name },
			'completed',
		);
		return result;
	};
