import { asRecord } from 'corsair/core';
import type { KadoaEndpoints } from '..';
import { segment } from '../client';
import { call, definedQuery } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

/** One page is full when it holds as many changes as were asked for. */
// unknown: the raw body is an untyped envelope until the output schema runs.
function changesShape(
	raw: unknown,
	parsed: { skip?: number | undefined; limit?: number | undefined },
) {
	const record = asRecord(raw);
	const changes = Array.isArray(record?.changes) ? record.changes : [];
	const limit = parsed.limit;
	return {
		...record,
		changes,
		nextSkip:
			limit !== undefined && changes.length >= limit
				? (parsed.skip ?? 0) + changes.length
				: null,
	};
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
