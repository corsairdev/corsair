import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateWebhookInput,
	CreateWebhookOutput,
	DeleteWebhookInput,
	DeleteWebhookOutput,
	GetWebhookInput,
	GetWebhookOutput,
	GetWebhooksInput,
	GetWebhooksOutput,
	UpdateWebhookInput,
	UpdateWebhookOutput,
} from './types';
import {
	CreateWebhookOutputSchema,
	DeleteWebhookOutputSchema,
	GetWebhookOutputSchema,
	GetWebhooksOutputSchema,
	LapostaEndpointInputSchemas,
	UpdateWebhookOutputSchema,
} from './types';

export const webhooks = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetWebhooksInput,
	): Promise<GetWebhooksOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['webhooks.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/webhook', ctx.key, {
			method: 'GET',
			query: parsedInput,
		});
		return GetWebhooksOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetWebhookInput,
	): Promise<GetWebhookOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['webhooks.get'].parse(input);
		const { webhook_id, list_id } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/webhook/${encodeURIComponent(webhook_id)}`,
			ctx.key,
			{ method: 'GET', query: { list_id } },
		);
		return GetWebhookOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateWebhookInput,
	): Promise<CreateWebhookOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['webhooks.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/webhook', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateWebhookOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateWebhookInput,
	): Promise<UpdateWebhookOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['webhooks.update'].parse(input);
		const { webhook_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/webhook/${encodeURIComponent(webhook_id)}`,
			ctx.key,
			{ method: 'POST', body },
		);
		return UpdateWebhookOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteWebhookInput,
	): Promise<DeleteWebhookOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['webhooks.delete'].parse(input);
		const { webhook_id, list_id } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/webhook/${encodeURIComponent(webhook_id)}`,
			ctx.key,
			{ method: 'DELETE', query: { list_id } },
		);
		return DeleteWebhookOutputSchema.parse(raw);
	},
};
