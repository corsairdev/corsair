import type { SupportbeeEndpoints } from '..';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The route is called emails, but it manages the **forwarding addresses** that
 * turn mail into tickets. An address is a `from` that an existing mailbox
 * forwards to the generated `forward_to` address, which is what SupportBee reads.
 */
export const list: SupportbeeEndpoints['emailsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'emails.list',
			input: Inputs.emailsList,
			output: Outputs.emailsList,
		},
		input,
		() => ({ method: 'GET', path: '/emails' }),
		{
			log: (_, result) => ({ count: result.forwarding_addresses.length }),
		},
	);

export const create: SupportbeeEndpoints['emailsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'emails.create',
			input: Inputs.emailsCreate,
			output: Outputs.emailsCreate,
		},
		input,
		({ email, name, filter_spam, use_agent_name }) => ({
			method: 'POST',
			path: '/emails',
			body: {
				forwarding_address: {
					email,
					...(name === undefined ? {} : { name }),
					...(filter_spam === undefined ? {} : { filter_spam }),
					...(use_agent_name === undefined ? {} : { use_agent_name }),
				},
			},
		}),
		{
			// The address is personal data, so only the id is logged.
			log: (_, result) => ({
				forwardingAddressId: result.forwarding_address.id ?? undefined,
			}),
		},
	);
