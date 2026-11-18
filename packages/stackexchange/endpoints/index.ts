import { logEventFromContext } from 'corsair/core';
import type { StackExchangeContext } from '..';
import { makeStackExchangeRequest } from '../client';
import type { RouteGroup } from './routes';
import { getRoute } from './routes';
import type { NetworkReadInput, SiteReadInput, SiteWriteInput } from './types';
import {
	StackExchangeEndpointInputSchemas,
	StackExchangeEndpointOutputSchemas,
} from './types';

// Method item types vary by route; the operation parses the common wrapper next.
async function execute(
	ctx: StackExchangeContext,
	group: RouteGroup,
	input: SiteReadInput | SiteWriteInput | NetworkReadInput,
): Promise<unknown> {
	const route = getRoute(group, input.route);
	const response = await makeStackExchangeRequest(
		group,
		input.route,
		ctx.key,
		ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key',
		{
			method: 'method' in input ? input.method : undefined,
			...(route.site && 'site' in input ? { site: input.site } : {}),
			pathParams: input.pathParams,
			parameters: input.parameters,
		},
	);

	// Provider JSON is untrusted until the response schema parses it below.
	return response;
}

export const siteRead = async (
	ctx: StackExchangeContext,
	input: SiteReadInput,
) => {
	const parsedInput = StackExchangeEndpointInputSchemas.siteRead.parse(input);
	const response = await execute(ctx, 'siteRead', parsedInput);
	const parsed = StackExchangeEndpointOutputSchemas.siteRead.parse(response);
	await logEventFromContext(
		ctx,
		'stackexchange.site_read',
		{ route: parsedInput.route },
		'completed',
	);
	return parsed;
};

export const siteWrite = async (
	ctx: StackExchangeContext,
	input: SiteWriteInput,
) => {
	const parsedInput = StackExchangeEndpointInputSchemas.siteWrite.parse(input);
	const response = await execute(ctx, 'siteWrite', parsedInput);
	const parsed = StackExchangeEndpointOutputSchemas.siteWrite.parse(response);
	await logEventFromContext(
		ctx,
		'stackexchange.site_write',
		{ route: parsedInput.route },
		'completed',
	);
	return parsed;
};

export const networkRead = async (
	ctx: StackExchangeContext,
	input: NetworkReadInput,
) => {
	const parsedInput =
		StackExchangeEndpointInputSchemas.networkRead.parse(input);
	const response = await execute(ctx, 'networkRead', parsedInput);
	const parsed = StackExchangeEndpointOutputSchemas.networkRead.parse(response);
	await logEventFromContext(
		ctx,
		'stackexchange.network_read',
		{ route: parsedInput.route },
		'completed',
	);
	return parsed;
};

export { ROUTE_GROUPS } from './routes';
export * from './types';
