import { logEventFromContext } from 'corsair/core';
import { makeCloudflareApiKeyRequest } from '../client';
import type { CloudflareApiKeyEndpoints } from '../index';
import {
	persistDnsRecord,
	persistDnssec,
	persistLockdown,
	persistR2Object,
	persistRuleset,
	persistZone,
	deleteDnsRecord as removeDnsRecordFromDb,
	deleteDnssec as removeDnssecFromDb,
	deleteRuleset as removeRulesetFromDb,
	deleteZone as removeZoneFromDb,
} from '../persist';
import type { CloudflareApiKeyEndpointOutputs } from './types';

function rulesetBase(input: { account_id?: string; zone_id?: string }): string {
	if (input.account_id) return `/accounts/${input.account_id}`;
	return `/zones/${input.zone_id}`;
}

function rulesetScope(input: { account_id?: string; zone_id?: string }): {
	account_id?: string;
	zone_id?: string;
} {
	return { account_id: input.account_id, zone_id: input.zone_id };
}

export const zonesList: CloudflareApiKeyEndpoints['zonesList'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['zonesList']
	>('/zones', ctx.key, { method: 'GET', query: { ...input } });

	if (ctx.db.zones) {
		for (const zone of result) {
			await persistZone(zone, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflareapikey.zones.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const zonesGet: CloudflareApiKeyEndpoints['zonesGet'] = async (
	ctx,
	input,
) => {
	const { zone_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['zonesGet']
	>(`/zones/${zone_id}`, ctx.key, { method: 'GET' });

	await persistZone(result, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.zones.get',
		{ zone_id },
		'completed',
	);
	return result;
};

export const zonesUpdate: CloudflareApiKeyEndpoints['zonesUpdate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['zonesUpdate']
	>(`/zones/${zone_id}`, ctx.key, { method: 'PATCH', body });

	await persistZone(result, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.zones.update',
		{ zone_id },
		'completed',
	);
	return result;
};

export const zonesDelete: CloudflareApiKeyEndpoints['zonesDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['zonesDelete']
	>(`/zones/${zone_id}`, ctx.key, { method: 'DELETE' });

	await removeZoneFromDb(zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.zones.delete',
		{ zone_id },
		'completed',
	);
	return result;
};

export const zonesRerunActivationCheck: CloudflareApiKeyEndpoints['zonesRerunActivationCheck'] =
	async (ctx, input) => {
		const { zone_id } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['zonesRerunActivationCheck']
		>(`/zones/${zone_id}/activation_check`, ctx.key, {
			method: 'PUT',
			body: {},
		});

		await persistZone(result, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.zones.rerunActivationCheck',
			{ zone_id },
			'completed',
		);
		return result;
	};

export const dnsList: CloudflareApiKeyEndpoints['dnsList'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...query } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnsList']
	>(`/zones/${zone_id}/dns_records`, ctx.key, { method: 'GET', query });

	if (ctx.db.dnsRecords) {
		for (const record of result) {
			await persistDnsRecord(record, zone_id, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflareapikey.dns.list',
		{ zone_id },
		'completed',
	);
	return result;
};

export const dnsCreate: CloudflareApiKeyEndpoints['dnsCreate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnsCreate']
	>(`/zones/${zone_id}/dns_records`, ctx.key, { method: 'POST', body });

	await persistDnsRecord(result, zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.dns.create',
		{ zone_id },
		'completed',
	);
	return result;
};

export const dnsOverwrite: CloudflareApiKeyEndpoints['dnsOverwrite'] = async (
	ctx,
	input,
) => {
	const { zone_id, dns_record_id, ...body } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnsOverwrite']
	>(`/zones/${zone_id}/dns_records/${dns_record_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await persistDnsRecord(result, zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.dns.overwrite',
		{ zone_id, dns_record_id },
		'completed',
	);
	return result;
};

export const dnsDelete: CloudflareApiKeyEndpoints['dnsDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id, dns_record_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnsDelete']
	>(`/zones/${zone_id}/dns_records/${dns_record_id}`, ctx.key, {
		method: 'DELETE',
	});

	await removeDnsRecordFromDb(dns_record_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.dns.delete',
		{ zone_id, dns_record_id },
		'completed',
	);
	return result;
};

export const dnssecUpdate: CloudflareApiKeyEndpoints['dnssecUpdate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnssecUpdate']
	>(`/zones/${zone_id}/dnssec`, ctx.key, { method: 'PATCH', body });

	await persistDnssec(result, zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.dnssec.update',
		{ zone_id },
		'completed',
	);
	return result;
};

export const dnssecDelete: CloudflareApiKeyEndpoints['dnssecDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['dnssecDelete']
	>(`/zones/${zone_id}/dnssec`, ctx.key, { method: 'DELETE' });

	await removeDnssecFromDb(zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.dnssec.delete',
		{ zone_id },
		'completed',
	);
	return result;
};

export const lockdownsCreate: CloudflareApiKeyEndpoints['lockdownsCreate'] =
	async (ctx, input) => {
		const { zone_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['lockdownsCreate']
		>(`/zones/${zone_id}/firewall/lockdowns`, ctx.key, {
			method: 'POST',
			body,
		});

		await persistLockdown(result, zone_id, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.lockdowns.create',
			{ zone_id },
			'completed',
		);
		return result;
	};

export const lockdownsGet: CloudflareApiKeyEndpoints['lockdownsGet'] = async (
	ctx,
	input,
) => {
	const { zone_id, lockdown_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['lockdownsGet']
	>(`/zones/${zone_id}/firewall/lockdowns/${lockdown_id}`, ctx.key, {
		method: 'GET',
	});

	await persistLockdown(result, zone_id, ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.lockdowns.get',
		{ zone_id, lockdown_id },
		'completed',
	);
	return result;
};

export const lockdownsUpdate: CloudflareApiKeyEndpoints['lockdownsUpdate'] =
	async (ctx, input) => {
		const { zone_id, lockdown_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['lockdownsUpdate']
		>(`/zones/${zone_id}/firewall/lockdowns/${lockdown_id}`, ctx.key, {
			method: 'PUT',
			body,
		});

		await persistLockdown(result, zone_id, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.lockdowns.update',
			{ zone_id, lockdown_id },
			'completed',
		);
		return result;
	};

export const rulesetsGet: CloudflareApiKeyEndpoints['rulesetsGet'] = async (
	ctx,
	input,
) => {
	const { ruleset_id } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['rulesetsGet']
	>(`${rulesetBase(input)}/rulesets/${ruleset_id}`, ctx.key, {
		method: 'GET',
	});

	await persistRuleset(result, rulesetScope(input), ctx.db);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.rulesets.get',
		{ ruleset_id },
		'completed',
	);
	return result;
};

export const rulesetsCreate: CloudflareApiKeyEndpoints['rulesetsCreate'] =
	async (ctx, input) => {
		const { account_id, zone_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsCreate']
		>(`${rulesetBase(input)}/rulesets`, ctx.key, { method: 'POST', body });

		await persistRuleset(result, { account_id, zone_id }, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.create',
			{ account_id, zone_id },
			'completed',
		);
		return result;
	};

export const rulesetsUpdate: CloudflareApiKeyEndpoints['rulesetsUpdate'] =
	async (ctx, input) => {
		const { account_id, zone_id, ruleset_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsUpdate']
		>(`${rulesetBase(input)}/rulesets/${ruleset_id}`, ctx.key, {
			method: 'PUT',
			body,
		});

		await persistRuleset(result, { account_id, zone_id }, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.update',
			{ ruleset_id },
			'completed',
		);
		return result;
	};

export const rulesetsDelete: CloudflareApiKeyEndpoints['rulesetsDelete'] =
	async (ctx, input) => {
		const { ruleset_id } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsDelete']
		>(`${rulesetBase(input)}/rulesets/${ruleset_id}`, ctx.key, {
			method: 'DELETE',
		});

		await removeRulesetFromDb(ruleset_id, ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.delete',
			{ ruleset_id },
			'completed',
		);
		return result;
	};

export const rulesetsCreateRule: CloudflareApiKeyEndpoints['rulesetsCreateRule'] =
	async (ctx, input) => {
		const { account_id, zone_id, ruleset_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsCreateRule']
		>(`${rulesetBase(input)}/rulesets/${ruleset_id}/rules`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.createRule',
			{ account_id, zone_id, ruleset_id },
			'completed',
		);
		return result;
	};

export const rulesetsUpdateRule: CloudflareApiKeyEndpoints['rulesetsUpdateRule'] =
	async (ctx, input) => {
		const { account_id, zone_id, ruleset_id, rule_id, ...body } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsUpdateRule']
		>(
			`${rulesetBase(input)}/rulesets/${ruleset_id}/rules/${rule_id}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);

		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.updateRule',
			{ account_id, zone_id, ruleset_id, rule_id },
			'completed',
		);
		return result;
	};

export const rulesetsDeleteRule: CloudflareApiKeyEndpoints['rulesetsDeleteRule'] =
	async (ctx, input) => {
		const { ruleset_id, rule_id } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsDeleteRule']
		>(
			`${rulesetBase(input)}/rulesets/${ruleset_id}/rules/${rule_id}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.deleteRule',
			{ ruleset_id, rule_id },
			'completed',
		);
		return result;
	};

export const rulesetsGetEntrypointVersion: CloudflareApiKeyEndpoints['rulesetsGetEntrypointVersion'] =
	async (ctx, input) => {
		const { ruleset_phase, ruleset_version } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['rulesetsGetEntrypointVersion']
		>(
			`${rulesetBase(input)}/rulesets/phases/${ruleset_phase}/entrypoint/versions/${ruleset_version}`,
			ctx.key,
			{ method: 'GET' },
		);

		await persistRuleset(result, rulesetScope(input), ctx.db);
		await logEventFromContext(
			ctx,
			'cloudflareapikey.rulesets.getEntrypointVersion',
			{ ruleset_phase, ruleset_version },
			'completed',
		);
		return result;
	};

export const cacheGetRegionalTieredCache: CloudflareApiKeyEndpoints['cacheGetRegionalTieredCache'] =
	async (ctx, input) => {
		const { zone_id } = input;
		const result = await makeCloudflareApiKeyRequest<
			CloudflareApiKeyEndpointOutputs['cacheGetRegionalTieredCache']
		>(`/zones/${zone_id}/cache/regional_tiered_cache`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'cloudflareapikey.cache.getRegionalTieredCache',
			{ zone_id },
			'completed',
		);
		return result;
	};

export const ipsGet: CloudflareApiKeyEndpoints['ipsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['ipsGet']
	>('/ips', ctx.key, { method: 'GET', query: { ...input } });

	await logEventFromContext(
		ctx,
		'cloudflareapikey.ips.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const s3Upload: CloudflareApiKeyEndpoints['s3Upload'] = async (
	ctx,
	input,
) => {
	const { account_id, bucket_name, object_key, content, content_type } = input;
	const result = await makeCloudflareApiKeyRequest<
		CloudflareApiKeyEndpointOutputs['s3Upload']
	>(
		`/accounts/${account_id}/r2/buckets/${bucket_name}/objects/${object_key}`,
		ctx.key,
		{
			method: 'PUT',
			rawBody: content,
			mediaType: content_type ?? 'application/octet-stream',
		},
	);

	await persistR2Object(
		{ ...result, key: result.key ?? object_key },
		account_id,
		bucket_name,
		ctx.db,
	);
	await logEventFromContext(
		ctx,
		'cloudflareapikey.s3.upload',
		{ account_id, bucket_name, object_key },
		'completed',
	);
	return result;
};

export const ZonesEndpoints = {
	list: zonesList,
	get: zonesGet,
	update: zonesUpdate,
	delete: zonesDelete,
	rerunActivationCheck: zonesRerunActivationCheck,
};

export const DNSEndpoints = {
	list: dnsList,
	create: dnsCreate,
	overwrite: dnsOverwrite,
	delete: dnsDelete,
};

export const DnssecEndpoints = {
	update: dnssecUpdate,
	delete: dnssecDelete,
};

export const LockdownsEndpoints = {
	create: lockdownsCreate,
	get: lockdownsGet,
	update: lockdownsUpdate,
};

export const RulesetsEndpoints = {
	get: rulesetsGet,
	create: rulesetsCreate,
	update: rulesetsUpdate,
	delete: rulesetsDelete,
	createRule: rulesetsCreateRule,
	updateRule: rulesetsUpdateRule,
	deleteRule: rulesetsDeleteRule,
	getEntrypointVersion: rulesetsGetEntrypointVersion,
};

export const CacheEndpoints = {
	getRegionalTieredCache: cacheGetRegionalTieredCache,
};

export const IpsEndpoints = {
	get: ipsGet,
};

export const S3Endpoints = {
	upload: s3Upload,
};

export * from './types';
