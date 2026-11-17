import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/refunds/{refund_id} (GetPaymentRefund). */
export const get: SquareEndpoints['refundsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.refundsGet.parse(rawInput);
	return callSquare(ctx, '/v2/refunds/{refund_id}', {
		path: { refund_id: input.refund_id },
		output: SquareEndpointOutputSchemas.refundsGet,
		event: 'refunds.get',
		logged: { refund_id: input.refund_id },
	});
};

/** GET /v2/refunds (ListPaymentRefunds). */
export const list: SquareEndpoints['refundsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.refundsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/refunds', {
		query: input,
		output: SquareEndpointOutputSchemas.refundsList,
		event: 'refunds.list',
	});
};
