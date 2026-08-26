import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import { GetBlacklistResponseSchema } from './types';

/**
 * Download the blacklist of most-reported IPs, optionally filtered by
 * confidence minimum, country, and IP version.
 *
 * API: GET /api/v2/blacklist
 * Docs: https://docs.abuseipdb.com/#blacklist-endpoint
 */
export const get: AbuseIPDBEndpoints['getBlacklist'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	const response = await makeAbuseIPDBRequest<{
		meta: { generatedAt: string };
		data: Array<{
			ipAddress: string;
			abuseConfidenceScore: number;
			lastReportedAt?: string | null;
			countryCode?: string | null;
		}>;
	}>('blacklist', ctx.key, {
		query: {
			confidenceMinimum: input.confidenceMinimum,
			limit: input.limit,
			onlyCountries: input.onlyCountries?.join(','),
			exceptCountries: input.exceptCountries?.join(','),
			ipVersion: input.ipVersion,
		},
	});

	// The API wraps entries in `data` and the generation timestamp in `meta`.
	// Validate the meta envelope and the whole flattened result so a missing
	// `meta` surfaces as a schema error instead of a raw property-access
	// crash on `response.meta.generatedAt`.
	const generatedAt = z.string().parse(response.meta?.generatedAt);
	const blacklistResult = GetBlacklistResponseSchema.parse({
		generatedAt,
		entries: response.data,
	});

	await logEventFromContext(
		ctx,
		'abuseipdb.blacklist.get',
		{
			confidenceMinimum: input.confidenceMinimum ?? 100,
			limit: input.limit,
		},
		'completed',
	);

	return blacklistResult;
};
