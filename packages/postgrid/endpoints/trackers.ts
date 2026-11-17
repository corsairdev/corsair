import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads one tracker: the PURL and QR-code destination an order references, and
 * how many times it was followed. A tracker is not an order, so delivery status
 * comes from the letter, postcard or self-mailer route instead.
 */
export const get: PostgridEndpoints['trackersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackers.get',
			input: Inputs.trackersGet,
			output: Outputs.trackersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/trackers/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				trackerId: id,
				visitCount: result.visitCount ?? undefined,
				uniqueVisitCount: result.uniqueVisitCount ?? undefined,
			}),
		},
	);
