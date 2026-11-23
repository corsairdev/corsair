import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

export const query: MixpanelEndpoints['retentionQuery'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'retention.query',
			input: Inputs.retentionQuery,
			output: Outputs.retentionQuery,
		},
		input,
		async (parsed) => ({
			service: 'query',
			replayable: true,
			method: 'GET',
			path: '/retention',
			query: {
				from_date: parsed.from_date,
				to_date: parsed.to_date,
				retention_type: parsed.retention_type,
				born_event: parsed.born_event,
				event: parsed.event,
				born_where: parsed.born_where,
				where: parsed.where,
				interval: parsed.interval,
				interval_count: parsed.interval_count,
				unit: parsed.unit,
				unbounded_retention: parsed.unbounded_retention,
				on: parsed.on,
				limit: parsed.limit,
				project_id: await resolveProjectId(ctx),
				workspace_id: parsed.workspace_id,
			},
		}),
		{
			log: (parsed) => ({
				fromDate: parsed.from_date,
				toDate: parsed.to_date,
				unit: parsed.unit ?? 'day',
			}),
		},
	);
