import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/customers/segments (ListCustomerSegments). */
export const list: SquareEndpoints['customerSegmentsList'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerSegmentsList.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/customers/segments', {
		query: input,
		output: SquareEndpointOutputSchemas.customerSegmentsList,
		event: 'customerSegments.list',
	});
};

/** GET /v2/customers/segments/{segment_id} (RetrieveCustomerSegment). */
export const get: SquareEndpoints['customerSegmentsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerSegmentsGet.parse(rawInput);
	return callSquare(ctx, '/v2/customers/segments/{segment_id}', {
		path: { segment_id: input.segment_id },
		output: SquareEndpointOutputSchemas.customerSegmentsGet,
		event: 'customerSegments.get',
		logged: { segment_id: input.segment_id },
	});
};
