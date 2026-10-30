import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import {
	CreateWebhookInputSchema,
	CreateWebhookOutputSchema,
	DeleteWebhookInputSchema,
	DeleteWebhookOutputSchema,
	DisableWebhookInputSchema,
	DisableWebhookOutputSchema,
	EnableWebhookInputSchema,
	EnableWebhookOutputSchema,
	ListWebhooksInputSchema,
	ListWebhooksOutputSchema,
	ParserSchema,
} from './types';

export const createWebhook: ParseurEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const parsed = CreateWebhookInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>('/webhook', {
		apiKey: ctx.key,
		method: 'POST',
		body: {
			event: parsed.event,
			target: parsed.target,
			...(parsed.name ? { name: parsed.name } : {}),
			...(parsed.headers ? { headers: parsed.headers } : {}),
			category: parsed.category ?? 'CUSTOM',
			...(parsed.parser ? { parser: parsed.parser } : {}),
			...(parsed.parser_field ? { parser_field: parsed.parser_field } : {}),
		},
	});

	const output = CreateWebhookOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.webhooks.createWebhook',
		{ event: parsed.event, id: output.id },
		'completed',
	);

	return output;
};

export const enableWebhook: ParseurEndpoints['enableWebhook'] = async (
	ctx,
	input,
) => {
	const parsed = EnableWebhookInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.mailbox_id}/webhook_set/${parsed.id}`,
		{
			apiKey: ctx.key,
			method: 'POST',
		},
	);

	const output = EnableWebhookOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.webhooks.enableWebhook',
		{ mailboxId: parsed.mailbox_id, id: parsed.id },
		'completed',
	);

	return output;
};

export const disableWebhook: ParseurEndpoints['disableWebhook'] = async (
	ctx,
	input,
) => {
	const parsed = DisableWebhookInputSchema.parse(input);
	await makeParseurRequest<unknown>(
		`/parser/${parsed.mailbox_id}/webhook_set/${parsed.id}`,
		{
			apiKey: ctx.key,
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'parseur.webhooks.disableWebhook',
		{ mailboxId: parsed.mailbox_id, id: parsed.id },
		'completed',
	);

	return DisableWebhookOutputSchema.parse({ success: true });
};

export const deleteWebhook: ParseurEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteWebhookInputSchema.parse(input);
	await makeParseurRequest<unknown>(`/webhook/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'parseur.webhooks.deleteWebhook',
		{ id: parsed.id },
		'completed',
	);

	return DeleteWebhookOutputSchema.parse({ success: true });
};

export const listWebhooks: ParseurEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const parsed = ListWebhooksInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(`/parser/${parsed.id}`, {
		apiKey: ctx.key,
		method: 'GET',
	});
	const mailbox = ParserSchema.parse(response);
	const output = ListWebhooksOutputSchema.parse({
		webhook_set: mailbox.webhook_set ?? [],
		available_webhook_set: mailbox.available_webhook_set ?? [],
	});

	await logEventFromContext(
		ctx,
		'parseur.webhooks.listWebhooks',
		{ mailboxId: parsed.id },
		'completed',
	);

	return output;
};
