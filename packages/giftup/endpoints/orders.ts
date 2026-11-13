import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	Order,
	OrdersAddNoteInput,
	OrdersCreateInput,
	OrdersGetInput,
	OrdersListInput,
	OrdersListResponse,
	OrdersMarkAsPostedInput,
	OrdersUpdateInput,
	SuccessResponse,
} from './types';
import {
	OrderSchema,
	OrdersAddNoteInputSchema,
	OrdersCreateInputSchema,
	OrdersGetInputSchema,
	OrdersListInputSchema,
	OrdersListResponseSchema,
	OrdersMarkAsPostedInputSchema,
	OrdersUpdateInputSchema,
	SuccessResponseSchema,
} from './types';

export const Orders = {
	list: async (
		ctx: GiftUpContext,
		input: OrdersListInput,
	): Promise<OrdersListResponse> => {
		const parsed = OrdersListInputSchema.parse(input);
		const response = await makeGiftUpRequest<OrdersListResponse>(
			'/orders',
			ctx.key,
			{
				method: 'GET',
				query: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return OrdersListResponseSchema.parse(response);
	},
	get: async (ctx: GiftUpContext, input: OrdersGetInput): Promise<Order> => {
		const parsed = OrdersGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<Order>(
			`/orders/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return OrderSchema.parse(response);
	},
	create: async (
		ctx: GiftUpContext,
		input: OrdersCreateInput,
	): Promise<Order> => {
		const parsed = OrdersCreateInputSchema.parse(input);
		const response = await makeGiftUpRequest<Order>('/orders', ctx.key, {
			method: 'POST',
			body: parsed,
			testMode: ctx.options?.testMode,
		});
		return OrderSchema.parse(response);
	},
	update: async (
		ctx: GiftUpContext,
		input: OrdersUpdateInput,
	): Promise<Order> => {
		const parsed = OrdersUpdateInputSchema.parse(input);
		const response = await makeGiftUpRequest<Order>(
			`/orders/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return OrderSchema.parse(response);
	},
	addNote: async (
		ctx: GiftUpContext,
		input: OrdersAddNoteInput,
	): Promise<SuccessResponse> => {
		const parsed = OrdersAddNoteInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/orders/${encodeGiftUpPathId(parsed.id)}/notes`,
			ctx.key,
			{
				method: 'POST',
				body: { content: parsed.content },
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response ?? { success: true });
	},
	markAsPosted: async (
		ctx: GiftUpContext,
		input: OrdersMarkAsPostedInput,
	): Promise<SuccessResponse> => {
		const parsed = OrdersMarkAsPostedInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/orders/${encodeGiftUpPathId(parsed.id)}/post`,
			ctx.key,
			{
				method: 'POST',
				body: { codes: parsed.codes },
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response ?? { success: true });
	},
};
