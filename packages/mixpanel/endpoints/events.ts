import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Imports a batch of server-side events. Chosen over POST /track for this
 * plugin because /track authenticates with the project token (meant for
 * untrusted clients), while /import takes the service account this plugin
 * authenticates with, and accepts events older than five days.
 */
export const importEvents: MixpanelEndpoints['eventsImport'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.import',
			input: Inputs.eventsImport,
			output: Outputs.eventsImport,
		},
		input,
		async ({ strict, events }) => ({
			service: 'ingestion',
			// Every event carries an $insert_id and Mixpanel deduplicates on
			// (event, time, distinct_id, $insert_id), so a retry after a 5xx
			// cannot double-count.
			replayable: true,
			method: 'POST',
			path: '/import',
			query: { strict: strict ?? '1', project_id: await resolveProjectId(ctx) },
			body: events,
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ imported: result.num_records_imported }),
		},
	);
