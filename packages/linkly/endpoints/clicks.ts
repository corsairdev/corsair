import type { LinklyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const getTimeSeries: LinklyEndpoints['clicksGetTimeSeries'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'clicks.getTimeSeries',
			input: Inputs.clicksGetTimeSeries,
			output: Outputs.clicksGetTimeSeries,
		},
		input,
		({
			workspace_id,
			link_id,
			link_ids,
			start,
			end,
			country,
			browser,
			platform,
			referer,
			isp,
			bots,
			unique,
			format,
			pivot,
			timezone,
			frequency,
		}) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/clicks`,
			query: {
				link_id,
				link_ids,
				start,
				end,
				country,
				browser,
				platform,
				referer,
				isp,
				bots,
				unique,
				format,
				pivot,
				timezone,
				frequency,
			},
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				// The pivot answer carries rows in `data`; the time series in `traffic`.
				buckets: Array.isArray(result.traffic)
					? result.traffic.length
					: Array.isArray(result.data)
						? result.data.length
						: 0,
			}),
		},
	);

export const getCounters: LinklyEndpoints['clicksGetCounters'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clicks.getCounters',
			input: Inputs.clicksGetCounters,
			output: Outputs.clicksGetCounters,
		},
		input,
		({
			workspace_id,
			counter,
			link_id,
			link_ids,
			start,
			end,
			country,
			bots,
			unique,
			format,
		}) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/clicks/counters/${segment(counter)}`,
			query: { link_id, link_ids, start, end, country, bots, unique, format },
			replaySafe: true,
		}),
		{
			// The click counts, not the group values, are the useful size signal.
			log: ({ workspace_id, counter }, result) => ({
				workspaceId: workspace_id,
				counter,
				total: result.total,
				groups: result.values.length,
			}),
		},
	);

export const exportClicks: LinklyEndpoints['clicksExport'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clicks.export',
			input: Inputs.clicksExport,
			output: Outputs.clicksExport,
		},
		input,
		({ workspace_id, link_id, start, end, country, platform, bots }) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/clicks/export`,
			// json is pinned: Linkly's MCP server always sends it, and the
			// output schema parses only that shape.
			query: { format: 'json', link_id, start, end, country, platform, bots },
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				rows: Array.isArray(result) ? result.length : result.clicks.length,
			}),
		},
	);
