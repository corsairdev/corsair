import type { LinklyEndpoints } from '..';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const list: LinklyEndpoints['conversionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversions.list',
			input: Inputs.conversionsList,
			output: Outputs.conversionsList,
		},
		input,
		({ workspace_id, limit, after, since }) => ({
			method: 'GET',
			path: '/api/v1/conversions',
			// API-key calls name the workspace in the query.
			query: { workspace_id, limit, after, since },
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				count: result.conversions.length,
				hasMore: result.has_more,
			}),
		},
	);

export const create: LinklyEndpoints['conversionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversions.create',
			input: Inputs.conversionsCreate,
			output: Outputs.conversionsCreate,
		},
		input,
		({ workspace_id, ...body }) => ({
			method: 'POST',
			path: '/api/v1/conversions',
			query: { workspace_id },
			body,
			// With an event_id Linkly returns the original conversion on a
			// repeat; without one a replay could count the sale twice.
			replaySafe: body.event_id !== undefined,
		}),
		{
			// Amounts, customer ids and visitor IPs stay out of the log.
			log: ({ workspace_id, event_type }, result) => ({
				workspaceId: workspace_id,
				eventType: event_type,
				attributed: !('attributed' in result && result.attributed === false),
			}),
		},
	);
