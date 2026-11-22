import type { StatusCakeEndpoints } from '..';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const uptime: StatusCakeEndpoints['uptimeLocations'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uptimeLocations.list',
			input: Inputs.uptimeLocations,
			output: Outputs.uptimeLocations,
		},
		input,
		({ region_code }) => ({
			method: 'GET',
			path: '/uptime-locations',
			query: { region_code },
		}),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const pagespeed: StatusCakeEndpoints['pagespeedLocations'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pagespeedLocations.list',
			input: Inputs.pagespeedLocations,
			output: Outputs.pagespeedLocations,
		},
		input,
		({ location }) => ({
			method: 'GET',
			path: '/pagespeed-locations',
			query: { location },
		}),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);
