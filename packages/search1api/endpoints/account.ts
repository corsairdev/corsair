import type { Search1APIEndpoints } from '..';
import { makeSearch1APIRequest } from '../client';
import { callSearch1API } from './call';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './types';

export const usage: Search1APIEndpoints['usage'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.account.usage',
		Search1APIEndpointInputSchemas.usage,
		Search1APIEndpointOutputSchemas.usage,
		input,
		(validated) =>
			makeSearch1APIRequest('/usage', ctx.key, {
				method: 'GET',
				// The shared client drops undefined query values, so no period
				// means no query string.
				query: { period: validated.period },
			}),
		(_validated, response) => ({
			usage: response.usage,
			credentialType: response.credential_type,
		}),
	);
};

export const health: Search1APIEndpoints['health'] = async (ctx, input) => {
	return callSearch1API(
		ctx,
		'search1api.account.health',
		Search1APIEndpointInputSchemas.health,
		Search1APIEndpointOutputSchemas.health,
		input,
		() => makeSearch1APIRequest('/health', ctx.key, { method: 'GET' }),
		(_validated, response) => ({
			status: response.status,
			timestamp: response.timestamp,
			version: response.version,
		}),
	);
};
