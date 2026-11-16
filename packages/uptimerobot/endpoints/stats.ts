import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Uptime across every monitor. `timeFrame` is required, and CUSTOM needs both
 * bounds as Unix seconds — the input schema enforces that before a request.
 */
export const uptime: UptimeRobotEndpoints['statsUptime'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.uptime',
			input: Inputs.statsUptime,
			output: Outputs.statsUptime,
		},
		input,
		({ timeFrame, start, end, logLimit }) => ({
			method: 'GET',
			path: '/monitors/uptime-stats',
			query: { timeFrame, start, end, logLimit },
		}),
		{
			log: (_, result) => ({
				uptime: result.overallUptime ?? undefined,
				incidents: result.totalIncidents ?? undefined,
			}),
		},
	);

/** Uptime for one monitor. The documented range is at most 90 days. */
export const monitorUptime: UptimeRobotEndpoints['statsMonitorUptime'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stats.monitorUptime',
			input: Inputs.statsMonitorUptime,
			output: Outputs.statsMonitorUptime,
		},
		input,
		({ id, from, to }) => ({
			method: 'GET',
			path: `/monitors/${segment(id)}/stats/uptime`,
			query: { from, to },
		}),
		{
			log: (_, result) => ({
				uptime: result.uptime ?? undefined,
				incidents: result.incident_count ?? undefined,
			}),
		},
	);

export const responseTime: UptimeRobotEndpoints['statsResponseTime'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stats.responseTime',
			input: Inputs.statsResponseTime,
			output: Outputs.statsResponseTime,
		},
		input,
		({ id, from, to, includeTimeSeries }) => ({
			method: 'GET',
			path: `/monitors/${segment(id)}/stats/response-time`,
			query: { from, to, includeTimeSeries },
		}),
		{
			log: (_, result) => ({
				average: result.summary?.avg ?? undefined,
				points: result.data_points ?? undefined,
			}),
		},
	);
