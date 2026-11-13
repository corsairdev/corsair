import type { KeenEndpoints } from '..';
import { call } from './call';
import {
	KeenEndpointInputSchemas as Inputs,
	KeenEndpointOutputSchemas as Outputs,
} from './types';

// The analysis document goes through unchanged: Keen validates it, and every
// key in it is one the input schema has already checked. `percentile` is the
// one exception, because Keen wants it beside `target_property` rather than
// nested, which is already where the input puts it.
// unknown: the parsed analysis is already validated; only undefined keys are
// dropped, so the values' types do not matter here.
function analysisBody(parsed: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(parsed).filter(([, value]) => value !== undefined),
	);
}

export const run: KeenEndpoints['queriesRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'queries.run',
			input: Inputs.queriesRun,
			output: Outputs.queriesRun,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/queries/${parsed.analysis_type}`,
			body: analysisBody(parsed),
		}),
		{ log: (parsed) => ({ analysisType: parsed.analysis_type }) },
	);

// Keen takes at most 10 analyses in one multi-analysis request and rejects a
// larger list; checking here saves a round trip.
const MAX_MULTI_ANALYSES = 10;

export const multiAnalysis: KeenEndpoints['queriesMultiAnalysis'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'queries.multiAnalysis',
			input: Inputs.queriesMultiAnalysis,
			output: Outputs.queriesMultiAnalysis,
		},
		input,
		(parsed) => {
			if (Object.keys(parsed.analyses).length > MAX_MULTI_ANALYSES) {
				throw new Error(
					`Keen takes at most ${MAX_MULTI_ANALYSES} analyses in one multi-analysis request`,
				);
			}
			return {
				method: 'POST',
				path: '/queries/multi_analysis',
				body: Object.fromEntries(
					Object.entries({
						event_collection: parsed.event_collection,
						analyses: parsed.analyses,
						timeframe: parsed.timeframe,
						interval: parsed.interval,
						timezone: parsed.timezone,
						filters: parsed.filters,
						group_by: parsed.group_by,
					}).filter(([, value]) => value !== undefined),
				),
			};
		},
		{
			log: (parsed) => ({ analyses: Object.keys(parsed.analyses).length }),
		},
	);
