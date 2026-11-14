import type { ScrapingAntEndpoints } from '..';
import { parseJsonObject } from '../client';
import { call } from './call';
import {
	ScrapingAntEndpointInputSchemas as Inputs,
	ScrapingAntEndpointOutputSchemas as Outputs,
} from './types';

export const usage: ScrapingAntEndpoints['accountUsage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.usage',
			input: Inputs.accountUsage,
			output: Outputs.accountUsage,
		},
		input,
		() => ({}),
		{
			path: '/v2/usage',
			shape: (raw) => parseJsonObject(raw),
			log: (_, result) => ({
				plan: result.plan_name,
				remainedCredits: result.remained_credits,
			}),
		},
	);
