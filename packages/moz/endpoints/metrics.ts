import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Reads Domain Authority, Page Authority, Spam Score and link counts for one target. */
export const fetchMetrics: MozEndpoints['metricsFetch'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.fetch',
			input: Inputs.metricsFetch,
			output: Outputs.metricsFetch,
		},
		input,
		(parsed) => ({
			method: 'data.site.metrics.fetch',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed) => ({
				query: parsed.site_query.query,
				scope: parsed.site_query.scope,
			}),
		},
	);

/** Reads the same metrics for several targets; each target answers separately. */
export const fetchMultiple: MozEndpoints['metricsFetchMultiple'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'metrics.fetchMultiple',
			input: Inputs.metricsFetchMultiple,
			output: Outputs.metricsFetchMultiple,
		},
		input,
		(parsed) => ({
			method: 'data.site.metrics.fetch.multiple',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				requested: parsed.site_queries.length,
				fetched: result.results_by_site.length,
				failed: result.errors_by_site.length,
			}),
		},
	);
