import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeIp2proxyRequest } from '../client';
import type { Ip2proxyContext } from '../context';
import { Ip2proxyCheckEntity } from '../schema/database';
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
	// `unknown` until CheckProxyResponseSchema parses it: the body is untrusted provider JSON.
	const body = await makeIp2proxyRequest<unknown>(ctx.key, {
		ip: parsed.ip,
		package: parsed.package,
	});
	const result = CheckProxyResponseSchema.parse(body);

	if (result.response !== 'OK') {
		throw new Error(`IP2Proxy lookup failed: ${result.response}`);
	}

	await storeCheck(ctx, parsed.ip, result);
	await logEventFromContext(
		ctx,
		'ip2proxy.proxy.checkProxy',
		{ package: parsed.package ?? 'PX1' },
		'completed',
	);

	return result;
};

async function storeCheck(
	ctx: Ip2proxyContext,
	ip: string | undefined,
	result: CheckProxyResponse,
): Promise<void> {
	if (!ip || !ctx.db?.checks) return;
	const row = Ip2proxyCheckEntity.safeParse({ ip, ...result });
	if (!row.success) return;
	try {
		await ctx.db.checks.upsertByEntityId(row.data.ip, row.data);
	} catch {
		console.warn('Failed to save IP2Proxy check');
	}
}

export const Proxy = { checkProxy };
