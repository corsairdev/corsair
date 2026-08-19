import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type { NextDNSSecurity, NextDNSSecurityTld } from './types';

export const get: NextDNSEndpoints['securityGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSSecurity }>(
		ctx,
		`/profiles/${input.profileId}/security`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.security.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/**
 * Confirmed live: `PATCH .../security` returns `204` with no body, unlike
 * `setup/linkedip` which returns the updated resource. A `GET` after the
 * `PATCH` is the only way to hand the caller the resulting state.
 */
export const update: NextDNSEndpoints['securityUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/security`, {
		method: 'PATCH',
		body: compactBody({
			threatIntelligenceFeeds: input.threatIntelligenceFeeds,
			aiThreatDetection: input.aiThreatDetection,
			googleSafeBrowsing: input.googleSafeBrowsing,
			cryptojacking: input.cryptojacking,
			dnsRebinding: input.dnsRebinding,
			idnHomographs: input.idnHomographs,
			typosquatting: input.typosquatting,
			dga: input.dga,
			nrd: input.nrd,
			ddns: input.ddns,
			parking: input.parking,
			csam: input.csam,
		}),
	});
	const result = await nextDNSCall<{ data: NextDNSSecurity }>(
		ctx,
		`/profiles/${input.profileId}/security`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.security.update',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

export const getTlds: NextDNSEndpoints['securityGetTlds'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSSecurityTld[] }>(
		ctx,
		`/profiles/${input.profileId}/security/tlds`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.security.getTlds',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? [];
};

export const addBlockedTld: NextDNSEndpoints['securityAddBlockedTld'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/security/tlds`, {
		method: 'POST',
		body: { id: input.id },
	});
	await logEventFromContext(
		ctx,
		'nextdns.security.addBlockedTld',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const removeBlockedTld: NextDNSEndpoints['securityRemoveBlockedTld'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/security/tlds/${input.id}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'nextdns.security.removeBlockedTld',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const replaceTlds: NextDNSEndpoints['securityReplaceTlds'] = async (
	ctx,
	input,
) => {
	const body = input.tlds.map((id) => ({ id }));
	const result = await nextDNSCall<{ data: NextDNSSecurityTld[] }>(
		ctx,
		`/profiles/${input.profileId}/security/tlds`,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'nextdns.security.replaceTlds',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data ?? body;
};
