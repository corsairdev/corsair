import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import type { CheckIpResponse } from './types';
import { CheckIpResponseSchema } from './types';

/**
 * Look up an IP address and get its abuse confidence score, country, ISP,
 * usage type, and optionally recent reports (verbose).
 *
 * API: GET /api/v2/check
 * Docs: https://docs.abuseipdb.com/#check-endpoint
 */
export const check: AbuseIPDBEndpoints['checkIp'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	const response = await makeAbuseIPDBRequest<{
		data: CheckIpResponse;
	}>('check', ctx.key, {
		query: {
			ipAddress: input.ipAddress,
			maxAgeInDays: input.maxAgeInDays,
			// AbuseIPDB's `verbose` is a flag-style param — official clients
			// send it as an empty value (`-d verbose`), not `verbose=true`.
			verbose: input.verbose ? '' : undefined,
		},
	});

	// The API wraps results in a `data` envelope; validate the inner shape at
	// runtime before returning it.
	const checkResult = CheckIpResponseSchema.parse(response.data);

	if (ctx.db?.ipChecks) {
		try {
			await ctx.db.ipChecks.upsertByEntityId(checkResult.ipAddress, {
				ipAddress: checkResult.ipAddress,
				abuseConfidenceScore: checkResult.abuseConfidenceScore,
				isPublic: checkResult.isPublic,
				ipVersion: checkResult.ipVersion,
				countryCode: checkResult.countryCode ?? null,
				countryName: checkResult.countryName ?? null,
				usageType: checkResult.usageType ?? null,
				isp: checkResult.isp ?? null,
				domain: checkResult.domain ?? null,
				isTor: checkResult.isTor,
				totalReports: checkResult.totalReports,
				numDistinctUsers: checkResult.numDistinctUsers,
				checkedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save IP check result to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'abuseipdb.check.ip',
		{ ipAddress: input.ipAddress },
		'completed',
	);

	return checkResult;
};
