import type { ReamazeEndpoints } from '..';
import { call, queryOf, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Every report takes the same `brand`, `start_date` and `end_date` query and
 * answers a body keyed by dates, staff names or channel ids. The payload stays
 * an open record; the schemas name the keys the vendor documents.
 */
export const volume: ReamazeEndpoints['reportsVolume'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.volume',
			input: Inputs.reportsVolume,
			output: Outputs.reportsVolume,
		},
		input,
		({ brand, start_date, end_date }) => ({
			method: 'GET',
			path: '/reports/volume',
			query: queryOf({ brand, start_date, end_date }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'volume report'),
			log: (_, result) => ({ startDate: result.start_date ?? undefined }),
		},
	);

export const responseTime: ReamazeEndpoints['reportsResponseTime'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.response_time',
			input: Inputs.reportsResponseTime,
			output: Outputs.reportsResponseTime,
		},
		input,
		({ brand, start_date, end_date }) => ({
			method: 'GET',
			path: '/reports/response_time',
			query: queryOf({ brand, start_date, end_date }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'response time report'),
			log: (_, result) => ({ startDate: result.start_date ?? undefined }),
		},
	);

export const staff: ReamazeEndpoints['reportsStaff'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.staff',
			input: Inputs.reportsStaff,
			output: Outputs.reportsStaff,
		},
		input,
		({ brand, start_date, end_date }) => ({
			method: 'GET',
			path: '/reports/staff',
			query: queryOf({ brand, start_date, end_date }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'staff report'),
			log: (_, result) => ({ startDate: result.start_date ?? undefined }),
		},
	);

export const tags: ReamazeEndpoints['reportsTags'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.tags',
			input: Inputs.reportsTags,
			output: Outputs.reportsTags,
		},
		input,
		({ brand, start_date, end_date }) => ({
			method: 'GET',
			path: '/reports/tags',
			query: queryOf({ brand, start_date, end_date }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'tags report'),
			log: (_, result) => ({ startDate: result.start_date ?? undefined }),
		},
	);

export const channelSummary: ReamazeEndpoints['reportsChannelSummary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.channel_summary',
			input: Inputs.reportsChannelSummary,
			output: Outputs.reportsChannelSummary,
		},
		input,
		({ brand, start_date, end_date }) => ({
			method: 'GET',
			path: '/reports/channel_summary',
			query: queryOf({ brand, start_date, end_date }),
		}),
		{
			shape: (raw) => unwrapObject(raw, 'channel summary report'),
			log: (_, result) => ({ startDate: result.start_date ?? undefined }),
		},
	);
