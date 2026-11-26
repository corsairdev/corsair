import type { SpondyrEndpoints } from '..';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

export const send: SpondyrEndpoints['batchSend'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'batch.send',
			input: SpondyrEndpointInputSchemas.batchSend,
			output: SpondyrEndpointOutputSchemas.batchSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'Batch',
			body: {
				EventType: parsed.event_type,
				IsGenerateOnly: parsed.is_generate_only ?? false,
				...(parsed.shared_data === undefined
					? {}
					: { SharedData: parsed.shared_data }),
				Data: parsed.data,
			},
		}),
		{
			log: (parsed, result) => ({
				event_type: parsed.event_type,
				items: parsed.data.length,
				reference_id: result.ReferenceID ?? undefined,
			}),
		},
	);

export const status: SpondyrEndpoints['batchStatus'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'batch.status',
			input: SpondyrEndpointInputSchemas.batchStatus,
			output: SpondyrEndpointOutputSchemas.batchStatus,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Batch',
			query: { ReferenceID: parsed.reference_id },
		}),
		{
			log: (parsed, result) => ({
				reference_id: parsed.reference_id,
				status_code: result.StatusCode ?? undefined,
				total_processed: result.TotalProcessed ?? undefined,
				batch_errors: result.BatchErrors?.length ?? 0,
			}),
		},
	);
