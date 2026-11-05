import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryPayment } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryPaymentSchema,
} from './types';

/**
 * List all payments.
 *
 * API: GET /api/v2/payments
 * Docs: https://www.clientary.com/api/payments
 */
export const list: ClientaryEndpoints['paymentsList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.paymentsList>
	>('payments', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
			sort: input.sort,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.paymentsList.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.payments.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Record a payment against an invoice. Provide an `amount`, or a
 * `payment_profile_id` to auto-charge the invoice's outstanding balance.
 *
 * API: POST /api/v2/invoices/:invoice_id/payments
 * Docs: https://www.clientary.com/api/payments
 */
export const create: ClientaryEndpoints['paymentsCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { invoice_id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryPayment>(
		`invoices/${invoice_id}/payments`,
		apiKey,
		domain,
		{ method: 'POST', body: { payment: { ...fields } } },
	);

	const parsed = ClientaryPaymentSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.payments.create',
		{ invoice_id },
		'completed',
	);
	return parsed;
};

/**
 * Delete (void) a payment.
 *
 * API: DELETE /api/v2/invoices/:invoice_id/payments/:id
 * Docs: https://www.clientary.com/api/payments
 */
export const remove: ClientaryEndpoints['paymentsDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { invoice_id, id } = input;

	await makeClientaryRequest<unknown>(
		`invoices/${invoice_id}/payments/${id}`,
		apiKey,
		domain,
		{ method: 'DELETE' },
	);

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id,
	});

	await logEventFromContext(
		ctx,
		'clientary.payments.delete',
		{ invoice_id, id },
		'completed',
	);
	return result;
};
