import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SymplaContext } from '../context';
import { callSympla, requireKey } from './shared';
import type {
	GetOrderInput,
	GetOrderResponse,
	ListOrdersInput,
	ListOrdersResponse,
	ListPresentationOrdersInput,
	ListPresentationOrdersResponse,
} from './types';
import {
	GetOrderInputSchema,
	GetOrderResponseSchema,
	ListOrdersInputSchema,
	ListOrdersResponseSchema,
	ListPresentationOrdersInputSchema,
	ListPresentationOrdersResponseSchema,
} from './types';

export const listOrders: CorsairEndpoint<
	SymplaContext,
	ListOrdersInput,
	ListOrdersResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListOrdersInputSchema.parse(input);
	const { event_id: _event_id, ...query } = parsed;
	return callSympla(
		ctx,
		'orders.list',
		{ path: `/events/${pathPart(parsed.event_id)}/orders`, query },
		ListOrdersResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const listOrdersByPresentation: CorsairEndpoint<
	SymplaContext,
	ListPresentationOrdersInput,
	ListPresentationOrdersResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListPresentationOrdersInputSchema.parse(input);
	const {
		event_id: _event_id,
		presentation_id: _presentation_id,
		...query
	} = parsed;
	return callSympla(
		ctx,
		'orders.listByPresentation',
		{
			path: `/events/${pathPart(parsed.event_id)}/presentations/${pathPart(parsed.presentation_id)}/orders`,
			query,
		},
		ListPresentationOrdersResponseSchema,
		{
			event_id: String(parsed.event_id),
			presentation_id: String(parsed.presentation_id),
		},
	);
};

export const getOrder: CorsairEndpoint<
	SymplaContext,
	GetOrderInput,
	GetOrderResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetOrderInputSchema.parse(input);
	const { event_id: _event_id, order_id: _order_id, ...query } = parsed;
	return callSympla(
		ctx,
		'orders.get',
		{
			path: `/events/${pathPart(parsed.event_id)}/orders/${pathPart(parsed.order_id)}`,
			query,
		},
		GetOrderResponseSchema,
		{ event_id: String(parsed.event_id), order_id: String(parsed.order_id) },
	);
};

export const Orders = {
	list: listOrders,
	listByPresentation: listOrdersByPresentation,
	get: getOrder,
};
