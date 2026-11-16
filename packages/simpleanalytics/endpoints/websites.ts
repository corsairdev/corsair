import type { SimpleanalyticsEndpoints } from '..';
import { adminHeaders, call } from './shared';
import {
	SimpleanalyticsEndpointInputSchemas as Inputs,
	SimpleanalyticsEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleanalyticsEndpoints['websitesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'websites.list',
			input: Inputs.websitesList,
			output: Outputs.websitesList,
		},
		input,
		async () => ({
			method: 'GET',
			path: '/api/websites',
			headers: await adminHeaders(ctx),
		}),
		{
			log: (_, result) => ({ count: result.websites.length }),
		},
	);

export const add: SimpleanalyticsEndpoints['websitesAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'websites.add',
			input: Inputs.websitesAdd,
			output: Outputs.websitesAdd,
		},
		input,
		async (parsed) => ({
			method: 'POST',
			path: '/api/websites/add',
			headers: await adminHeaders(ctx),
			body: {
				hostname: parsed.hostname,
				isPublic: parsed.isPublic,
				timezone: parsed.timezone,
				label: parsed.label,
			},
		}),
		{
			log: (_parsed, result) => ({
				// The hostname is the customer's, so it stays out. validDNS says
				// whether the site's DNS already points at it.
				validDNS: result.validDNS ?? undefined,
			}),
		},
	);
