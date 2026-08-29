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
} from './types';

export const createWebhook: ParseurEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const parsed = CreateWebhookInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>('/webhook', {
		apiKey: ctx.key,
		method: 'POST',
		body: parsed,
	});

	const output = CreateWebhookOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.webhooks.createWebhook',
		{ target_url: parsed.target_url },
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

	const output = EnableWebhookOutputSchema.parse(response ?? { success: true });

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
