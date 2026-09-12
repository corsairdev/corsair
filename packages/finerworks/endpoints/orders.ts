import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	OrdersDeletePendingInputSchema,
	OrdersDeletePendingOutputSchema,
	OrdersFetchStatusInputSchema,
	OrdersFetchStatusOutputSchema,
	OrdersListStatusDefinitionsInputSchema,
	OrdersListStatusDefinitionsOutputSchema,
	OrdersSavePendingInputSchema,
	OrdersSavePendingOutputSchema,
	OrdersSubmitInputSchema,
	OrdersSubmitOutputSchema,
	OrdersValidateRecipientAddressInputSchema,
	OrdersValidateRecipientAddressOutputSchema,
} from './types';

/**
 * Submit up to five new orders for production.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2
 */
export const submit: FinerWorksEndpoint<'orders.submit'> = async (
	ctx,
	input,
) => {
	const validated = OrdersSubmitInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/submit_orders_v2',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.orders.submit',
		{
			count: validated.orders.length,
			order_pos: validated.orders.map((order) => order.order_po),
		},
		'completed',
	);
	return OrdersSubmitOutputSchema.parse(res);
};

/**
 * Store orders in temporary storage for review before final submission.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-save_pending_orders
 */
export const savePending: FinerWorksEndpoint<'orders.savePending'> = async (
	ctx,
	input,
) => {
	const validated = OrdersSavePendingInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/save_pending_orders',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.orders.savePending',
		{ count: validated.orders.length },
		'completed',
	);
	return OrdersSavePendingOutputSchema.parse(res);
};

/**
 * Remove orders that were previously saved as pending.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-delete_pending_orders
 */
export const deletePending: FinerWorksEndpoint<'orders.deletePending'> = async (
	ctx,
	input,
) => {
	const validated = OrdersDeletePendingInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/delete_pending_orders',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.orders.deletePending',
		{ count: validated.ids.length },
		'completed',
	);
	return OrdersDeletePendingOutputSchema.parse(res);
};

/**
 * Production status and tracking information for one or more orders.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-fetch_order_status
 */
export const fetchStatus: FinerWorksEndpoint<'orders.fetchStatus'> = async (
	ctx,
	input,
) => {
	const validated = OrdersFetchStatusInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/fetch_order_status',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.orders.fetchStatus',
		{
			order_ids: validated.order_ids ?? null,
			order_pos: validated.order_pos ?? null,
		},
		'completed',
	);
	return OrdersFetchStatusOutputSchema.parse(res);
};

/**
 * Every production status an order can be reported in.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-list_order_status_definitions
 */
export const listStatusDefinitions: FinerWorksEndpoint<
	'orders.listStatusDefinitions'
> = async (ctx, input = {}) => {
	OrdersListStatusDefinitionsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_order_status_definitions',
		credentials,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'finerworks.orders.listStatusDefinitions',
		{},
		'completed',
	);
	return OrdersListStatusDefinitionsOutputSchema.parse(res);
};

/**
 * Validate a recipient address before an order is placed against it.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-validate_recipient_address
 */
export const validateRecipientAddress: FinerWorksEndpoint<
	'orders.validateRecipientAddress'
> = async (ctx, input) => {
	const validated = OrdersValidateRecipientAddressInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/validate_recipient_address',
		credentials,
		{ method: 'POST', body: validated },
	);

	// Log only the coarse destination, never the full recipient record.
	await logEventFromContext(
		ctx,
		'finerworks.orders.validateRecipientAddress',
		{ country_code: validated.recipient.country_code },
		'completed',
	);
	return OrdersValidateRecipientAddressOutputSchema.parse(res);
};

export const OrdersEndpoints = {
	submit,
	savePending,
	deletePending,
	fetchStatus,
	listStatusDefinitions,
	validateRecipientAddress,
} as const;
