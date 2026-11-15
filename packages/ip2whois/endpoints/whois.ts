import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { Ip2whoisContext } from '..';
import { makeIp2whoisRequest } from '../client';
import type {
	DomainLookupInput,
	DomainLookupResponse,
	HostedLookupInput,
	HostedLookupResponse,
} from './types';
import {
	DomainLookupInputSchema,
	DomainLookupResponseSchema,
	HostedLookupInputSchema,
	HostedLookupResponseSchema,
} from './types';

function failureMessage(body: unknown): string | undefined {
	if (!body || typeof body !== 'object' || !('error' in body)) return undefined;
	const error = (body as { error?: unknown }).error;
	if (!error || typeof error !== 'object' || !('error_message' in error)) {
		return undefined;
	}
	const message = (error as { error_message?: unknown }).error_message;
	return typeof message === 'string' ? message : undefined;
}

export const lookupDomain: CorsairEndpoint<
	Ip2whoisContext,
	DomainLookupInput,
	DomainLookupResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('ip2whois', 'api_key');
	}

	const parsed = DomainLookupInputSchema.parse(input);
	const body = await makeIp2whoisRequest<unknown>(ctx.key, '/v2', {
		domain: parsed.domain,
	});
	const failure = failureMessage(body);
	if (failure) {
		throw new Error(`IP2WHOIS lookup failed: ${failure}`);
	}
	const result = DomainLookupResponseSchema.parse(body);
	await logEventFromContext(ctx, 'ip2whois.domain.lookup', {}, 'completed');
	return result;
};

export const lookupHosted: CorsairEndpoint<
	Ip2whoisContext,
	HostedLookupInput,
	HostedLookupResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('ip2whois', 'api_key');
	}

	const parsed = HostedLookupInputSchema.parse(input);
	const body = await makeIp2whoisRequest<unknown>(ctx.key, '/hosteddomain', {
		ip: parsed.ip,
		page: parsed.page,
	});
	const failure = failureMessage(body);
	if (failure) {
		throw new Error(`IP2WHOIS lookup failed: ${failure}`);
	}
	const result = HostedLookupResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'ip2whois.hosted.lookup',
		{ page: parsed.page ?? 1 },
		'completed',
	);
	return result;
};

export const Domain = { lookup: lookupDomain };
export const Hosted = { lookup: lookupHosted };
