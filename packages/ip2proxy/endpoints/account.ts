import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeIp2proxyRequest } from '../client';
import type { Ip2proxyContext } from '../context';
import type { GetCreditsInput, GetCreditsResponse } from './types';
import { GetCreditsInputSchema, GetCreditsResponseSchema } from './types';

export const getCredits: CorsairEndpoint<
	Ip2proxyContext,
	GetCreditsInput,
	GetCreditsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('ip2proxy', 'api_key');
	}

	GetCreditsInputSchema.parse(input ?? {});
	// `unknown` until GetCreditsResponseSchema parses it: the body is untrusted provider JSON.
	const body = await makeIp2proxyRequest<unknown>(ctx.key, { check: true });
	// An unknown key gets HTTP 200 with a bare `null` body instead of a 401.
	if (body === null || body === undefined) {
		throw new Error(
			'IP2Proxy returned no credit balance. Check that the API key is valid (invalid API key).',
		);
	}
	const result = GetCreditsResponseSchema.parse(body);

	await logEventFromContext(
		ctx,
		'ip2proxy.account.getCredits',
		{},
		'completed',
	);

	return result;
};

export const Account = { getCredits };
