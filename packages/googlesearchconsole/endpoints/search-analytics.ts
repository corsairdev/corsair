import type { GoogleSearchConsoleEndpoints } from '..';
import { siteSegment } from '../client';
import { call, rowCount } from './call';
import {
	GoogleSearchConsoleEndpointInputSchemas as Inputs,
	GoogleSearchConsoleEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `searchAnalytics/query` is a POST because the query is a structured body, not
 * because it writes.
 */
export const query: GoogleSearchConsoleEndpoints['searchanalyticsQuery'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'searchanalytics.query',
				input: Inputs.searchanalyticsQuery,
				output: Outputs.searchanalyticsQuery,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}/searchAnalytics/query`,
				body: {
					startDate: input.startDate,
					endDate: input.endDate,
					...(input.dimensions ? { dimensions: input.dimensions } : {}),
					...(input.type ? { type: input.type } : {}),
					...(input.searchType ? { searchType: input.searchType } : {}),
					...(input.dimensionFilterGroups
						? { dimensionFilterGroups: input.dimensionFilterGroups }
						: {}),
					...(input.aggregationType
						? { aggregationType: input.aggregationType }
						: {}),
					...(input.rowLimit === undefined || input.rowLimit === null
						? {}
						: { rowLimit: input.rowLimit }),
					...(input.startRow === undefined || input.startRow === null
						? {}
						: { startRow: input.startRow }),
					...(input.dataState ? { dataState: input.dataState } : {}),
				},
			}),
			(result) => rowCount(result.rows),
		);
