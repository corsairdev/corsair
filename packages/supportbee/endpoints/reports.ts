import type { SupportbeeEndpoints } from '..';
import { call, queryOf } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Each report answers `{ data_points: [{ value, timestamp }] }`, where `value`
 * arrives as a string even when it is a count. `user`, `team` and `label` narrow
 * the window; `since` takes any of the date formats the API documents.
 */
export const avgFirstResponseTime: SupportbeeEndpoints['reportsAvgFirstResponseTime'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'reports.avgFirstResponseTime',
				input: Inputs.reportsAvgFirstResponseTime,
				output: Outputs.reportsAvgFirstResponseTime,
			},
			input,
			({ user, team, label, since }) => ({
				method: 'GET',
				path: '/reports/avg_first_response_time',
				query: queryOf({ user, team, label, since }),
			}),
			{
				log: (_, result) => ({ count: result.data_points.length }),
			},
		);

export const ticketsCount: SupportbeeEndpoints['reportsTicketsCount'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.ticketsCount',
			input: Inputs.reportsTicketsCount,
			output: Outputs.reportsTicketsCount,
		},
		input,
		({ user, team, label, since }) => ({
			method: 'GET',
			path: '/reports/tickets_count',
			query: queryOf({ user, team, label, since }),
		}),
		{
			log: (_, result) => ({ count: result.data_points.length }),
		},
	);

export const repliesCount: SupportbeeEndpoints['reportsRepliesCount'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.repliesCount',
			input: Inputs.reportsRepliesCount,
			output: Outputs.reportsRepliesCount,
		},
		input,
		({ user, team, label, since }) => ({
			method: 'GET',
			path: '/reports/replies_count',
			query: queryOf({ user, team, label, since }),
		}),
		{
			log: (_, result) => ({ count: result.data_points.length }),
		},
	);
