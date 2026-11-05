import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbuseIPDBRequest } from '../client';
import type { AbuseIPDBEndpoints } from '../index';
import type { GetReportsResponse } from './types';
import { GetReportsResponseSchema } from './types';

/**
 * Get a paginated list of abuse reports filed against a single IP address.
 *
 * API: GET /api/v2/reports
 * Docs: https://docs.abuseipdb.com/#reports-endpoint
 */
export const list: AbuseIPDBEndpoints['getReports'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('abuseipdb', 'api_key');
	}

	const response = await makeAbuseIPDBRequest<{
		data: GetReportsResponse;
	}>('reports', ctx.key, {
		query: {
			ipAddress: input.ipAddress,
			maxAgeInDays: input.maxAgeInDays,
			page: input.page,
			perPage: input.perPage,
		},
	});

	const reportsResult = GetReportsResponseSchema.parse(response.data);

	await logEventFromContext(
		ctx,
		'abuseipdb.reports.list',
		{ ipAddress: input.ipAddress, page: input.page ?? 1 },
		'completed',
	);

	return reportsResult;
};
