import type { WatiEndpoints } from '..';
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
			// V3 sends from one route with the recipient in the body; the
			// `/conversations/{target}/messages` form does not exist in v3. The
			// target is a JSON value here, so it is sent as given, not URL-encoded.
			path: '/conversations/messages/text',
			body: { target: who, text },
		}),
		{
			// The message text is the user's content, so only the id is logged.
			log: (_, result) => ({
				id: result.message?.id ?? undefined,
				status: result.message?.status ?? undefined,
			}),
		},
	);

/**
 * Sends an approved template, which is the only option outside the service
 * window.
 *
 * WATI records every template send as a campaign named by `broadcast_name`,
 * even for one recipient. `parameters` is left out for a template with no
 * placeholders.
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
		({
			whatsapp_number,
			template_name,
			broadcast_name,
			local_message_id,
			parameters,
		}) => ({
			method: 'POST',
			path: '/messageTemplates/send',
			body: {
				template_name,
				broadcast_name,
				recipients: [
					{
						target: whatsapp_number,
						// The caller's own id comes back on the result, so a send can
						// be matched to it.
						local_message_id,
						// A template with no placeholders takes no parameters.
						custom_params:
							parameters === undefined
								? undefined
								: parameters.map((entry) => ({
										name: entry.name,
										value: entry.value,
									})),
					},
				],
			},
		}),
		{
			log: (parsed, result) => ({
				template: parsed.template_name,
				broadcast: parsed.broadcast_name,
				// The number of bound placeholders, never their values, which may
				// be personal.
				parameters: parsed.parameters?.length ?? 0,
				broadcastId: result.broadcast_id ?? undefined,
				success: result.success ?? undefined,
				// Per-recipient failures arrive inside an HTTP 200.
				recipientErrors:
					result.recipients?.filter((row) => (row.errors?.length ?? 0) > 0)
						.length ?? 0,
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
		({ target: who, url, caption }) => ({
			method: 'POST',
			path: '/conversations/messages/fileViaUrl',
			body: { target: who, file_url: url, caption },
		}),
		{
			log: (parsed, result) => ({
				caption: parsed.caption !== undefined,
				id: result.message?.id ?? undefined,
			}),
		},
	);
