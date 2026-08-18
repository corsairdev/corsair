import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type {
	NextDNSSettings,
	NextDNSSettingsBlockPage,
	NextDNSSettingsLogs,
	NextDNSSettingsPerformance,
} from './types';

export const get: NextDNSEndpoints['settingsGet'] = async (ctx, input) => {
	const result = await nextDNSCall<{ data: NextDNSSettings }>(
		ctx,
		`/profiles/${input.profileId}/settings`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Confirmed live: `PATCH .../settings` returns `204` with no body - a `GET` after follows to return the resulting state. */
export const update: NextDNSEndpoints['settingsUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/settings`, {
		method: 'PATCH',
		body: compactBody({
			logs: input.logs,
			blockPage: input.blockPage,
			performance: input.performance,
			web3: input.web3,
		}),
	});
	const result = await nextDNSCall<{ data: NextDNSSettings }>(
		ctx,
		`/profiles/${input.profileId}/settings`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.update',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

export const getBlockPage: NextDNSEndpoints['settingsGetBlockPage'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSSettingsBlockPage }>(
		ctx,
		`/profiles/${input.profileId}/settings/blockPage`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.getBlockPage',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Confirmed live: `PATCH .../settings/blockPage` returns `204` with no body. */
export const updateBlockPage: NextDNSEndpoints['settingsUpdateBlockPage'] =
	async (ctx, input) => {
		await nextDNSCall(ctx, `/profiles/${input.profileId}/settings/blockPage`, {
			method: 'PATCH',
			body: { enabled: input.enabled },
		});
		const result = await nextDNSCall<{ data: NextDNSSettingsBlockPage }>(
			ctx,
			`/profiles/${input.profileId}/settings/blockPage`,
		);
		await logEventFromContext(
			ctx,
			'nextdns.settings.updateBlockPage',
			auditPayload(input, ['profileId', 'enabled']),
			'completed',
		);
		return result.data;
	};

export const getLogs: NextDNSEndpoints['settingsGetLogs'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSSettingsLogs }>(
		ctx,
		`/profiles/${input.profileId}/settings/logs`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.getLogs',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Confirmed live: `PATCH .../settings/logs` returns `204` with no body. */
export const updateLogs: NextDNSEndpoints['settingsUpdateLogs'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/settings/logs`, {
		method: 'PATCH',
		body: compactBody({
			enabled: input.enabled,
			retention: input.retention,
			location: input.location,
		}),
	});
	const result = await nextDNSCall<{ data: NextDNSSettingsLogs }>(
		ctx,
		`/profiles/${input.profileId}/settings/logs`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.updateLogs',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

export const getPerformance: NextDNSEndpoints['settingsGetPerformance'] =
	async (ctx, input) => {
		const result = await nextDNSCall<{ data: NextDNSSettingsPerformance }>(
			ctx,
			`/profiles/${input.profileId}/settings/performance`,
		);
		await logEventFromContext(
			ctx,
			'nextdns.settings.getPerformance',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data;
	};

/** Confirmed live: `PATCH .../settings/performance` returns `204` with no body. */
export const updatePerformance: NextDNSEndpoints['settingsUpdatePerformance'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/settings/performance`,
			{
				method: 'PATCH',
				body: compactBody({
					ecs: input.ecs,
					cacheBoost: input.cacheBoost,
					cnameFlattening: input.cnameFlattening,
				}),
			},
		);
		const result = await nextDNSCall<{ data: NextDNSSettingsPerformance }>(
			ctx,
			`/profiles/${input.profileId}/settings/performance`,
		);
		await logEventFromContext(
			ctx,
			'nextdns.settings.updatePerformance',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data;
	};

/**
 * `NEXTDNS_LOG_CLIENT_IPS` - toggles `settings.logs.drop.ip`. `enabled: true`
 * means IPs are *not* dropped (i.e. logged), the inverse of the raw `drop`
 * flag, matching the operation's own name. Confirmed live: the `PATCH`
 * returns `204` with no body.
 */
export const logClientIps: NextDNSEndpoints['settingsLogClientIps'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/settings/logs`, {
		method: 'PATCH',
		body: { drop: { ip: !input.enabled } },
	});
	const result = await nextDNSCall<{ data: NextDNSSettingsLogs }>(
		ctx,
		`/profiles/${input.profileId}/settings/logs`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.logClientIps',
		auditPayload(input, ['profileId', 'enabled']),
		'completed',
	);
	return result.data;
};

/**
 * `NEXTDNS_LOG_DOMAINS` - toggles `settings.logs.drop.domain`, same
 * polarity rule and `204`-response behavior as `logClientIps`.
 */
export const logDomains: NextDNSEndpoints['settingsLogDomains'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/settings/logs`, {
		method: 'PATCH',
		body: { drop: { domain: !input.enabled } },
	});
	const result = await nextDNSCall<{ data: NextDNSSettingsLogs }>(
		ctx,
		`/profiles/${input.profileId}/settings/logs`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.settings.logDomains',
		auditPayload(input, ['profileId', 'enabled']),
		'completed',
	);
	return result.data;
};
