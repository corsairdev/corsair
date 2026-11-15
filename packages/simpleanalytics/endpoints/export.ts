import type { SimpleanalyticsEndpoints } from '..';
import { call } from './shared';
import {
	SimpleanalyticsEndpointInputSchemas as Inputs,
	SimpleanalyticsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The Export API serves CSV, TSV, JSON, NDJSON, Parquet and Avro. Only `json`
 * is read here: it is the one format `corsair/http` can return intact, and the
 * typed binary formats would arrive as text.
 */
export const datapoints: SimpleanalyticsEndpoints['exportDatapoints'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'export.datapoints',
			input: Inputs.exportDatapoints,
			output: Outputs.exportDatapoints,
		},
		input,
		async (parsed) => ({
			method: 'GET',
			path: '/api/export/datapoints',
			query: {
				version: 6,
				format: 'json',
				hostname: parsed.hostname,
				start: parsed.start,
				end: parsed.end,
				timezone: parsed.timezone,
				type: parsed.type,
				robots: parsed.robots,
				// Metadata keys are exported only when named, as
				// `metadata.<key>_<suffix>`; a bare key gets the prefix added.
				fields: [
					...parsed.fields,
					...(parsed.metadata_fields ?? []).map((key) =>
						key.startsWith('metadata.') ? key : `metadata.${key}`,
					),
				].join(','),
			},
		}),
		{
			log: (parsed, result) => ({
				hostname: parsed.hostname,
				start: parsed.start,
				end: parsed.end,
				type: parsed.type ?? 'pageviews',
				datapoints: result.datapoints.length,
			}),
		},
	);
