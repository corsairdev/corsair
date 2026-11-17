import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/payments/{payment_id}/cancel (CancelPayment). */
export const cancel: SquareEndpoints['paymentsCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentsCancel.parse(rawInput);
	return callSquare(ctx, '/v2/payments/{payment_id}/cancel', {
		method: 'POST',
		path: { payment_id: input.payment_id },
		output: SquareEndpointOutputSchemas.paymentsCancel,
		event: 'payments.cancel',
		logged: { payment_id: input.payment_id },
	});
};

/** GET /v2/payments (ListPayments). */
export const list: SquareEndpoints['paymentsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.paymentsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/payments', {
		query: input,
		output: SquareEndpointOutputSchemas.paymentsList,
		event: 'payments.list',
	});
};

/** POST /v2/payments (CreatePayment). */
export const create: SquareEndpoints['paymentsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentsCreate.parse(rawInput);
	return callSquare(ctx, '/v2/payments', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.paymentsCreate,
		event: 'payments.create',
	});
};

/** GET /v2/payments/{payment_id} (GetPayment). */
export const get: SquareEndpoints['paymentsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.paymentsGet.parse(rawInput);
	return callSquare(ctx, '/v2/payments/{payment_id}', {
		path: { payment_id: input.payment_id },
		output: SquareEndpointOutputSchemas.paymentsGet,
		event: 'payments.get',
		logged: { payment_id: input.payment_id },
	});
};

/** PUT /v2/payments/{payment_id} (UpdatePayment). */
export const update: SquareEndpoints['paymentsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentsUpdate.parse(rawInput);
	const { payment_id, ...body } = input;
	return callSquare(ctx, '/v2/payments/{payment_id}', {
		method: 'PUT',
		body,
		path: { payment_id },
		output: SquareEndpointOutputSchemas.paymentsUpdate,
		event: 'payments.update',
		logged: { payment_id },
	});
};

/** POST /v2/payments/{payment_id}/complete (CompletePayment). */
export const complete: SquareEndpoints['paymentsComplete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentsComplete.parse(rawInput);
	const { payment_id, ...body } = input;
	return callSquare(ctx, '/v2/payments/{payment_id}/complete', {
		method: 'POST',
		body,
		path: { payment_id },
		output: SquareEndpointOutputSchemas.paymentsComplete,
		event: 'payments.complete',
		logged: { payment_id },
	});
};

/** POST /v2/refunds (RefundPayment). */
export const refund: SquareEndpoints['paymentsRefund'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentsRefund.parse(rawInput);
	return callSquare(ctx, '/v2/refunds', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.paymentsRefund,
		event: 'payments.refund',
	});
};

/** POST /v2/payments/cancel (CancelPaymentByIdempotencyKey). */
export const cancelByIdempotencyKey: SquareEndpoints['paymentsCancelByIdempotencyKey'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.paymentsCancelByIdempotencyKey.parse(rawInput);
		return callSquare(ctx, '/v2/payments/cancel', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.paymentsCancelByIdempotencyKey,
			event: 'payments.cancelByIdempotencyKey',
		});
	};
