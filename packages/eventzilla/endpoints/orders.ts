import type { EventzillaEndpoints } from '..';
import { call } from './call';
import {
	EventzillaEndpointInputSchemas as Inputs,
	EventzillaEndpointOutputSchemas as Outputs,
} from './types';

/** Cancelling an order keeps the record and stops it standing: destructive. */
export const cancel: EventzillaEndpoints['ordersCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.cancel',
			input: Inputs.ordersCancel,
			output: Outputs.ordersCancel,
			toRequest: (body) => ({
				method: 'POST',
				path: '/events/order/cancel',
				body,
			}),
		},
		input,
		{
			log: ({ checkout_id, eventid }, result) => ({
				checkoutId: checkout_id,
				eventId: eventid,
				result: result.ordercancel ?? undefined,
			}),
		},
	);

export const confirm: EventzillaEndpoints['ordersConfirm'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.confirm',
			input: Inputs.ordersConfirm,
			output: Outputs.ordersConfirm,
			toRequest: (body) => ({
				method: 'POST',
				path: '/events/order/confirm',
				body,
			}),
		},
		input,
		{
			log: ({ checkout_id, eventid, sendemail }, result) => ({
				checkoutId: checkout_id,
				eventId: eventid,
				emailSent: sendemail ?? true,
				result: result.orderconfirm ?? undefined,
			}),
		},
	);

/**
 * Opens or closes sales for the whole event. `status` is the body field; the
 * response's `eventstatus` is the resulting state, not an echo of the boolean.
 */
export const toggle: EventzillaEndpoints['salesToggle'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sales.toggle',
			input: Inputs.salesToggle,
			output: Outputs.salesToggle,
			toRequest: (body) => ({
				method: 'POST',
				path: '/events/togglesales',
				body,
			}),
		},
		input,
		{
			log: ({ eventid, status }, result) => ({
				eventId: eventid,
				requested: status,
				eventStatus: result.eventstatus ?? undefined,
			}),
		},
	);
