import type { ParseraEndpoints } from '..';
import { call } from './call';
import {
	ParseraEndpointInputSchemas as Inputs,
	ParseraEndpointOutputSchemas as Outputs,
} from './types';

export const run: ParseraEndpoints['scrapersRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrapers.run',
			input: Inputs.scrapersRun,
			output: Outputs.scrapersRun,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/scrapers/run',
			body,
		}),
		{
			// A run that passes five minutes comes back 202 with a run_id
			// instead of results; the output schema models both shapes.
			log: (_, result) => ({
				runId: result.run_id ?? undefined,
				status: result.status,
			}),
		},
	);

export const runAsync: ParseraEndpoints['scrapersRunAsync'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrapers.runAsync',
			input: Inputs.scrapersRunAsync,
			output: Outputs.scrapersRunAsync,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/scrapers/run_async',
			body,
		}),
		{
			log: (_, result) => ({
				runId: result.run_id ?? undefined,
				status: result.status,
			}),
		},
	);

export const getRun: ParseraEndpoints['scrapersGetRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrapers.getRun',
			input: Inputs.scrapersGetRun,
			output: Outputs.scrapersGetRun,
		},
		input,
		({ runId }) => ({
			method: 'GET',
			path: `/v1/scrapers/run_async/${encodeURIComponent(runId)}`,
		}),
		{
			log: (_, run) => ({ runId: run.run_id ?? undefined, status: run.status }),
		},
	);
