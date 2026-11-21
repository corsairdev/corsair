import type { PersistiqEndpoints } from '..';
import { call } from './call';
import type { WebhookSettings } from './types';
import {
	PersistiqEndpointInputSchemas as Inputs,
	PersistiqEndpointOutputSchemas as Outputs,
} from './types';

// Logs which deliveries are on, never the URLs.
function enabledCount(settings: WebhookSettings): number {
	return [
		settings.post_new_prospect,
		settings.post_updated_prospect,
		settings.raw_events,
		settings.post_email_reply,
		settings.post_email_opened,
	].filter((on) => on === true).length;
}

export const getSettings: PersistiqEndpoints['webhooksGetSettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.getSettings',
			input: Inputs.webhooksGetSettings,
			output: Outputs.webhooksGetSettings,
		},
		input,
		() => ({ method: 'GET', path: '/v1/webhook_plugin' }),
		{ log: (_, settings) => ({ enabled: enabledCount(settings) }) },
	);

export const updateSettings: PersistiqEndpoints['webhooksUpdateSettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.updateSettings',
			input: Inputs.webhooksUpdateSettings,
			output: Outputs.webhooksUpdateSettings,
		},
		input,
		(body) => ({ method: 'PUT', path: '/v1/webhook_plugin', body }),
		{ log: (_, settings) => ({ enabled: enabledCount(settings) }) },
	);
