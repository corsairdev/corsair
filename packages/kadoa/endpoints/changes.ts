import { asRecord } from 'corsair/core';
import type { KadoaEndpoints } from '..';
import { segment } from '../client';
import { call, definedQuery } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KADOA_DEFAULT_CHANGES_LIMIT,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Another page exists while `pagination.totalCount` says more changes remain,
 * or, without it, while this page came back full. Kadoa's default page size
 * applies when the caller named no limit. A body without a `changes` array is
 * passed on unchanged, so the output schema rejects it instead of reporting no
 * changes.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
function changesShape(
	raw: unknown,
	parsed: { skip?: number | undefined; limit?: number | undefined },
) {
	const record = asRecord(raw);
	const changes = record?.changes;
	if (!record || !Array.isArray(changes)) return raw;
	const next = (parsed.skip ?? 0) + changes.length;
	const totalCount = asRecord(record.pagination)?.totalCount;
	const more =
		typeof totalCount === 'number'
			? next < totalCount && changes.length > 0
			: changes.length >= (parsed.limit ?? KADOA_DEFAULT_CHANGES_LIMIT);
	return { ...record, nextSkip: more ? next : null };
}

export const list: KadoaEndpoints['changesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'changes.list',
			input: Inputs.changesList,
			output: Outputs.changesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/changes',
			query: definedQuery({
				workflowIds:
					parsed.workflowIds && parsed.workflowIds.length > 0
						? parsed.workflowIds.join(',')
						: undefined,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				skip: parsed.skip,
				limit: parsed.limit,
				exclude:
					parsed.exclude && parsed.exclude.length > 0
						? parsed.exclude.join(',')
						: undefined,
			}),
		}),
		{
			shape: changesShape,
			log: (_, result) => ({ count: result.changes.length }),
		},
	);

export const get: KadoaEndpoints['changesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'changes.get',
			input: Inputs.changesGet,
			output: Outputs.changesGet,
		},
		input,
		({ changeId }) => ({
			method: 'GET',
			path: `/v4/changes/${segment(changeId)}`,
		}),
		{ log: (_, result) => ({ changeId: result.id }) },
	);
