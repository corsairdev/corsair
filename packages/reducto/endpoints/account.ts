import type { ReductoEndpoints } from '../index';
import { callReducto } from './call';
import {
	ConfigureWebhookInputSchema,
	ConfigureWebhookResponseSchema,
	VersionInputSchema,
	VersionResponseSchema,
} from './types';

export const version: ReductoEndpoints['version'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.account.version',
		VersionInputSchema,
		VersionResponseSchema,
		input,
		() => ({ method: 'GET', url: '/version' }),
		() => ({}),
	);
};

export const configureWebhook: ReductoEndpoints['configureWebhook'] = async (
	ctx,
	input,
) => {
	return callReducto(
		ctx,
		'reducto.account.configureWebhook',
		ConfigureWebhookInputSchema,
		ConfigureWebhookResponseSchema,
		input,
		() => ({ method: 'POST', url: '/configure_webhook' }),
		// The portal URL is a credential. Do not write it to the event log.
		() => ({ configured: true }),
	);
};
