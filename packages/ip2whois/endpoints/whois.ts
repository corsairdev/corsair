import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeIp2whoisRequest } from '../client';
import type { Ip2whoisContext } from '../context';
import {
	Ip2whoisDomainEntity,
	Ip2whoisHostedDomainEntity,
} from '../schema/database';
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
	await storeDomain(ctx, result);
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
	const body = await makeIp2whoisRequest<unknown>(ctx.key, '/domains', {
		ip: parsed.ip,
		page: parsed.page,
	});
	const failure = failureMessage(body);
	if (failure) {
		throw new Error(`IP2WHOIS lookup failed: ${failure}`);
	}
	const result = HostedLookupResponseSchema.parse(body);
	await storeHostedDomains(ctx, result.ip, result.domains);
	await logEventFromContext(
		ctx,
		'ip2whois.hosted.lookup',
		{ page: parsed.page ?? 1 },
		'completed',
	);
	return result;
};

async function storeDomain(
	ctx: Ip2whoisContext,
	result: DomainLookupResponse,
): Promise<void> {
	if (!ctx.db?.domains) return;
	const row = Ip2whoisDomainEntity.safeParse(result);
	if (!row.success) return;
	try {
		await ctx.db.domains.upsertByEntityId(row.data.domain, row.data);
	} catch {
		console.warn('Failed to save IP2WHOIS domain');
	}
}

async function storeHostedDomains(
	ctx: Ip2whoisContext,
	hostIp: string,
	domains: HostedLookupResponse['domains'],
): Promise<void> {
	if (!ctx.db?.hostedDomains) return;
	for (const domain of domains) {
		const row = Ip2whoisHostedDomainEntity.safeParse({ domain, hostIp });
		if (!row.success) continue;
		try {
			await ctx.db.hostedDomains.upsertByEntityId(
				`${row.data.hostIp}:${row.data.domain}`,
				row.data,
			);
		} catch {
			console.warn('Failed to save IP2WHOIS hosted domain');
		}
	}
}

export const Domain = { lookup: lookupDomain };
export const Hosted = { lookup: lookupHosted };
