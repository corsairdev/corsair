import type { WatiEndpoints } from '..';
import { target } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Sends a free-text message.
 *
 * This only works inside the 24-hour customer service window. Outside it WATI
 * refuses, and a template send is the only way through — which is why the
 * template operation exists separately rather than as an option here.
 */
export const sendText: WatiEndpoints['messagesSendText'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.sendText',
			input: Inputs.messagesSendText,
			output: Outputs.messagesSendText,
		},
		input,
		({ target: who, text }) => ({
			method: 'POST',
			path: `/conversations/${target(who)}/messages`,
			body: { text },
		}),
		{
			// The message text is the user's content, so only that one was sent.
			log: (_, result) => ({
				id: result.id ?? undefined,
				local: result.local_message_id ?? undefined,
				success: result.success ?? false,
			}),
		},
	);

/**
 * Sends an approved template, which is the only option outside the service
 * window.
 *
 * `broadcast_name` turns the send into a campaign, and the schema requires
 * `parameters` alongside it — a campaign with no bound parameters only makes
 * sense for a template with no placeholders, so the pairing is worth a check.
 */
export const sendTemplate: WatiEndpoints['messagesSendTemplate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.sendTemplate',
			input: Inputs.messagesSendTemplate,
			output: Outputs.messagesSendTemplate,
		},
		input,
		({ whatsapp_number, template_name, broadcast_name, parameters }) => ({
			method: 'POST',
			path: '/messages/template',
			body: {
				whatsapp_number,
				template_name,
				broadcast_name,
				parameters,
			},
		}),
		{
			log: (parsed, result) => ({
				template: parsed.template_name,
				broadcast: parsed.broadcast_name,
				// The number of bound placeholders, never their values, which may
				// be personal.
				parameters: parsed.parameters?.length ?? 0,
				id: result.id ?? undefined,
			}),
		},
	);

/** Sends a file from a public URL, with an optional caption. */
export const sendFile: WatiEndpoints['messagesSendFile'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.sendFile',
			input: Inputs.messagesSendFile,
			output: Outputs.messagesSendFile,
		},
		input,
		({ target: who, url, caption, filename }) => ({
			method: 'POST',
			path: `/conversations/${target(who)}/messages`,
			body: { url, caption, filename },
		}),
		{
			log: (parsed, result) => ({
				filename: parsed.filename,
				caption: parsed.caption !== undefined,
				id: result.id ?? undefined,
			}),
		},
	);
