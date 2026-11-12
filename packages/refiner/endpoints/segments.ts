import type { RefinerEndpoints } from '..';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

export const list: RefinerEndpoints['segmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.list',
			input: Inputs.segmentsList,
			output: Outputs.segmentsList,
		},
		input,
		({ page, page_length }) => ({
			method: 'GET',
			path: '/segments',
			query: { page, page_length },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);

/**
 * Add or remove a user in a manual segment. Refiner exposes both through one route
 * and distinguishes them only by HTTP method, so `remove` picks DELETE. A user who
 * does not exist yet is created, which is why this is a `write`.
 */
export const sync: RefinerEndpoints['segmentsSync'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.sync',
			input: Inputs.segmentsSync,
			output: Outputs.segmentsSync,
		},
		input,
		({ id, email, segment_uuid, remove }) => ({
			method: remove === true ? 'DELETE' : 'POST',
			path: '/sync-segment',
			body: { id, email, segment_uuid },
			// Adding a user who is already in the segment, or removing one who is not,
			// leaves the same membership, so a replay cannot double anything.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				segmentUuid: result.segment_uuid ?? parsed.segment_uuid,
				removed: parsed.remove === true,
			}),
		},
	);
