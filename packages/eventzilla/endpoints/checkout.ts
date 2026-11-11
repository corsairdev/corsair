import type { EventzillaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EventzillaEndpointInputSchemas as Inputs,
	EventzillaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The checkout workflow, in the order it has to be called: prepare (what is on
 * sale, and which `payment_id` to use), create (reserve, and get one
 * `ticket_price_id` per ticket), fill (buyer and attendee details), confirm
 * (record the payment). Every step needs the event's `dateid`, not its `id`.
 */
export const prepare: EventzillaEndpoints['checkoutPrepare'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checkout.prepare',
			input: Inputs.checkoutPrepare,
			output: Outputs.checkoutPrepare,
			toRequest: ({ eventid, dateid }) => ({
				method: 'GET',
				path: `/checkout/prepare/${segment(eventid)}/${segment(dateid)}`,
			}),
		},
		input,
		{
			log: ({ eventid }, result) => ({
				eventId: eventid,
				ticketTypes: result.tickettypes.length,
				paymentOptions: result.payment_options.length,
			}),
		},
	);

export const create: EventzillaEndpoints['checkoutCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checkout.create',
			input: Inputs.checkoutCreate,
			output: Outputs.checkoutCreate,
			toRequest: (body) => ({
				method: 'POST',
				path: '/checkout/create',
				body,
			}),
		},
		input,
		{
			log: ({ eventid, ticket_types }, result) => ({
				eventId: eventid,
				checkoutId: result.checkout_id ?? undefined,
				requested: ticket_types.reduce((sum, entry) => sum + entry.quantity, 0),
				reserved: result.tickets?.length ?? 0,
			}),
		},
	);

export const fillOrder: EventzillaEndpoints['checkoutFillOrder'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkout.fillOrder',
			input: Inputs.checkoutFillOrder,
			output: Outputs.checkoutFillOrder,
			toRequest: (body) => ({
				method: 'POST',
				path: '/checkout/fillorder',
				body,
			}),
		},
		input,
		{
			log: ({ checkout_id, tickets }) => ({
				checkoutId: checkout_id,
				tickets: tickets.length,
			}),
		},
	);

export const confirm: EventzillaEndpoints['checkoutConfirm'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checkout.confirm',
			input: Inputs.checkoutConfirm,
			output: Outputs.checkoutConfirm,
			toRequest: (body) => ({
				method: 'POST',
				path: '/checkout/confirm',
				body,
			}),
		},
		input,
		{
			log: ({ checkout_id, payment_status }, result) => ({
				checkoutId: checkout_id,
				paymentStatus: payment_status,
				status: result.transaction_status ?? undefined,
			}),
		},
	);
