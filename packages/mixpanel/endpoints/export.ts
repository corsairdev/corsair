import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
	parseExportLines,
} from './types';

/**
 * Downloads raw events as newline-delimited JSON. There is no cursor: a range
 * is one request, capped by `limit`, so wide ranges are the caller's job to
 * split.
 */
export const events: MixpanelEndpoints['exportEvents'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'export.events',
			input: Inputs.exportEvents,
			output: Outputs.exportEvents,
		},
		input,
		async (parsed) => ({
			service: 'export',
			replayable: true,
			method: 'GET',
			path: '/export',
			query: {
				from_date: parsed.from_date,
				to_date: parsed.to_date,
				event: parsed.event_names
					? JSON.stringify(parsed.event_names)
					: undefined,
				where: parsed.where,
				limit: parsed.limit,
				time_in_ms: parsed.time_in_ms,
				project_id: await resolveProjectId(ctx),
			},
		}),
		{
			shape: (raw) => ({ events: parseExportLines(raw) }),
			log: (parsed, result) => ({
				fromDate: parsed.from_date,
				toDate: parsed.to_date,
				events: result.events.length,
			}),
		},
	);
