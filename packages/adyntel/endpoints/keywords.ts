import type { AdyntelEndpoints } from '..';
import { call } from './call';
import {
	AdyntelEndpointInputSchemas as Inputs,
	AdyntelEndpointOutputSchemas as Outputs,
} from './types';

export const paidVsOrganic: AdyntelEndpoints['paidVsOrganic'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'keywords.paidVsOrganic',
			input: Inputs.paidVsOrganic,
			output: Outputs.paidVsOrganic,
		},
		input,
		(parsed) => ({
			path: 'domain-keywords',
			operation: 'domainKeywords',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				organicCount: result.organic?.count ?? undefined,
				paidCount: result.paid?.count ?? undefined,
			}),
		},
	);
