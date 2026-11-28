import type { NtfyEndpoints } from '..';
import { call } from './call';
import {
	NtfyEndpointInputSchemas as Inputs,
	NtfyEndpointOutputSchemas as Outputs,
} from './types';

export const usage: NtfyEndpoints['accountUsage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.usage',
			input: Inputs.accountUsage,
			output: Outputs.accountUsage,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v1/account',
		}),
		{
			log: (_, result) => ({
				role: result.role,
				messagesUsed: result.stats.messages ?? 0,
				messagesRemaining: result.stats.messages_remaining ?? 0,
			}),
		},
	);
