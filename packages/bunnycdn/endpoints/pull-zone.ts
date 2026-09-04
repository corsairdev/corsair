import type { BunnycdnContext } from '../index';
import { api, apiVoid } from './helpers';
import type {
	BunnycdnEndpointInputs,
	BunnycdnEndpointOutputs,
	EdgeRuleDeleteInput,
	EdgeRuleSetEnabledInput,
	EdgeRuleUpsertInput,
	PullZoneAvailabilityInput,
	PullZoneBlockedIpInput,
	PullZoneCreateInput,
	PullZoneDateRangeInput,
	PullZoneDeleteInput,
	PullZoneGetInput,
	PullZoneListInput,
	PullZonePurgeInput,
	PullZoneReferrerInput,
	PullZoneResetSecurityKeyInput,
	PullZoneSetForceSSLInput,
	PullZoneUpdateInput,
} from './types';

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/list-pull-zones
export async function list(
	ctx: BunnycdnContext,
	input: PullZoneListInput = {},
): Promise<BunnycdnEndpointOutputs['pullZoneList']> {
	return api(ctx, 'core', 'GET', '/pullzone', {
		query: {
			page: input.page,
			perPage: input.perPage,
			search: input.search,
			includeCertificate: input.includeCertificate,
		},
	});
}

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/get-pull-zone
export async function get(
	ctx: BunnycdnContext,
	input: PullZoneGetInput,
): Promise<BunnycdnEndpointOutputs['pullZoneGet']> {
	return api(ctx, 'core', 'GET', `/pullzone/${input.id}`, {
		query: { includeCertificate: input.includeCertificate },
	});
}

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/add-pull-zone
export async function create(
	ctx: BunnycdnContext,
	input: PullZoneCreateInput,
): Promise<BunnycdnEndpointOutputs['pullZoneCreate']> {
	const { name, originUrl, type, settings } = input;
	return api(ctx, 'core', 'POST', '/pullzone', {
		body: {
			Name: name,
			OriginUrl: originUrl,
			Type: type,
			...(settings ?? {}),
		},
	});
}

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/update-pull-zone
export async function update(
	ctx: BunnycdnContext,
	input: PullZoneUpdateInput,
): Promise<BunnycdnEndpointOutputs['pullZoneUpdate']> {
	return api(ctx, 'core', 'POST', `/pullzone/${input.id}`, {
		body: { ...input.settings },
	});
}

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/delete-pull-zone
export async function remove(
	ctx: BunnycdnContext,
	input: PullZoneDeleteInput,
): Promise<BunnycdnEndpointOutputs['pullZoneDelete']> {
	return apiVoid(ctx, 'core', 'DELETE', `/pullzone/${input.id}`);
}

// Docs: https://bunny.net/docs/api-reference/core/pull-zone/purge-cache
export async function purgeCache(
	ctx: BunnycdnContext,
	input: PullZonePurgeInput,
): Promise<BunnycdnEndpointOutputs['pullZonePurge']> {
	return apiVoid(ctx, 'core', 'POST', `/pullzone/${input.id}/purgeCache`, {
		body: input.cacheTag ? { CacheTag: input.cacheTag } : {},
	});
}

export async function checkAvailability(
	ctx: BunnycdnContext,
	input: PullZoneAvailabilityInput = {},
): Promise<BunnycdnEndpointOutputs['pullZoneAvailability']> {
	return api(ctx, 'core', 'POST', '/pullzone/checkavailability', {
		body: { Name: input.name },
	});
}

export async function addAllowedReferrer(
	ctx: BunnycdnContext,
	input: PullZoneReferrerInput,
): Promise<BunnycdnEndpointOutputs['pullZoneReferrer']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.id}/addAllowedReferrer`,
		{
			body: { Hostname: input.hostname },
		},
	);
}

export async function removeAllowedReferrer(
	ctx: BunnycdnContext,
	input: PullZoneReferrerInput,
): Promise<BunnycdnEndpointOutputs['pullZoneReferrer']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.id}/removeAllowedReferrer`,
		{ body: { Hostname: input.hostname } },
	);
}

export async function addBlockedIp(
	ctx: BunnycdnContext,
	input: PullZoneBlockedIpInput,
): Promise<BunnycdnEndpointOutputs['pullZoneBlockedIp']> {
	return apiVoid(ctx, 'core', 'POST', `/pullzone/${input.id}/addBlockedIp`, {
		body: { BlockedIp: input.blockedIp },
	});
}

export async function removeBlockedIp(
	ctx: BunnycdnContext,
	input: PullZoneBlockedIpInput,
): Promise<BunnycdnEndpointOutputs['pullZoneBlockedIp']> {
	return apiVoid(ctx, 'core', 'POST', `/pullzone/${input.id}/removeBlockedIp`, {
		body: { BlockedIp: input.blockedIp },
	});
}

export async function addBlockedReferrer(
	ctx: BunnycdnContext,
	input: PullZoneReferrerInput,
): Promise<BunnycdnEndpointOutputs['pullZoneBlockedIp']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.id}/addBlockedReferrer`,
		{ body: { Hostname: input.hostname } },
	);
}

export async function removeBlockedReferrer(
	ctx: BunnycdnContext,
	input: PullZoneReferrerInput,
): Promise<BunnycdnEndpointOutputs['pullZoneBlockedIp']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.id}/removeBlockedReferrer`,
		{ body: { Hostname: input.hostname } },
	);
}

export async function resetSecurityKey(
	ctx: BunnycdnContext,
	input: PullZoneResetSecurityKeyInput,
): Promise<BunnycdnEndpointOutputs['pullZoneSecurityKey']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.id}/resetSecurityKey`,
		{
			body: input.securityKey ? { SecurityKey: input.securityKey } : {},
		},
	);
}

export async function setForceSSL(
	ctx: BunnycdnContext,
	input: PullZoneSetForceSSLInput,
): Promise<BunnycdnEndpointOutputs['pullZoneForceSSL']> {
	return apiVoid(ctx, 'core', 'POST', `/pullzone/${input.id}/setForceSSL`, {
		body: { Hostname: input.hostname, ForceSSL: input.forceSSL },
	});
}

export async function edgeRuleUpsert(
	ctx: BunnycdnContext,
	input: EdgeRuleUpsertInput,
): Promise<BunnycdnEndpointOutputs['edgeRuleUpsert']> {
	return api(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.pullZoneId}/edgerules/addOrUpdate`,
		{
			body: { ...input.rule },
		},
	);
}

export async function edgeRuleDelete(
	ctx: BunnycdnContext,
	input: EdgeRuleDeleteInput,
): Promise<BunnycdnEndpointOutputs['edgeRuleDelete']> {
	return apiVoid(
		ctx,
		'core',
		'DELETE',
		`/pullzone/${input.pullZoneId}/edgerules/${input.edgeRuleId}`,
	);
}

export async function edgeRuleSetEnabled(
	ctx: BunnycdnContext,
	input: EdgeRuleSetEnabledInput,
): Promise<BunnycdnEndpointOutputs['edgeRuleSetEnabled']> {
	return apiVoid(
		ctx,
		'core',
		'POST',
		`/pullzone/${input.pullZoneId}/edgerules/${input.edgeRuleId}/setEdgeRuleEnabled`,
		{ body: { Value: input.value } },
	);
}

export async function optimizerStatistics(
	ctx: BunnycdnContext,
	input: PullZoneDateRangeInput,
): Promise<BunnycdnEndpointOutputs['pullZoneDateRange']> {
	return api(
		ctx,
		'core',
		'GET',
		`/pullzone/${input.pullZoneId}/optimizer/statistics`,
		{
			query: {
				dateFrom: input.dateFrom,
				dateTo: input.dateTo,
				hourly: input.hourly,
			},
		},
	);
}

export async function originShieldQueueStatistics(
	ctx: BunnycdnContext,
	input: PullZoneDateRangeInput,
): Promise<BunnycdnEndpointOutputs['pullZoneDateRange']> {
	return api(
		ctx,
		'core',
		'GET',
		`/pullzone/${input.pullZoneId}/originshield/queuestatistics`,
		{
			query: {
				dateFrom: input.dateFrom,
				dateTo: input.dateTo,
				hourly: input.hourly,
			},
		},
	);
}

export async function safeHopStatistics(
	ctx: BunnycdnContext,
	input: PullZoneDateRangeInput,
): Promise<BunnycdnEndpointOutputs['pullZoneDateRange']> {
	return api(
		ctx,
		'core',
		'GET',
		`/pullzone/${input.pullZoneId}/safehop/statistics`,
		{
			query: {
				dateFrom: input.dateFrom,
				dateTo: input.dateTo,
				hourly: input.hourly,
			},
		},
	);
}

export type {
	BunnycdnEndpointInputs,
	PullZoneAvailabilityInput,
	PullZoneBlockedIpInput,
	PullZoneCreateInput,
	PullZoneDeleteInput,
	PullZoneGetInput,
	PullZoneListInput,
	PullZonePurgeInput,
	PullZoneReferrerInput,
	PullZoneResetSecurityKeyInput,
	PullZoneSetForceSSLInput,
	PullZoneUpdateInput,
	PullZoneDateRangeInput,
};
