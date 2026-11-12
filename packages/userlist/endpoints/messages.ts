import type { UserlistEndpoints } from '..';
import { call } from './call';
import {
	UserlistEndpointInputSchemas as Inputs,
	UserlistEndpointOutputSchemas as Outputs,
} from './types';

function ref(value: string | number | Record<string, unknown>): string {
	if (typeof value === 'object') {
		const record = value as { identifier?: string | number };
		return record.identifier === undefined
			? '(embedded)'
			: String(record.identifier);
	}
	return String(value);
}

/**
 * Queues a transactional message.
 *
 * The rules the input schema enforces are the ones Userlist documents:
 *
 * - a `template` supplies subject, body and channel; without one, both
 *   `subject` and `body` are required;
 * - an email goes to a `user` or a `to` address;
 * - a web message needs a `user` and must not carry `to`, since it is shown
 *   in-app rather than delivered.
 */
export const send: UserlistEndpoints['messagesSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messagesSend,
			output: Outputs.messagesSend,
			label: 'messages.send',
		},
		input,
		({ template, ...rest }) => ({
			method: 'POST',
			path: '/messages',
			// Omitted rather than sent as undefined, so a template message does
			// not carry empty subject or body keys.
			body: template === undefined ? rest : { template, ...rest },
		}),
		{
			identifier: (parsed) =>
				parsed.template ??
				(parsed.user === undefined ? parsed.to : ref(parsed.user)),
			log: (parsed) => ({
				// A template picks its own channel, which the plugin cannot see.
				channel:
					parsed.channel ??
					(parsed.template === undefined ? 'email' : undefined),
				template: parsed.template,
				user: parsed.user === undefined ? undefined : ref(parsed.user),
			}),
		},
	);
