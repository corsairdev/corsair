import type { PiloterrEndpoints } from '..';
import { call } from './call';
import {
	PiloterrEndpointInputSchemas as Inputs,
	PiloterrEndpointOutputSchemas as Outputs,
} from './types';

const V2 = '/v2';

export const finder: PiloterrEndpoints['emailFinder'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.finder',
			input: Inputs.emailFinder,
			output: Outputs.emailFinder,
		},
		input,
		({ query, companyDomain, companyName, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/email/finder`,
			query: {
				query,
				company_domain: companyDomain,
				company_name: companyName,
				soft_fail: softFail,
				fields,
			},
		}),
		{ log: (_, found) => ({ email: found.email ?? undefined }) },
	);

export const verify: PiloterrEndpoints['emailVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.verify',
			input: Inputs.emailVerify,
			output: Outputs.emailVerify,
		},
		input,
		({ query, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/email/verify`,
			query: { query, soft_fail: softFail, fields },
		}),
		{ log: (_, verified) => ({ status: verified.status ?? undefined }) },
	);

export const analyzes: PiloterrEndpoints['emailAnalyzes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.analyzes',
			input: Inputs.emailAnalyzes,
			output: Outputs.emailAnalyzes,
		},
		input,
		({ query, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/email/analyzes`,
			query: { query, soft_fail: softFail, fields },
		}),
		{
			log: (_, analyzed) => ({
				isMicrosoft365: analyzed.is_microsoft_365 ?? undefined,
			}),
		},
	);
