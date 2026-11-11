import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

/** Checks that the key and site pair work, and that the service is up. */
export const ping: WaiverFileEndpoints['ping'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'ping', input: Inputs.ping, output: Outputs.ping },
		input,
		() => ({ method: 'GET', path: '/api/v1/Ping' }),
		{ log: (_, result) => ({ message: result.Message ?? undefined }) },
	);

/** The site behind the credentials: its name, timezone and contact details. */
export const get: WaiverFileEndpoints['siteGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'site.get', input: Inputs.siteGet, output: Outputs.siteGet },
		input,
		() => ({ method: 'GET', path: '/api/v1/GetSiteDetails' }),
		{
			log: (_, result) => ({
				id: result.SiteID ?? undefined,
				name: result.Name ?? result.SiteName ?? undefined,
			}),
		},
	);
