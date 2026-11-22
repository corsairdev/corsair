import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

export const average: PingdomEndpoints['summariesAverage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'summaries.average',
			input: Inputs.summariesAverage,
			output: Outputs.summariesAverage,
		},
		input,
		({ checkId, from, to, probes, includeUptime, byCountry, byProbe }) => ({
			method: 'GET',
			path: `${V31}/summary.average/${checkId}`,
			query: {
				from,
				to,
				probes,
				includeuptime: includeUptime,
				bycountry: byCountry,
				byprobe: byProbe,
			},
		}),
	);

export const hoursOfDay: PingdomEndpoints['summariesHoursOfDay'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'summaries.hoursOfDay',
			input: Inputs.summariesHoursOfDay,
			output: Outputs.summariesHoursOfDay,
		},
		input,
		({ checkId, from, to, probes }) => ({
			method: 'GET',
			path: `${V31}/summary.hoursofday/${checkId}`,
			query: { from, to, probes },
		}),
	);

export const outage: PingdomEndpoints['summariesOutage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'summaries.outage',
			input: Inputs.summariesOutage,
			output: Outputs.summariesOutage,
		},
		input,
		({ checkId, from, to, probes }) => ({
			method: 'GET',
			path: `${V31}/summary.outage/${checkId}`,
			query: { from, to, probes },
		}),
	);

export const performance: PingdomEndpoints['summariesPerformance'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'summaries.performance',
			input: Inputs.summariesPerformance,
			output: Outputs.summariesPerformance,
		},
		input,
		({ checkId, from, to, resolution, includeUptime, probes, order }) => ({
			method: 'GET',
			path: `${V31}/summary.performance/${checkId}`,
			query: {
				from,
				to,
				resolution,
				includeuptime: includeUptime,
				probes,
				order,
			},
		}),
	);

export const probes: PingdomEndpoints['summariesProbes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'summaries.probes',
			input: Inputs.summariesProbes,
			output: Outputs.summariesProbes,
		},
		input,
		({ checkId, from, to, probes }) => ({
			method: 'GET',
			path: `${V31}/summary.probes/${checkId}`,
			query: { from, to, probes },
		}),
	);
