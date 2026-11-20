import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/online-checkout/payment-links/{id} (RetrievePaymentLink). */
export const get: SquareEndpoints['paymentLinksGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentLinksGet.parse(rawInput);
	return callSquare(ctx, '/v2/online-checkout/payment-links/{id}', {
		path: { id: input.id },
		output: SquareEndpointOutputSchemas.paymentLinksGet,
		event: 'paymentLinks.get',
		logged: { id: input.id },
	});
};

/** POST /v2/online-checkout/payment-links (CreatePaymentLink). */
export const create: SquareEndpoints['paymentLinksCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentLinksCreate.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/online-checkout/payment-links', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.paymentLinksCreate,
		event: 'paymentLinks.create',
	});
};

/** GET /v2/online-checkout/payment-links (ListPaymentLinks). */
export const list: SquareEndpoints['paymentLinksList'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentLinksList.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/online-checkout/payment-links', {
		query: input,
		output: SquareEndpointOutputSchemas.paymentLinksList,
		event: 'paymentLinks.list',
	});
};

/** DELETE /v2/online-checkout/payment-links/{id} (DeletePaymentLink). */
export const remove: SquareEndpoints['paymentLinksDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentLinksDelete.parse(rawInput);
	return callSquare(ctx, '/v2/online-checkout/payment-links/{id}', {
		method: 'DELETE',
		path: { id: input.id },
		output: SquareEndpointOutputSchemas.paymentLinksDelete,
		event: 'paymentLinks.delete',
		logged: { id: input.id },
	});
};

/** PUT /v2/online-checkout/payment-links/{id} (UpdatePaymentLink). */
export const update: SquareEndpoints['paymentLinksUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.paymentLinksUpdate.parse(rawInput);
	const { id, ...body } = input;
	return callSquare(ctx, '/v2/online-checkout/payment-links/{id}', {
		method: 'PUT',
		body,
		path: { id },
		output: SquareEndpointOutputSchemas.paymentLinksUpdate,
		event: 'paymentLinks.update',
		logged: { id },
	});
};
