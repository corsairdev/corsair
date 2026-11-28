import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

// These four operations manage webhook REGISTRATIONS over the API. The plugin
// does not receive SMTP2GO webhook deliveries: their payload shapes and
// signature scheme are docs-only and unverified, so no inbound handler ships.

export const list: Smtp2goEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(parsed) => ({
			path: '/webhook/view',
			body: pickBody(parsed),
			replayable: true,
		}),
	);

export const add: Smtp2goEndpoints['webhooksAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.add',
			input: Inputs.webhooksAdd,
			output: Outputs.webhooksAdd,
		},
		input,
		(parsed) => ({
			path: '/webhook/add',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			// The host only: a path or query can carry a secret.
			log: (parsed) => ({ host: safeHost(parsed.url) }),
		},
	);

export const edit: Smtp2goEndpoints['webhooksEdit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.edit',
			input: Inputs.webhooksEdit,
			output: Outputs.webhooksEdit,
		},
		input,
		(parsed) => ({
			path: '/webhook/edit',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ webhookId: parsed.id }),
		},
	);

export const remove: Smtp2goEndpoints['webhooksRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.remove',
			input: Inputs.webhooksRemove,
			output: Outputs.webhooksRemove,
		},
		input,
		(parsed) => ({
			path: '/webhook/remove',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ webhookId: parsed.id }),
		},
	);

function safeHost(url: string): string | undefined {
	try {
		return new URL(url).host;
	} catch {
		return undefined;
	}
}
