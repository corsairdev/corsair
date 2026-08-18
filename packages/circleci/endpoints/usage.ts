import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Creates a usage export job.
 *
 * The catalog documents this as rate-limited to 10 queries/hour, with a
 * 32-day maximum window. Never exercised live, to avoid spending a quota this
 * shared development account only gets once an hour.
 */
export const create: CircleCIEndpoints['usageExportCreate'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['usageExportCreate']
	>(ctx, `organizations/${input.orgId}/usage_export_job`, {
		method: 'POST',
		body: compact({
			start: input.start,
			end: input.end,
			shared_org_ids: input.sharedOrgIds,
		}),
	});

	await logEventFromContext(
		ctx,
		'circleci.usageExport.create',
		auditPayload(input, ['orgId', 'start', 'end']),
		'completed',
	);
	return result;
};

/** Reads a usage export job's status and, once ready, its download URLs. */
export const get: CircleCIEndpoints['usageExportGet'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['usageExportGet']>(
		ctx,
		`organizations/${input.orgId}/usage_export_job/${input.usageExportJobId}`,
	);

	await logEventFromContext(
		ctx,
		'circleci.usageExport.get',
		auditPayload(input, ['orgId', 'usageExportJobId']),
		'completed',
	);
	return result;
};
