import type { SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['regulationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'regulations.list',
			input: Inputs.regulationsList,
			output: Outputs.regulationsList,
		},
		input,
		({ status, regulationTypes, count, cursor }) => ({
			method: 'GET',
			path: '/regulations',
			query: {
				status,
				regulationTypes,
				...paginationQuery(count, cursor),
			},
		}),
		{ log: (_, result) => ({ count: result.data.regulations.length }) },
	);

/**
 * Permanently deletes or suppresses the user data named in `subjectIds`. The
 * run cannot be cancelled and the data cannot be recovered, so this is
 * destructive and irreversible; poll `regulations.get` with the returned
 * `regulateId` to follow it.
 */
export const create: SegmentEndpoints['regulationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'regulations.create',
			input: Inputs.regulationsCreate,
			output: Outputs.regulationsCreate,
		},
		input,
		({ regulationType, subjectType, subjectIds }) => ({
			method: 'POST',
			path: '/regulations',
			body: { regulationType, subjectType, subjectIds },
		}),
		{ log: (_, result) => ({ regulateId: result.data.regulateId }) },
	);

export const get: SegmentEndpoints['regulationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'regulations.get',
			input: Inputs.regulationsGet,
			output: Outputs.regulationsGet,
		},
		input,
		({ regulateId }) => ({
			method: 'GET',
			path: `/regulations/${pathSegment(regulateId)}`,
		}),
		{
			log: ({ regulateId }, result) => ({
				regulateId,
				status: result.data.regulation.overallStatus ?? undefined,
			}),
		},
	);
