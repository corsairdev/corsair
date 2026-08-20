import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import type { ReportIpResponse } from './types';
import { ReportIpResponseSchema } from './types';

/**
 * Submit an abuse report for an IP address.
 *
 * The `categories` field accepts numeric category IDs (integers 1–30) —
 * see https://www.abuseipdb.com/categories for the mapping.
 *
 * API: POST /api/v2/report
 * Docs: https://docs.abuseipdb.com/#report-endpoint
 */
export const report: AbuseIPDBEndpoints['reportIp'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	// POST /report expects `application/x-www-form-urlencoded` form fields,
	// not JSON or query params — pass them as formBody.
	const response = await makeAbuseIPDBRequest<{
		data: ReportIpResponse;
	}>('report', ctx.key, {
		method: 'POST',
		formBody: {
			ip: input.ip,
			categories: input.categories.join(','),
			comment: input.comment,
			timestamp: input.timestamp,
		},
	});

	const reportResult = ReportIpResponseSchema.parse(response.data);

	if (ctx.db?.reports) {
		try {
			await ctx.db.reports.upsertByEntityId(reportResult.ipAddress, {
				ipAddress: reportResult.ipAddress,
				abuseConfidenceScore: reportResult.abuseConfidenceScore,
				reportedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save report to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'abuseipdb.report.ip',
		{
			ip: input.ip,
			categories: input.categories.join(','),
		},
		'completed',
	);

	return reportResult;
};
