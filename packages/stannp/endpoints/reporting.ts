import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const summary: StannpEndpoints['reportingSummary'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reporting.summary',
			input: Inputs.reportingSummary,
			output: Outputs.reportingSummary,
		},
		input,
		({ startdate, enddate }, base) => ({
			method: 'GET',
			base,
			path: `/v1/reporting/summary/${segment(startdate)}/${segment(enddate)}`,
		}),
		{
			log: (_, result) => ({ total: result.total ?? undefined }),
		},
	);

// status and tag are optional path segments ([:status]/[:tag] in the docs);
// each is appended only when provided.
export const list: StannpEndpoints['reportingList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reporting.list',
			input: Inputs.reportingList,
			output: Outputs.reportingList,
		},
		input,
		({ startdate, enddate, status, tag }, base) => ({
			method: 'GET',
			base,
			path: `/v1/reporting/list/${segment(startdate)}/${segment(enddate)}${
				status !== undefined
					? `/${segment(status)}${tag !== undefined ? `/${segment(tag)}` : ''}`
					: ''
			}`,
		}),
		{
			log: (_, result) => ({ count: result.singles?.length ?? 0 }),
		},
	);
