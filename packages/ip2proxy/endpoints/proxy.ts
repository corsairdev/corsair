import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { Ip2proxyContext } from '..';
import { makeIp2proxyRequest } from '../client';
import type { CheckProxyInput, CheckProxyResponse } from './types';
import { CheckProxyInputSchema, CheckProxyResponseSchema } from './types';

export const checkProxy: CorsairEndpoint<
	Ip2proxyContext,
	CheckProxyInput,
	CheckProxyResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('ip2proxy', 'api_key');
	}

	const parsed = CheckProxyInputSchema.parse(input);
	const body = await makeIp2proxyRequest<unknown>(ctx.key, {
		ip: parsed.ip,
		package: parsed.package,
	});
	const result = CheckProxyResponseSchema.parse(body);

	if (result.response !== 'OK') {
		throw new Error(`IP2Proxy lookup failed: ${result.response}`);
	}

	await logEventFromContext(
		ctx,
		'ip2proxy.proxy.checkProxy',
		{ package: parsed.package ?? 'PX1' },
		'completed',
	);

	return result;
};

export const Proxy = { checkProxy };
