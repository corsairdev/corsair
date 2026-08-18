import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, nextDNSCall } from './shared';
import type { NextDNSAnalyticsResponse } from './types';

/**
 * Shared implementation for 10 of the 11 analytics categories - they differ
 * only in the trailing path segment and event-log name.
 * `GET_ANALYTICS_REASONS2` and `GET_ANALYTICS_DEVICES2` map to plain
 * `reasons`/`devices` (the "2" looks like a catalog-side label-collision
 * artifact, not a distinct `;series` variant - no `;series` counterpart
 * exists anywhere else in this 71-op catalog, and the operation
 * descriptions describe the same snapshot shape as every other analytics
 * category, not a time-series one). `destinations` is not built on this
 * helper - see below.
 */
async function getAnalytics(
	ctx: Parameters<NextDNSEndpoints['analyticsStatus']>[0],
	input: Parameters<NextDNSEndpoints['analyticsStatus']>[1],
	category: string,
	eventName: string,
): Promise<NextDNSAnalyticsResponse> {
	const result = await nextDNSCall<NextDNSAnalyticsResponse>(
		ctx,
		`/profiles/${input.profileId}/analytics/${category}`,
		{
			query: compactQuery({
				from: input.from,
				to: input.to,
				limit: input.limit,
				cursor: input.cursor,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		`nextdns.analytics.${eventName}`,
		auditPayload(input, ['profileId', 'from', 'to']),
		'completed',
	);
	return result;
}

export const status: NextDNSEndpoints['analyticsStatus'] = (ctx, input) =>
	getAnalytics(ctx, input, 'status', 'status');

export const domains: NextDNSEndpoints['analyticsDomains'] = (ctx, input) =>
	getAnalytics(ctx, input, 'domains', 'domains');

export const reasons: NextDNSEndpoints['analyticsReasons'] = (ctx, input) =>
	getAnalytics(ctx, input, 'reasons', 'reasons');

export const ips: NextDNSEndpoints['analyticsIps'] = (ctx, input) =>
	getAnalytics(ctx, input, 'ips', 'ips');

export const devices: NextDNSEndpoints['analyticsDevices'] = (ctx, input) =>
	getAnalytics(ctx, input, 'devices', 'devices');

export const protocols: NextDNSEndpoints['analyticsProtocols'] = (ctx, input) =>
	getAnalytics(ctx, input, 'protocols', 'protocols');

export const queryTypes: NextDNSEndpoints['analyticsQueryTypes'] = (
	ctx,
	input,
) => getAnalytics(ctx, input, 'queryTypes', 'queryTypes');

export const ipVersions: NextDNSEndpoints['analyticsIpVersions'] = (
	ctx,
	input,
) => getAnalytics(ctx, input, 'ipVersions', 'ipVersions');

export const dnssec: NextDNSEndpoints['analyticsDnssec'] = (ctx, input) =>
	getAnalytics(ctx, input, 'dnssec', 'dnssec');

export const encryption: NextDNSEndpoints['analyticsEncryption'] = (
	ctx,
	input,
) => getAnalytics(ctx, input, 'encryption', 'encryption');

/**
 * `type` (`countries` or `gafam`) is required - confirmed live: omitting it
 * 400s with `{"errors":[{"code":"required","source":{"parameter":"type"}}]}`.
 * The only one of the 11 analytics categories with a required extra
 * parameter, so it doesn't go through the shared `getAnalytics` helper.
 */
export const destinations: NextDNSEndpoints['analyticsDestinations'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<NextDNSAnalyticsResponse>(
		ctx,
		`/profiles/${input.profileId}/analytics/destinations`,
		{
			query: compactQuery({
				type: input.type,
				from: input.from,
				to: input.to,
				limit: input.limit,
				cursor: input.cursor,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'nextdns.analytics.destinations',
		auditPayload(input, ['profileId', 'type', 'from', 'to']),
		'completed',
	);
	return result;
};
