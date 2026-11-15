import type { SimplekpiEndpoints } from '..';
import { call } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * One row per KPI, per breakdown source, per period, already aggregated with
 * each KPI's own frequency and aggregate function. The id filter is a
 * comma-separated list, which is how this one route takes an array.
 */
export const allDataEntries: SimplekpiEndpoints['reportsAllDataEntries'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.allDataEntries',
			input: Inputs.reportsAllDataEntries,
			output: Outputs.reportsAllDataEntries,
		},
		input,
		({ kpiIDs, dateFrom, dateTo }) => ({
			method: 'GET',
			path: '/v1/reports/alldataentries',
			query: {
				kpiIDs: kpiIDs?.join(','),
				dateFrom,
				dateTo,
			},
		}),
		{
			log: (parsed, result) => ({
				kpis: parsed.kpiIDs?.length,
				rows: result.length,
			}),
		},
	);
