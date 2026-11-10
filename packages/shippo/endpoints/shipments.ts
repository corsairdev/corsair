import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['shipmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shipments.list',
			input: Inputs.shipmentsList,
			output: Outputs.shipmentsList,
		},
		input,
		({
			page,
			results,
			page_token,
			object_created_gt,
			object_created_gte,
			object_created_lt,
			object_created_lte,
			shippo_account_id,
		}) => ({
			method: 'GET',
			path: '/shipments',
			query: {
				page,
				results,
				page_token,
				object_created_gt,
				object_created_gte,
				object_created_lt,
				object_created_lte,
			},
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['shipmentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shipments.get',
			input: Inputs.shipmentsGet,
			output: Outputs.shipmentsGet,
		},
		input,
		({ shipment_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/shipments/${segment(shipment_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ shipment_id }, result) => ({
				shipmentId: shipment_id,
				status: result.status ?? undefined,
				rateCount: result.rates?.length ?? 0,
			}),
		},
	);

export const create: ShippoEndpoints['shipmentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shipments.create',
			input: Inputs.shipmentsCreate,
			output: Outputs.shipmentsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/shipments',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({
				shipmentId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				rateCount: result.rates?.length ?? 0,
			}),
		},
	);

/**
 * Rates are computed when the shipment is created; this reads them back, which
 * is what a caller does when the shipment was created asynchronously (the
 * default) and came back without any.
 */
export const rates: ShippoEndpoints['shipmentsRates'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shipments.rates',
			input: Inputs.shipmentsRates,
			output: Outputs.shipmentsRates,
		},
		input,
		({ shipment_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/shipments/${segment(shipment_id)}/rates`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ shipment_id }, result) => ({
				shipmentId: shipment_id,
				count: result.results.length,
			}),
		},
	);

export const ratesInCurrency: ShippoEndpoints['shipmentsRatesInCurrency'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'shipments.ratesInCurrency',
			input: Inputs.shipmentsRatesInCurrency,
			output: Outputs.shipmentsRatesInCurrency,
		},
		input,
		({ shipment_id, currency_code, shippo_account_id }) => ({
			method: 'GET',
			path: `/shipments/${segment(shipment_id)}/rates/${segment(currency_code)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ shipment_id, currency_code }, result) => ({
				shipmentId: shipment_id,
				currency: currency_code,
				count: result.results.length,
			}),
		},
	);
